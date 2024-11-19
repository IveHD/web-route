
import RouteMapping from '../core/route';
import { AnnotationRouteConfig } from '../types/global';

const RequestMapping = (config: string | AnnotationRouteConfig) => {
  let configObj: AnnotationRouteConfig = { path: '/' };
  if (typeof config === 'string') {
    configObj.path = config;
  } else {
    configObj = { ...config };
  }
  return (...args) => {
    const [target, property] = args;
    const handler = target[property];
    if (args.length === 1) { // class decorator
      if (typeof config !== 'string') {
        throw new Error('Expected 1 argument when RequestMapping is used as class decorator');
      }
      RouteMapping.addGroupRoute(configObj.path, target);
    } else {
      RouteMapping.addRoute({
        ...configObj,
        handler
      }, target.constructor);
    }
  }
}

export default RequestMapping;