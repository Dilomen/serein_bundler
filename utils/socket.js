const socketIO = require('socket.io')
const { UPDATE_DETAIL, UPDATE_VIEW, UPDATE_LIST_VIEW } = require('./types')
let io = null
class SocketHandler {
  constructor(http) {
    io = socketIO(http)
    this.socket = null
    this.listener = {}
    this.instance = null
  }
  static getInstance(http) {
    if (!this.instance) {
      this.instance = new SocketHandler(http)
    }
    return this.instance
  }
  async connect () {
    io.on('connection', (socket) => {
      this.socket = socket
      socket.on('join', ({soloId}) => {
        socket.join(soloId)
      })
      socket.on('leave', ({soloId}) => {
        socket.leave(soloId)
      })
      this.on(UPDATE_VIEW, (data) => {
        io.to(data.soloId).emit('message', {type: UPDATE_VIEW, data})
      })
      this.on(UPDATE_LIST_VIEW, () => {
        io.emit('message', {type: UPDATE_LIST_VIEW})
      })
      this.on(UPDATE_DETAIL, (data) => {
        io.to(data.soloId).emit('message', {type: UPDATE_DETAIL, data})
      })
    })
  }
  receive (message = 'message', fn) {
    if (!this.socket) return
    this.socket.on(message, fn)
  }
  send (message = 'message', data) {
    if (!io) return
    io.emit(message, data)
  }
  disconnect () {
    if (!this.socket) return
    this.socket.disconnect();
  }
  on(key, fn) {
    if (!this.listener[key]) {
      this.listener[key] = []
    }
    this.listener[key].push(fn)
  }
  emit(key, ...data) {
    (this.listener[key] || []).forEach(fn => {
      fn(...data)
    })
  }
}

module.exports = SocketHandler