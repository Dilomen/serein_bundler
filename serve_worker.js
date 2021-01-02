const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const server = require('http').Server(app.callback());
const SocketHandler = require('./utils/socket')
const auth = require('./middleware/auth')
const fs = require('fs')
const path = require('path')
const consumer = require('./model/rabbitmq/consumerInstance')
const router = require('./router')
const { logger } = require('./log.config')
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

// 判断 build目录 是否存在
if (!fs.existsSync(path.resolve(__dirname, 'build'))) {
  fs.mkdirSync(path.resolve(__dirname, 'build'))
}

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

require('./service/serve_process/notice_service/gitlab_service').pull()
const redisClient = require('./model/redis')
redisClient().then(client => {
  require('./service/serve_process/cache_service')(client)
})
// 必须这么写
require('./controller/serve_process/bundler_controller').initMessageConsumer()
require('./controller/serve_process/bundler_controller').updateView()
require('./controller/serve_process/bundler_controller').updateDiedProcessTaskStatus()
require('./controller/serve_process/bundler_controller').initRebuildTask()
app.use(router.routes())
  .use(router.allowedMethods())
  .use(static('public/views'))
const port = 8081
module.exports = server.listen(port, () => {
  console.log('Listen http://localhost:' + port)
})
