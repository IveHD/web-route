import {
  RequestMapping,
  ValidParam,
} from './annotation';
import glob from 'glob';
import RouteMapping from './mapping/route';
import ValidParamRule from './validParamRule/index';
import { HTTP_METHOD } from './lib/const';
import KoaRouter from 'koa-router';
import { Context } from 'koa';
const bodyParser = require('./lib/bodyParser');
const router = new KoaRouter();
const parser = bodyParser({});

type RequestLogCallbackFn = (info: {
  path: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  ctx: Context;
}) => void;

function register(options: { cwd: string, requestLogCallback?: RequestLogCallbackFn }): KoaRouter {
  const list = glob.sync(options.cwd);
  list.forEach(p => {
    require(p);
  });
  const routeData = getRouteData();
  routeData.forEach(r => {
    router[r.method](r.path, ...r.handler);
    console.log(r.method, ':', r.path);
  });

  const routes = router.routes();

  router.routes = () => async (ctx, next) => {
    const startTime = Date.now();
    await parser(ctx);
    const result = await routes(ctx, next);
    const endTime = Date.now();
    if(typeof options.requestLogCallback === 'function') {
      options.requestLogCallback({
        path: ctx.path,
        method: ctx.method,
        startTime,
        endTime,
        duration: endTime - startTime,
        ctx
      });
    }
    return result;
  };
  
  return router;
}

function getRouteData() {
  return RouteMapping.getRouteData();
}

export {
  register,
  RequestMapping,
  ValidParam,
  getRouteData,
  ValidParamRule,
  HTTP_METHOD,
};
export default null;