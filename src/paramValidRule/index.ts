export const REQUIRED = (name, value) => (value === undefined || value === '' || value === null) && `[${name}]值不能为空`
export const STRING = (name, value) => typeof value === 'string' || `[${name}]值应为字符串`;
export const NUMBER = (name, value) => typeof value === 'number' || `[${name}]值应为数字`;
export const EMAIL = (name, value) => typeof value === 'string' && /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) || `[${name}]值应为邮件地址`;
export const URL = (name, value) => typeof value === 'string' && /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(value) || `[${name}]值应为网络地址`;
export const MOBILE_NUMBER = (name, value) => typeof value === 'string' && /^(13|14|15|18|17)[0-9]{9}$/.test(value) || `[${name}]值应为手机号码`;
export const TELEPHONE_NUMBER = (name, value) => typeof value === 'string' && /^(\d{3,4}-?)?\d{7,8}$/.test(value) || `[${name}]值应为座机电话号码`;
export const PHONE_NUMBER = (name, value) => typeof value === 'string' && (/^(13|14|15|18|17)[0-9]{9}$/.test(value) || /^(\d{3,4}-?)?\d{7,8}$/.test(value)) || `[${name}]值应为电话号码`;
export const ID_CARD_NUMBER = (name, value) => typeof value === 'string' && /(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) || `[${name}]值应为身份证号码;`;
export const CN = (name, value) => typeof value === 'string' && /[\u4e00-\u9fa5]/.test(value) || `[${name}]值应为中文;`;
export const NO_SPACE = (name, value) => typeof value === 'string' && !/[\n\s*\r]/.test(value) || `[${name}]值不能包含空格;`;
export const NO_SPECIAL_CHAR = (name, value) => typeof value === 'string' && /^[\u4e00-\u9fa5a-zA-Z0-9_]*$/.test(value) || `[${name}]值应为中文、英文、数字、下划线组成;`;
export const ARRAY = (name: string, value: any) => {
  return Array.isArray(value) ? true : `${name} 必须是数组`;
};

export const ARRAY_OF_STRING = (name: string, value: any) => {
  return Array.isArray(value) && value.every((item: any) => typeof item === 'string') ? true : `${name} 必须是字符串数组`;
};

export const ARRAY_OF_STRING_NOT_EMPTY = (name: string, value: any) => {
  return Array.isArray(value) && value.every((item: any) => typeof item === 'string') && value.length > 0 ? true : `${name} 必须是字符串数组`;
};

export const ARRAY_OF_NUMBER = (name: string, value: any) => {
  return Array.isArray(value) && value.every((item: any) => typeof item === 'number') ? true : `${name} 必须是数字数组`;
};

export const ARRAY_OF_NUMBER_NOT_EMPTY = (name: string, value: any) => {
  return Array.isArray(value) && value.every((item: any) => typeof item === 'number') && value.length > 0 ? true : `${name} 必须是数字数组`;
};

export const OBJECT = (name: string, value: any) => {
  return typeof value === 'object' && value !== null ? true : `${name} 必须是对象`;
};

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
  ARRAY,
  ARRAY_OF_STRING,
  ARRAY_OF_STRING_NOT_EMPTY,
  ARRAY_OF_NUMBER,
  ARRAY_OF_NUMBER_NOT_EMPTY,
  OBJECT,
};