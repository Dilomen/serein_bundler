const axios = require('axios')
const url = 'https://192.168.1.3:8888/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=%22q4bk7Y1Ak3tUL5WEJrreMVibI4yWXhM80tQhT78DDVgKGOBxbGKcMIJPFZXBxttb%22'
function sendMessage(message) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
  return axios({
    method: 'GET',
    url: url + '&payload=' + encodeURI(JSON.stringify({ text: message }))
  })
}
// 发送chat
async function chatService(msg) {
  switch (msg.type) {
    case 'success':
      // TODO 生成符合 成功 的信息
      break
    case 'error':
      // TODO 生成符合 失败 的信息
      break
  }
  // return Promise.resolve('success')
  return sendMessage(msg.message)
}
module.exports = chatService
