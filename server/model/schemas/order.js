const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusValidator = (val) => {
  // 订单状态
  // 0: 已取消
  // 1: 待付款
  // 2: 待发货
  // 3: 待确定收货
  // 4: 待评价
  // 5: 退款中
  // 6: 退款成功
  return val >= 0 && val <= 6;
}

const orderSchema = new Schema({
  no: {type: String, required: true},
  // 卖家
  seller: {type: Schema.Types.ObjectId, required: true},
  // 买家
  buyer: {type: Schema.Types.ObjectId, required: true},
  // 创建时间
  createdAt: {type: Schema.Types.Date, default: new Date()},
  // 商品id
  goodsId: {type: Schema.Types.ObjectId, required: true},
  // 商品数量
  num: {type: Number, required: true},
  // 商品名称
  goodsName: {type: String, required: true},
  // 商品封面图
  cover: {type: String, required: true},
  // 商品价格
  goodsPrice: {type: Number, required: true},
  // 商品运费
  freight: {type: Number, required: true},
  // 总价
  price: {type: Number,required: true},
  // 收货信息
  delivery: {
    name: {type: String, required: true},
    mobile: {type: String, required: true},
    province: {type: String, required: true},
    district: {type: String, required: true},
    address: {type: String, required: true}
  },
  // 物流订单号
  logistic: {
    types: String,
    no: String
  },
  // 商品状态
  status: {type: Number, default: 0, validate: statusValidator},
});

module.exports = orderSchema;