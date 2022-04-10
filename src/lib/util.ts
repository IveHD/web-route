import { HTTP_METHOD } from "./const";
export const isPost = ctx => ctx.method.toLowerCase() === HTTP_METHOD.POST;