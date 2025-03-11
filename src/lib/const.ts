export const HTTP_METHOD = {
  GET: 'get',         // 请求指定的页面信息，并返回实体主体。
  HEAD: 'head',       // 类似于 GET 请求，只不过返回的响应中没有具体的内容，用于获取报头
  POST: 'post',       // 向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST 请求可能会导致新的资源的建立和/或已有资源的修改。
  PUT: 'put',         // 从客户端向服务器传送的数据取代指定的文档的内容。
  DELETE: 'delete',   // 请求服务器删除指定的页面。
  CONNECT: 'connect', // HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器。
  OPTIONS: 'options', // 允许客户端查看服务器的性能。预检请求。
  TRACE: 'trace',     // 回显服务器收到的请求，主要用于测试或诊断。
  PATCH: 'patch',     // 是对 PUT 方法的补充，用来对已知资源进行局部更新 。
};

export const CONTENT_TYPE = {
  "TEXT_HTML": "text/html",
  "TEXT_PLAIN": "text/plain",
  "TEXT_XML": "text/xml",
  "IMAGE_GIF": "image/gif",
  "IMAGE_JPEG": "image/jpeg",
  "IMAGE_PNG": "image/png",
  "APPLICATION_XHTML+XML": "application/xhtml+xml",
  "APPLICATION_XML": "application/xml",
  "APPLICATION_ATOM+XML": "application/atom+xml",
  "APPLICATION_JSON": "application/json",
  "APPLICATION_PDF": "application/pdf",
  "APPLICATION_MSWORD": "application/msword",
  "APPLICATION_OCTET-STREAM": "application/octet-stream",
  "APPLICATION_FORM": "application/x-www-form-urlencoded",
  "APPLICATION_JSON_UTF8": "application/json;charset=utf-8",
  "APPLICATION_FORM_UTF8": "application/x-www-form-urlencoded;charset=utf-8",
  "EVENT_STREAM": "text/event-stream"
};

export const EXCEPTION_CODE = {
  NO_AUTH: {
    CODE: 401,
    INFO: 'no auth'
  },
  UNSUPPORTED_CONTENT_TYPE: {
    CODE: 415,
    INFO: 'Unsupported content-type'
  },
  PARAM_INVALID: {
    CODE: 1001,
    INFO: 'Params invalid'
  },
};