const fs = require('fs')
function moveDir(oldPath, newPath) {
    return new Promise((resolve) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.log('Error', err)
                resolve(false)
            }
            resolve(true)
        })
    })
}

module.exports = moveDir