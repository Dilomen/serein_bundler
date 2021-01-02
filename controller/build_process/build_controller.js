const BuildService = require('../../service/build_process/build_service')
const Consumer = require('../../model/rabbitmq/consumer')
const logger = require('../../log.config')
class BuildController {
    /**
     * 正常webhook请求的打包
     * @param {Object} content  请求内容
     */
    async build (content) {
        if (!content.commitId) { this._ctx.body = { code: 0, msg: '当前提交有误，缺少commit信息' }; return false }
        const buildService = new BuildService(content)
        buildService.start()
        return true
    }

    /**
     * 初始化打包消费者
     */
    static async initTaskConsumer () {
        const taskConsumer = await new Consumer().getNewInstance()
        taskConsumer('task', 'dispatch', async (msg, ch) => {
            try {
                msg = JSON.parse(msg.content.toString())
                const buildController = new BuildController()
                const result = await buildController.build(msg)
                result && ch.ack(msg)
            } catch (err) {
                logger.error(err)
            }
        })
    }
}

module.exports = BuildController
