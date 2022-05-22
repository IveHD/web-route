import { EXCEPTION_CODE } from "../lib/const";
import { lowerCaseTrim } from "../lib/util";
import { RouteConfig } from '../types/global';
import { Middleware } from 'koa';

export default function contentTypeMiddleware(config: RouteConfig): Middleware {
  return async (ctx, next) => {
    // content-type 校验
    if (typeof config !== 'string' && config.contentType && lowerCaseTrim(ctx.header['content-type'] || '') !== lowerCaseTrim(config.contentType || '')) {
      const EXCEPTION = EXCEPTION_CODE.UNSUPPORTED_CONTENT_TYPE
      ctx.body = {
        success: false,
        code: EXCEPTION.CODE,
        info: EXCEPTION.INFO
      };
    } else {
      await next();
    }
  }
};

