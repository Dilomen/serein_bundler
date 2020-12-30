const TaskService = require('../../service/serve_process/task_service')
class TaskController {
  constructor(ctx) {
    this._ctx = ctx
  }

  async addTask() {
    const taskService = TaskService.getInstance()
    const result = await taskService.addTask(this._ctx.request.body)
    this._ctx.body = result || { code: 1, msg: '请求成功' }
  }
}

module.exports = TaskController
