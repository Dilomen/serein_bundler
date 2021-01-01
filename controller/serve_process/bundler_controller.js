/**
 * 该文件主要是处理前端展示交互相关
 */
const BundlerService = require('../../service/serve_process/bundler_service')
const TaskService = require('../../service/serve_process/task_service')
const jwt = require('jsonwebtoken')
const SocketHandler = require('../../utils/socket')
const { TASKNOTICE, UPDATE_DIED_PROCESS_TASK_STATUS } = require('../../utils/types')
const dBUtils = require('../../utils/dbUtils')
const TaskController = require('../../controller/serve_process/task_controller')
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
   * 服务重启时，对数据库中原本未完成打包（等待，开始状态）的项目，进行打包处理
   * @memberof BundlerContoller
   */
  static async initRebuildTask() {
    let searchSql = `
    SELECT 
      solo_id AS soloId
    FROM 
      bundler_info 
    WHERE 
      build_status='1' OR build_status='2'`
    let soloIds = await dBUtils.search(searchSql)
    soloIds = soloIds.map(item => item.soloId)
    new TaskController().reBuildTask(soloIds)
  }

  /**
   * 初始化打包消息的消费者
   * @memberof BundlerContoller
   */
  initMessageConsumer() {}
}

module.exports = BundlerContoller
