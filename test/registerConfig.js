const path = require('path');

module.exports = {
  annControllerPath: path.resolve(__dirname, './controllers/*.ts'),  // 设置 controller 文件 glob 路径
  controllerPath: path.resolve(__dirname, './controllers/*.js'),
  defaultConfig: {
    method: 'get',
    cors: true,
    // isAuthValidate: true,
    // authValidate(ctx, next) {
    //   return next();
    // },
  },
  requestLogCallback(info) {
    console.log(info.duration);
  }
}