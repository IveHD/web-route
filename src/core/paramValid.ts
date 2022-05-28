import { RouteConfig } from '../types/global';
import { Middleware } from 'koa';
import { EXCEPTION_CODE } from '../lib/const';
import { isPost } from '../lib/util';

export default function paramValidateMiddleware(config: RouteConfig): Middleware {
  const { paramValidate } = config;
  return async (ctx, next) => {
    if (paramValidate !== undefined) {
      const body = isPost(ctx) ? ctx.request.body : ctx.request.query;  // src/index.ts 内做了 bodyParser
      for(const p in paramValidate) {
        const validFns = Array.isArray(paramValidate[p]) ? paramValidate[p] : [paramValidate[p]];
        for(let i = 0; i < validFns.length; i++){
          const validFn = validFns[i];
          const result = await validFn(p, body[p], body, ctx);
          if (typeof result === 'string') {
            ctx.body = {
              success: false,
              code: EXCEPTION_CODE.PARAM_INVALID.CODE,
              info: result,
            };
            return;
          }
        }
      }
      await next();
    } else {
      await next();
    }
  }
}