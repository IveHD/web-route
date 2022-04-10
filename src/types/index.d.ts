type CORS_CONFIG = { origin?: string, headers?: string, methods?: string, credentials?: string };
type CORS = boolean | CORS_CONFIG;
export { CORS_CONFIG, CORS };