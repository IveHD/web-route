import { Context, Next, Middleware } from 'koa';
import { CORS, RouteConfig } from '../types/global';

const corsDefaultHeader = {
  'origin': '*',
  'headers': '*',
  'methods': '*',
  'credentials': true
};

export const setCorsHeader = (ctx: Context, config: CORS) => {
  let origin, headers, methods, credentials;
  if (config === true) {
    origin = ctx.get('origin');
    headers = corsDefaultHeader.headers;
    methods = ctx.request.method;
    credentials = (corsDefaultHeader.credentials) as unknown as string;
  } else if (typeof config === 'object') {
    origin = config.origin || corsDefaultHeader.origin;
    headers = config.headers || corsDefaultHeader.headers;
    methods = config.methods || ctx.request.method;
    credentials = (config.credentials || corsDefaultHeader.credentials) as unknown as string;
  }
  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Headers', headers);
  ctx.set('Access-Control-Allow-Methods', methods);
  ctx.set('Access-Control-Allow-Credentials', credentials);
  if (origin !== '*') {
    ctx.set('Vary', 'Origin');
  }
}

export default function corsMiddleware(config: RouteConfig, addRoute: Function): Middleware {
  const { path, cors } = config;
  if (cors) {
    // 跨域预检请求
    addRoute({
      path,
      method: 'options',
      handler: async (ctx, next) => {
        ctx.response.status = 200;
        setCorsHeader(ctx, cors);
      }
    });
  }
  return async (ctx: Context, next: Next) => {
    if (cors) {
      setCorsHeader(ctx, cors);
    }
    await next();
  };
}