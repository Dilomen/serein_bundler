const BuildService = require('../../service/build_process/build_service')
class BuildContoller {
    async build (content) {
        let { pusher, ref, repository: { clone_url = '', name = '', updated_at: updateTime }, commits: [currentCommits = {}] = [], soloId, commitTime } = content
        ref = ref.replace('refs/heads/', '')
        const { id: commitId } = currentCommits
        if (!commitId) { this._ctx.body = { code: 0, msg: '当前提交有误，缺少commit信息' }; return }
        const buildService = new BuildService({ pusher, ref, clone_url, name, currentCommits, updateTime, soloId, commitTime })
        buildService.start()
    }
}

module.exports = BuildContoller
