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
const gitUserAndPass = require('../../config').gitUserAndPass
// const TransmitService = require('../serve_process/transmit_service')
const { Worker } = require('worker_threads');
const { uniteProjectBranch } = require('../../utils/common')
// const iconv = require('iconv-lite')
const threadServicePath = path.resolve(__dirname, './build_thread_service.js')
let buildThread = new Worker(threadServicePath, {});
const { UPDATE_DETAIL, UPDATE_VIEW, UPDATE_LIST_VIEW, TYPE_ADD_BUILD, TYPE_FINISH_BUILD, TYPE_FILECACHE_ADD, TYPE_FINISH_SEND, BUILD_TYPE } = require('../../utils/types')

class BuildService {
    constructor(content) {
        this.content = content
        let { ref = '', name = '' } = content
        ref = ref.replace('refs/heads/', '')
        this.content.ref = ref
        this.build_dirname = uniteProjectBranch(name, ref)
        this.projectPath = config.cwd
        this.cwdOutput = ''
        this.timer = null
        this.status = BUILD_TYPE.BUILD_WAIT
        this.buildStatus = BUILD_TYPE.BUILD_WAIT
        this.sendStatus = BUILD_TYPE.SEND_WAIT
    }

    start () {
        const { ref = '', soloId } = this.content
        process.send({ type: TYPE_ADD_BUILD, workerPid: process.pid, soloId, projectName: this.build_dirname })
        this.updateStatus(BUILD_TYPE.BUILD_START)
        this.execStdListening('开始打包: branch: ' + ref + '\nplatform: ' + process.platform + '\n')
        try {
            this.build()
        } catch(err) {
            console.log(err)
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
                _self.projectPath = content.data.projectPath
                _self.execStdListening('\n打包成功')
                process.send({ type: TYPE_FILECACHE_ADD, data: _self.build_dirname })
                clearInterval(_self.timer)
                _self.updateResult({ type: BUILD_TYPE.BUILD_SUCCESS, useTime: content.data.useTime })
            } else if (content.type === 'fail') {
                new Promise((resolve, reject) => {
                    if (fs.existsSync(`${config.cwd}/${_self.build_dirname}`)) {
                        setTimeout(() => {
                            rm(`${config.cwd}/${_self.build_dirname}`, function (err) {
                                if (err) { reject(err); logger.error(err) }
                                resolve()
                            })
                        }, 10000)
                    } else {
                        resolve()
                    }
                }).then(() => {
                    _self.projectPath = content.data.projectPath
                    _self.execStdListening('\n打包失败')
                    clearInterval(_self.timer)
                    _self.updateResult({ type: BUILD_TYPE.BUILD_FAIL, useTime: content.data.useTime })
                })
            }
        })
    }

    execStdListening (msg) {
        this.cwdOutput += msg
    }

    async updateStatus (status, useTime) {
        this.status = status
        const { soloId } = this.content
        let sql_sentence
        let sql_params
        this.statusFactory(status)
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

    async updateResult ({ type: status, useTime }) {
        try {
            console.log("打包总用时: ", useTime / 1000)
            const { currentCommits: { committer: { username }, message }, ref, name, name: repoName = '', commitTime } = this.content
            await this.updateStatus(status, useTime)
            // 打包结束
            process.send({ type: TYPE_FINISH_BUILD, soloId: '', projectName: '', workerPid: process.pid })
            let buildMessage = ` @${username} 提交了任务\n分支名：【 *${ref}* 】\n项目名：【 *${name}* 】\n提交信息：${message}\n提交时间：${commitTime}\n打包用时： *${Math.ceil(useTime / 1000)}s*`
            this.cwdOutput = ''
            const buildPath = fs.existsSync(this.projectPath + '/dist') ? this.projectPath + '/dist' : this.projectPath + '/build'
            if (status === BUILD_TYPE.BUILD_SUCCESS) {
                // await this.compress(buildMessage, buildPath)
                this.MQProducer('success', { message: '【 *打包成功!* 】\n' + buildMessage, commitMsg: message, dirName: this.build_dirname, repoName, buildPath, branchName: ref })
                // 打包失败
            } else if (status === BUILD_TYPE.BUILD_FAIL) {
                this.MQProducer('error', { message: '【 *打包失败！* 】\n' + buildMessage, commitMsg: message, dirName: this.build_dirname, repoName, buildPath })
            }
        } catch (err) {
            console.log(err)
        }
    }

    statusFactory (status) {
        [BUILD_TYPE.SEND_FAIL, BUILD_TYPE.SEND_SUCCESS, BUILD_TYPE.SEND_START, BUILD_TYPE.SEND_WAIT].indexOf(status) === -1 ? this.buildStatus = status : this.sendStatus = status
    }

    // 压缩
    async compress (buildMessage, buildPath) {
        const { currentCommits: { timestamp } } = this.content
        buildMessage = encryption(buildMessage)
        return new Promise((resolve, reject) => {
            fs.writeFile(buildPath + '/.env', buildMessage, (err) => {
                if (err) throw err
                const zipBuildPath = this.projectPath + `/${dayjs(timestamp).format('YYYY-MM-DD-HH_mm_ss')}.zip`
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

    static closeThread () {
        buildThread.terminate()
        buildThread = null
    }
}

module.exports = BuildService
