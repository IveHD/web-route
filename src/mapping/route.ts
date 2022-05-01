import path from 'path';
import { GROUP_ROUTE, ROUTE, RouteConfig } from '../types/global';
import { EXCEPTION_CODE, HTTP_METHOD } from '../lib/const';
import { setCorsHeader } from '../lib/cors';

const DEFAULT_CONFIG = {
  method: HTTP_METHOD.GET,
  cors: false,
};

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
    this.routes.push(route);
  }

  addRoute(config: RouteConfig, ctor?: Function) {
    const { path, method, handler } = Object.assign({}, DEFAULT_CONFIG, config);
    const addRoute = ctor ? this.doAddAnnotationRoute.bind(this, ctor) : this.doAddRoute.bind(this);
    // 跨域设置
    const isCors = config.cors;
    if (isCors) {
      addRoute({
        path,
        method: 'options',
        handler: (ctx, next) => {
          ctx.response.status = 200;
          setCorsHeader(ctx, typeof config.cors === 'boolean' ? { methods: method } : Object.assign({ methods: method }, config.cors));
        }
      });
    }
    addRoute({
      path,
      method,
      handler: async (ctx, next) => {
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