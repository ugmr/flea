const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertSchema = new Schema({
  name: { type: String, required: true },
  // 图片
  img: { type: String, required: true },
  // 目标id
  src: { type: String, required: true },
  // 是否应用
  isUsed: { type: Boolean, default: false },
  // 创建时间
  createdAt: { type: Schema.Types.Date, default: new Date() },
});

module.exports = advertSchema;
