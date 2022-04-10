
import RouteMapping from '@/mapping/route';
import { HTTP_METHOD } from '@/lib/const';
import { EXCEPTION_CODE } from '../lib/const';
import { setCorsHeader } from '../lib/cors';
import { CORS } from '@/types/index';

type RouteConfig = string | {
  path: string;
  method?: typeof HTTP_METHOD[keyof typeof HTTP_METHOD];
  contentType?: string;
  cors?: CORS,
}

const RequestMapping = (config: RouteConfig) => {
  let path = '/';
  let method = HTTP_METHOD.GET;
  if (typeof config === 'string') {
    path = config;
  }
  else {
    path = config.path;
    method = config.method?.toLowerCase() || HTTP_METHOD.GET;
  }
  return (...args) => {
    const [target, property] = args;
    const handler = target[property];
    if (args.length === 1) { // class decorator
      if (typeof config !== 'string') {
        throw new Error('Expected 1 argument when RequestMapping is used as class decorator');
      }
      RouteMapping.addGroupRoute(target, path);
    } else {
      // 跨域设置
      const isCors = typeof config !== 'string' && config.cors;
      if (isCors) {
        RouteMapping.addRoute(target.constructor, {
          path,
          method: 'options',
          handler: [(ctx, next) => {
            ctx.response.status = 200;
            setCorsHeader(ctx, typeof config.cors === 'boolean' ? { methods: method } : Object.assign({ methods: method }, config.cors));
          }]
        });
      }
      RouteMapping.addRoute(target.constructor, {
        path,
        method,
        handler: [async (ctx, next) => {
          if (typeof config !== 'string' && config.contentType && ctx.header['content-type'] !== config.contentType) {
            const EXCEPTION = EXCEPTION_CODE.UNSUPPORTED_CONTENT_TYPE
            ctx.body = {
              success: false,
              code: EXCEPTION.CODE,
              info: EXCEPTION.INFO
            };
            return;
          }
          if (isCors) {
            setCorsHeader(ctx, typeof config.cors === 'boolean' ? { methods: method } : Object.assign({ methods: method }, config.cors));
          }
          await handler(ctx, next);
        }],
      });
    }
  }
}

export default RequestMapping;