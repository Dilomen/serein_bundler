const UserService = require('../service/user')
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

    async addUser() {
      const userService = new UserService()
      const result = await userService.addUser(this._ctx.request.body)
      this._ctx.body = result
    }
  
    async searchUserList() {
      const userService = new UserService()
      const result = await userService.searchUserList(this._ctx.request.query)
      this._ctx.body = result
    }
  
    async deleteUser() {
      const userService = new UserService()
      const params = {id: this._ctx.params.id, status: this._ctx.request.query.status}
      const result = await userService.deleteUser(params)
      this._ctx.body = result
    }
  
    async editUser() {
      const userService = new UserService()
      const result = await userService.editUser(this._ctx.request.body)
      this._ctx.body = result
    }
}

module.exports = UserContoller
