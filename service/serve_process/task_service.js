// 管理所有打包项目进度状态
const config = require('../../config')
const { LinkedQueue } = require('../../utils/queue')
const { logger } = require('../../log.config')
const dBUtils = require('../../utils/dbUtils')
const SocketHandler = require('../../utils/socket')
const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')
const { uniteProjectBranch } = require('../../utils/common')
const rabbit = require('../../model/rabbitmq')
const { UPDATE_VIEW, UPDATE_LIST_VIEW, BUILD_TYPE, BUILD_STATUS_SHOW } = require('../../utils/types')
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
    data.commitTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.content = data
    let { ref = '', repository: { name = '' }, commits: [currentCommits] = [] } = data
    if (!currentCommits) return { code: 0, msg: '没有相关的提交记录' }
    ref = ref.replace('refs/heads/', '')
    // if (/^feature/i.test(ref)) return { code: 0, msg: '开发分支不打包' }
    const projectName = uniteProjectBranch(name, ref)
    await this.insertDB(soloId)
    this.taskManager.enqueue({ name: projectName, data })
    SocketHandler.getInstance().emit(UPDATE_VIEW, { soloId })
    SocketHandler.getInstance().emit(UPDATE_LIST_VIEW)
    // 有请求就询问当前是否有空闲的子进程
    this.dispatch(true)
  }

  /**
   * 派发任务
   * @param {Boolean} isAddTask 是否新任务
   */
  async dispatch (isAddTask, taskName) {
    // 当前是否有空闲进程
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
      let rabbits = await rabbit()
      rabbits.producer.sendQueueMsg('dispatch', buildProject.data.data, {}, (err) => {
          if (err) { logger.error(err) }
      })

    }
  }

  /**
   * 更新工作的任务
   * @param {*} taskName
   * @param {Boolean} value false表示空闲
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

  async insertDB (soloId) {
    // full_name : github里为name
    let { ref = '', repository: { name = '' }, commits: [currentCommits = {}] = [], pusher: { name: fullName }, commitTime } = this.content
    let { id: commitId, committer: { username, name: personName }, message } = currentCommits
    ref = ref.replace('refs/heads/', '')
    const sql_sentence = `
    INSERT INTO 
      bundler_info(solo_id, branch_name,build_status,send_status,belong_project,commit_id,commit_person, commit_person_name, commit_msg, commit_time) 
    VALUES
      (?,?,?,?,?,?,?,?,?,?)`;
    const sql_params = [soloId, ref, BUILD_TYPE.BUILD_WAIT, BUILD_TYPE.BUILD_WAIT, name, commitId, username || personName, fullName, message, commitTime];
    await dBUtils.insertField(sql_sentence, sql_params)
  }
}

module.exports = TaskService
