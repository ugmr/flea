const { user } = require('../model/mongo');
const { checkMobile: mobileCheck, checkUserName: userNameCheck } = require('../libs/check');
const { CError, ERROR } = require('../libs/error');
const { debug } = require("../libs/log4j")("debug");

// 校验手机号
const checkMobile = async (req, res) => {
  const { mobile } = req.body;

  console.log(mobile)

  if(!mobileCheck(mobile)) throw new CError(ERROR.FORMAT_INVALID, '手机号格式错误');
  const exist = await user.findOne({mobile: mobile});

  res.status(200).json({ exist: !!exist });
}

// 验证用户名是否存在
const checkUserName = async (req, res) => {
  const { userName } = req.body;
  if(!userNameCheck(userName)) throw new CError(ERROR.FORMAT_INVALID, '用户名格式错误');
  // 校验用户名
  const exist = await user.findOne({userName: userName});
  // 正常返回
  res.status(200).json({exist: !!exist});
}

module.exports = {
  checkMobile,
  checkUserName
}