const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const server = require('http').Server(app.callback());
const { SocketHandler } = require('../utils')
const auth = require('./middleware/auth')
const router = require('./route/index')
const path = require('path')
const { logger } = require('../log.config')
SocketHandler.getInstance(server).connect()

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type, Accept, Authorization,Cookie, X-Gogs-Signature");
  ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("X-Powered-By", ' 3.2.1')
  if (ctx.method === "OPTIONS") {
    ctx.status = 204
    return
  }
  await next();
}).use(auth()).use(bodyParser())

process.on('error', (error) => {
  logger.error(error)
})
process.on('unhandledRejection', error => {
  logger.error(error);
});
process.on('uncaughtException', error => {
  logger.error(error);
  process.exit(1)
});

require('./service/notice_service/gitlab_service').pull()
const redisClient = require('../model/redis')
redisClient().then(client => {
  require('./service/cache')(client)
})
// 必须这么写
require('./controller/bundler').initMessageConsumer()
require('./controller/bundler').initIntrruptListen()
require('./controller/bundler').updateView()
require('./controller/bundler').updateDiedProcessTaskStatus()
require('./controller/task').initRebuildTask()
app.use(router.routes())
  .use(router.allowedMethods())
  .use(static(path.resolve(__dirname, './public/views')))
const port = 8082
module.exports = server.listen(port, () => {
  console.log('Listen http://localhost:' + port)
})
