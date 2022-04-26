import '../src/lib/moduleAlias';
import Koa from 'koa';
import path from 'path';
import { buildRoute } from '../src';

const app = new Koa();

const router = buildRoute({
  cwd: path.resolve(__dirname, './controllers/*.ts')  // 设置 controller 文件 glob 路径
});

app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});