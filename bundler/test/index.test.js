const request = require('supertest')
const app = require('../index')
const agent = request.agent(app)
describe('GET /', function () {
    it('测试服务器是否正常执行', function (done) {
        agent.get('/')
            .end(function (err, res) {
                if (err) return done(err)
                done()
            })
    })
})


describe('POST /webhook', function () {
    it('测试webhook', function (done) {
        agent.post('/webhook')
            .send({
                "ref": "refs/heads/master",
                "repository": {
                    "clone_url": "http://gitlab.info.dbappsecurity.com.cn/jeff.zhao/bundler_test.git"
                },
                "pusher": {
                    "name": "heel",
                    "email": "12345@github.com"
                },
                "commits": [
                    {
                        "id": "b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0"
                    }
                ]
            })
            .set('Accept', 'application/json')
            // .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                done()
            })
    })
})
