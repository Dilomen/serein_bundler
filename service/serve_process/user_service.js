const dBUtils = require('../../utils/dbUtils')
const jwt = require('jsonwebtoken')
const { logger } = require('../../log.config')
class UserService {
  constructor(content = {}) {
    this.content = content
  }

  async login () {
    const { username, password } = this.content
    const searchSql = `SELECT password FROM user WHERE username = '${username}'`
    let result = await dBUtils.search(searchSql) || []
    if (result.length === 0 || result[0].password !== password) {
      return { code: 0, msg: '登录失败' }
    }
    return { code: 1, msg: '登录成功', token: 'Bearer ' + this.getToken() }
  }

  async info (token) {
    return jwt.verify(token, 'ailpha', async (err, res) => {
      if (err) {
        logger.error(err)
        return
      }
      const result = await dBUtils.search(`SELECT * FROM user WHERE username='${res.username}'`)
      delete result[0].password
      return result[0]
    })
  }

  getToken () {
    const { username, password } = this.content
    return jwt.sign({ username, password }, 'ailpha', { expiresIn: "1 days" })
  }
}

module.exports = UserService
