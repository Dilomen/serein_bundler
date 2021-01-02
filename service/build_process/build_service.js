const rm = require('rimraf')
const config = require('../../config')
const path = require('path')
const fs = require('fs')
const compressing = require('compressing')
const dayjs = require('dayjs')
const dBUtils = require('../../utils/dbUtils')
const { encryption } = require('../../utils/aes')
const { logger } = require('../../log.config')
const rabbit = require('../../model/rabbitmq')
// const gitUserAndPass = require('../../config').gitUserAndPass
const { Worker } = require('worker_threads');
const { uniteProjectBranch } = require('../../utils/common')
const threadServicePath = path.resolve(__dirname, './build_thread_service.js')
let buildThread = new Worker(threadServicePath, {});
const { UPDATE_DETAIL, UPDATE_VIEW, UPDATE_LIST_VIEW, TYPE_ADD_BUILD, TYPE_FINISH_BUILD, TYPE_FILECACHE_ADD, TYPE_FINISH_SEND, BUILD_TYPE } = require('../../utils/types')

class BuildService {
    constructor(content) {
        this.content = content
        let { branch, repositoryName } = content
        this.build_dirname = uniteProjectBranch(repositoryName, branch)
        this.projectPath = config.cwd
        this.cwdOutput = ''
        this.timer = null
        this.status = BUILD_TYPE.BUILD_WAIT
        this.buildStatus = BUILD_TYPE.BUILD_WAIT
        this.sendStatus = BUILD_TYPE.SEND_WAIT
    }

    async start () {
        const { branch, soloId } = this.content
        process.send({ type: TYPE_ADD_BUILD, workerPid: process.pid, soloId, projectName: this.build_dirname })
        this.updateStatus(BUILD_TYPE.BUILD_START)
        this.execStdListening('开始打包: branch: ' + branch + '\nplatform: ' + process.platform + '\n')
        try {
            this.build()
        } catch (err) {
            logger.error(err)
        }
        this.timer = setInterval(async () => {
            process.send({ type: UPDATE_DETAIL, data: { commitContent: this.cwdOutput, status: this.status, soloId } })
        }, 1000)
    }

    build () {
        if (!buildThread) {
            buildThread = new Worker(threadServicePath, {});
        }
        buildThread.postMessage({ projectPath: this.projectPath, buildDirname: this.build_dirname, content: this.content })
        const _self = this
        buildThread.on('message', function (content) {
            if (content.type === 'std') {
                _self.execStdListening(content.data)
            } else if (content.type === 'success') {
                _self.updateResult({ status: BUILD_TYPE.BUILD_SUCCESS, data: content.data, msg: '\n打包成功' })
                // 通知缓存更新，同时更新redis中的项目管理数据
                process.send({ type: TYPE_FILECACHE_ADD, data: _self.build_dirname })
            } else if (content.type === 'fail') {
                try {
                    if (fs.existsSync(`${config.cwd}/${_self.build_dirname}`)) {
                        rm.sync(`${config.cwd}/${_self.build_dirname}`)
                    }
                } catch (err) {
                    logger.error(err)
                }
                _self.updateResult({ status: BUILD_TYPE.BUILD_FAIL, data: content.data, msg: '\n打包失败' })
            }
        })
    }

    execStdListening (msg) {
        this.cwdOutput += msg
    }

