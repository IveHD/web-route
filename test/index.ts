import { register, getRouteData } from '../src';
import path from 'path';

register({
  annControllerPath: path.resolve(__dirname, './controllers/*.ts'),  // controller 路径
  controllerPath: path.resolve(__dirname, './controllers/*.js'),  // 设置 controller 文件 glob 路径
  defaultConfig: {
    method: 'get',
    cors: true,
  },
});

const routeData = getRouteData();
console.log('routeData', routeData);

routeData.forEach(r => {

});