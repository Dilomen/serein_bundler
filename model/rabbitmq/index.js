const Producer = require('./producer.js')
const create = require('./connect.js')
let producer = null
async function link () {
  if (!producer) {
    const { ch, confirmCh } = await create()
    // 生产
    producer = new Producer(ch, confirmCh)
    producer
      .addQueue('chat', 'anheng')
      .addQueue('gitlab', 'anheng')
      .addQueue('other', 'anheng')
      .addQueue('task', 'dispatch')
      .addExChange('dispatch')
      .addExChange('anheng')
      .relation()
  }
}

module.exports = async () => {
  await link()
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
