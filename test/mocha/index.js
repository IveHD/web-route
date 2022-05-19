const axios = require('axios');
const config = require('../registerConfig');

const domain = 'http://127.0.0.1:8080';

describe('#接口注册', () => {
  const method = config.defaultConfig.method || 'get';
  it('#ts 注解默认注册接口', (done) => {
    axios[method](`${domain}/ts_api/registByString`).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js 默认注册接口', (done) => {
    axios[method](`${domain}/js_api/registByString`).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#ts post', (done) => {
    axios.post(`${domain}/ts_api/post`).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js post', (done) => {
    axios.post(`${domain}/js_api/post`).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
});

describe('#参数校验', () => {
  it('#ts 参数不合格', (done) => {
    axios.post(`${domain}/ts_api/paramValid`).then(res => {
      if (res.data.success === false) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#ts 参数合格', (done) => {
    axios.post(`${domain}/ts_api/paramValid`, { a: 'string', b: 20 }).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js 参数不合格', (done) => {
    axios.post(`${domain}/js_api/paramValid`).then(res => {
      if (res.data.success === false) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js 参数合格', (done) => {
    axios.post(`${domain}/js_api/paramValid`, { a: 'string', b: 20 }).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
});

describe('#content-type 校验', () => {
  it('#ts content-type 不合格', (done) => {
    axios.post(
      `${domain}/ts_api/contentType`, 
      null, 
      {
        headers: { 
          'content-type': 'asd' 
        }
      }
    ).then(res => {
      if (res.data.success === false && res.data.code === 415) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#ts content-type 合格', (done) => {
    axios.post(
      `${domain}/ts_api/contentType`, 
      null, 
      {
        headers: { 
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    ).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js content-type 不合格', (done) => {
    axios.post(
      `${domain}/js_api/contentType`, 
      null, 
      {
        headers: { 
          'content-type': 'asd' 
        }
      }
    ).then(res => {
      if (res.data.success === false && res.data.code === 415) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js content-type 合格', (done) => {
    axios.post(
      `${domain}/js_api/contentType`, 
      null, 
      {
        headers: { 
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    ).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });


});

describe('#CORS 跨域', () => {
  it('#ts cors 跨域', (done) => {
    axios.post(`${domain}/ts_api/cors1`).then(res => {
      const { headers } = res;
      if(
        headers['access-control-allow-credentials']
        && headers['access-control-allow-headers']
        && headers['access-control-allow-methods']
        && headers['access-control-allow-origin']
      ) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });

  // todo 预检跨域
  // todo js 跨域
});