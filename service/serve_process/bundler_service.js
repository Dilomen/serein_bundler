const dBUtils = require('../../utils/dbUtils')
const { camlCaseObj } = require('../../utils/camlCase')
const SocketHandler = require('../../utils/socket')
const TaskService = require('./task_service')
const { uniteProjectBranch } = require('../../utils/common')
const fs = require('fs')
const path = require('path')
const { UPDATE_VIEW, UPDATE_LIST_VIEW, BUILD_TYPE, getStatusShow } = require('../../utils/types')
class BuildService {
  constructor(content = {}) {
    this.content = JSON.parse(JSON.stringify(content))
  }

  async searchList () {
    let params = {
      branch_name: this.content.branchName, // 分支名
      belong_project: this.content.belongProject, // 所属项目
      commit_person: this.content.commitPerson // 提交人
    }
    const limit = this.content.limit || 20
    const offset = this.content.offset || 1
    let paramsStr = ''
    params = Object.keys(params).reduce((obj, key) => {
      if (params[key]) {
        obj[key] = params[key]
      }
      return obj
    }, {})
    Object.keys(params).forEach((key, index) => {
      if (params[key]) {
        paramsStr += index === Object.keys(params).length - 1 ? `${key} like '%${params[key]}%'` : `${key} like '%${params[key]}%' AND `
      }
    })
    const sum = limit * (offset - 1)
    let searchSql = ''
    const [startTime, endTime] = this.content['commitTime[]'] || [] // 提交时间间隔
    if (startTime && endTime) {
      searchSql = `
      SELECT * FROM 
        bundler_info 
      WHERE 
        ${paramsStr ? paramsStr + 'AND' : ''} commit_time 
      BETWEEN 
        '${startTime}' 
      AND 
        '${endTime}' 
      ORDER BY 
        create_time 
      DESC LIMIT 
        ${sum},${limit};`
    } else {
      searchSql = `
      SELECT * FROM bundler_info 
        ${paramsStr ? 'WHERE ' + paramsStr : ''} 
      ORDER BY 
        create_time 
      DESC LIMIT
        ${sum},${limit};`
    }
    let results = await dBUtils.search(searchSql)
    results = camlCaseObj(results)
    results.map(item => {
      item.statusShow = getStatusShow(item.buildStatus, item.sendStatus)
    })
    const totalResult = await dBUtils.search(`
      SELECT
        COUNT(*) AS total
      FROM 
        bundler_info 
      ${paramsStr ? 'WHERE ' + paramsStr : ''}`)
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
        const projectName = uniteProjectBranch(resResult.belongProject, resResult.branchName)
        commitContent = fs.readFileSync(path.resolve(process.cwd(), `./build_log/${resResult.createTime.slice(0, 10)}/${projectName}/${resResult.soloId}.log`), 'utf-8')
      } catch (err) {
        commitContent = ''
      }
      resResult.commitContent = commitContent
    }
    return resResult
  }

  async interrupt ({ interruptId, branchName, belongProject, isNoticeDispatch }) {
    // 是否通知派发任务，如果是中断未开始的任务，就不需要通知，如果是进行中的任务，就通知
    if (isNoticeDispatch) {
      branchName = branchName.replace('refs/heads/', '')
      const projectName = uniteProjectBranch(belongProject, branchName)
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
    SocketHandler.getInstance().emit(UPDATE_VIEW, { interruptId })
    SocketHandler.getInstance().emit(UPDATE_LIST_VIEW)
  }
}

module.exports = BuildService
