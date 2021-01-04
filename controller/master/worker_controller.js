let workersManager = [] // 打包进程中的相关信息
let _cluster = null
const { TYPE_ADD_BUILD, TYPE_FINISH_BUILD, TYPE_FINISH_SEND, TYPE_FILECACHE_ADD, FILECACHE, INTERRUPT, TASKNOTICE, UPDATE_DIED_PROCESS_TASK_STATUS } = require('../../utils/types')
const childProcess = require('child_process')
const path = require('path')
let serviceWorker = null
class WorkManagerController {
  constructor(ctx) {
    this._ctx = ctx
  }

  /**
   * 监听子进程的消息
   * @param {子进程群} cluster 
   */
  static listen (cluster) {
    _cluster = cluster
    for (const id in _cluster.workers) {
      _cluster.workers[id].on('message', (msg) => {
        // 打包新增或完成：更新进程信息管理状态
        if (msg.type === TYPE_ADD_BUILD || msg.type === TYPE_FINISH_BUILD) {
          for (let i = 0; i < workersManager.length; i++) {
            if (workersManager[i].workerPid === msg.workerPid) {
              delete msg.type
              Object.assign(workersManager[i], msg)
            }
          }
        // 消息发送完成后，通知打包队列进行下一个打包
        } else if (msg.type === TYPE_FINISH_SEND) {
          serviceWorker.send({ type: TASKNOTICE, taskName: msg.data.taskName })
        // 打包成功，更新redis中的项目管理数据
        } else if (msg.type === TYPE_FILECACHE_ADD) {
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
      // 防止更新数据库操作出现问题，导致主进程崩溃，所以将更新数据库的任务分发给业务进程来处理
      serviceWorker.send({ type: UPDATE_DIED_PROCESS_TASK_STATUS, soloId: deidWork.soloId })
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
    // execArgv 可以传入指定调试的端口号
    serviceWorker = childProcess.fork(path.resolve(process.cwd(), './serve_worker.js'), [], { execArgv: ['--inspect=8081'] })
    serviceWorker.on('exit', () => {
      serviceWorker = childProcess.fork(path.resolve(process.cwd(), './serve_worker.js'))
    })
    serviceWorker.on('message', (msg) => {
      if (msg.type === INTERRUPT) {
        serviceWorker.send({ type: INTERRUPT, result: WorkManagerController.interrupt(msg.data.soloId), data: msg.data  })
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

  /**
   * 中断操作，要更新进程管理状态，并向子进程发送中断通知
   */
  static interrupt (interruptId) {
    let result = false
    for (let i = 0; i < workersManager.length; i++) {
      const soloId = workersManager[i].soloId
      if (soloId && (soloId === interruptId)) {
        _cluster.workers[workersManager[i].workerId].send({ type: INTERRUPT, soloId: interruptId })
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
