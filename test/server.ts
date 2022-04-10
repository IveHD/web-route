import '../src/lib/moduleAlias';
import Koa from 'koa';
import path from 'path';
import { buildRoute } from '../src';

const app = new Koa();



const router = buildRoute({
  cwd: path.resolve(__dirname, './controllers/*.ts')
});

app.use(router.routes());
app.listen(8002, () => {
  console.log('启动。。。');
});