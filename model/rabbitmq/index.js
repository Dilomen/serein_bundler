const Producer = require('./producer.js')
const create = require('./connect.js')
let producer = null

create().then(({ ch, confirmCh }) => {
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
})

module.exports = () => {
  return new Promise(resolve => {
    producer &&
      resolve({
        producer
      })
  })
}
