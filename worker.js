const { logger } = require('./log.config')
const buildService = require('./service/build_process/build_service')
require('./controller/build_process/build_controller').initTaskConsumer()

process.on('error', (error) => {
  logger.error(error)
})
process.on('unhandledRejection', error => {
  logger.error(error)
});
process.on('uncaughtException', error => {
  logger.error(error)
  process.exit(1)
});
// 检测进程是否内存泄漏
setInterval(() => {
  if (process.memoryUsage().rss > 734003200) {
    process.exit(1)
  }
}, 4000)
process.on('message', (msg) => {
  if (msg === 'interrupt') {
    buildService.closeThread()
  }
  if (msg === 'ping') {
    process.send('pong')
  }
})
