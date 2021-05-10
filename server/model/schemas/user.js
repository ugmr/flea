const {
  checkMobile,
  checkPassword,
  checkUserName,
} = require("../../libs/check");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mobileValidator = checkMobile;
const passwordValidator = checkPassword;
const usernameValidator = checkUserName;

const userSchema = new Schema({
  mobile: {
    //手机号
    type: String,
    required: true,
    unique: true,
    validate: mobileValidator,
  },
  password: {
    // 密码
    type: String,
    required: true,
    validate: passwordValidator,
  },
  userName: {
    // 昵称
    type: String,
    required: true,
    unique: true,
    validate: usernameValidator,
  },
  profilePhoto: {
    // 头像
    type: String,
    default: "",
  },
  gender: {
    // 性别
    type: String,
    default: "male",
    validate: (v) => {
      return ["male", "female"].includes(v);
    },
  },
  birthday: {
    // 生日
    type: Schema.Types.Date,
    default: new Date(),
  },
  address: {
    // 地址
    type: String,
    default: "",
  },
  intro: {
    // 简介
    type: String,
    default: "",
    validateL: (v) => {
      return v.length < 200;
    },
  },
  credit: {
    // 信誉分
    type: Number,
    default: 100,
    validate: (v) => {
      return v >= 0 && v <= 100;
    },
  },
  role: {
    // 角色
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    // 创建时间
    type: Schema.Types.Date,
    default: new Date(),
  },
});

module.exports = userSchema;
