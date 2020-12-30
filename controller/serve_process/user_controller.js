const UserService = require('../../service/serve_process/user_service')
class UserContoller {
    constructor(ctx) {
        this._ctx = ctx
    }
    async login () {
      const userService = new UserService(this._ctx.request.body)
      const result = await userService.login()
      result.token && this._ctx.cookies.set('BUNDLER_TOKEN', result.token)
      this._ctx.body = result
    }
    async info() {
      let authorization = this._ctx.cookies.get('BUNDLER_TOKEN') || this._ctx.header.authorization || ''
      if (!authorization) return { code: 0, msg: '登录失败' }
      authorization = authorization.replace('Bearer ', '')
      const userService = new UserService()
      const result = await userService.info(authorization)
      this._ctx.body = result
    }
}

module.exports = UserContoller
