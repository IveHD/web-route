import { GlobalRouteConfig } from '../types/global';
import { HTTP_METHOD } from './const';

const config: GlobalRouteConfig = {
  method: HTTP_METHOD.GET,
  cors: false,
  isAuthValidate: false,
};

export const setConfig = _config => {
  Object.assign(config, _config);
  return config;
}

export const getConfig = (): GlobalRouteConfig => config;