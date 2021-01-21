const scpClient = require('scp2')
const { logger } = require('../../../log.config')
const rm = require('rimraf')
class TransmitService {
  constructor() { }

  receiveMessage(message) {
    const msg = JSON.parse(message)
    if (msg.zipBuildPath) {
      this.sendFile(msg.zipBuildPath)
    }
  }

  sendFile (localFilePath) {
    scpClient.scp(localFilePath, {
      host: 'xxx.xxx.xxx.xxx',
      username: 'root',
      password: 'xxxx',
      path: '/home/'
    }, (err) => {
      if (err) { logger.error(err); return }
      rm(localFilePath, function (err) {
        if (err) logger.error(err)
      })
    })
  }
}

module.exports = TransmitService