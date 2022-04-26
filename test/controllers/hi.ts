import { RequestMapping, ValidParam, ValidParamRule } from "../../src/index";
import { Context } from "koa";

@RequestMapping('/hi')
class HiController {
  
  @RequestMapping({ path: '/sayHiAgain', method: 'get', cors: true })
  @ValidParam({
    a: [ValidParamRule.REUQIRED, ValidParamRule.STRING],
    b: ValidParamRule.REUQIRED
  })
  sayHiAgain(ctx: Context) {
    console.log('hi world again...');
    ctx.body = {
      success: true,
    };
  }
}

export default HiController;