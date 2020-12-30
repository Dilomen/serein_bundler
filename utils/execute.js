const exec = require('child_process').exec
const execFile = require('child_process').execFile
function execute (cmd, options, cb, stdListener) {
    return new Promise((resolve, reject) => {
        try {
            const child = exec(cmd, options, cb)
            child.on('error', (err) => {
                // console.error(err)
                reject(err)
            })
            child.stderr.on('data', (msg) => {
                // console.warn(msg)
                stdListener && stdListener(msg)
            })
            child.stdout.on('data', (msg) => {
                // console.log(msg)
                stdListener && stdListener(msg)
            })
            child.on('close', (code) => {
                resolve(code)
            })
        } catch (err) {
            console.error('Error: ' + err)
            reject(err)
        }
    })
}

function executeFile (file, arg, options, cb, stdListener) {
    return new Promise((resolve, reject) => {
        try {
            const child = execFile(file, arg, options, cb)
            child.on('error', (err) => {
                // console.error(err)
                reject(err)
            })
            child.stderr.on('data', (msg) => {
                // console.warn(msg)
                stdListener && stdListener(msg)
            })
            child.stdout.on('data', (msg) => {
                // console.log(msg)
                stdListener && stdListener(msg)
            })
            child.on('close', (code) => {
                resolve(code)
            })
        } catch (err) {
            console.error('Error: ' + err)
            reject(err)
        }
    })
}


module.exports = {
    execute, 
    executeFile
}
