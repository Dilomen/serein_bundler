const amqp = require('amqplib')
const conf = require('../../config').rabbitmq
const chalk = require('chalk')
const { logger } = require('../../log.config.js')

const create = async function () {
  if (create.channel)
    return Promise.resolve({ ch: create.channel, confirmCh: create.confirmCh })
  return new Promise((resolve, reject) => {
    amqp
      .connect(conf.URL)
      .then(async connect => {
        let ch = await connect.createChannel()
        let confirmCh = await connect.createConfirmChannel()
        // console.log(chalk.blue(`\n---> rabbitmq 连接成功 <---`))
        create.channel = ch
        create.confirmCh = confirmCh
        resolve({ ch, confirmCh })
      })
      .catch(error => {
        logger.error('rabbitmq 连接失败')
        console.log(chalk.red('\n---> rabbitmq 连接失败 <---'))
        console.log(chalk.blue('rabbitmq 50秒后尝试重新连接>>> \n'))
        setTimeout(async () => {
          await create()
        }, 50000)
        reject(error)
      })
  })
}

module.exports = create
