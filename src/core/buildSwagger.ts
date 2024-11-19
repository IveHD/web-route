import { CONTENT_TYPE } from "src/lib/const";
import { REQUIRED } from "../paramValidRule";
import { ParamValidateFn, RouteConfig } from "../types/global";

type ConstructorParam = {
  swaggerVersion?: string;
  infoTitle?: string;
  infoVersion?: string;
  infoDescription?: string;
  host?: string;
  basePath?: string;
};

type PathConfig = {
  path: string;
  method: 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch';
  params: ParamValidateFn;
  summary?: string;
  description?: string;
  responses: any;
};

type pathItem = {
  [key: string]: any;
}

type ParametersItem = {
  name: string;
  in: 'query' | 'header' | 'path' | 'body' | 'formData';
  description?: string;
  required?: boolean;
  schema?: any;
  type?: string;
};

export default class BuildSwagger {
  private swagger = {
    swagger: '2.0',
    info: {
      title: '',
      description: '',
      version: ''
    },
    host: 'localhost:8080',
    basePath: '/',
    tags: [],
    paths: {} as pathItem,
    definitions: {},
  };
  constructor(param: ConstructorParam = {}) {
    this.swagger.swagger = param.swaggerVersion || this.swagger.swagger;
    this.swagger.info.title = param.infoTitle || this.swagger.info.title;
    this.swagger.info.version = param.infoVersion || this.swagger.info.version;
    this.swagger.info.description = param.infoDescription || this.swagger.info.description;
    this.swagger.host = param.host || this.swagger.host;
    this.swagger.basePath = param.basePath || param.basePath || this.swagger.basePath;
  }

  addPath(config: RouteConfig) {
    const { path, method, paramValidate, contentType } = config;
    this.swagger.paths[path] = this.swagger.paths[path] || {};
    let parameters = [] as ParametersItem[];
    // todo 定义更多请求方式
    let inType = 'body';
    switch (method) {
      case 'get':
        inType = 'query';
        break;
      case 'post':
        inType = 'body';
        break;
      default:
        inType = 'body';
        break;
    }
    const paramsTypes = [] as any[];
    const params = paramValidate || {};
    Object.keys(params).forEach(name => {
      const p = params[name];
      const validFns = Array.isArray(p) ? p : [p];
      const type = validFns.find(fn => fn.type)?.type || 'string';
      const required = !!validFns.find(fn => REQUIRED.name === fn.name);
      paramsTypes.push({
        name,
        type,
        required
      });
    });

    if (inType === 'query') {
      parameters = this.buildQueryParameters(paramsTypes);
    } else {
      const res = this.buildBodyParameters(paramsTypes, config);
      parameters = res.parameters;
      this.swagger.definitions[res.name] = res.definition;
    }

    const pathObject = {
      [method as string]: {
        tags: [],
        summary: 'todo summary',
        operationId: `${this.buildInterfaceName(config)}`,
        produces: [ // todo
          "*/*"
        ],
        parameters,
        responses: {
          200: {
            description: 'ok'
          }
        }
      }
    };

    const re = this.swagger.paths[path] = {
      ...this.swagger.paths[path],
      ...pathObject
    };
    console.log('re', re);
  }

  buildInterfaceName(config: RouteConfig) {
    const array = config.path.split('/');
    // 驼峰格式拼接array中单词，注意array长度不确定，使用reduce
    const interfaceName = array.reduce((pre, cur) => {
      return pre + this.wordToCamelCase(cur);
    }, this.wordToCamelCase(config.method as string));
    return `${interfaceName}`;
  }

  private wordToCamelCase(str: string) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  buildQueryParameters(types: any[]): ParametersItem[] {
    const parameters = [] as ParametersItem[];
    types.forEach(t => {
      parameters.push({
        in: 'query',
        name: t.name,
        type: 'string',
        required: true
      });
    });
    return parameters;
  }

  buildBodyParameters(types: any[], config: RouteConfig): { parameters: ParametersItem[], definition: any, name: string } {
    const requestName = `${this.buildInterfaceName(config)}Request`;
    const definition = {
      type: 'object',
      title: requestName,
      description: 'todo', // todo
      properties: {},
    };
    types.forEach(t => {
      definition.properties[t.name] = {
        type: t.type,
      };
    });
    const parameters = [{
      in: 'body',
      name: "request",
      required: !!types.find(e => e.required),
      schema: {
        originalRef: requestName,
        $ref: `#/definitions/${requestName}`
      }
    }] as ParametersItem[];
    return {
      parameters,
      definition,
      name: requestName
    };
  }
}