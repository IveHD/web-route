import { CORS_CONFIG } from '../types/global';

const corsDefaultHeader = {
  'origin': '*',
  'headers': '*',
  'methods': 'GET,HEAD,PUT,POST,DELETE,PATCH',
  'credentials': 'true'
};

export const setCorsHeader = (ctx, config: CORS_CONFIG = {}) => {
  ctx.set('Access-Control-Allow-Origin', config.origin || corsDefaultHeader.origin);
  ctx.set('Access-Control-Allow-Headers', config.headers || corsDefaultHeader.headers);
  ctx.set('Access-Control-Allow-Methods', config.methods || corsDefaultHeader.methods);
  ctx.set('Access-Control-Allow-Credentials', config.credentials || corsDefaultHeader.credentials);
}