const Producer = require('./producer.js')
const create = require('./connect.js')
let producer = null

module.exports = async () => {
  if (!producer) {
    const { ch, confirmCh } = await create()
    // 生产
    producer = new Producer(ch, confirmCh)
    producer
      .addQueue('chat', 'serein')
      .addQueue('gitlab', 'serein')
      .addQueue('transmit', 'serein')
      .addQueue('email', 'serein')
      .addQueue('note', 'serein')
      .addQueue('task', 'dispatch')
      .addExChange('dispatch')
      .addExChange('serein')
      .relation()
  }
  return new Promise((resolve, reject) => {
    if (producer) {
      resolve({
        producer
      })
    } else {
      console.error('Connect failed!')
      reject(null)
    }
  })
}
