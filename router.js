const Router = require('koa-router')
const router = new Router()
const BundlerController = require('./controller/serve_process/bundler_controller')
const UserController = require('./controller/serve_process/user_controller')
const TaskController = require('./controller/serve_process/task_controller')
const StatisticsController = require('./controller/serve_process/statistics_controller')
const { decryption } = require('./utils/aes')
const fs = require('fs')
const path = require('path')

router.get('/', async (ctx) => {
  const content = fs.readFileSync(path.resolve(process.cwd(), './public/views/index.html'), 'utf-8')
  ctx.set('Context-Type', 'text/html;charset:utf-8')
  ctx.body = content
})

// 登录
router.post('/login', async (ctx) => {
  const userController = new UserController(ctx)
  await userController.login()
})

// 用户信息
router.get('/info', async (ctx) => {
  const userController = new UserController(ctx)
  await userController.info()
})

// 接受webhook请求
router.post('/webhook', async (ctx) => {
  const taskController = new TaskController(ctx)
  await taskController.addTask()
})

// 解码
router.post('/decode', async (ctx) => {
  const result = decryption(ctx.request.body.content)
  if (result) {
    ctx.body = { code: 1, data: result }
    return
  }
  ctx.body = { code: 0, msg: '解码失败' }
})

// 打断
router.put('/bundler_interrupt', async (ctx) => {
  const bundlerController = new BundlerController(ctx)
  let result = await bundlerController.interrupt(ctx.request.body)
  ctx.body = result
})

// 打包列表
router.get('/bundler_list', async (ctx) => {
  const bundlerController = new BundlerController(ctx)
  await bundlerController.searchList()
})

// 打包详情
router.get('/bundler_detail', async (ctx) => {
  const bundlerController = new BundlerController(ctx)
  await bundlerController.searchDetail()
})

// 统计
router.get('/statistics', async (ctx) => {
  const statisticsController = new StatisticsController(ctx)
  await statisticsController.searchSummation()
})

// 个人统计
router.get('/statistics_person', async (ctx) => {
  const statisticsController = new StatisticsController(ctx)
  await statisticsController.searchPersonSummation()
})

module.exports = router
