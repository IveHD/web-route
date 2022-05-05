export const HTTP_METHOD = {
  GET: 'get',
  POST: 'post'
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