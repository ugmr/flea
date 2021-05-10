const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  // 用户id
  userId: String,
  // 目标id
  targetId: String,
  // 消息内容
  content: String,
  // 消息类型
  type: String,
  // 消息状态 (目标是否收到)
  status: Boolean,
  // 消息创建时间
  createAt: Schema.Types.Date,
});

module.exports = messageSchema;