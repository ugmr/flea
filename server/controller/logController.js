const { user, role } = require("../model/mongo");
const redisDb = require("../model/redis");
const jwt = require("../libs/token");
const { checkMobile, checkPassword } = require("../libs/check");
const { CError, ERROR } = require("../libs/error");
const logger = require("../libs/log4j")("log");

/**
 *  用户登录接口
 */
const login = async (req, res) => {
  // 获取参数
  const { mobile, password } = req.body;
  // 验证参数是否正确
  if (!checkMobile(mobile))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid Mobile");
  if (!checkPassword(password))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid Password");

  // 查询用户
  const result = await user.findOne({ mobile: mobile, password: password });
  if (!result) throw new CError(ERROR.LOGIN_REQUIRED, "用户名或密码错误");
  // 查询用户角色信息
  const r = await role.findOne({ _id: result.role });
  const userInfo = {
    id: result._id,
    mobile: result.mobile,
    userName: result.userName,
    role: r._id,
    isAdmin: r.isAdmin,
  };

  // 生成token, 将登录状态写入redis
  const token = await jwt.sign(userInfo);
  await redisDb.set(
    redisDb.types.TOKEN,
    result.mobile,
    token,
    24 * 60 * 60 * 60
  );

  userInfo.profilePhoto = result.profilePhoto;
  res.status(200).json({ token, userInfo });
};

/**
 * 管理员接口
 */
const adminLogin = async (req, res) => {
  // 获取参数
  const { mobile, password } = req.body;
  // 验证参数是否正确
  if (!checkMobile(mobile))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid Mobile");
  if (!checkPassword(password))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid Password");

  // 查询用户
  const result = await user.findOne({ mobile, password });
  if (!result) throw new CError(ERROR.LOGIN_REQUIRED, "用户名或密码错误");

  // 管理员登陆
  const r =
    (await role.findOne({ _id: result.role })) ||
    (await role.findOne({ default: true }));
  console.log(r);
  if (!r || !r.isAdmin)
    throw new CError(ERROR.LOGIN_REQUIRED, "不是管理员账户");
  const userInfo = {
    id: result._id,
    mobile: result.mobile,
    userName: result.userName,
    role: r._id,
    isAdmin: r.isAdmin,
  };
  // 生成token
  const token = await jwt.sign(userInfo);
  // 写入redis
  await redisDb.set(
    redisDb.types.TOKEN,
    result.mobile,
    token,
    24 * 60 * 60 * 60
  );
  userInfo.profilePhoto = result.profilePhoto;
  // 返回
  res.status(200).json({
    token: token,
    userInfo: userInfo,
  });
};

// 登出接口
const logout = () => {
  return async (req, res) => {
    const userId = req.token.id;
    // 登出
    await redisDb.del(redisDb.types.TOKEN, userId);
    // 返回结果
    res.status(204).json();
  };
};

module.exports = {
  login,
  adminLogin,
  logout,
};
