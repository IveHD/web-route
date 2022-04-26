import { register, getRouteData } from '../src';
import path from 'path';

register({
  cwd: path.resolve(__dirname, './controllers/*.ts')  // controller 路径
});

const routeData = getRouteData();
console.log('routeData', routeData);

routeData.forEach(r => {

});