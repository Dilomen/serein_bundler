const TaskService = require('../../service/serve_process/task_service')
const dayjs = require('dayjs')
const dBUtils = require('../../utils/dbUtils')
class TaskController {
  constructor(ctx) {
    this._ctx = ctx
  }

  async addTask () {
    this.content = this._ctx.request.body || {}
    let { ref = '', commits = [] } = this.content
    const branch = ref.replace('refs/heads/', '')
    const { name: pusher = '', email: pusherEmail = '' } = (this.content.pusher || {})
    const { clone_url = '', name: repositoryName = '', owner: { name: repositoryCreator = '' } = {} } = (this.content.repository || {})
    const { id: commitId = '', committer: { username: commitPerson = '', email: commitPersonEmail = '' } = {}, timestamp: commitTime = '', message: commitMessage } = (commits[commits.length - 1] || {})
    const taskService = TaskService.getInstance()
    const task = new Task({ branch, pusher, pusherEmail, repositoryName, clone_url, commitId, repositoryCreator, commitPerson, commitPersonEmail, commitTime, commitMessage })
    const result = await taskService.addTask(task)
    this._ctx.body = result || { code: 1, msg: '请求成功' }
  }

  async reBuildTask (soloIds) {
    if (!soloIds) return
    if (typeof soloIds === 'string') {
      soloIds = [soloIds]
    }
    let searchWhereSoloId = ''
    soloIds.forEach((soloId, index) => {
      if (index === 0) {
        searchWhereSoloId += `bundler_info.solo_id='${soloId}'`
      } else {
        searchWhereSoloId += ` OR bundler_info.solo_id='${soloId}'`
      }
    })
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
      ${searchWhereSoloId}`
    const records = await dBUtils.search(searchSql)
    const taskService = TaskService.getInstance()
    function dispatch(records) {
      if (!records || records.length === 0) return
      const record = records.pop()
      const task = new Task(record)
      taskService.rebuildTask({ ...task, soloId: record.soloId })
      if (records.length === 0) return
      setTimeout(async () => {
        dispatch(records)
      }, 1000)
    }
    dispatch(records)
  }
}

class Task {
  constructor(content) {
    const { branch, pusher, pusherEmail, repositoryName, clone_url, commitId, repositoryCreator, commitPerson, commitPersonEmail, commitTime, commitMessage } = content
    // 打包者信息
    this.pusher = pusher // push提交者
    this.pusherEmail = pusherEmail // push提交者邮箱
    // 项目信息
    this.remoteUrl = clone_url // 拉取的git地址
    this.repositoryName = repositoryName // 项目名称
    this.repositoryCreator = repositoryCreator // 项目创建者
    this.branch = branch // 分支名
    // 提交者信息
    this.commitId = commitId // 提交id
    this.commitPerson = commitPerson // commit提交者
    this.commitPersonEmail = commitPersonEmail // commit提交者邮箱
    this.commitTime = dayjs(commitTime).format('YYYY-MM-DD HH:mm:ss') // commit时间
    this.commitMessage = commitMessage // commit注释
  }
}

module.exports = TaskController