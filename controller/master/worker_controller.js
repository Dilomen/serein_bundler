/**
 * 该文件主要是主进程对子进程的管理相关
 */
let workersManager = []
let _cluster = null
const { TYPE_ADD_BUILD, TYPE_FINISH_BUILD, TYPE_FINISH_SEND, TYPE_FILECACHE_ADD, FILECACHE, INTERRUPT, TASKNOTICE } = require('../../utils/types')
const childProcess = require('child_process')
const path = require('path')
let serviceWorker = null
class WorkManagerController {
  constructor(ctx) {
    this._ctx = ctx
  }

  static listen (cluster) {
    _cluster = cluster
    for (const id in _cluster.workers) {
      _cluster.workers[id].on('message', (msg) => {
        if (msg.type === TYPE_ADD_BUILD || msg.type === TYPE_FINISH_BUILD) {
          for (let i = 0; i < workersManager.length; i++) {
            if (workersManager[i].workerPid === msg.workerPid) {
              delete msg.type
              Object.assign(workersManager[i], msg)
            }
          }
        } else if (msg.type === TYPE_FINISH_SEND) {
          serviceWorker.send({ type: TASKNOTICE, taskName: msg.data.taskName })
        }
        if (msg.type === TYPE_FILECACHE_ADD) {
          serviceWorker.send({ type: FILECACHE, data: msg.data })
        }
      })
    }
    _cluster.on('fork', (worker) => {
      workersManager.push({ workerId: worker.id, workerPid: worker.process.pid })
    })

    _cluster.on('exit', (worker) => {
      const deidWork = workersManager.find(item => item.workerPid === worker.process.pid)
      workersManager = workersManager.filter(item => item.workerPid !== worker.process.pid)
      console.log('worker ' + worker.process.pid + ' died')
      serviceWorker.send({ type: TASKNOTICE, taskName: deidWork.projectName })
      setTimeout(() => {
        const worker = cluster.fork()
        console.log('worker ' + worker.process.pid + ' fork')
        WorkManagerController.ping(worker)
      }, 5000)
    })
  }
  /**
   * 客户端交互进程
   */
  static initServiceWorker () {
    serviceWorker = childProcess.fork(path.resolve(process.cwd(), './serve_worker.js'))
    serviceWorker.on('exit', () => {
      serviceWorker = childProcess.fork(path.resolve(process.cwd(), './serve_worker.js'))
    })
    serviceWorker.on('message', (msg) => {
      if (msg.type === INTERRUPT) {
        serviceWorker.send({ type: INTERRUPT, result: WorkManagerController.interrupt(msg.data) })
      }
    })
  }


  static checkOverflow () {
    // 检测进程是否内存泄漏
    setInterval(() => {
      if (process.memoryUsage().rss > 734003200) {
        process.exit(1)
      }
    }, 5000)
  }

  // 心跳包
  static ping (worker) {
    worker.on('exit', () => {
      clearInterval(timer)
    })
    let missedPing = 0
    let timer = setInterval(() => {
      worker.send('ping')
      missedPing++
      if (missedPing >= 3) {
        process.kill(worker.process.pid)
        clearInterval(timer)
      }
    }, 5000)
    worker.on('message', (msg) => {
      if (msg === 'pong') {
        missedPing--
      }
    })
  }

  static interrupt (interruptId) {
    let result = false
    for (let i = 0; i < workersManager.length; i++) {
      const soloId = workersManager[i].soloId
      if (soloId && (soloId === interruptId)) {
        _cluster.workers[workersManager[i].workerId].send('interrupt')
        workersManager[i].soloId = ''
        workersManager[i].projectName = ''
        result = true
        break
      }
    }
    return result
  }

  // socket通知页面
  static updateView (_cluster) {
    for (const id in _cluster.workers) {
      _cluster.workers[id].on('message', (msg) => {
        if (msg.type) {
          serviceWorker.send(msg)
        }
      })
    }
  }
}

module.exports = WorkManagerController
