import { RequestMapping, ParamValidRule, CONTENT_TYPE, NO_AUTH_BODY } from "../../src/index";
import { Context } from "koa";

@RequestMapping('/asd',)
class HiController {
  @RequestMapping({
    path: '/this/is/a/get',
    paramValidate: {
      a: [ParamValidRule.REQUIRED, ParamValidRule.STRING],
      b: ParamValidRule.REQUIRED
    }
  })
  default(ctx) {
    ctx.body = {
      success: true,
      msg: 'registByString',
    };
  }

  @RequestMapping({
    method: 'post',
    path: '/this/is/a/post',
    paramValidate: {
      a: [ParamValidRule.REQUIRED, ParamValidRule.STRING],
      b: ParamValidRule.REQUIRED
    }
  })
  fn(ctx) {
    ctx.body = {
      success: true,
      msg: 'registByString',
    };
  }
}

export default HiController;