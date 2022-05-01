import { RequestMapping, ValidParam, ValidParamRule } from "../../src/index";
import { Context } from "koa";

@RequestMapping('/hi')
class HiController {
  
  @RequestMapping({ path: '/sayHiAgain', method: 'post' })
  @ValidParam({
    a: [ValidParamRule.REUQIRED, ValidParamRule.STRING],
    b: ValidParamRule.REUQIRED
  })
  async sayHiAgain(ctx: Context) {
    console.log('hi world again...');
    ctx.body = {
      success: true,
      msg: '注解注册接口'
    };
  }
}

export default HiController;