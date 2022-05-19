const { ValidParamRule, CONTENT_TYPE } = require("../../src/index");

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
}];