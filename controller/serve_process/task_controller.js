const TaskService = require('../../service/serve_process/task_service')
const dayjs = require('dayjs')
class TaskController {
  constructor(ctx) {
    this._ctx = ctx
  }

  async addTask() {
    const taskService = TaskService.getInstance()
    const task = new Task(this._ctx.request.body)
    const result = await taskService.addTask(task)
    this._ctx.body = result || { code: 1, msg: '请求成功' }
  }
}

class Task {
  constructor(content) {
    let { ref, commits = [] } = content
    const { name: pusherName = '', email: pusherEmail = '' } = (content.pusher || {})
    // 打包者信息
    this.pusher = pusherName // push提交者
    this.pusherEmail = pusherEmail // push提交者邮箱
    // 项目信息
    const { clone_url = '', name: repositoryName = '', owner: { name: ownerName = '' } = {} } = (content.repository || {})
    this.remoteUrl = clone_url // 拉取的git地址
    this.repositoryName = repositoryName // 项目名称
    this.repositoryCreator = ownerName // 项目创建者
    this.branch = ref.replace('refs/heads/', '') // 分支名
    // 提交者信息
    const { id: commitId = '', committer: { username: committerName = '', email: committerEmail = '' } = {}, timestamp: commitTime = '', message: commitMessage } = (commits[commits.length - 1] || {})
    this.commitId = commitId // 提交id
    this.commitPerson = committerName // commit提交者
    this.commitPersonEmail = committerEmail // commit提交者邮箱
    this.commitTime = dayjs(commitTime).format('YYYY-MM-DD HH:mm:ss') // commit时间
    this.commitMessage = commitMessage // commit注释
  }
}

module.exports = TaskController