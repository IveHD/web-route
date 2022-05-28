import { Context, Next } from 'koa';
import { RouteConfig } from '../types/global';
import { transparentMiddleware } from '../lib/util';
import { getConfig } from '../lib/config';
import { setCorsHeader } from './cors';
const DEFAULT_CONFIG = getConfig();

export default (config: RouteConfig, addRoute: Function) => {
  const list = [];
  const { originWhiteList } = config;
  const defaultWhiteList = DEFAULT_CONFIG.originWhiteList;

  if(Array.isArray(originWhiteList)) Array.prototype.push.apply(list, originWhiteList);
  if(Array.isArray(defaultWhiteList)) Array.prototype.push.apply(list, defaultWhiteList);

  if(!list.length) return transparentMiddleware;
  const regxs = list.map(s => new RegExp(`^${s}$`));
  const { path, cors } = config;
  // 如果接口没做跨域配置，则为 originWhiteList 里面的域名自动添加允许跨域，如果做了跨域配置，则使用配置
  if(!cors) {
    addRoute({
      path,
      method: 'options',
      handler: async (ctx, next) => {
        if(!!regxs.find(r => r.test(ctx.get('origin')))) {
          ctx.response.status = 200;
          setCorsHeader(ctx, true);
        }
      }
    });
  }
  
  return async (ctx: Context, next: Next) => {
    if(!!regxs.find(r => r.test(ctx.get('origin')))) {
      // 如果接口没做跨域配置，则为 originWhiteList 里面的域名自动添加允许跨域，如果做了跨域配置，则使用配置
      if(!cors) {
        setCorsHeader(ctx, true);
      }
      await next();
    } else {
      ctx.status = 403;
    }
  }
};