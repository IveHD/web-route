import Koa from 'koa';
import { register } from '../src';
import config from './registerConfig.js';

const app = new Koa();

const router = register(config);

app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});