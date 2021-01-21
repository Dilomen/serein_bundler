const Router = require('koa-router')
const router = new Router()
const UserController = require('../controller/user')

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

// 删除用户
router.delete('/delete/:id', async (ctx) => {
  const userController = new UserController(ctx)
  await userController.deleteUser()
})

// 用户列表
router.get('/list', async (ctx) => {
  const userController = new UserController(ctx)
  await userController.searchUserList()
})

// 添加用户
router.post('/add', async (ctx) => {
  const userController = new UserController(ctx)
  await userController.addUser()
})

// 编辑用户
router.put('/edit', async (ctx) => {
  const userController = new UserController(ctx)
  await userController.editUser()
})

module.exports = router