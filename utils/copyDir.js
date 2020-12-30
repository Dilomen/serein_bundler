const fs = require('fs')
function isDirEmpty(dirPath) {
  return fs.promises.readdir(dirPath).then((files) => {
    return files.length === 0
  })
}

function copy(src, dst) {
  const paths = fs.readdirSync(src)
  if (paths.length === 0) return
  paths.forEach((path) => {
    const _src = src + '/' + path
    const _dst = dst + '/' + path
    const stat = fs.statSync(_src)
    if (stat.isFile()) {
      fs.writeFileSync(_dst, fs.readFileSync(_src, 'utf-8'))
    } else if (stat.isDirectory()) {
      copySync(_src, _dst)
    }
  })
}

function copySync(src, dst) {
  const isExists = fs.existsSync(dst)
  if (!isExists) {
    fs.mkdirSync(dst)
  }
  copy(src, dst)
}

module.exports = {
  isDirEmpty,
  copySync
}
