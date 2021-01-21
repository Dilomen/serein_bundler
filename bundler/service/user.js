const jwt = require('jsonwebtoken')
const { encryption, dBUtils } = require('../../utils')
const { logger } = require('../../log.config')
class UserService {
  constructor(content = {}) {
    this.content = content
  }

  async login () {
    let { username, password } = this.content
    const searchSql = `SELECT password FROM user WHERE user_name = '${username}'`
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
      const searchSql = `
      SELECT 
        user_name as userName, 
        real_name as realName, 
        identity, 
        create_time as createTime 
      FROM 
        user 
      WHERE
        user_name='${res.username}'
      `
      let result = await dBUtils.search(searchSql) || []
      return result[0]
    })
  }

  async addUser ({ userName = '', realName = '', password, identity = 1 }) {
    if (!userName || !password) return { code: 0, msg: '缺少对应参数' }
    password = encryption(encodeURIComponent(password))
    const searchSql = `SELECT user_name as userName FROM user WHERE user_name='${userName}'`
    let result = await dBUtils.search(searchSql) || []
    if (result.length > 0) return { code: 0, msg: '用户名已存在' }
    const sql_sentence = `
    INSERT INTO 
      user(user_name, real_name, password, identity) 
    VALUES
      (?,?,?,?)`;
    const sql_params = [userName, realName, password, identity];
    result = await dBUtils.insertField(sql_sentence, sql_params)
    return result ? { code: 1, msg: '添加用户成功' } : { code: 0, msg: '添加用户失败' }
  }

  async searchUserList ({ userName = '', realName = '', limit = 20, offset = 1 }) {
    const sum = limit * (offset - 1)
    let whereSql = ''
    if (userName && realName) {
      whereSql = `WHERE user_name like '%${userName}%' AND real_name like '%${realName}%'`
    } else if (userName) {
      whereSql = `WHERE user_name like '%${userName}%'`
    } else if (realName) {
      whereSql = `WHERE real_name like '%${realName}%'`
    }
    const searchSql = `
    SELECT
      id,
      enabled,
      user_name as userName,
      real_name as realName,
      identity,
      create_time as createTime
    FROM
      user
      ${whereSql}
    ORDER BY
      createTime
    DESC
    LIMIT
      ${sum},${limit};
    `
    let result = await dBUtils.search(searchSql) || []
    const searchTotalSql = `
    SELECT 
      COUNT(*) AS total
    FROM 
      user 
      ${whereSql}
    LIMIT 
      ${sum},${limit};
    `
    let totalResult = await dBUtils.search(searchTotalSql) || []
    return { data: result, total: totalResult[0].total, code: 1 }
  }

  async deleteUser ({ id, status }) {
    const sql_sentence = `
      UPDATE 
        user
      SET 
        enabled = ? 
      WHERE id = ?`;
    const sql_params = [status, id];
    let result = await dBUtils.updateField(sql_sentence, sql_params)
    return result ? { code: 1, msg: '修改用户成功' } : { code: 0, msg: '修改用户失败' }
  }

  async editUser ({ userName, realName, password, identity = 1, id }) {
    if (!userName) return { code: 0, msg: '缺少对应参数' }
    const searchSql = `SELECT user_name as userName FROM user WHERE id!='${id}' AND user_name='${userName}'`
    let result = await dBUtils.search(searchSql) || []
    if (result.length > 0) return { code: 0, msg: '用户名已存在' }
    if (password) {
      password = encryption(encodeURIComponent(password))
      const sql_sentence = `
      UPDATE 
        user
      SET 
        user_name = ?, real_name = ?, password = ?, identity = ? WHERE id = ?`;
      const sql_params = [userName, realName, password, identity, id];
      result = await dBUtils.updateField(sql_sentence, sql_params)
    } else {
      const sql_sentence = `
      UPDATE 
        user
      SET 
        user_name = ?, real_name = ?, identity = ? WHERE id = ?`;
      const sql_params = [userName, realName, identity, id];
      result = await dBUtils.updateField(sql_sentence, sql_params)
    }
    return result ? { code: 1, msg: '修改用户成功' } : { code: 0, msg: '修改用户失败' }
  }

  getToken () {
    const { username, password } = this.content
    return jwt.sign({ username, password }, 'ailpha', { expiresIn: "1 days" })
  }
}

module.exports = UserService
