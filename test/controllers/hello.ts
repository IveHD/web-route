import { RequestMapping, ValidParamRule, CONTENT_TYPE, NO_AUTH_BODY } from "../../src/index";
import { Context } from "koa";

@RequestMapping('/ts_api/')
class HiController {
  @RequestMapping('/registByString')
  default(ctx) {
    ctx.body = {
      success: true,
      msg: 'registByString',
    };
  }

  @RequestMapping({ path: '/post', method: 'post' })
  post(ctx) {
    ctx.body = {
      success: true,
      msg: 'post',
    };
  }
  
  @RequestMapping({ path: '/paramValid', method: 'post', isAuthValidate: false, paramValidate: {
    a: [ValidParamRule.REUQIRED, ValidParamRule.STRING],
    b: ValidParamRule.REUQIRED
  } })
  async fn1(ctx: Context) {
    ctx.body = {
      success: true,
      msg: 'paramValid'
    };
  }

  @RequestMapping({ path: '/contentType', method: 'post', contentType: CONTENT_TYPE.APPLICATION_FORM_UTF8 })
  async fn2(ctx: Context) {
    ctx.body = {
      success: true,
      msg: 'contentType'
    };
  }

  @RequestMapping({ path: '/cors1', method: 'post', cors: true })
  async fn3(ctx: Context) {
    ctx.body = {
      success: true,
      msg: 'cors1'
    };
  }

  @RequestMapping({ path: '/auth', method: 'post', authValidate: (ctx, next) => {
    const token = ctx.get('token');
    if(token) next();
    else ctx.body = NO_AUTH_BODY;
  }})
  async fn4(ctx: Context) {
    ctx.body = {
      success: true,
      msg: 'auth'
    };
  }
}

export default HiController;