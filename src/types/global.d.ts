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
  cors?: CORS,
  
}

export  type AnnotationRouteConfig = Omit<RouteConfig, 'handler'>;

export  type ROUTE = Pick<RouteConfig, 'path' | 'method' | 'handler'>;
export  type GROUP_ROUTE = {
  prefix: string | null;
  routes: Array<ROUTE>
};