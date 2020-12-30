const { parentPort } = require('worker_threads');
const { execute } = require('../../utils/execute')
const { logger } = require('../../log.config')
const config = require('../../config')
const path = require('path')

let startTime = ''
parentPort.on('message', ({ steps, projectPath, buildDirname, content }) => {
  build({ steps, projectPath, buildDirname, content })
  startTime = new Date().getTime()
})

function build ({ steps, projectPath, buildDirname, content }) {
  const cmd = steps.shift()
  if (/git clone/.test(cmd)) {
    projectPath = path.resolve(config.cwd, buildDirname)
  }
  if (/git checkout/.test(cmd)) {
    projectPath = path.resolve(config.cwd, buildDirname, content.name)
  }
  let child = null
  if (cmd === 'npm run build') {
    child = execute(cmd, { cwd: projectPath, env: { ...process.env, ...config.env } }, null, (msg) => parentPort.postMessage({ data: decode(msg), type: 'std' }))
  } else {
    child = execute(cmd, { cwd: projectPath }, null, (msg) => parentPort.postMessage({ data: decode(msg), type: 'std' }))
  }
  child.then((code) => {
    if (code === 0) {
      if (steps.length === 0) {
        parentPort.postMessage({ type: 'success', data: { projectPath, useTime: new Date().getTime() - startTime } })
      } else {
        parentPort.postMessage({ data: '开始下一步\n', type: 'std' })
        build({ steps, projectPath, buildDirname, content })
      }
    } else {
      parentPort.postMessage({ type: 'fail', data: { projectPath, useTime: new Date().getTime() - startTime } })
    }
  }).catch((err) => { logger.error(err) })
}


function decode (str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}