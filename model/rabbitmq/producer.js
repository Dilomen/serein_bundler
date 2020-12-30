const create = require('./connect.js')
class Producer {
  constructor(channel, confirmCh) {
    this.queue = []
    this.exchange = []
    this.channel = channel
    this.confirmCh = confirmCh
    this.init()
  }
  init() {
    if (Producer.instance) return Producer.instance
    if (!this.channel) {
      create().then(ch => (this.channel = ch))
    }
    return (Producer.instance = this)
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
      let index = this.queueInstance.findIndex(q => q.name === queueName)
      if (index === -1) {
        let queue = this.channel.assertQueue(queueName, options)
        this.channel.bindQueue(queueName, exchangeName)
        this.queueInstance.push({
          name: queueName,
          value: queue
        })
      }
    })
    return this
  }
  sendQueueMsg(exchangeName, msg, options = {}, callback) {
    if (!exchangeName) return false
    let buffer = Buffer.from(JSON.stringify(msg))
    this.confirmCh.publish(exchangeName, '', buffer, options, callback)
    return true
  }
}

// function getInstance() {
//   if (getInstance.instance) return Promise.resolve(getInstance.instance)
//   return new Promise(resolve => {
//     create(ch => {
//       let producer = new Producer(ch)
//       getInstance.instance = producer
//       resolve(producer)
//     })
//   })
// }
module.exports = Producer
