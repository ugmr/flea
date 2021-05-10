const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const relationSchema = new Schema({
  // 用户id
  fromId: {type: Schema.Types.ObjectId, required: true},
  // 目标id
  toId: {type: Schema.Types.ObjectId, required: true},
  // 状态
  status: {type: Boolean, required: true},
});

module.exports = relationSchema;