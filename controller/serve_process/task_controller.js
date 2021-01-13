const TaskService = require('../../service/serve_process/task_service')
const { Task } = require('../../utils/types')
class TaskController {
  constructor(ctx) {
    this._ctx = ctx
  }

  /**
   * 处理webhook的请求过来的数据，并添加到任务
   * @memberof TaskController
   */
  async addTask () {
    this.content = this._ctx.request.body || {}
    let { ref = '', commits = [] } = this.content
    const branch = ref.replace('refs/heads/', '')
    let task = null
    if (this._ctx.header['x-gitlab-token']) {
      const { user_username: pusher = '', user_email: pusherEmail } = (this.content || [])
      const { git_ssh_url: clone_url = '', name: repositoryName = '', owner: { name: repositoryCreator = '' } = {} } = (this.content.repository || {})
      const { id: commitId = '', author: { name: commitPerson = '', email: commitPersonEmail = '' } = {}, timestamp: commitTime = '', message: commitMessage } = (commits[commits.length - 1] || {})
      task = new Task({ branch, pusher, pusherEmail, repositoryName, clone_url, commitId, repositoryCreator, commitPerson, commitPersonEmail, commitTime, commitMessage })
    } else if (this._ctx.header['x-gogs-signature']) {
      const { username: pusher = '', email: pusherEmail = '' } = (this.content.pusher || {})
      const { ssh_url: clone_url = '', name: repositoryName = '', owner: { name: repositoryCreator = '' } = {} } = (this.content.repository || {})
      const { id: commitId = '', author: { name: commitPerson = '', email: commitPersonEmail = '' } = {}, timestamp: commitTime = '', message: commitMessage } = (commits[commits.length - 1] || {})
      task = new Task({ branch, pusher, pusherEmail, repositoryName, clone_url, commitId, repositoryCreator, commitPerson, commitPersonEmail, commitTime, commitMessage })
    } else {
      const { name: pusher = '', email: pusherEmail = '' } = (this.content.pusher || {})
      const { ssh_url: clone_url = '', name: repositoryName = '', owner: { name: repositoryCreator = '' } = {} } = (this.content.repository || {})
      const { id: commitId = '', committer: { username: commitPerson = '', email: commitPersonEmail = '' } = {}, timestamp: commitTime = '', message: commitMessage } = (commits[commits.length - 1] || {})
      task = new Task({ branch, pusher, pusherEmail, repositoryName, clone_url, commitId, repositoryCreator, commitPerson, commitPersonEmail, commitTime, commitMessage })
    }
    if (!task) return
    const taskService = TaskService.getInstance()
    const result = await taskService.addTask(task)
    this._ctx.body = result || { code: 1, msg: '请求成功' }
  }


  /**
   * 服务重启时，对数据库中原本未开始打包和打包进行中的项目，进行打包处理
   */
  static async initRebuildTask() {
    const taskService = TaskService.getInstance()
    taskService.initRebuildTask()
  }
}

module.exports = TaskController