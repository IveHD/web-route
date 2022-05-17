module.exports = [{
  path: '/js_api/registByString',
  handler(ctx, next) {
    ctx.body = {
      success: true,
      msg: 'registByString'
    };
  }
}, {
  path: '/js_api/post',
  method: 'post',
  handler(ctx, next) {
    ctx.body = {
      success: true,
      msg: 'post'
    };
  }
}];