const { logger } = require('../log.config')
const BuildService = require('./service/build_service')
const { INTERRUPT } = require('../utils')
require('./controller/build_controller').initTaskConsumer()

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
  if (msg.type === INTERRUPT) {
    BuildService.closeThread(msg.soloId)
  }
  if (msg === 'ping') {
    process.send('pong')
  }
})
