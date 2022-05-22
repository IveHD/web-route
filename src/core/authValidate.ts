import { EXCEPTION_CODE } from "../lib/const";
import { getConfig } from '../lib/config';
import { transparentMiddleware } from "../lib/util";
import { RouteConfig } from '../types/global';
import { Middleware } from 'koa';

const DEFAULT_CONFIG = getConfig();

export default function authValidateMiddleware (config: RouteConfig): Middleware {
  let { isAuthValidate, authValidate } = config;
  let defaultIsAuthValidate = DEFAULT_CONFIG.isAuthValidate;
  let defaultAuthValidate = DEFAULT_CONFIG.authValidate;

  if(typeof authValidate === 'function') {
    if(isAuthValidate === false) throw new Error('Already define an auth validate function, but isAuthValidate is false');
    return authValidate;
  }
  
  if (isAuthValidate === false) return transparentMiddleware;

  if (defaultIsAuthValidate && typeof defaultAuthValidate === 'function') return defaultAuthValidate;

  return transparentMiddleware;
} 

export const NO_AUTH_BODY = {
  success: false,
  code: EXCEPTION_CODE.NO_AUTH.CODE,
  info: EXCEPTION_CODE.NO_AUTH.INFO
}