import Koa from 'koa';
import path from 'path';
import { register } from '../src';

const app = new Koa();

const router = register({
  annControllerPath: path.resolve(__dirname, './controllers/*.ts'),  // 设置 controller 文件 glob 路径
  controllerPath: path.resolve(__dirname, './controllers/*.js'),
  defaultConfig: {
    method: 'get',
    // isAuthValidate: true,
  },
  // authValidate(ctx) {
  //   // ctx.body = {
  //   //   success: false,
  //   //   info: 'no auth',
  //   // };
  //   return false;
  // },
  requestLogCallback(info) {
    console.log(info.duration);
  }
});

app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});