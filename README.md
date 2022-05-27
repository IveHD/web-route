# web-route
服务接口开发主要包含接口配置 + 业务逻辑。业务逻辑以外接口配置部分的过程和痛点总结如下：
1. router 模块中定义接口方法、路径并定义处理逻辑的 controller<br/>
  痛点：router 模块内代码简单，但接口多了后整个 router 模块就显得繁杂而冗长。<br/>
2. controller 模块中进行业务逻辑以外的参数解析、参数校验等工作。<br/>
  痛点1：参数校验逻辑并不难，但代码实现过程却繁杂而冗长。<br/>
  痛点2：如果服务内需要单接口的跨域、鉴权等设置，则需要在跨域、鉴权的中间件中特殊处理，这样接口逻辑又被耦合进了其他地方。<br/>

本工具库用于帮助接口配置部分的快速开发，并为解决上述痛点，封装了
* 路由自动注册
* 单接口跨域配置
* 请求源域名校验
* contentType校验
* 鉴权
* 参数校验<br/>

等基本逻辑。旨在
* 让开发者能够把精力主要放在业务逻辑上，技术上的接口配置 web-route 尽量帮你简单做。
* 将单接口配置的代码高内聚在一处
* 接口配置和业务逻辑低耦合
* 可对单接口进行配置以增强单接口灵活性。
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
import { RequestMapping, ParamValidRule } from "web-route";
import { Context } from "koa";

@RequestMapping('/hi')  // 定义模块内路由的路径前缀
class HiController {
  
