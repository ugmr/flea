const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // 所属话题id
  topicId: {type: Schema.Types.ObjectId, required: true},
  // 用户id
  userId: {type: Schema.Types.ObjectId, required: true},
  // 图片
  photo: {type: Array},
  // 内容
  content: {type: String, required: true},
  // 链接商品
  goodsId: String,
  // 点赞数
  like: {type: Number, default: 0},
  // 浏览量
  view: {type: Number, default: 0},
  // 
  createdAt: {type: Schema.Types.Date, default: new Date()}
});

module.exports = postSchema;