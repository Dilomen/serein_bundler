// const request = require('supertest')
// const { app, socket } = require('../worker')
// const agent = request.agent(worker)

// describe('GET /', function () {
//   it('测试服务器是否正常执行', function (done) {
//       agent.get('/')
//           .end(function (err, res) {
//               if (err) return done(err)
//               done()
//           })
//   })
// })


// describe('POST /interrupt', function () {
//   it('测试webhook', function (done) {
//       agent.post('/interrupt')
//           .send({
//               "id": "b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0"
//           })
//           .set('Accept', 'application/json')
//           .expect(200)
//           .end(function (err, res) {
//               if (err) return done(err)
//               done()
//           })
//   })
// })