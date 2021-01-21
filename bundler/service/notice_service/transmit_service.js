const scpClient = require('scp2')
const { logger } = require('../../../log.config')
class TransmitService {
  constructor() { }

  sendFile (localFilePath) {
    scpClient.scp(localFilePath, {
      host: 'xxx.xxx.xxx.xx',
      username: 'root',
      password: '',
      path: '/home/'
    }, (err) => {
      if (err) logger.error(err)
    })
  }
}

module.exports = TransmitService