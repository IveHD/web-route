const { ValidParamRule, CONTENT_TYPE, NO_AUTH_BODY } = require("../../src/index");

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
}, {
  path: '/js_api/paramValid',
  method: 'post',
  paramValidate: {
    a: [ValidParamRule.REUQIRED, ValidParamRule.STRING],
    b: ValidParamRule.REUQIRED
  },
  handler(ctx, next) {
    ctx.body = {
      success: true,
      msg: 'post'
    };
  }
}, {
  path: '/js_api/contentType',
  method: 'post',
  contentType: CONTENT_TYPE.APPLICATION_FORM_UTF8,
  handler(ctx, next) {
    ctx.body = {
      success: true,
      msg: 'post'
    };
  }
}, {
  path: '/js_api/cors1',
  method: 'post',
  cors: true,
  handler(ctx, next) {
    ctx.body = {
      success: true,
      msg: 'post'
    };
  }
}, {
  path: '/js_api/auth',
  method: 'post',
  authValidate: (ctx, next) => {
    const token = ctx.get('token');
    if(token) next();
    else ctx.body = NO_AUTH_BODY;
  },
  handler(ctx, next) {
    ctx.body = {
      success: true,
      msg: 'auth'
    };
  }
}];