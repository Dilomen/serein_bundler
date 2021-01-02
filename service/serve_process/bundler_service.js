const dBUtils = require('../../utils/dbUtils')
const { camlCaseObj } = require('../../utils/camlCase')
const SocketHandler = require('../../utils/socket')
const TaskService = require('./task_service')
const { uniteProjectBranch } = require('../../utils/common')
const fs = require('fs')
const rabbit = require('../../model/rabbitmq')
const path = require('path')
const { logger } = require('../../log.config')
const config = require('../../config')
const rm = require('rimraf')
const { INTERRUPT } = require('../../utils/types')
const throttle = require('../../utils/throttle')
const { UPDATE_VIEW, UPDATE_LIST_VIEW, BUILD_TYPE, TYPE_FINISH_SEND, getStatusShow } = require('../../utils/types')
class BuildService {
  constructor(content = {}) {
    this.content = content
  }

  async searchList () {
    const { branch, repositoryName, pusher, limit = 20, offset = 1 } = this.content
    let params = {
      branch, // 分支名
      repository_name: repositoryName, // 项目名称
      pusher // 提交人
    }
    let paramsStr = ''
    params = Object.keys(params).reduce((obj, key) => {
      if (params[key]) obj[key] = params[key]
      return obj
    }, {})
    Object.keys(params).forEach((key, index) => {
      if (params[key]) {
        paramsStr += index === Object.keys(params).length - 1 ? `${key} like '%${params[key]}%'` : `${key} like '%${params[key]}%' AND `
      }
    })
    const sum = limit * (offset - 1)
    let searchSql = ''
    const [startTime, endTime] = this.content['createTime[]'] || [] // 提交时间间隔
    if (startTime && endTime) {
      searchSql = `
      SELECT * FROM 
        bundler_info
      WHERE 
        ${paramsStr ? paramsStr + 'AND' : ''}
        create_time 
      BETWEEN 
        '${startTime}' 
      AND 
        '${endTime}' 
      ORDER BY 
        create_time 
      DESC
      LIMIT 
        ${sum},${limit};`
    } else {
      searchSql = `
      SELECT * FROM bundler_info 
        ${paramsStr ? 'WHERE ' + paramsStr : ''} 
      ORDER BY 
        create_time 
      DESC
      LIMIT
        ${sum},${limit};`
    }
    let results = await dBUtils.search(searchSql)
    results = camlCaseObj(results)
    results.map(item => {
      item.statusShow = getStatusShow(item.buildStatus, item.sendStatus)
    })
    let searhTotal = ''
    if (startTime && endTime) {
      searhTotal = `
        SELECT
          COUNT(*) AS total
        FROM 
          bundler_info
        WHERE
          ${paramsStr ? paramsStr + 'AND' : ''}
          create_time 
        BETWEEN 
          '${startTime}' 
        AND 
          '${endTime}'
        `
    } else {
      searhTotal = `
        SELECT
          COUNT(*) AS total
        FROM 
          bundler_info
        ${paramsStr ? 'WHERE ' + paramsStr : ''}`
    }
    const totalResult = await dBUtils.search(searhTotal)
    return {
      total: totalResult[0].total,
      data: results,
      page: +offset
    }
  }

  async searchDetail () {
    const { id } = this.content
    const searchSql = `SELECT * FROM bundler_info WHERE id = ${id}`
    let results = await dBUtils.search(searchSql) || []
    let resResult = {}
    if (results.length > 0) {
      resResult = camlCaseObj(results[0])
      resResult.statusShow = getStatusShow(resResult.buildStatus, resResult.sendStatus)
      let commitContent = ''
      try {
        const projectName = uniteProjectBranch(resResult.repositoryName, resResult.branch)
        commitContent = fs.readFileSync(path.resolve(process.cwd(), `./build_log/${resResult.createTime.slice(0, 10)}/${projectName}/${resResult.soloId}.log`), 'utf-8')
      } catch (err) {
        commitContent = ''
      }
      resResult.commitContent = commitContent
    }
    return resResult
  }

