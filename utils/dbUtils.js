const mysql = require('mysql')
const config = require('../config')
class DBUtils {
  constructor(config){
    this.mysql = null
    this.mysqlConfig = config
    this.connectMysql()
  }
  connectMysql(){
    this.mysql = mysql.createConnection(this.mysqlConfig)
    this.mysql.connect()
    this.mysql.on('error',this.handleError.bind(this))
  }
  handleError (error){
      if(error){
          if(error.code === 'PROTOCOL_CONNECTION_LOST'){
              this.connectMysql()
          }
      }
  }
  async insertField(sql, params) {
    return new Promise((resolve) => {
      return this.mysql.query(sql, params, function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          resolve(false)
        }
        resolve(result)
      });
    })
  }
  async updateField(sql, params) {
    return new Promise((resolve) => {
      this.mysql.query(sql, params, function (err, result) {
        if (err) {
          console.log('[UPDATE ERROR] - ', err.message)
          resolve(false)
        }
        resolve(result)
      })
    });
  }
  async deleteField(sql) {
    return new Promise((resolve) => {
      this.mysql.query(sql, function (err, result) {
        if (err) {
          console.log('[DELETE ERROR] - ', err.message);
          resolve(false)
        }
        resolve(result)
      });
    })
  }
  async search(sql) {
    return new Promise((resolve) => {
      this.mysql.query(sql, function selectCb(err, results) {
        if (err) {
          console.log('[SEARCH ERROR] - ', err.message);
          resolve(false)
        }
        resolve(results)
      })
    })
  }
}

module.exports = new DBUtils(config.mysql)
