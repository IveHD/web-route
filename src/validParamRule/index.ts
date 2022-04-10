const REUQIRED = (name, value) => (value === undefined || value === '' || value === null) && `[${name}]值不能为空`
const STRING = (name, value) => typeof value === 'string' || `[${name}]值应为字符串`;
const NUMBER = (name, value) => typeof value === 'number' || `[${name}]值应为数字`;
export default {
  REUQIRED,
  STRING,
  NUMBER
};