  async interrupt ({ interruptId, branch, repositoryName }) {
    let isExistTask = false
    // 如果不是进行中的，那么就是等待队列中取消
    const taskService = TaskService.getInstance()
    isExistTask = taskService.cancalTask(interruptId)
    if (isExistTask) {
      await this._handleInterruptSuccess({ interruptId, isNoticeDispatch: false })
      return { code: 1, msg: '中断成功' }
    }

    return new Promise((resolve) => {
      process.send({ type: INTERRUPT, data: interruptId })
      // 节流：防止执行多次中断操作
      const interruptNotice = throttle(async (msg, resolve) => {
        if (msg.result) {
          await this._handleInterruptSuccess({ interruptId, branch, repositoryName, isNoticeDispatch: true })
          resolve({ code: 1, msg: '中断成功' })
          return
        }
        resolve({ code: 0, msg: '无法停止当前打包' })
      }, 500)
      process.on('message', async (msg) => {
        interruptNotice(msg, resolve)
      })
    })
  }

  async  _handleInterruptSuccess ({ interruptId, branch, repositoryName, isNoticeDispatch }) {
    // 是否通知派发任务，如果是中断未开始的任务，就不需要通知，如果是进行中的任务，就通知
    if (isNoticeDispatch) {
      const projectName = uniteProjectBranch(repositoryName, branch)
      TaskService.getInstance().notice(projectName)
    }
    const sql_sentence = `
          UPDATE
            bundler_info
          SET 
            build_status = ?, send_status = ? 
          WHERE 
            solo_id = ?`;
    const sql_params = [BUILD_TYPE.BUILD_CANCEL, BUILD_TYPE.BUILD_CANCEL, interruptId];
    await dBUtils.updateField(sql_sentence, sql_params)
    SocketHandler.getInstance().emit(UPDATE_VIEW, { soloId: interruptId })
    SocketHandler.getInstance().emit(UPDATE_LIST_VIEW)
  }

  /**
   * 用于更新崩溃进程的任务状态
   * @param {任务唯一标识} soloId 
   */
  async updateDiedProcessTaskStatus (soloId) {
    const currentTime = new Date()
    const searchSql = `SELECT repository_name, commit_message, branch, create_time, pusher FROM bundler_info WHERE solo_id='${soloId}'`
    const result = await dBUtils.search(searchSql)
    const { repository_name: repositoryName, commit_message: commitMessage, pusher, branch, create_time: createTime } = (result[0] || {})
    const useTime = ((currentTime - new Date(createTime)) || 0).toFixed(2)
    await this.updateTaskStatus(soloId, BUILD_TYPE.BUILD_FAIL, BUILD_TYPE.SEND_START, useTime)
    SocketHandler.getInstance().emit(UPDATE_VIEW, { soloId })
    SocketHandler.getInstance().emit(UPDATE_LIST_VIEW)
    let rabbits = await rabbit()
    const message = { type: 'error', message: '【 *打包失败！* 】\n' + ` @${pusher} 提交了任务\n分支名：【 *${branch}* 】\n项目名：【 *${repositoryName}* 】\n提交信息：${commitMessage}\n提交时间：${createTime}\n打包用时： *${useTime}s*`, commitMsg: commitMessage, dirName: this.build_dirname, repoName: repositoryName }
    rabbits.producer.sendQueueMsg('anheng', message, {}, (err) => {
      process.send({ type: TYPE_FINISH_SEND, data: { taskName: this.build_dirname } })
      if (err) { this.updateTaskStatus(soloId, BUILD_TYPE.BUILD_FAIL, BUILD_TYPE.SEND_FAIL, useTime); logger.error(err) }
      this.updateTaskStatus(soloId, BUILD_TYPE.BUILD_FAIL, BUILD_TYPE.SEND_SUCCESS, useTime)
    })
  }

  async updateTaskStatus (soloId, buildStatus, sendStatus, useTime) {
    const sql_sentence = `
    UPDATE
      bundler_info
    SET 
      build_status = ?, send_status = ? , consume_time = ?
    WHERE 
      solo_id = ?`;
    const sql_params = [buildStatus, sendStatus, useTime, soloId];
    await dBUtils.updateField(sql_sentence, sql_params)
  }
}

module.exports = BuildService
