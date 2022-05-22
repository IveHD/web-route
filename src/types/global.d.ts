import { Context, Next, Middleware } from 'koa';
import { HTTP_METHOD } from 'src/lib/const';
export type CORS_CONFIG = { origin?: string, headers?: string, methods?: string, credentials?: string };
export type CORS = boolean | CORS_CONFIG;
export type Handler = (ctx: Context, next: Next) => void | Promise<void>;
export type Handlers = Handler[];
export type AuthValidateFn = Middleware;
export type validFn = (paramName: string, paramValue: any, requestBody?: Record<string, any>, ctx?: Context) => string | boolean | Promise<string> | Promise<boolean>;
export type ParamValidateFn = { [name: string]: validFn | validFn[] };

export type RouteConfig = {
  path: string;
  handler: Handler | Handlers;
  method?: typeof HTTP_METHOD[keyof typeof HTTP_METHOD];
  cors?: CORS;
  originWhiteList?: string[];
  contentType?: string;
  authValidate?: Middleware;
  isAuthValidate?: boolean;
  paramValidate?: ParamValidateFn;
}

// 注解方式可配置的 config
export  type AnnotationRouteConfig = Omit<RouteConfig, 'handler'>;

export type GlobalRouteConfig = Omit<RouteConfig, 'handler' | 'path'>;

export  type ROUTE = Pick<RouteConfig, 'path' | 'method' | 'handler'>;
export  type GROUP_ROUTE = {
  prefix: string | null;
  routes: Array<ROUTE>
};

export type RequestLogCallbackFn = (info: {
  path: string;
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
  ctx: Context;
}) => void;

export type RegisterOptions = { 
  annControllerPath?: string,                 // 注解方式编译时加载路由的模块 glob 路径
  controllerPath?: string;                    // commonjs 运行时方式加载路由的模块 glob 路径
  defaultConfig?: GlobalRouteConfig,          // 指定接口的全局默认配置
  // authValidate?: Middleware,                  // 用于验证身份的中间件函数
  requestLogCallback?: RequestLogCallbackFn   // 获取请求日志的回调函数
};