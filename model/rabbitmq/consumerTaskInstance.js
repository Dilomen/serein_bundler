const BuildController = require('../../controller/build_process/build_controller')
const Consumer = require('./consumer.js')
const create = require('./connect.js')
const { logger } = require('../../log.config')
let task = null

module.exports = async () => {
  const { ch } = await create()
  task = new Consumer(ch)
  task
    .addQueue('task', 'dispatch')
    .addExChange('dispatch')
    .relation()
    .receiveQueueMsg(
      (msg, ch) => {
        try {
          ch.ack(msg)
          msg = JSON.parse(msg.content.toString())
          const buildController = new BuildController()
          buildController.build(msg)
        } catch (err) {
          logger.error(err)
        }
      },
      { noAck: false }
    )
  return new Promise(resolve => {
    task && resolve(task)
  })
}
