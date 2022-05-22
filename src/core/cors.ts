import { Context, Next, Middleware } from 'koa';
import { CORS } from "../types/global";

const corsDefaultHeader = {
  'origin': '*',
  'headers': '*',
  'methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
  'credentials': 'true'
};

export const setCorsHeader = (ctx: Context, config: CORS) => {
  if (config === true) {
    ctx.set('Access-Control-Allow-Origin', corsDefaultHeader.origin);
    ctx.set('Access-Control-Allow-Headers', corsDefaultHeader.headers);
    ctx.set('Access-Control-Allow-Methods', ctx.request.method);
    ctx.set('Access-Control-Allow-Credentials', corsDefaultHeader.credentials);
  } else if (typeof config === 'object') {
    ctx.set('Access-Control-Allow-Origin', config.origin || corsDefaultHeader.origin);
    ctx.set('Access-Control-Allow-Headers', config.headers || corsDefaultHeader.headers);
    ctx.set('Access-Control-Allow-Methods', config.methods || ctx.request.method);
    ctx.set('Access-Control-Allow-Credentials', config.credentials || corsDefaultHeader.credentials);
  }
}

export default function corsMiddleware(cors: CORS): Middleware {
  return async (ctx: Context, next: Next) => {
    setCorsHeader(ctx, cors);
    await next();
  };
}