    async updateStatus (status, useTime) {
        this.status = status
        const { soloId } = this.content
        let sql_sentence = ''
        let sql_params = []
        if ([BUILD_TYPE.SEND_FAIL, BUILD_TYPE.SEND_SUCCESS, BUILD_TYPE.SEND_START, BUILD_TYPE.SEND_WAIT].indexOf(status) === -1) {
            this.buildStatus = status
        } else {
            this.sendStatus = status
        }
        if (status === BUILD_TYPE.BUILD_SUCCESS || status === BUILD_TYPE.BUILD_FAIL) {
            sql_sentence = `
            UPDATE
                bundler_info
            SET 
                build_status = ?, send_status = ?, consume_time = ?
            WHERE
                solo_id = ?`
            sql_params = [this.buildStatus, this.sendStatus, useTime, soloId]
            const dateCommitConentPath = path.join(process.cwd(), `./build_log/${dayjs(new Date()).format('YYYY-MM-DD')}`)
            const commitConentPath = path.join(dateCommitConentPath, `/${this.build_dirname}`)
            if (!fs.existsSync(dateCommitConentPath)) {
                fs.mkdirSync(dateCommitConentPath)
            }
            if (!fs.existsSync(commitConentPath)) {
                fs.mkdirSync(commitConentPath)
            }
            fs.writeFileSync(path.join(commitConentPath, `/${soloId}.log`), this.cwdOutput, { encoding: 'utf-8' })
        } else {
            sql_sentence = 'UPDATE bundler_info SET build_status = ?, send_status = ? WHERE solo_id = ?'
            sql_params = [this.buildStatus, this.sendStatus, soloId]
        }
        await dBUtils.updateField(sql_sentence, sql_params)
        process.send({ type: UPDATE_VIEW, data: { soloId } })
        process.send({ type: UPDATE_LIST_VIEW })
    }

    async updateResult ({ status, data, msg }) {
        clearInterval(this.timer)
        this.projectPath = data.projectPath
        this.execStdListening(msg)
        try {
            const { pusher, commitMessage, branch, repositoryName, commitTime } = this.content
            await this.updateStatus(status, data.useTime)
            // 打包结束
            process.send({ type: TYPE_FINISH_BUILD, soloId: '', projectName: '', workerPid: process.pid })
            let buildMessage = ` @${pusher} 提交了任务\n分支名：【 *${branch}* 】\n项目名：【 *${repositoryName}* 】\n提交信息：${commitMessage}\n提交时间：${commitTime}\n打包用时： *${Math.ceil(data.useTime / 1000)}s*`
            this.cwdOutput = ''
            const buildPath = fs.existsSync(this.projectPath + '/dist') ? this.projectPath + '/dist' : this.projectPath + '/build'
            if (status === BUILD_TYPE.BUILD_SUCCESS) {
                // await this.compress(buildMessage, buildPath)
                this.MQProducer('success', { message: '【 *打包成功!* 】\n' + buildMessage, commitMessage, repositoryName, buildPath })
            } else if (status === BUILD_TYPE.BUILD_FAIL) {
                this.MQProducer('error', { message: '【 *打包失败！* 】\n' + buildMessage, commitMessage, repositoryName, buildPath })
            }
        } catch (err) {
            console.log(err)
        }
    }

    // 压缩
    async compress (buildMessage, buildPath) {
        buildMessage = encryption(buildMessage)
        return new Promise((resolve, reject) => {
            fs.writeFile(buildPath + '/.env', buildMessage, (err) => {
                if (err) throw err
                const zipBuildPath = this.projectPath + `/${dayjs(new Date()).format('YYYY-MM-DD-HH_mm_ss')}.zip`
                compressing.zip.compressDir(buildPath + '/', zipBuildPath).then((err) => {
                    if (err) logger.error(err)
                    // new TransmitService().sendFile(zipBuildPath)
                    resolve()
                }).catch(err => {
                    logger.error(err)
                    reject(err)
                })
            })
        })

    }

    async MQProducer (type, content) {
        this.updateStatus(BUILD_TYPE.SEND_START)
        let rabbits = await rabbit()
        const message = { type, ...content }
        rabbits.producer.sendQueueMsg('anheng', message, {}, (err) => {
            process.send({ type: TYPE_FINISH_SEND, data: { taskName: this.build_dirname } })
            if (err) { this.updateStatus(BUILD_TYPE.SEND_FAIL); logger.error(err) }
            this.updateStatus(BUILD_TYPE.SEND_SUCCESS)
        })
    }

    /**
     * 关闭工作的线程，以此关闭打包子进程
     */
    static closeThread () {
        buildThread.terminate()
        buildThread = null
    }

}

module.exports = BuildService
