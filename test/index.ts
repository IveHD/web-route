import '../src/lib/moduleAlias';

import { buildRoute, getRouteData } from '../src';
import path from 'path';

buildRoute({
  cwd: path.resolve(__dirname, './controllers/*.ts')
});

const routeData = getRouteData();
console.log('routeData', routeData);

routeData.forEach(r => {

});