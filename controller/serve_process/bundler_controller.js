/**
 * 该文件主要是处理前端展示交互相关
 */
const BundlerService = require('../../service/serve_process/bundler_service')
const TaskService = require('../../service/serve_process/task_service')
const jwt = require('jsonwebtoken')
const SocketHandler = require('../../utils/socket')
const { TASKNOTICE, UPDATE_DIED_PROCESS_TASK_STATUS } = require('../../utils/types')
const Consumer = require('../../model/rabbitmq/consumer')
// const chatService = require('../../service/serve_process/notice_service/chat_service')
const GitlabService = require('../../service/serve_process/notice_service/gitlab_service')
// const noteService = require('../../service/serve_process/notice_service/note_service')
// const emailService = require('../../service/serve_process/notice_service/email_service')
class BundlerContoller {
  constructor(ctx) {
    this._ctx = ctx
  }
  /**
   * 页面列表页
   */
  async searchList () {
    const bundlerService = new BundlerService(this._ctx.request.query)
    const result = await bundlerService.searchList()
    this._ctx.body = result
  }
  /**
   * 页面详情页
   */
  async searchDetail () {
    const bundlerService = new BundlerService(this._ctx.request.query)
    const result = await bundlerService.searchDetail()
    this._ctx.body = result
  }
  /**
   * 中断服务
   * @param {*} param0 
   */
  async interrupt ({ id: interruptId, branch, repositoryName, commitPerson }) {
    let authorization = this._ctx.cookies.get('BUNDLER_TOKEN') || this._ctx.header.authorization || ''
    if (!authorization) return { code: 0, msg: '没有权限中断' }
    authorization = authorization.replace('Bearer ', '')
    const pusher = jwt.verify(authorization, 'ailpha')
    const { username = '' } = pusher
    if (username !== 'admin' && (!username || !commitPerson || commitPerson !== username)) return this._ctx.body = { code: 0, msg: '你没有权限中断当前打包' }
    const bundlerService = new BundlerService()
    const result = await bundlerService.interrupt({ interruptId, branch, repositoryName })
    return result
  }

  /**
   * socket通知页面
   * @static
   * @memberof BundlerContoller
   */
  static updateView () {
    process.on('message', (msg) => {
      SocketHandler.getInstance().emit(msg.type, msg.data)
      if (msg.type === TASKNOTICE) {
        TaskService.getInstance().notice(msg.taskName)
      }
    })
  }

  /**
   * 更新数据库中，崩溃的打包进程中执行的任务状态，置为打包失败
   */
  static updateDiedProcessTaskStatus () {
    process.on('message', async (msg) => {
      if (msg.type === UPDATE_DIED_PROCESS_TASK_STATUS) {
        const bundlerService = new BundlerService()
        await bundlerService.updateDiedProcessTaskStatus(msg.soloId)
      }
    })
  }

  /**
   * 初始化打包消息的消费者
   */
  static async initMessageConsumer() {
    const gitlab = await new Consumer().getNewInstance()
    gitlab('gitlab', 'anheng', async (msg, ch) => {
      const message = msg.content.toString()
      const result = await new GitlabService().receiveMessage(message)
      result && ch.ack(msg)
    })

    // const chat = await new Consumer().getNewInstance()
    // chat('chat', 'anheng', async (msg, ch) => {
    //   const result = await chatService.receiveMessage(msg)
    //   result && ch.ack(msg)
    // })

    // const email = await new Consumer().getNewInstance()
    // email('email', 'anheng', (msg, ch) => {
    //   emailService.receiveMessage(msg, ch)
    // })

    // const note = await new Consumer().getNewInstance()
    // note('note', 'anheng', (msg, ch) => {
    //   noteService.receiveMessage(msg, ch)
    // })
  }
}

module.exports = BundlerContoller
