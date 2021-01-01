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
}

module.exports = BuildContoller
