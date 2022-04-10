import path from 'path';
import Koa from 'koa';
// map: { ctor -> { prefix: '', routes: [{ path: '/', method: 'GET', handler: (ctx, next) => {...}  }] } }

type ROUTE = { path: string; method: string; handler: Array<(ctx: Koa.Context, next: Koa.Next) => void> }
type GROUP_ROUTE = {
  prefix: string | null;
  routes: Array<ROUTE>
};

class Mapping {
  map: Map<Function, GROUP_ROUTE> = new Map();

  addRoute(ctor: Function, route: ROUTE, toRear: boolean = true) {
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

  addGroupRoute(ctor: Function, path: string) {
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
    const data: ROUTE[] = [];
    this.map.forEach((value, key) => {
      if (value.prefix === null) return;
      value.routes.forEach((e) => {
        const url = path.join(value.prefix as string, e.path);
        if (data.find(r => r.path === url && r.method === e.method)) {
          throw new Error(`duplicate url: ${url}`);
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