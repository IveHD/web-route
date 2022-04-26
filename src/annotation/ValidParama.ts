import { EXCEPTION_CODE } from '../lib/const';
import { isPost } from '@/lib/util';
import Koa from 'koa';
import { Context } from 'koa';
const bodyParser = require('@/lib/bodyParser');

type validFn = (paramName: string, paramValue: any, requestBody?: Record<string, any>, ctx?: Context) => string | boolean;

const parser = bodyParser({});
const ValidParam = (rule: { [name: string]: validFn | validFn[] }) => {
  return (...args) => {
    const [target, property, desciptor] = args;
    const handler = target[property];
    target[property] = async (ctx, next) => {
      await parser(ctx);
      const body = isPost(ctx) ? ctx.request.body : ctx.request.query;
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
        handler(ctx, next);
      }
    };
  }
}

export default ValidParam;