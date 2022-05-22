import {
  RequestMapping,
  ValidParam,
} from './annotation';
import glob from 'glob';
import RouteMapping from './core/route';
import ValidParamRule from './validParamRule/index';
import { HTTP_METHOD, CONTENT_TYPE } from './lib/const';
import { NO_AUTH_BODY } from './core/authValidate';
import KoaRouter from 'koa-router';
import { ROUTE, RegisterOptions } from './types/global';
import { setConfig } from './lib/config';
const bodyParser = require('./lib/bodyParser');
const router = new KoaRouter();
const parser = bodyParser({
  jsonLimit: '5mb',
  formLimit: '1mb',
});

function register(options: RegisterOptions): KoaRouter {
  const { defaultConfig = {} } = options;
  setConfig({ ...defaultConfig });
  
  let routeData: ROUTE[] = [];
  const { annControllerPath, controllerPath } = options;
  
  // 利用注解的编译过程直接向 RouteMapping 添加路由配置
  if (annControllerPath) {
    const annList = glob.sync(options.annControllerPath);
    annList.forEach(p => {
      require(p);
    });
  }
  
  // 通过 commonjs module 获取路由配置并向 RouteMapping 添加路由配置
  if (controllerPath) {
    const list =  glob.sync(options.controllerPath);
    list.forEach(p => {
      const controllers = require(p);
      if (!Array.isArray(controllers)) throw new Error(`it is not a standard controller module of: ${p}`);
      controllers.forEach(c => {
        RouteMapping.addRoute(c);
      });
    });
  }

  // 获取所有路由配置信息，并向 router 注册
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
  CONTENT_TYPE,
  NO_AUTH_BODY
};
export default null;