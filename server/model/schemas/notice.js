const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noticeSchema = new Schema({
  // 目标id
  userId: { type: Schema.Types.ObjectId, required: true },
  // 标题
  title: { type: String, required: true },
  // 内容
  content: { type: String, required: true },
  // 状态（是否被查看）
  status: { type: Boolean, default: false },
  // 发布时间
  createdAt: { type: Schema.Types.Date, default: new Date() },
});

module.exports = noticeSchema;
