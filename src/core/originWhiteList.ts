import { Context, Next } from 'koa';
import { RouteConfig } from '../types/global';
import { transparentMiddleware } from '../lib/util';
import { getConfig } from '../lib/config';
const DEFAULT_CONFIG = getConfig();

export default (config: RouteConfig) => {
  const list = [];
  const { originWhiteList } = config;
  const defaultWhiteList = DEFAULT_CONFIG.originWhiteList;

  if(Array.isArray(originWhiteList)) Array.prototype.push.apply(list, originWhiteList);
  if(Array.isArray(defaultWhiteList)) Array.prototype.push.apply(list, defaultWhiteList);

  if(!list.length) return transparentMiddleware;
  const regxs = list.map(s => new RegExp(`^${s}$`));
  return async (ctx: Context, next: Next) => {
    if(!!regxs.find(r => r.test(ctx.origin))) {
      await next();
    } else {
      ctx.status = 403;
    }
  }
};