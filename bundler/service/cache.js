const rm = require('rimraf')
const fs = require('fs')
const config = require('../../config')
const { FILECACHE } = require('../../utils')
const { logger } = require('../../log.config')

async function cacheFile (client) {
  client.get('fileChache', (err, res) => {
    if (err) { logger.error(err); return }
    let fileCacheArr = []
    try {
      fileCacheArr = JSON.parse(res)
    } catch(err) {
      logger.error('fileChache Error: ', err)
    }
    fileCacheArr = Array.isArray(fileCacheArr) ? fileCacheArr : []
    const fileCache = new LRUCache(fileCacheArr)
    fileCache.on('remove', (deleteName) => {
      if (!fs.existsSync(`${config.cwd}/${deleteName}`)) return
      rm(`${config.cwd}/${deleteName}`, function (err) {
        if (err) logger.error(err)
      })
    })
    process.on('message', (msg) => {
      if (msg.type === FILECACHE) {
        fileCache.append(msg.data, client)
      }
    })
  })
}

class LRUCache {
  constructor(fileCacheArr) {
    this.capacity = config.cacheQuantity || 100 // 最多缓存几个项目
    this.fileNamePath = fileCacheArr || []
    this.listener = {}
  }

  append (filename, client) {
    // 如果已存在，更新位置
    let fileIndex = this.fileNamePath.lastIndexOf(filename)
    if (fileIndex !== -1) {
      this.fileNamePath.splice(fileIndex, 1)
    } else {
      // 如果满了，就删除链头
      if (this.isFull()) {
        const head = this.fileNamePath.shift()
        this.emit('remove', head)
      }
    }
    this.fileNamePath.push(filename)
    client.set('fileChache', JSON.stringify(this.fileNamePath))
  }

  on (key, fn) {
    if (!this.listener[key]) {
      this.listener[key] = []
    }
    this.listener[key].push(fn)
  }

  emit (key, ...args) {
    if (!this.listener[key]) return
    this.listener[key].forEach(fn => {
      if (fn instanceof Function) {
        fn(...args)
      }
    })
  }

  isFull () {
    return this.fileNamePath.length === this.capacity
  }

  toString () {
    let resultString = ""
    this.fileNamePath.forEach((item, index) => {
      index === this.fileNamePath.length - 1 ? resultString += item : resultString += item + ','
    })
    return resultString
  }
}


module.exports = cacheFile
