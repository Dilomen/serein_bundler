const cluster = require('cluster')
const config = require('../config')
const { logger } = require('../log.config')
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
  exec: path.resolve(__dirname, './worker.js')
})
for (let i = 0; i < config.processSize; i++) {
  const worker = cluster.fork()
  require('./controller/worker_controller').ping(worker)
}

const buildLogPath = path.resolve(process.cwd(), './storage/build_log')
if (!fs.existsSync(buildLogPath)) {
  fs.mkdirSync(buildLogPath)
}

// 判断 build目录 是否存在
if (!fs.existsSync(path.resolve(config.cwd))) {
  fs.mkdirSync(path.resolve(config.cwd))
}

// 必须这么写
require('./controller/worker_controller').initServiceWorker()
require('./controller/worker_controller').listen(cluster)
require('./controller/worker_controller').checkOverflow(cluster)
require('./controller/worker_controller').updateView(cluster)