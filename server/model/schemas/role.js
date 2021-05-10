const { CError, ERROR } = require("../../libs/error");
const mongoose = require("mongoose");

const nameValidator = (val) => {
  if (val.length && val.length <= 20) return true;
  throw new CError(ERROR.FORMAT_INVALID, "Invalid role name");
};

const roleSchema = new mongoose.Schema({
  // 角色名称
  name: { type: String, required: true, unique: true, validate: nameValidator },
  // 权限列表
  permissions: { type: Array, required: true },
  // 是否是管理员
  isAdmin: { type: Boolean, default: true },
  // 描述
  desc: { type: String, required: true },
  // 默认角色
  default: { type: Boolean, default: false },
});

module.exports = roleSchema;
