import '../src/lib/moduleAlias';
import {
  RequestMapping,
  ValidParam,
} from './annotation';
import glob from 'glob';
import RouteMapping from '@/mapping/route';
import ValidParamRule from './validParamRule/index';
import { HTTP_METHOD } from './lib/const';
import KoaRouter from 'koa-router';
const router = new KoaRouter();

function buildRoute(options: { cwd: string }) {
  const list = glob.sync(options.cwd);
  list.forEach(p => {
    require(p);
  });
  const routeData = getRouteData();

  routeData.forEach(r => {
    router[r.method](r.path, ...r.handler);
    console.log(r.method, ':', r.path);
  });
  
  return router;
}

function getRouteData() {
  return RouteMapping.getRouteData();
}

export {
  buildRoute,
  RequestMapping,
  ValidParam,
  getRouteData,
  ValidParamRule,
  HTTP_METHOD,
};
export default null;