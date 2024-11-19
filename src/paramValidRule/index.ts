export const REQUIRED = (name, value) => (value === undefined || value === '' || value === null) && `[${name}]值不能为空`
export const STRING = (name, value) => typeof value === 'string' || `[${name}]值应为字符串`;
STRING.type = 'string';
export const NUMBER = (name, value) => typeof value === 'number' || `[${name}]值应为数字`;
NUMBER.type = 'number';
export const EMAIL = (name, value) => typeof value === 'string' && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) || `[${name}]值应为邮件地址`;
EMAIL.type = 'string';
export const URL = (name, value) => typeof value === 'string' && /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(value) || `[${name}]值应为网络地址`;
URL.type = 'string';
export const MOBILE_NUMBER = (name, value) => typeof value === 'string' && /^(13|14|15|18|17)[0-9]{9}$/.test(value) || `[${name}]值应为手机号码`;
MOBILE_NUMBER.type = 'string';
export const TELEPHONE_NUMBER = (name, value) => typeof value === 'string' && /^(\d{3,4}-?)?\d{7,8}$/.test(value) || `[${name}]值应为座机电话号码`;
TELEPHONE_NUMBER.type = 'string';
export const PHONE_NUMBER = (name, value) => typeof value === 'string' && (/^(13|14|15|18|17)[0-9]{9}$/.test(value) || /^(\d{3,4}-?)?\d{7,8}$/.test(value)) || `[${name}]值应为电话号码`;
PHONE_NUMBER.type = 'string';
export const ID_CARD_NUMBER = (name, value) => typeof value === 'string' && /(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) || `[${name}]值应为身份证号码;`;
export const CN = (name, value) => typeof value === 'string' && /[\u4e00-\u9fa5]/.test(value) || `[${name}]值应为中文;`;
export const NO_SPACE = (name, value) => typeof value === 'string' && !/[\n\s*\r]/.test(value) || `[${name}]值不能包含空格;`;
export const NO_SPECIAL_CHAR = (name, value) => typeof value === 'string' && /^[\u4e00-\u9fa5a-zA-Z0-9_]*$/.test(value) || `[${name}]值应为中文、英文、数字、下划线组成;`;

export default {
  REQUIRED,
  STRING,
  NUMBER,
  EMAIL,
  URL,
  MOBILE_NUMBER,
  TELEPHONE_NUMBER,
  PHONE_NUMBER,
  ID_CARD_NUMBER,
  CN,
  NO_SPACE,
  NO_SPECIAL_CHAR,
};