const create = require('./connect.js')

class Consumer {
  constructor(channel) {
    this.queue = []
    this.exchange = []
    this.channel = channel
    this.init()
  }
  init() {
    if (Consumer.instance) return Consumer.instance
    if (!this.channel) {
      create().then(ch => (this.channel = ch))
    }
    return (Consumer.instance = this)
  }
  addQueue(queueName, exchangeName, options = {}) {
    this.queue.push({ queueName, exchangeName, options })
    return this
  }
  addExChange(exchangeName, type = 'fanout', options = {}) {
    this.exchange.push({ exchangeName, type, options })
    return this
  }
  relation() {
    this.queueInstance = []
    this.exchangeInstance = []
    this.exchange.forEach(({ exchangeName, type, options }) => {
      this.exchangeInstance.push({
        name: exchangeName,
        value: this.channel.assertExchange(exchangeName, type, options)
      })
    })
    this.queue.forEach(({ queueName, exchangeName, options }) => {
      let queue = this.channel.assertQueue(queueName, options)
      this.channel.bindQueue(queueName, exchangeName)
      this.queueInstance.push({
        name: queueName,
        value: queue
      })
    })
    return this
  }
  receiveQueueMsg(callback, options = {}) {
    this.queue.forEach(({ queueName }) => {
      this.channel.consume(
        queueName,
        msg => {
          callback(msg, this.channel)
        },
        options
      )
    })
  }
}
// async function getInstance() {
//   if (getInstance.instance) return Promise.resolve(getInstance.instance)
//   return new Promise(resolve => {
//     create(ch => {
//       let consumer = new Consumer(ch)
//       getInstance.instance = consumer
//       resolve(consumer)
//     })
//   })
// }
module.exports = Consumer
