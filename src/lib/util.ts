import { HTTP_METHOD } from "./const";
export const isPost = ctx => ctx.method.toLowerCase() === HTTP_METHOD.POST;

export const lowerCaseTrim = (str: string): string => {
  return str.replace(/\s*/g, '').toLowerCase();
}