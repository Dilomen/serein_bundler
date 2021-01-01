const chatService = require('../../service/serve_process/notice_service/chat_service')
// const GitlabService = require('../../service/serve_process/notice_service/gitlab_service')
const Consumer = require('./consumer.js')
const create = require('./connect.js')
const { logger } = require('../../log.config')
let gitlab = null
// let other = null

module.exports = async () => {
  const { ch } = await create()
  gitlab = new Consumer(ch)
  gitlab
    .addQueue('gitlab', 'anheng')
    .addExChange('anheng')
    .relation()
    .receiveQueueMsg(
      (msg, ch) => {
        // let message = msg.content.toString()
        // const messageObj = JSON.parse(message)
        try {
          ch.ack(msg)
          // if (messageObj.type === 'error') {
          //   chatService(messageObj).then(() => {
          //     ch.ack(msg)
          //   })
          //   return
          // }
          // new GitlabService(message).push().then((data = {}) => {
          //   const chatMsg = data.status === 'send' ? data : messageObj
          //   chatService(chatMsg)
          // }).then(() => {
          //   ch.ack(msg)
          // })
        } catch (err) {
          logger.error(err)
        }
      },
      { noAck: false }
    )
  // other = new Consumer(ch)
  // other
  //   .addQueue('other', 'anheng')
  //   .addExChange('anheng')
  //   .relation()
  //   .receiveQueueMsg(
  //     (msg, ch) => {
  //       sendMessage(msg.content.toString()).then(() => {
  //         ch.ack(msg)
  //       })
  //     },
  //     { noAck: false }
  //   )
  return new Promise(resolve => {
    gitlab && resolve(gitlab)
  })
}
