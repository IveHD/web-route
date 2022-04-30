import Koa from 'koa';
import path from 'path';
import { register } from '../src';

const app = new Koa();

const router = register({
  controllerPath: path.resolve(__dirname, './controllers/*.ts'),  // 设置 controller 文件 glob 路径
  requestLogCallback(info) {
    console.log(info.duration);
  }
});

app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});