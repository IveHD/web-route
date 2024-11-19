import { Context, Next, Middleware } from 'koa';
import { CONTENT_TYPE, HTTP_METHOD } from '../lib/const';
export type CORS_CONFIG = { origin?: string, headers?: string, methods?: string, credentials?: boolean };
export type CORS = boolean | CORS_CONFIG;
export type Handler = (ctx: Context, next: Next) => void | Promise<void>;
export type Handlers = Handler[];
export type AuthValidateFn = Middleware;
export type validFn = {
  (paramName: string, paramValue: any, requestBody?: Record<string, any>, ctx?: Context): string | boolean | Promise<string> | Promise<boolean>;
  type?: string;
};
export type ParamValidateFn = { [name: string]: validFn | validFn[] };

export type RouteConfig = {
  path: string;                                                      // 接口路径
  handler: Handler | Handlers;                                       // 处理函数
  method?: typeof HTTP_METHOD[keyof typeof HTTP_METHOD];             // 接口方法
  cors?: CORS;                                                       // 跨域配置
  originWhiteList?: string[];                                        // 请求源域名白名单
  contentType?: typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE],      // content-type
  authValidate?: Middleware;                                         // 权限校验
  isAuthValidate?: boolean;                                          // 是否进行权限校验
  paramValidate?: ParamValidateFn;                                   // 参数校验
}


// 注解方式可配置的 config
export type AnnotationRouteConfig = Omit<RouteConfig, 'handler'>;

export type GlobalRouteConfig = Omit<RouteConfig, 'handler' | 'path' | 'paramValidate'>;

export type ROUTE = Pick<RouteConfig, 'path' | 'method' | 'handler'>;
export type GROUP_ROUTE = {
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
  requestLogCallback?: RequestLogCallbackFn   // 获取请求日志的回调函数
};