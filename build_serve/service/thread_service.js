const { parentPort } = require('worker_threads');
const path = require('path')
const { executeFile } = require('../../utils')
const { logger } = require('../../log.config')
const config = require('../../config')

let startTime = ''
parentPort.on('message', (data) => {
  build(data)
  startTime = new Date().getTime()
})

function build ({ projectPath, buildDirname, content: { repositoryName, cloneUrl, branch } }) {
  const shellPath = path.resolve(__dirname, './shell/front_default.sh')
  // 拉取下来的地址
  const gitClonePath = path.resolve(config.cwd, buildDirname)
  // 拉取下来地址中的项目地址
  const checkoutProjectPath = path.resolve(config.cwd, buildDirname, repositoryName)
  const pkgPath = path.resolve(gitClonePath, repositoryName, 'package.json')
  const child = executeFile(
    shellPath, 
    ['-gp', gitClonePath, '-cpp', checkoutProjectPath, '-clone', cloneUrl, '-branch', branch, '-pkg', pkgPath], 
    null, 
    null, 
    (msg) => {
    parentPort.postMessage({ data: decode(msg), type: 'std' })
  })
  child.then((code) => {
    if (code === 0) {
      projectPath = projectPath + '/' + buildDirname + '/' + repositoryName
      parentPort.postMessage({ type: 'success', data: { projectPath, useTime: new Date().getTime() - startTime } })
    } else {
      parentPort.postMessage({ type: 'fail', data: { projectPath, useTime: new Date().getTime() - startTime } })
    }
  }).catch((err) => { logger.error(err) })
}


function decode (str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}