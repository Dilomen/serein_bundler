const cluster = require('cluster')
const config = require('./config')
const { logger } = require('./log.config')
const path = require('path')
const fs = require('fs')
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
cluster.setupMaster({
  exec: './worker.js'
})
for (let i = 0; i < config.processSize; i++) {
  const worker = cluster.fork()
  require('./controller/master/worker_controller').ping(worker)
}

const buildLogPath = path.resolve(__dirname, './build_log')
if (!fs.existsSync(buildLogPath)) {
  fs.mkdirSync(buildLogPath)
}

// 必须这么写
require('./controller/master/worker_controller').listen(cluster)
require('./controller/master/worker_controller').initServiceWorker()
require('./controller/master/worker_controller').checkOverflow(cluster)
require('./controller/master/worker_controller').updateView(cluster)