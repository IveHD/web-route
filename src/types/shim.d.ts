import '@types/koa';

declare module "koa" {
    interface Request extends BaseRequest {
        body?: any;
    }
}