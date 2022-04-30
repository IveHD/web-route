
import RouteMapping from '../mapping/route';
import { HTTP_METHOD } from '../lib/const';
import { AnnotationRouteConfig } from 'src/types/global';

const RequestMapping = (config: string | AnnotationRouteConfig) => {
  let path = '/';
  let method;
  if (typeof config === 'string') {
    path = config;
  } else {
    path = config.path;
    method = config.method?.toLowerCase();
  }
  return (...args) => {
    const [target, property] = args;
    const handler = target[property];
    if (args.length === 1) { // class decorator
      if (typeof config !== 'string') {
        throw new Error('Expected 1 argument when RequestMapping is used as class decorator');
      }
      RouteMapping.addGroupRoute(path, target);
    } else {
      RouteMapping.addRoute({
        path,
        method,
        handler,
      }, target.constructor);
    }
  }
}

export default RequestMapping;