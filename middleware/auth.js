const jwt = require('jsonwebtoken')

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.path === '/webhook') {
      let Signature = ctx.header['x-gitlab-token'] || ctx.header['x-gogs-signature'] || ctx.header['x-hub-signature'] || ''
      if (!Signature) {
        ctx.status = 401
        ctx.body = { msg: '非法请求，没有权限', code: 0 }
        return
      }
    }
    if (['/favicon.ico', '/login', '/webhook', '/'].includes(ctx.path) || /_nuxt/.test(ctx.path)) {
      await next();
    } else {
      let authorization = ctx.cookies.get('BUNDLER_TOKEN') || ctx.header.authorization || ''
      if (!authorization) {
        ctx.status = 401
        // ctx.body = { code: 0, msg: '验证已过期，请重新登录' }
        // ctx.response.redirect('#/login')
        return
      }
      authorization = authorization.replace('Bearer ', '')
      const result = await checkToken(authorization)
      if (!result) {
        ctx.status = 401
        // ctx.body = { code: 0, msg: '验证已过期，请重新登录' }
        // ctx.response.redirect('#/login')
        return
      }
      await next()
    }
  }
}


function checkToken (token) {
  return new Promise((resolve) => {
    jwt.verify(token, 'ailpha', (err, res) => {
      if (!err) {
        // 表示过期
        if (res.exp <= parseInt(+new Date().getTime()/1000)) {
          resolve(false)
        }
        resolve(true)
      } else {
        resolve(false);
      }
    })
  })
}