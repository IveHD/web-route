import path from 'path';
import { GROUP_ROUTE, ROUTE, RouteConfig } from '../types/global';
import { EXCEPTION_CODE, HTTP_METHOD } from '../lib/const';
import { setCorsHeader } from '../lib/cors';
import { getConfig } from '../lib/config';
import { isPost, lowerCaseTrim } from '../lib/util';

const DEFAULT_CONFIG = getConfig();

class Mapping {
  map: Map<Function, GROUP_ROUTE> = new Map();

  routes: ROUTE[] = [];

  doAddAnnotationRoute(ctor: Function, route: ROUTE, toRear: boolean = true) {
    const r = this.map.get(ctor);
    if (r) {
      r.routes.push(route);
    } else {
      this.map.set(ctor, {
        prefix: null,
        routes: [route]
      });
    }
  }

  doAddRoute(route: ROUTE) {
    if (this.routes.find(r => r.path === route.path && r.method === route.method)) {
      throw new Error(`duplicate interface: ${route.method}: ${route.path}`);
    }
    this.routes.push(route);
  }

  addRoute(config: RouteConfig, ctor?: Function) {
    const { path, method, handler, cors, paramValidate, authValidate, isAuthValidate } = Object.assign({}, DEFAULT_CONFIG, config);
    const addRoute = ctor ? this.doAddAnnotationRoute.bind(this, ctor) : this.doAddRoute.bind(this);
    // 跨域预检请求
    if (cors) {
      addRoute({
        path,
        method: 'options',
        handler: async (ctx, next) => {
          ctx.response.status = 200;
          setCorsHeader(ctx, typeof cors === 'boolean' ? { methods: method } : Object.assign({ methods: method }, cors));
        }
      });
    }
    addRoute({
      path,
      method,
      handler: async (ctx, next) => {
        // CORS 跨域
        if (cors) {
          setCorsHeader(ctx, typeof cors === 'boolean' ? { methods: method } : Object.assign({ methods: method }, cors));
        }

        // 权限校验
        if (isAuthValidate === true && typeof authValidate === 'function' && !await authValidate(ctx, next)) {
          if (!ctx.body) {
            ctx.body = {
              success: false,
              code: EXCEPTION_CODE.NO_AUTH.CODE,
              info: EXCEPTION_CODE.NO_AUTH.INFO
            };
          }
          return;
        }

        // content-type 校验
        console.log(lowerCaseTrim(ctx.header['content-type'] || ''), lowerCaseTrim(config.contentType || ''));
        if (typeof config !== 'string' && config.contentType && lowerCaseTrim(ctx.header['content-type'] || '') !== lowerCaseTrim(config.contentType || '')) {
          const EXCEPTION = EXCEPTION_CODE.UNSUPPORTED_CONTENT_TYPE
          ctx.body = {
            success: false,
            code: EXCEPTION.CODE,
            info: EXCEPTION.INFO
          };
          return;
        }

        if (paramValidate !== undefined) {
          const body = isPost(ctx) ? ctx.request.body : ctx.request.query;  // src/index.ts 内做了 bodyParser
          const invalidList: string[] = [];
          for(const p in paramValidate) {
            const validFns = Array.isArray(paramValidate[p]) ? paramValidate[p] : [paramValidate[p]];
            for(let i = 0; i < validFns.length; i++){
              const validFn = validFns[i];
              const result = await validFn(p, body[p], body, ctx);
              if (typeof result === 'string') {
                invalidList.push(result);
              }
            }
          }
          if (invalidList.length) {
            ctx.body = {
              success: false,
              code: EXCEPTION_CODE.PARAM_INVALID.CODE,
              info: invalidList.join(';')
            };
            return;
          }
        }

        await handler(ctx, next);
      },
    });
  }

  addGroupRoute(path: string, ctor: Function) {
    const r = this.map.get(ctor);
    if (r) {
      r.prefix = path;
    } else {
      this.map.set(ctor, {
        prefix: path,
        routes: []
      });
    }
  }

  list() {
    return this.map;
  }

  getRouteData(): ROUTE[] {
    const data: ROUTE[] = [...this.routes];
    this.map.forEach((value, key) => {
      if (value.prefix === null) return;
      value.routes.forEach((e) => {
        const url = path.join(value.prefix as string, e.path);
        if (data.find(r => r.path === url && r.method === e.method)) {
          throw new Error(`duplicate interface: ${e.method}: ${url}`);
        }
        data.push({
          path: url,
          method: e.method,
          handler: e.handler
        });
      });
    });
    return data;
  }
}

export default new Mapping();