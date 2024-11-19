import Koa from 'koa';
import { register, getRouteData } from '../src';
import config from './registerConfig.js';

const app = new Koa();

const router = register(config);

const data = getRouteData();
debugger
// app.use(async (ctx, next) => {
//   console.log(ctx);
//   await next();
// });

// app.use(router.routes());
// app.listen(8082, () => {
//   console.log('启动。。。');
// });