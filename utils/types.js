const dayjs = require('dayjs')

// 进程通信相关
const TYPE_FILECACHE_ADD = 'TYPE_FILECACHE_ADD'
const TYPE_ADD_BUILD = 'TYPE_ADD_BUILD'
const TYPE_FINISH_BUILD = 'TYPE_FINISH_BUILD'
const TYPE_FINISH_SEND = 'TYPE_FINISH_SEND'
// socket相关
const UPDATE_LIST_VIEW = 'UPDATE_LIST_VIEW' // 通知列表页面发送请求更新
const UPDATE_VIEW = 'UPDATE_VIEW' // 通知详情页面发送请求更新，并断开socket
const UPDATE_DETAIL = 'UPDATE_DETAIL' // 通知发送给详情页面信息

const FILECACHE = 'FILECACHE'
const INTERRUPT = 'INTERRUPT'
const TASKNOTICE = 'TASKNOTICE'
const UPDATE_DIED_PROCESS_TASK_STATUS = 'UPDATE_DIED_PROCESS_TASK_STATUS'

const BUILD_TYPE = {
  BUILD_WAIT: 1, // 打包等待
  BUILD_START: 2, // 开始打包
  BUILD_SUCCESS: 3, // 打包成功
  SEND_WAIT: 4, // 等待发送
  SEND_START: 5, // 开始发送
  SEND_SUCCESS: 6, // 发送成功
  BUILD_CANCEL: 7, // 打包取消
  BUILD_FAIL: -1, // 打包失败
  SEND_FAIL: -2 // 发送失败
}

const BUILD_STATUS_SHOW = {
  [BUILD_TYPE.BUILD_WAIT]: { type: 'warning', label: '打包等待', loading: false, icon: 'md-time' }, // 打包等待
  [BUILD_TYPE.SEND_WAIT]: { type: 'warning', label: '发送等待', loading: false, icon: 'md-time' }, // 发送等待
  [BUILD_TYPE.BUILD_START]: { type: 'info', label: '开始打包', loading: true, icon: 'md-play' }, // 开始打包
  [BUILD_TYPE.SEND_START]: { type: 'info', label: '开始发送', loading: true, icon: 'md-play' }, // 开始发送
  [BUILD_TYPE.BUILD_SUCCESS]: { type: 'success', label: '打包成功', loading: false, icon: 'md-checkmark-circle' }, // 打包成功
  [BUILD_TYPE.SEND_SUCCESS]: { type: 'success', label: '发送成功', loading: false, icon: 'md-checkmark-circle' }, // 发送成功
  [BUILD_TYPE.BUILD_CANCEL]: { type: 'default', label: '打包取消', loading: false, icon: 'md-remove-circle' }, // 打包取消
  [BUILD_TYPE.BUILD_FAIL]: { type: 'error', label: '打包失败', loading: false, icon: 'md-close-circle' }, // 打包失败
  [BUILD_TYPE.SEND_FAIL]: { type: 'error', label: '发送失败', loading: false, icon: 'md-close-circle' }, // 发送失败
}

function getStatusShow (buildSatus, sendStatus) {
  return [BUILD_STATUS_SHOW[buildSatus], BUILD_STATUS_SHOW[sendStatus]]
}

class Task {
  constructor(content = {}) {
    const { 
      branch,
      pusher,
      pusherEmail,
      repositoryName,
      clone_url, commitId,
      repositoryCreator,
      commitPerson,
      commitPersonEmail,
      commitTime,
      commitMessage
    } = content
    // 打包者信息
    this.pusher = pusher // push提交者
    this.pusherEmail = pusherEmail // push提交者邮箱
    // 项目信息
    this.cloneUrl = clone_url // 拉取的git地址
    this.repositoryName = repositoryName // 项目名称
    this.repositoryCreator = repositoryCreator // 项目创建者
    this.branch = branch // 分支名
    // 提交者信息
    this.commitId = commitId // 提交id
    this.commitPerson = commitPerson // commit提交者
    this.commitPersonEmail = commitPersonEmail // commit提交者邮箱
    this.commitTime = dayjs(commitTime).format('YYYY-MM-DD HH:mm:ss') // commit时间
    this.commitMessage = commitMessage // commit注释
  }
}

module.exports = {
  TASKNOTICE,
  INTERRUPT,
  FILECACHE,
  BUILD_TYPE,
  TYPE_FILECACHE_ADD,
  TYPE_ADD_BUILD,
  TYPE_FINISH_BUILD,
  TYPE_FINISH_SEND,
  UPDATE_VIEW,
  UPDATE_LIST_VIEW,
  UPDATE_DETAIL,
  BUILD_STATUS_SHOW,
  UPDATE_DIED_PROCESS_TASK_STATUS,
  Task,
  getStatusShow
}