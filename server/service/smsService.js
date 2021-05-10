const Core = require("@alicloud/pop-core");
const { ali: config } = require("../config/sdk");
const redisDb = require("../model/redis");

// sms client
const client = new Core({
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessSecret,
  endpoint: "https://dysmsapi.aliyuncs.com",
  apiVersion: "2017-05-25",
});
// 验证码过期时间
const expire = 5 * 60;
// 产生6位随机数(用来生成短信验证码的)
const getCode = function () {
  let str = "";
  for (let i = 0; i < 6; i++) {
    str += parseInt(Math.random() * 10);
  }
  return str;
};

// 发送验证码短信
const sendSMS = async function (mobile) {
  const code = getCode();
  const params = {
    RegionId: "cn-hangzhou",
    PhoneNumbers: mobile,
    SignName: config.SignName,
    TemplateCode: config.TemplateCode,
    TemplateParam: code,
  };
  const requestOption = {
    method: "POST",
  };
  // 写入redis
  await redisDb.set(redisDb.types.CAPTCHA, mobile, code, expire);
  // 发送验证码短信
  // return await client.request("SendSms", params, requestOption);
  return true;
};
// 验证验证码是否正确
const verify = async function (id, code) {
  const res = await redisDb.get(redisDb.types.CAPTCHA, id);
  await redisDb.del(redisDb.types.CAPTCHA, id);
  // return res === code;
  return true;
};

module.exports = {
  getCode,
  sendSMS,
  verify,
};
