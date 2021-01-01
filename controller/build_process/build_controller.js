const BuildService = require('../../service/build_process/build_service')
class BuildContoller {
    /**
     * 正常webhook请求的打包
     * @param {Object} content  请求内容
     */
    async build (content) {
        if (!content.commitId) { this._ctx.body = { code: 0, msg: '当前提交有误，缺少commit信息' }; return }
        const buildService = new BuildService(content)
        buildService.start()
    }

    /**
     * 重新打包：一般就是平台发起的，或者服务重启，对原本未开始或者未结束的包进行重新打包
     * @param {Object} content 请求内容
     */
    async rebuild (content) {
        console.log(content)
    }
}

module.exports = BuildContoller
