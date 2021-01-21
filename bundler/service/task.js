// 管理所有打包项目进度状态
const config = require('../../config')
const { logger } = require('../../log.config')
const { v4: uuidv4 } = require('uuid')
const rabbit = require('../../model/rabbitmq')
const { LinkedQueue, dBUtils, Task, SocketHandler, decryption, uniteProjectBranch, UPDATE_VIEW, UPDATE_LIST_VIEW, BUILD_TYPE } = require('../../utils')
let rabbits = null
class TaskService {
  constructor(content) {
    this.content = content
    this.taskManager = new LinkedQueue() // 请求队列
    this.noticeTackManager = new LinkedQueue() // 通知队列
    this.workTaskMap = new Set() // 正在进行的任务
    this.instance = null
  }

  static getInstance (content) {
    if (!this.instance) {
      this.instance = new TaskService(content)
    }
    return this.instance
  }

  /**
   * 添加任务
   * @param {Object} data
   */
  async addTask (data) {
    const soloId = uuidv4()
    data.soloId = soloId
    this.content = data
    let { repositoryName, commitId, branch, pusher, cloneUrl } = data
    if (!commitId) return { code: 0, msg: '没有相关的提交信息' }
    // if (/^feature/i.test(ref)) return { code: 0, msg: '开发分支不打包' }
    const projectName = uniteProjectBranch(repositoryName, branch)
    const searchSql = `SELECT password FROM user WHERE user_name='${pusher}'`
    const result = await dBUtils.search(searchSql) || []
    if (!result || result.length === 0) { logger.error('The current user is not registered: ' + pusher); return }
    const password = decryption(result[0].password)
    data.cloneUrl = cloneUrl.replace(/(https*:\/\/)/, `$1${pusher}:${password}@`)
    setTimeout(async () => {
      await this.insertTaskToDB(soloId)
      this.taskManager.enqueue({ name: projectName, data, soloId })
      SocketHandler.getInstance().emit(UPDATE_VIEW, { soloId })
      SocketHandler.getInstance().emit(UPDATE_LIST_VIEW)
      this.dispatch(true)
    }, 10)
  }

  /**
   * 重新打包
   * @param {*} data 
   */
  async rebuildTask (data) {
    const sql_sentence = `
    UPDATE
      bundler_info
    SET
      build_status=?, send_status=?
    WHERE
      solo_id=?`;
    const sql_params = [BUILD_TYPE.BUILD_WAIT, BUILD_TYPE.SEND_WAIT, data.soloId];
    await dBUtils.updateField(sql_sentence, sql_params)
    const projectName = uniteProjectBranch(data.repositoryName, data.branch)
    this.taskManager.enqueue({ name: projectName, data, soloId: data.soloId })
    SocketHandler.getInstance().emit(UPDATE_VIEW, { soloId: data.soloId })
    SocketHandler.getInstance().emit(UPDATE_LIST_VIEW)
    this.dispatch(true)
  }

  /**
   * 派发任务
   * @param {Boolean} isAddTask 是否新任务
   */
  async dispatch (isAddTask, taskName) {
    // 当前是否有空闲的打包子进程
    if (this.workTaskMap.size < config.processSize) {
      let buildProject
      const noticeTaskSize = this.noticeTackManager.size()
      const taskSize = this.taskManager.size()
      // 通知队列有内容，并且当前是有任务完成通知触发的
      if (!isAddTask && noticeTaskSize > 0) {
        if (!taskName) return
        buildProject = this.noticeTackManager.remove(taskName)
        // 如果通知队列中没有相应的就继续执行请求队列的
        if (!buildProject) this.dispatch(true)
      } else if (taskSize > 0) {
        buildProject = this.taskManager.dequeue()
        while (buildProject && this.workTaskMap.has(buildProject.data.name)) {
          this.noticeTackManager.enqueue(buildProject.data)
          buildProject = this.taskManager.dequeue()
        }
      }
      if (!buildProject) return
      // 进入工作
      this.updateWorkTask(buildProject.data.name, true)
      !rabbits && (rabbits = await rabbit())
      rabbits.producer.sendQueueMsg('dispatch', buildProject.data.data, {}, (err) => {
        if (err) { logger.error(err) }
      })
    }
  }

  /**
   * 更新工作的任务
   * @param {*} taskName
   * @param {Boolean} value false表示有进程的任务完成了或者被取消了等
   */
  updateWorkTask (taskName, value) {
    if (!value) {
      this.workTaskMap.delete(taskName)
      return
    }
    this.workTaskMap.add(taskName)
  }

  /**
   * 当有任务分发完成，就来队列取任务
   * @param {String} 任务名称
   */
  notice (taskName) {
    this.updateWorkTask(taskName, false)
    this.dispatch(false, taskName)
  }

  /**
   * 将新增的任务添加到数据库
   */
  async insertTaskToDB (soloId) {
    let { branch, repositoryName, cloneUrl, commitId, commitPerson, commitPersonEmail, commitTime, commitMessage, pusher } = this.content
    const sql_sentence = `
    INSERT INTO 
      bundler_info(solo_id, branch, build_status, send_status, repository_name, pusher, commit_message) 
    VALUES
      (?,?,?,?,?,?,?)`;
    const sql_params = [soloId, branch, BUILD_TYPE.BUILD_WAIT, BUILD_TYPE.SEND_WAIT, repositoryName, pusher, commitMessage];
    await dBUtils.insertField(sql_sentence, sql_params)
    const sql_commit_sentence = `
    INSERT INTO 
      commit_record(solo_id, clone_url, commit_id, commit_person, commit_person_email, commit_time, commit_message) 
    VALUES
      (?,?,?,?,?,?,?)`;
    const sql_commit_params = [soloId, cloneUrl, commitId, commitPerson, commitPersonEmail, commitTime, commitMessage];
    await dBUtils.insertField(sql_commit_sentence, sql_commit_params)
  }

  /**
   * 取消在等待队列中的任务
   */
  cancalTask (cancelId) {
    let taskResult = this.taskManager.removeId(cancelId)
    !taskResult && (taskResult = this.noticeTackManager.removeId(cancelId))
    return !!taskResult
  }


  /**
   * 服务重启时，对数据库中原本未开始打包和打包进行中的项目，进行打包处理
   */
  async initRebuildTask () {
    const records = await this.searchNoFinishTask()
    if (!records || records.length === 0) return
    function _dispatch (records) {
      if (!records || records.length === 0) return
      const record = records.pop()
      const task = new Task(record)
      this.rebuildTask({ ...task, soloId: record.soloId })
      if (records.length === 0) return
      setTimeout(async () => {
        _dispatch.call(this, records)
      }, 1000)
    }
    _dispatch.call(this, records)
  }

  /**
   * 查询未完成打包的任务
   */
  async searchNoFinishTask () {
    let searchSql = `
    SELECT 
      branch,
      pusher,
      repository_name as repositoryName,
      clone_url,
      bundler_info.solo_id as soloId,
      commit_id as commitId,
      bundler_info.commit_message as commitMessage,
      commit_time as commitTime
    FROM 
      bundler_info 
    INNER JOIN 
      commit_record 
    ON 
      bundler_info.solo_id=commit_record.solo_id
    WHERE 
      build_status='1' OR build_status='2'
    ORDER BY
      create_time
    DESC`
    let result = await dBUtils.search(searchSql)
    return result
  }
}

module.exports = TaskService
