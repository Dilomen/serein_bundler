const { execute } = require('../../../utils/execute')
const conf = require('../../../config')
const fs = require('fs')
const chalk = require('chalk')
const { logger } = require('../../../log.config')
const { copySync } = require('../../../utils/copyDir')
const chatService = require('./chat_service')
class GitlabService {
  constructor() {
    this.message = {}
    this.remoteRepoPath = ''
  }

  async receiveMessage(message) {
    this.message = JSON.parse(message)
    return true
    // try {
    //   if (this.message.type === 'error') {
    //     chatService(this.message).then(() => {
    //       return true
    //     })
    //   }
    //   const { data = {} } = await this.push()
    //   const chatMsg = data.status === 'send' ? data : this.message
    //   if (data.type === 'success') {
    //     chatService(chatMsg)
    //     return true
    //   }
    //   return false
    // } catch (err) {
    //   logger.error(err)
    // }
  }

  async push () {
    // 路径 仓库名
    let { repositoryName, commitMessage, buildPath } = this.message
    if (!fs.existsSync(buildPath) || !fs.existsSync(conf.remoteRepoUrl)) {
      return this.createError("找不到对应可提交的文件")
    }
    let isSuccess = true
    try {
      this.remoteRepoPath = this.dispatchPath()
      copySync(buildPath, `${conf.remoteRepoUrl}/${this.remoteRepoPath}`)
    } catch(err) {
      isSuccess = false
    }
    if (!isSuccess) return this.createError(`Project ${repositoryName} copy failed`)
    let options = {
      cwd: conf.remoteRepoUrl
    }
    let steps = ['git add .', `git commit -m "${commitMessage}"`, 'git push origin master']
    const result = await this.build(steps, options)
    return result
  }

  async build(steps, options) {
    const cwd = steps.shift()
    let { message } = this.message
    try {
      await execute(cwd, options, null)
      // if (code !== 0) { throw `the command of ${cwd} execution failed, Project < ${repoName} > submission gitlab failed` }
      if (steps.length === 0) {
        return { type: 'success', message: message + `\n获取地址：${conf.remoteGitRepository}/${this.remoteRepoPath}`, status: 'send' }
      } else {
        return await this.build(steps, options)
      }
    } catch (err) {
      logger.error(err)
      return this.createError(`${err}`)
    }
  }

  // 判断是否 拉取 远程仓库
  static pull () {
    if (!fs.existsSync(conf.remoteRepoUrl) || fs.readdirSync(conf.remoteRepoUrl).length === 0) {
      execute(`git clone ${conf.remoteGitUrl}`, {}, null).then((code) => {
        if (!code) {
          console.log(`${chalk.green('success to execution the command of')} ${chalk.underline.yellow(`'git clone ${conf.remoteGitUrl}'`)}`)
        }
      })
    } else {
      console.log(`${chalk.green('already pulled')} ${chalk.underline.yellow(`'${conf.remoteGitUrl}'`)}`)
    }
  }

  createError() {
    const { message } = this.message
    const sendErrorMsg =  message.replace('打包成功', '打包失败')
    logger.error(sendErrorMsg)
    return { type: 'error', message: sendErrorMsg, status: 'send' }
  }

  dispatchPath() {
    const { branchName } = this.message
    let gitPath = ''
    if (/\/cac-/.test(branchName)) {
      gitPath = 'cac'
    } else if (/\/app/i.test(branchName)) {
      gitPath = 'app'
    } else if (/\/screen/i.test(branchName)) {
      gitPath = 'screen'
    } else {
      gitPath = 'ga'
    }
    if (!fs.existsSync(`${conf.remoteRepoUrl}/${gitPath}`)) { fs.mkdirSync(`${conf.remoteRepoUrl}/${gitPath}`) }
    return `${gitPath}/${branchName.replace(/\//g, '_')}`
  }
}


module.exports = GitlabService
