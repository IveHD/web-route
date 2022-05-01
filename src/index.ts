import {
  RequestMapping,
  ValidParam,
} from './annotation';
import glob from 'glob';
import RouteMapping from './mapping/route';
import ValidParamRule from './validParamRule/index';
import { HTTP_METHOD } from './lib/const';
import KoaRouter from 'koa-router';
import { Context, Next } from 'koa';
import { ROUTE } from 'src/types/global';
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

type Options = { annControllerPath?: string, controllerPath?: string; requestLogCallback?: RequestLogCallbackFn };

function register(options: Options): KoaRouter {
  let routeData: ROUTE[] = [];
  const { annControllerPath, controllerPath } = options;
  if (annControllerPath) {
    const annList = glob.sync(options.annControllerPath);
    annList.forEach(p => {
      require(p);
    });
  }
  
  if (controllerPath) {
    const list =  glob.sync(options.controllerPath);
    list.forEach(p => {
      const controllers = require(p);
      if (!Array.isArray(controllers)) throw new Error(`it is not a standard controller module of: ${p}`);
      controllers.forEach(c => {
        RouteMapping.addRoute(c);
      });
    })
  }

  Array.prototype.push.apply(routeData, getRouteData());
  
  routeData.forEach(r => {
    const handler = Array.isArray(r.handler) ? r.handler : [r.handler];
    router[r.method](r.path, ...handler);
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
  };;
  
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