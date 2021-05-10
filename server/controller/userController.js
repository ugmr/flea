const smsService = require("../service/smsService");
const { user, role, relation, collect } = require("../model/mongo");
const { checkMobile, checkPassword } = require("../libs/check");
const { CError, ERROR } = require("../libs/error");

/**
 * 用户注册
 * @param {String} mobile 手机号
 * @param {String} password 密码
 * @param {String} userName 用户名
 * @returns {Object} 生成的用户信息
 */
const signin = async (req, res) => {
  // 获取参数
  const { mobile, password, userName } = req.body;
  // 检查格式
  if (!checkMobile(mobile))
    throw new CError(ERROR.FORMAT_INVALID, "手机号格式错误");
  if (!checkPassword(password))
    throw new CError(ERROR.FORMAT_INVALID, "密码格式错误");
  // 是否经过验证
  const valid = smsService.verify(mobile, "pass");
  if (!valid) throw new CError(ERROR.PERMISSION_DENIED, "验证码已过期");
  // 验证手机号是否被创建
  const result = await user.findOne({ mobile: mobile });
  if (result) throw new CError(ERROR.USER_EXISTED, "手机号已被注册");
  // 角色
  const defaultRole =
    (await role.findOne({ default: true })) || (await role.findOne());
  // 返回新建的 用户
  const u = await user.create({
    mobile: mobile,
    password: password,
    userName: userName,
    role: defaultRole._id,
  });

  // 返回
  res.status(201).json({
    user: u,
  });
};

/**
 * 用户注销
 */
const signoff = async (req, res) => {
  const userId = req.token.id;
  await user.remove({ _id: userId });
  res.status(204).send();
};

/**
 * 忘记密码
 * @param {String} mobile 手机号
 * @param {String} password 密码
 * @returns null
 */
const forget = async (req, res) => {
  const { mobile, password } = req.body;
  // 验证参数是否合法
  if (!checkMobile(mobile))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid Mobile");
  if (!checkPassword(password))
    throw new CError(ERROR.FORMAT_INVALID, "Invalid Password");
  // 对比验证码
  const valid = await smsService.verify(mobile, "pass");
  if (!valid) throw new CError(ERROR.PERMISSION_DENIED, "验证码已过期");
  // 更新密码
  user.findOneAndUpdate({ mobile }, { password });
  // 返回
  res.status(200).send();
};
/**
 * 获取用户基本信息
 */
const getBaseInfo = async (req, res) => {
  // 获取参数
  const userId = req.params.id;
  let userInfo = await user.findOne({ _id: userId });

  if (!userInfo) throw new CError(ERROR.DATA_NOT_FOUND, "用户不存在");

  const collectNum = await collect.count({ userId });
  const focusNum =
    (await relation.count({ fromId: userId })) +
    (await relation.count({ toId: userId, status: true }));
  const followNum =
    (await relation.count({ toId: userId })) +
    (await relation.count({ fromId: userId, status: true }));

  const result = {
    id: userInfo.id,
    userName: userInfo.userName,
    profilePhoto: userInfo.profilePhoto,
    intro: userInfo.intro,
    credit: userInfo.credit,
    gender: userInfo.gender,
    birthday: userInfo.birthday,
    address: userInfo.address,
    collectNum,
    focusNum,
    followNum,
  };

  res.status(200).json({ user: result });
};
/**
 * 获取用户列表
 */
const getUserList = async (req, res) => {
  let { conditions, fields, options, isAdmin } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");
  isAdmin = JSON.parse(isAdmin || "false");

  Object.keys(conditions).forEach((key) => {
    const value = conditions[key];
    if (key === "userId") return;
    conditions[key] = { $regex: value, $options: "$i" };
  });

  users = await user.find(conditions, fields, options).populate({
    path: "role",
    model: "role",
  });

  users = users.filter((u) => {
    return u.role.isAdmin === isAdmin;
  });

  res.status(200).json({
    users,
    count: users.length,
  });
};
/**
 * 更新用户密码
 */
const updatePassword = async (req, res) => {
  // 获取参数
  const userId = req.token.id;
  const { password } = req.body;
  if (!checkPassword(password))
    throw new CError(ERROR.FORMAT_INVALID, "密码格式错误");
  // 查询结果
  await user.findOneAndUpdate(
    { _id: userId },
    {
      password: password,
    }
  );
  // 返回
  res.status(203).json({
    status: "success",
    message: "修改密码成功",
  });
};
/**
 * 修改用户个人信息
 */
const updateProfile = async (req, res) => {
  // 获取参数
  const userId = req.token.id;
  let newInfo = req.body;
  // 查询结果
  await user.findOneAndUpdate({ _id: userId }, newInfo);
  // 返回
  res.status(203).json({ profile: newInfo });
};

/**
 * 获取用户信息
 */
const getProfile = async (req, res) => {
  // 获取参数
  const userId = req.token.id;
  // 查询结果
  let result = await user.findOne({ _id: userId });
  const roleInfo = await role.findOne({ _id: result.role });
  // 返回
  res.status(200).json({ profile: result, role: roleInfo });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  await user.findOneAndDelete({ _id: id });

  res.status(204).send();
};

const updateUser = async (req, res) => {
  const id = req.params.id;

  const userInfo = req.body;

  const result = await user.updateOne({ _id: id }, userInfo);

  res.status(203).json({
    user: result,
  });
};

module.exports = {
  signin,
  signoff,
  forget,
  getBaseInfo,
  getUserList,
  updatePassword,
  updateProfile,
  getProfile,
  deleteUser,
  updateUser,
};
