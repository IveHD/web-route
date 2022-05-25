# web-route
服务接口开发主要包含接口配置 + 业务逻辑。业务逻辑以外接口配置部分的过程和痛点总结如下：
1. router 模块中定义接口方法、路径并定义处理逻辑的 controller<br/>
  痛点：router 模块内代码简单，但接口多了后整个 router 模块就显得繁杂而冗长。<br/>
2. controller 模块中进行业务逻辑以外的参数解析、参数校验等工作。<br/>
  痛点1：参数校验逻辑并不难，但代码实现过程却繁杂而冗长。<br/>
  痛点2：如果服务内需要但接口的跨域、鉴权等设置，则需要在跨域、鉴权的中间件中特殊处理，这样接口逻辑又被耦合进了其他地方。<br/>

本工具库用于帮助接口配置部分的快速开发，并为解决上述痛点，封装了路由自动注册、单接口跨域配置、请求源域名校验、contentType校验、鉴权、参数校验等基本逻辑。旨在将**单接口配置的代码高内聚在一处、接口配置和业务逻辑低耦合、可对单接口进行配置以增强单接口灵活性**。
<br/>
<br/>

# 1. 安装
```
npm install web-route --save
```

# 2. 使用示例
## 2.1 服务启动
```typescript
// index.ts
import Koa from 'koa';
import path from 'path';
import { register } from 'web-route';

const app = new Koa();

const router = register({
  // 设置 controller 文件 glob 路径（以 typescript 注解方式注册路由，详见2.2）
  annControllerPath: path.resolve(__dirname, './controllers/*.ts'),
  
  // 设置 controller 文件 glob 路径（commonjs 普通方式注册路由，详见2.3）
  controllerPath: path.resolve(__dirname, './controllers/*.js'),  

  // 全局设置接口默认配置
  defaultConfig: {
    // 全局接口默认为 get
    method: 'get',

    // 全局接口支持跨域
    cors: true,

    // 请求源域名白名单
    originWhiteList: ['http://127.0.0.1']

    // 接口默认 content-type
    contentType: 'application/json;charset=utf-8',

    // 权限校验
    authValidate: (ctx, next) => {
      const token = ctx.get('token');
      if(token === 'something') {
        next();
      } else {
        ctx.status = 401;
      }
    },

    // 接口默认开启权限校验
    isAuthValidate: true,
  },
});

app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});
```
<br/>

## 2.2 以 typescript 注解方式注册路由
```typescript
// controller/hi.ts
import { RequestMapping, ValidParamRule } from "web-route";
import { Context } from "koa";

@RequestMapping('/hi')  // 定义模块内路由的路径前缀
class HiController {
  
  // 定义路径为 /hi/sayHiAgain、请求方式为 get、允许跨域、验证参数 a 为必填且为字符串 & 参数 b 为必填
  @RequestMapping({ path: '/sayHiAgain', method: 'get', cors: true, paramValidate: {
    a: [ValidParamRule.REUQIRED, ValidParamRule.STRING],
    b: ValidParamRule.REUQIRED
  } }) 
  sayHiAgain(ctx: Context) {
    console.log('hi world again...');
    ctx.body = {
      success: true,
    };
  }
}

export default HiController;
```
<br/>

## 2.3 commonjs 普通方式注册路由
```javascript
module.exports = [{
  path: '/js/hello',
  method: 'get',
  cors: true,
  handler(ctx, next) {
      ctx.body = {
        success: true,
        msg: 'hello'
      };
  }
}];
```
<br/>

## 2.4 接口测试
```shell
# 发送测试请求
curl --location --request GET 'http://localhost:8080/hi/sayHiAgain?a=hello' \
--header 'Origin: localhost:9000' \
--header 'Host: localhost:9000'
```

```shell
# 返回结果
{success: false, code: 1001, info: '[a]值不能为空;[a]值应为字符串;[b]值不能为空'}
```
<br/>
<br/>

# 3. 开发指南及API
## 3.1 路由注册及全局配置
```typescript
import { register } from 'web-route';
const router = register(options);     // options: RegisterOptions
app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});
```
```typescript
// register 接收参数结构如下 typescript 定义
type RegisterOptions = { 
  annControllerPath?: string,                 // ts注解方式编译时加载路由的模块 glob 路径
  controllerPath?: string;                    // js commonjs 运行时方式加载路由的模块 glob 路径
  defaultConfig?: {                           // 指定接口的全局默认配置
    method?: string;                                                 // 接口方法
    cors?: CORS;                                                     // 跨域配置
    originWhiteList?: string[];                                      // 请求源域名白名单
    contentType?: string,                                            // content-type
    authValidate?: Middleware;                                       // 权限校验
    isAuthValidate?: boolean;                                        // 是否进行权限校验
  },          
  requestLogCallback?: RequestLogCallbackFn   // 获取请求日志的回调函数
};
```
### RegisterOptions
|属性|说明|类型|可选值|默认值|
|---|---|---|---|---|
|annControllerPath|ts 注解方式加载路由的模块 glob 路径|string|有效的glob路径|无|
|controllerPath|js commonjs 方式加载路由的模块 glob 路径|string|有效的glob路径|无|
|defaultConfig|指定接口的全局默认配置|GlobalRouteConfig|如下 GlobalRouteConfig 介绍|如下 GlobalRouteConfig 默认值|

<br/>

