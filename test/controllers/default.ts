import { RequestMapping, ValidParamRule, CONTENT_TYPE } from "../../src/index";
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
      msg: 'paramValid'
    };
  }
}

export default HiController;