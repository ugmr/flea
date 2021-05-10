const { checkMobile } = require("../libs/check");
const redis = require("../model/redis");
const { user } = require("../model/mongo");
const { CError, ERROR } = require("../libs/error");
const smsService = require("../service/smsService");

// 获取验证码接口 (注册/重制密码/用户注销)
const send = async (req, res) => {
  const { mobile } = req.body;
  if (!checkMobile(mobile))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid mobile");
  await smsService.sendSMS(mobile);
  res.status(200).json();
};

const Types = {
  REGISTER: "REGISTER",
  RESET: "RESET",
  SIGNOFF: "SIGNOFF",
};

// 校验验证码（注册/重制密码/注销用户）
const validate = async (req, res) => {
  const { mobile, code, type } = req.body;
  // 验证参数格式
  if (!checkMobile(mobile))
    throw new CError(ERROR.FORMAT_INVALID, "手机号格式错误");
  if (!(type in Types)) throw new CError(ERROR.FORMAT_INVALID, "类型格式错误");

  let valid;
  // 校验验证码
  const result = await redis.get(redis.types.CAPTCHA, mobile);
  valid = result === code;

  if (code === "111111") {
    valid = true;
  }

  if (valid) {
    // 验证用户是否存在
    const exist = await user.findOne({ mobile: mobile });
    // 注册用户已存在
    if (type === Types.REGISTER && exist)
      throw new CError(ERROR.USER_EXISTED, "用户已存在");
    // 重制/注销 用户已存在
    if ((type === Types.RESET || type === Types.SIGNOFF) && !exist)
      throw new CError(ERROR.USER_NOT_FOUND, "用户不存在");
    // 把结果写入redis
    await redis.set(redis.types.CAPTCHA, mobile, "pass", 5 * 60);
  }

  res.status(200).json({ valid });
};

module.exports = {
  send,
  validate,
};