### GlobalRouteConfig
|属性|说明|类型|可选值|默认值|
|---|---|---|---|---|
|method|接口全局请求方法|string|有效的 http 请求方法|get|
|cors|跨域配置|boolean \| CORS|true\|false\|跨域配置对象|false，不支持跨域|
|originWhiteList|请求源域名白名单，不设置或为空数组则不做服务的访问源限制，否则只有白名单内的请求源域名才能访问|string[\]|可访问本服务的请求源域名的集合|[]|
|contentType|content-type|string|合法的content-type值|无|
|authValidate|权限校验函数|Koa 中间件函数|不设置或Koa中间件函数|无|
|isAuthValidate|默认是否开启 authValidate 权限校验|boolean|true \| false|false|

<br/>
<br/>

## 3.2 接口定义
支持两种方式加载路由：
* ts 注解方式：在类的方法上使用 @RequestMapping 注解，并向 @RequestMapping 传入配置对象。
* js commonjs 方式：module.exports 导出接口配置的集合。

### 3.2.1 接口配置对象
```typescript
type RouteConfig = {
  path: string;                                                      // 接口路径
  method?: typeof HTTP_METHOD[keyof typeof HTTP_METHOD];             // 接口方法
  cors?: CORS;                                                       // 跨域配置
  originWhiteList?: string[];                                        // 请求源域名白名单
  contentType?: typeof CONTENT_TYPE[keyof typeof CONTENT_TYPE],      // content-type
  authValidate?: Middleware;                                         // 权限校验
  isAuthValidate?: boolean;                                          // 是否进行权限校验
  paramValidate?: ParamValidateFn;                                   // 参数校验
  handler: Handler | Handlers;                                       // 处理函数
}
```

### RouteConfig
|属性|说明|类型|可选值|默认值|
|---|---|---|---|---|
|path|接口路径|string|任何路径|无|
|method|接口全局请求方法|string|有效的 http 请求方法|get或全局默认配置|
|cors|跨域配置|boolean \| CORS|true\|false\|跨域配置对象|false或全局默认配置|
|originWhiteList|如全局和接口均未设置白名单则接口无限制，否则接口可访问请求源域名为全局设置+接口设置|string[\]|可访问本服务的请求源域名的集合|无或全局默认配置|
|contentType|content-type|string|-|无或全局默认配置|
|authValidate|权限校验函数，接口设置将覆盖全局设置|Koa 中间件函数|不设置或Koa中间件函数|无或全局设置|
|isAuthValidate|默认是否开启 authValidate 权限校验|boolean|true \| false|false或全局设置|
<!-- |paramValidate|参数校验配置|boolean|true \| false|false或全局设置| -->
<!-- todo -->


```typescript
import { RequestMapping, ValidParamRule } from "web-route";
import { Context } from "koa";

@RequestMapping('/hi')  // 定义模块内路由的路径前缀
class HiController {
  
  // 定义路径为 /hi/sayHiAgain、请求方式为 get、允许跨域、验证参数 a 为必填且为字符串 & 参数 b 为必填
  @RequestMapping() 
  sayHiAgain(ctx: Context) {
    console.log('hi world again...');
    ctx.body = {
      success: true,
    };
  }
}
```

```typescript
declare const RequestMapping: (config: string | {
    path: string;
    method?: string | undefined;
    contentType?: string | undefined;
    cors?: boolean | { origin?: string, headers?: string, methods?: string, credentials?: string };
}) => (...args: any[]) => void;
```
@RequestMapping 用于定义接口路由，有两种使用方式：<br/>
#### 1. 修饰路由模块 class
  * 参数
    * `prefix: string` class内路由的路径前缀  
  * 用法<br/>
    类内定义的路由函数最终访问路径前都将加上这里定义的前缀，此时 RequestMapping 的参数只能是 string。

#### 2. 修饰路由方法
  * 参数
    * `config: string | Object`
  * 用法<br/>
    当参数为 string，则参数被当做路由定义中的 path，其他定义使用默认值。更丰富的配置传递路由配置对象即可，支持的配置属性如下：

    **路由配置属性：**
    |属性|说明|类型|可选值|默认值|
    |---|---|---|---|---|
    |path|接口路径|string|任何路径|无|
    |method|请求方法|string|get \| post \| put \| head |get|
    |contentType|content-type|string|-|无|
    |cors|跨域配置|Boolean \| Object|true\|false\|跨域配置对象|false，不支持跨域|

    **跨域配置对象：**
    |属性|说明|类型|可选值|默认值|
    |---|---|---|---|---|
    |origin|返回头：Access-Control-Allow-Origin|string|-|*|
    |headers|返回头：Access-Control-Allow-Headers|string|-|*|
    |methods|返回头：Access-Control-Allow-Methods|string|-|GET,HEAD,PUT,POST,DELETE,PATCH|
    |credentials|返回头：Access-Control-Allow-Credentials|string|true \| false|true|

### 参数校验 @ValidParam & ValidParamRule
```typescript
// 检验函数
type validFn = (paramName: string, paramValue: any, requestBody?: Record<string, any>, ctx?: Context) => string | boolean;

declare const ValidParam: (rule: {
    [name: string]: validFn | validFn[];
}) => (...args: any[]) => void;
```
  * @ValidParam 参数
    * `rule: Object`
  * @ValidParam 用法<br/>
    接收请求参数校验配置对象，形如：
    ```typescript
      {
        param1: function (paramName, paramValue) {  // 单次校验
          // 校验逻辑
          if (校验成功) {
            return true;
          } else {
            return '失败提示';
          }
        },
        param2: [function (paramName, paramValue) {  // 多个校验条件
          // 校验逻辑
        }, function () {
          // 校验逻辑
        }],
        // ...
      }
    ```

  * ValidParamRule<br/>
  ValidParamRule 对象中集成了常用的校验函数，内容如下：

    |检验逻辑|函数名|
    |---|---|
    |必填|ValidParamRule.REUQIRED|
    |字符串|ValidParamRule.STRING|
    |数字|ValidParamRule.NUMBER|