  // 定义路径为 /hi/sayHiAgain、请求方式为 get、允许跨域、验证参数 a 为必填且为字符串 & 参数 b 为必填
  @RequestMapping({ path: '/sayHiAgain', method: 'get', cors: true, paramValidate: {
    a: [ParamValidRule.REUQIRED, ParamValidRule.STRING],
    b: ParamValidRule.REUQIRED
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
  requestLogCallback?: RequestLogCallbackFn   // 每个请求完成后的回调函数
};
```
#### RegisterOptions
|属性|说明|类型|可选值|默认值|
|---|---|---|---|---|
|annControllerPath|ts 注解方式加载路由的模块 glob 路径|string|有效的glob路径|无|
|controllerPath|js commonjs 方式加载路由的模块 glob 路径|string|有效的glob路径|无|
|defaultConfig|指定接口的全局默认配置|GlobalRouteConfig|如下 GlobalRouteConfig 介绍|如下 GlobalRouteConfig 默认值|
|requestLogCallback|每个请求完成后的回调函数，可用于获取请求信息、响应时间等信息|Function|有效的函数|无|

<br/>

#### GlobalRouteConfig
|属性|说明|类型|可选值|默认值|
|---|---|---|---|---|
|method|接口全局请求方法|string|有效的 http 请求方法|get|
|cors|跨域配置|boolean \| CORS|true\|false\|跨域配置对象|false，不支持跨域|
|originWhiteList|请求源域名白名单，支持正则匹配，不设置或为空数组则不做服务的访问源限制，否则只有白名单内的请求源域名才能访问|string[\]|可访问本服务的请求源域名的集合|[]|
|contentType|content-type|string|合法的content-type值|无|
|authValidate|权限校验函数，支持异步函数|Koa 中间件函数|不设置或Koa中间件函数|无|
|isAuthValidate|默认是否开启 authValidate 权限校验|boolean|true \| false|false|

<br/>
<br/>

#### RequestLogCallbackFn
```typescript
type RequestLogCallbackFn = (info: {
  path: string;             // 请求路径
  method: string;           // 请求方法
  startTime: number;        // 收到请求的时间戳
  endTime: number;          // 请求处理完毕的时间戳
  duration: number;         // 请求处理时间 ms
  ctx: Context;             // Koa ctx
}) => void;
```

## 3.2 接口定义
支持两种方式加载路由：
* ts 注解方式：在类的方法上使用 @RequestMapping 注解，并向 @RequestMapping 传入配置对象。
* js commonjs 方式：module.exports 导出接口配置的集合。

两种方式只是写法不同以及注解方式能够指定模块内接口统一的path前缀，除此以外接口的配置完全相同，配置如下。

<br/>

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

#### RouteConfig
|属性|说明|类型|可选值|默认值|
|---|---|---|---|---|
|path|接口路径|string|任何路径|无|
|method|接口全局请求方法|string|有效的 http 请求方法|get或全局默认配置|
|cors|跨域配置|boolean \| CORS|true\|false\|跨域配置对象|false或全局默认配置|
|originWhiteList|如全局和接口均未设置白名单则接口无限制，否则接口可访问请求源域名为全局设置+接口设置|string[\]|可访问本服务的请求源域名的集合|无或全局默认配置|
|contentType|content-type|string|-|无或全局默认配置|
|authValidate|权限校验函数，接口设置将覆盖全局设置|Koa 中间件函数|不设置或Koa中间件函数|无或全局设置|
|isAuthValidate|是否开启 authValidate 权限校验|boolean|true \| false|false或全局设置|
|paramValidate|参数校验配置|boolean|true \| false|无|
|handler|接口处理逻辑函数或函数集合|function \| function[]|有效的函数逻|无|

#### # cors 跨域配置
> 1. 如接口被配置成可跨域访问，则会自动为跨域接口添加一个可访问的 options 预检请求接口，以保证非简单跨域请求的访问。
> 2. 如果接口没做跨域配置，则为 originWhiteList 里面的域名自动添加允许跨域，如果做了跨域配置，则使用配置。
> 3. 考虑到 JSONP 的方式受原理限制，只能 get、发送的非 XHR 请求、有可能受到 CSP 影响等缺陷，不支持 JSONP 跨域。
```typescript
type CORS = boolean | CORS_CONFIG;
```

* 当 cors 为 false<br/>
  接口不支持跨域

* 当 cors 为 true<br/>
  接口支持跨域，且 cors 跨域响应头如下：
  ```shell
  Access-Control-Allow-Origin: '*'
  Access-Control-Allow-Headers: '*'
  Access-Control-Allow-Methods: '*'
  Access-Control-Allow-Credentials: true
  ```

* 当 cors 为配置对象 CORS_CONFIG，详细配置响应头
  ```typescript
  type CORS_CONFIG = {
    origin?: string,
    headers?: string,
    methods?: string,
    credentials?: string
  };
  ```
  ##### CORS_CONFIG
  |属性|说明|类型|可选值|默认值|
  |---|---|---|---|---|
  |origin|指定 [Access-Control-Allow-Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin)|string|protocol://domain|*|
  |headers|指定 [Access-Control-Allow-Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)|string|有效的 http 请求方法|*|
  |methods|指定 [Access-Control-Allow-Methods](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)|string|有效的 http 请求方法|*|
  |credentials|指定 [Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/web/http/headers/access-control-allow-credentials)|boolean|true|true|

<br/>
<br/>

#### # paramValidate 参数校验配置
```typescript
type validFn = (paramName: string, paramValue: any, requestBody?: Record<string, any>, ctx?: Context) => string | boolean | Promise<string> | Promise<boolean>;

type ParamValidateFn = { [name: string]: validFn | validFn[] };
```
先举个栗子：
```typescript
{
  // ...其他配置...
  paramValidate: {
    param1: async (name, value) => {
      // 验证逻辑
      if ('异步校验成功') {
        return true;
      } else {
        return '失败提示';
      }
    },
    param2: [
      (name, value, requestBody, ctx) => {
        // 验证逻辑1
        if ('校验成功') {
          return true;
        } else {
          return '失败提示';
        }
      },
      (name, value, requestBody, ctx) => {
        // 验证逻辑2
        if ('校验成功') {
          return true;
        } else {
          return '失败提示';
        }
      }
    ]
  }
  // ...其他配置...
}
```
说明：
* paramValidate 是一个对象，对象属性为参数名，对象值为校验函数或校验函数的集合(多个校验条件)。
* 校验函数支持异步校验。
* 校验函数可接收四个参数，分别是 参数名、参数值、所有请求参数、Koa 的 ctx。
* 检验函数返回字符串将被认作校验不通过，且字符串将被作为校验不成功的提示，无返回值或返回值非字符串，则认为校验通过。
web-route 内置了常用的参数校验函数，通过 ParamValidRule 对外暴露
  ```typescript
  import { ParamValidRule } from "web-route";
  // 或
  const { ParamValidRule } = require("web-route");
  ```
  |函数名|校验逻辑|
  |---|---|
  |REUQIRED|必填|
  |STRING|字符串|
  |NUMBER|数字|
  |EMAIL|邮箱地址|
  |URL|url|
  |MOBILE_NUMBER|11位手机号|
  |TELEPHONE_NUMBER|座机号，是否包含区号均可|
  |PHONE_NUMBER|11位手机号或座机号|
  |ID_CARD_NUMBER|身份证号|
  |CN|全中文|
  |NO_SPACE|不包含空格|
  |NO_SPECIAL_CHAR|中文、英文、数字、下划线组成|

<br/>
<br/>

### 3.2.2 ts 注解配置接口
```typescript
import { RequestMapping, ParamValidRule } from "web-route";
import { Context, Next } from "koa";

@RequestMapping('/hi')  // 定义模块内路由的路径前缀
class HiController {
  
  // 定义路径为 /hi/sayHiAgain、请求方式为 get、允许跨域、验证参数 a 为必填且为字符串 & 参数 b 为必填
  @RequestMapping({ 
    // ...这里写接口配置...
  }) 
  sayHi(ctx: Context, next: Next) {
    console.log('hi world again...');
    ctx.body = {
      success: true,
    };
  }
}
```

<br/>
<br/>

### 3.2.3 js commonjs 模块配置接口
```javascript
module.exports = [{
  path: '/js/hello',
  method: 'get',
  // ...这里写接口配置...
  handler(ctx, next) {
      ctx.body = {
        success: true,
        msg: 'hello'
      };
  }
}];
```
