import { getConfig } from '../lib/config';
import { GROUP_ROUTE, ROUTE, RouteConfig, CORS } from '../types/global';
import corsMiddleware from './cors';
import contentType from './contentType';
import paramValid from './paramValid';
import { Middleware } from 'koa';
import authValidate from './authValidate';
import originWhiteList from './originWhiteList';
import { pathJoin } from '../lib/util';

const DEFAULT_CONFIG = getConfig();

class Mapping {
  private map: Map<Function, GROUP_ROUTE> = new Map();

  private routes: ROUTE[] = [];

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
      throw new Error(`duplicate route: ${route.method}: ${route.path}`);
    }
    this.routes.push(route);
  }

  addRoute(config: RouteConfig, ctor?: Function) {
    let { path, method, handler, cors } = Object.assign({}, DEFAULT_CONFIG, config);
    const addRoute = ctor ? this.doAddAnnotationRoute.bind(this, ctor) : this.doAddRoute.bind(this);

    let middleware: Middleware[] = [];

    middleware.push(
      corsMiddleware(config, addRoute),
      originWhiteList(config, addRoute),
      contentType(config),
      authValidate(config),
      paramValid(config),
    );

    if(typeof handler === 'function') middleware.push(handler);
    else if (Array.isArray(handler)) middleware.push(...handler);

    addRoute({
      path,
      method,
      handler: middleware
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

  getRouteData(): ROUTE[] {
    // connmonjs 的路由直接加进来
    const data: ROUTE[] = [...this.routes];

    // 遍历并加进来注解的路由
    this.map.forEach((value, key) => {
      if (value.prefix === null) return;
      value.routes.forEach((e) => {
        const url = pathJoin(value.prefix as string, e.path);
        if (data.find(r => r.path === url && r.method === e.method)) {
          throw new Error(`duplicate route: ${e.method}: ${url}`);
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