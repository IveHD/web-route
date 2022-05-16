import { EXCEPTION_CODE } from '../lib/const';
import { isPost } from '../lib/util';
import { Context } from 'koa';

type validFn = (paramName: string, paramValue: any, requestBody?: Record<string, any>, ctx?: Context) => string | boolean;


const ValidParam = (rule: { [name: string]: validFn | validFn[] }) => {
  return (...args) => {
    const [target, property, desciptor] = args;
    const handler = target[property];
    target[property] = async (ctx, next) => {
      const body = isPost(ctx) ? ctx.request.body : ctx.request.query;  // src/index.ts 内做了 bodyParser
      const invalidList: string[] = [];
      Object.keys(rule).forEach(p => {
        const validFns = Array.isArray(rule[p]) ? rule[p] : [rule[p]];
        for(let i = 0; i < validFns.length; i++){
          const validFn = validFns[i];
          const result = validFn(p, body[p], body, ctx);
          if (typeof result === 'string') {
            invalidList.push(result);
            return;
          }
        }
      });

      if (invalidList.length) {
        ctx.body = {
          success: false,
          code: EXCEPTION_CODE.PARAM_INVALID.CODE,
          info: invalidList.join(';')
        };
      } else {
        await handler(ctx, next);
      }
    };
  }
}

export default ValidParam;