const Router = require('koa-router')
const router = new Router()
const TaskController = require('../controller/task')
const { decryption } = require('../../utils')
const fs = require('fs')
const path = require('path')

router.get('/', async (ctx) => {
  const content = fs.readFileSync(path.resolve(__dirname, '../public/views/index.html'), 'utf-8')
  ctx.set('Context-Type', 'text/html;charset:utf-8')
  ctx.body = content
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

const userRouter = require('./user')
router.use('/user', userRouter.routes(), userRouter.allowedMethods())
const bundlerRouter = require('./bundler')
router.use('/bundler', bundlerRouter.routes(), bundlerRouter.allowedMethods())

module.exports = router
