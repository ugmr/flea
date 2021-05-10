const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nameValidator = (name) => {
  return name.length && name.length <= 20;
};

const topicSchema = new Schema({
  // 圈子名称
  name: { type: String, required: true, unique: true, validate: nameValidator },
  // 圈子封面图
  cover: { type: String },
  // 圈子简介
  intro: String,
});

module.exports = topicSchema;
