module.exports = [{
  path: '/js/hello',
  method: 'get',
  cors: true,
  handler(ctx, next) {
      ctx.body = 'hello js';
  }
}]