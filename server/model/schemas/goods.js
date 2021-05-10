const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goodsSchema = new Schema({
  // 商品名称
  name: { type: String, required: true },
  // 发布者id
  userId: { type: Schema.Types.ObjectId, required: true },
  // 商品简介
  intro: { type: String, required: true },
  // 商品图片
  introPhoto: { type: Array, required: true },
  // 商品封面图
  cover: { type: String, required: true },
  // 商品分类
  category: { type: String, required: true },
  // 商品数量
  num: { type: Number, required: true },
  // 商品新旧程度
  new: { type: String, required: true },
  // 商品二手价格
  price: { type: Number, required: true },
  // 商品原价
  oldPrice: { type: Number, required: true },
  // 运费
  freight: { type: Number, required: true },
  // 商品发货地
  address: { type: String, required: true },
  location: {
    type: [Number],
    index: {
      type: "2dsphere",
      sparse: true,
    },
  },
  // 审核状态
  status: { type: Number, default: 0 },
  // 商品创建时间
  createdAt: { type: Schema.Types.Date, default: new Date() },
});

module.exports = goodsSchema;
