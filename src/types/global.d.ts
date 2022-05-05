import Koa from 'koa';
import { HTTP_METHOD } from 'src/lib/const';
export type CORS_CONFIG = { origin?: string, headers?: string, methods?: string, credentials?: string };
export type CORS = boolean | CORS_CONFIG;
export type SingleHandler = (ctx: Koa.Context, next: Koa.Next) => void | Promise<void>;
export type Handler = SingleHandler;

export type RouteConfig = {
  path: string;
  handler: Handler;
  method?: typeof HTTP_METHOD[keyof typeof HTTP_METHOD];
  contentType?: string;
  cors?: CORS;
  authValidate?: AuthValidateFn;
  isAuthValidate?: boolean;
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
  ctx: Koa.Context;
}) => void;

type AuthValidateFn = (ctx: Koa.Context, next?: Koa.Next) => boolean | Promise<boolean>

export type RegisterOptions = { 
  annControllerPath?: string,                 // 注解方式编译时加载路由的模块 glob 路径
  controllerPath?: string;                    // commonjs 运行时方式加载路由的模块 glob 路径
  defaultConfig?: GlobalRouteConfig,          // 指定接口的全局默认配置
  authValidate?: AuthValidateFn,               // 用于验证身份的钩子函数
  requestLogCallback?: RequestLogCallbackFn   // 获取请求日志的回调函数
};