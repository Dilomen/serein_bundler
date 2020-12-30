/**
 * 该文件主要是处理前端展示交互相关
 */
const BundlerService = require('../../service/serve_process/bundler_service')
const TaskService = require('../../service/serve_process/task_service')
const jwt = require('jsonwebtoken')
const SocketHandler = require('../../utils/socket')
const { INTERRUPT, TASKNOTICE } = require('../../utils/types')
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
  async interrupt ({ id: interruptId, branchName, belongProject, commitPerson }) {
    let authorization = this._ctx.cookies.get('BUNDLER_TOKEN') || this._ctx.header.authorization || ''
    if (!authorization) return { code: 0, msg: '没有权限中断' }
    authorization = authorization.replace('Bearer ', '')
    const pusher = jwt.verify(authorization, 'ailpha')
    const { username = '' } = pusher
    if (username !== 'admin' && (!username || !commitPerson || commitPerson !== username)) return this._ctx.body = { code: 0, msg: '你没有权限中断当前打包' }
    process.send({ type: INTERRUPT, data: interruptId })
    return new Promise((resolve) => {
      process.on('message', async (msg) => {
        if (msg.type === INTERRUPT) {
          if (msg.result) {
            const bundlerService = new BundlerService()
            await bundlerService.interrupt({ interruptId, branchName, belongProject })
            resolve({ code: 1, msg: '中断成功' })
            return
          }
          resolve({ code: 0, msg: '无法停止当前打包' })
        }
      })
    })
  }

  // socket通知页面
  static updateView () {
    process.on('message', (msg) => {
      SocketHandler.getInstance().emit(msg.type, msg.data)
      if (msg.type === TASKNOTICE) {
        TaskService.getInstance().notice(msg.taskName)
      }
    })
  }
}

module.exports = BundlerContoller
