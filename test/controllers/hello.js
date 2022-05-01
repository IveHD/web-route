module.exports = [{
  path: '/js/hello',
  // method: 'get',
  // cors: true,
  handler(ctx, next) {
      ctx.body = {
        success: true,
        msg: 'js 注册接口'
      };
  }
}];