import { HTTP_METHOD } from "./const";
export const isPost = ctx => ctx.method.toLowerCase() === HTTP_METHOD.POST;

export const lowerCaseTrim = (str: string): string => {
  return str.replace(/\s*/g, '').toLowerCase();
}

export const transparentMiddleware = async (ctx, next) => {
  await next()
};

export const pathJoin = (...paths): string => '/' + paths.map(e => e.replace(/^\/|\/$/g, '')).join('/');;