const assert = require('assert');
const axios = require('axios');

const domain = 'http://127.0.0.1:8080';

describe('#接口注册', () => {
  it('#ts 注解默认注册接口', (done) => {
    axios.get(`${domain}/ts_api/registByString`).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#js 默认注册接口', (done) => {
    axios.get(`${domain}/js_api/registByString`).then(res => {
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
  it('#参数不合格', (done) => {
    axios.post(`${domain}/ts_api/paramValid`).then(res => {
      if (res.data.success === false) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#参数合格', (done) => {
    axios.post(`${domain}/ts_api/paramValid`, { a: 'string', b: 20 }).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
});

describe('#content-type 校验', () => {
  it('#content-type 不合格', (done) => {
    axios.post(`${domain}/ts_api/paramValid`).then(res => {
      if (res.data.success === false) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
  it('#content-type 合格', (done) => {
    axios.post(`${domain}/ts_api/paramValid`, { a: 'string', b: 20 }).then(res => {
      if (res.data.success === true) done();
      else done(res.data);
    }).catch(err => {
      done(err);
    });
  });
});