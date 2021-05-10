const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blacklistSchema = new Schema({
  // 用户id
  fromId: {type: Schema.Types.ObjectId, required: true},
  // 目标id
  toId: {type: Schema.Types.ObjectId, required: true},
  // 互相拉黑
  status: {type: Boolean, required: true},
});

module.exports = blacklistSchema;