const { CError, ERROR } = require("../../libs/error");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nameValidator = (val) => {
  if (val.length && val.length <= 21) return true;
  throw new CError(ERROR.FORMAT_INVALID, "Invalid permission name");
};

const permissionSchema = new Schema({
  // 权限名称
  name: { type: String, required: true, unique: true, validate: nameValidator },
  // 权限描述
  description: { type: String, required: true },
  // 权限路径
  path: { type: String },
});

module.exports = permissionSchema;
