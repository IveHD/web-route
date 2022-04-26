# web-route
这是一个帮助 nodejs 服务开发者快速进行接口路由注册和设置的工具库。
* 使用 typescript 注解来注册接口路由。
* 接口 url、method、content-type、CORS 跨域的便捷设置。
* 接口请求参数校验的便捷设置。

`暂时只支持 koa`

## 安装
```
npm install web-route --save
```

## 使用示例
```typescript
// index.ts
import Koa from 'koa';
import path from 'path';
import { buildRoute } from 'web-route';

const app = new Koa();

const router = buildRoute({
  cwd: path.resolve(__dirname, './controllers/*.ts')  // 设置 controller 文件 glob 路径
});

app.use(router.routes());
app.listen(8080, () => {
  console.log('启动。。。');
});
```
```typescript
// controller/hi.ts
import { RequestMapping, ValidParam, ValidParamRule } from "web-route";
import { Context } from "koa";

@RequestMapping('/hi')  // 定义模块内路由的路径前缀
class HiController {
  
  @RequestMapping({ path: '/sayHiAgain', method: 'get', cors: true }) // get: /hi/sayHiAgain
  @ValidParam({              // 定义参数校验
    a: [ValidParamRule.REUQIRED, ValidParamRule.STRING],    // 参数 a 必填且字符串类型
    b: ValidParamRule.REUQIRED                              // 参数 b 必填
  })
  sayHiAgain(ctx: Context) {
    console.log('hi world again...');
    ctx.body = {
      success: true,
    };
  }
}

export default HiController;
```

```shell
# 发送测试请求
curl --location --request GET 'http://localhost:8080/hi/sayHiAgain?a=hello' \
--header 'Origin: localhost:9000' \
--header 'Host: localhost:9000'
```

```shell
# 返回结果
{"success":false,"code":1001,"info":"[b]值不能为空"}
```


# API
### 初始化构建路由 buildRoute
```typescript
declare function buildRoute(options: {
    cwd: string;  // 设置 controller 文件 glob 路径，将用于识别 controller 模块。
}): KoaRouter;
```


### 路由配置 @RequestMapping
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