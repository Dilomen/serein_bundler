const Router = require('koa-router')
const router = new Router()
const StatisticsController = require('../controller/statistics')
const BundlerController = require('../controller/bundler')

// 打断
router.put('/interrupt', async (ctx) => {
  const bundlerController = new BundlerController(ctx)
  let result = await bundlerController.interrupt(ctx.request.body)
  ctx.body = result
})

// 打包列表
router.get('/list', async (ctx) => {
  const bundlerController = new BundlerController(ctx)
  await bundlerController.searchList()
})

// 打包详情
router.get('/detail', async (ctx) => {
  const bundlerController = new BundlerController(ctx)
  await bundlerController.searchDetail()
})

// 统计
router.get('/statistics', async (ctx) => {
  const statisticsController = new StatisticsController(ctx)
  await statisticsController.searchSummation()
})

// 个人统计
router.get('/person_statistics', async (ctx) => {
  const statisticsController = new StatisticsController(ctx)
  await statisticsController.searchPersonSummation()
})

module.exports = router