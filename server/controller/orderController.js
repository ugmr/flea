const {
  order,
  delivery,
  goods,
  user,
  orderEvaluation,
} = require("../model/mongo");
const { CError, ERROR } = require("../libs/error");
const redis = require("../model/redis");
// 下单
const createOrder = async (req, res) => {
  const { goodsId, deliveryId } = req.body;
  const buyerId = req.token.id;

  let info = {};

  // 查询商品库存
  const goodsInfo = await goods.findOne({ _id: goodsId });
  if (!goodsInfo) throw new CError(ERROR.DATA_INVALID, "商品不存在");

  if (goodsInfo.num < 1) {
    return res.status(200).json({
      status: "fail",
      message: "商品库存不足",
    });
  }

  const deli = await delivery.findOne({ _id: deliveryId });
  if (!deli) throw new CError(ERROR.FORMAT_INVALID, "用户地址格式错误");

  info.delivery = {
    mobile: deli.name,
    name: deli.name,
    province: deli.province,
    district: deli.district,
    address: deli.address,
  };

  info.goodsId = goodsId;
  info.goodsName = goodsInfo.name;
  info.num = 1;
  info.cover = goodsInfo.cover;
  info.goodsPrice = goodsInfo.price;
  info.freight = goodsInfo.freight;
  info.seller = goodsInfo.userId;
  info.buyer = buyerId;
  info.price = info.goodsPrice + info.freight;
  info.status = 1;
  // // 生成订单号
  info.no = orderCode();

  // 创建订单
  const result = await order.create(info);

  // 更新库存
  await goods.updateOne(
    { _id: info.goodsId },
    { num: goodsInfo.num - info.num }
  );
  // 写入redis
  await redis.set(redis.types.ORDER, result.no, result.no, 60 * 24 * 24);

  res.status(201).json({
    order: result,
  });
};
// 取消订单
const cancelOrder = async (req, res) => {
  const id = req.params.id;

  // 更新订单状态
  const result = await order.updateOne(
    { _id: id },
    {
      status: 0,
    }
  );

  // 更新商品库存
  await goods.updateOne({ _id: result.goodsId }, { num: 1 });
  res.status(204).send();
};
// 获取订单列表
const getOrderList = async (req, res) => {
  let { conditions, fields, options } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  Object.keys(conditions).forEach((key) => {
    if (key === "buyer" || key === "seller") return;
    conditions[key] = { $regex: conditions[key], $options: "$i" };
  });

  const orderList = await order.find(conditions, fields, options);

  const result = await Promise.all(
    orderList.map(async (item) => {
      const ret = Object.assign({}, item._doc);
      const seller = await user.findOne({ _id: item.seller });
      const buyer = await user.findOne({ _id: item.buyer });
      return {
        id: item._id,
        ...ret,
        seller: {
          id: seller._id,
          profilePhoto: seller.profilePhoto,
          userName: seller.userName,
        },
        buyer: {
          id: buyer._id,
          profilePhoto: buyer.profilePhoto,
          userName: buyer.userName,
        },
      };
    })
  );

  res.status(200).json({
    orders: result,
    count: result.length,
  });
};
// 获取订单详情
const getOrderInfo = async (req, res) => {
  const orderId = req.params.id;

  const orderInfo = await order.findOne({
    _id: orderId,
  });

  const seller = await user.findOne({ _id: orderInfo.seller });
  const buyer = await user.findOne({ _id: orderInfo.buyer });

  let result = Object.assign({}, orderInfo._doc);

  result.sellerName = seller.userName;
  result.buyerName = buyer.userName;

  if (result.status === 4) {
    const evalu = await orderEvaluation.findOne({ orderId });

    result.evaluation = {
      buyer: evalu && !!evalu.buyer.id,
      seller: evalu && !!evalu.seller.id,
    };
  }

  res.status(200).json({
    order: result,
  });
};

const deleteOrder = async (req, res) => {
  const id = req.params.id;

  await order.remove({ _id: id });

  res.status(204).send();
};

const addLogistic = async (req, res) => {
  const id = req.params.id;
  const { types, no } = req.body;
  const result = await order.update(
    { _id: id },
    {
      logistic: { types, no },
      status: 3,
    }
  );

  res.status(203).json({
    data: result,
  });
};

const confirmOrder = async (req, res) => {
  const id = req.params.id;

  await order.updateOne(
    { _id: id },
    {
      status: 4,
    }
  );

  res.status(200).send();
};

// 根据当前时间和随机数生成流水号
const orderCode = () => {
  var orderCode = "";
  for (
    var i = 0;
    i < 6;
    i++ //6位随机数，用以加在时间戳后面。
  ) {
    orderCode += Math.floor(Math.random() * 10);
  }
  orderCode = new Date().getTime() + orderCode; //时间戳，用来生成订单号。
  return orderCode;
};

const pay = async (req, res) => {
  const orderId = req.body.orderId;

  const orderInfo = await order.findOne({ _id: orderId });

  if (orderInfo.status == 0) {
    res.status(200).json({
      status: "fail",
      message: "订单已取消",
    });
  } else if (orderInfo.status > 1) {
    res.status(200).json({
      status: "fail",
      message: "订单已支付",
    });
  }

  await order.update(
    { _id: orderId },
    {
      status: 2,
    }
  );

  res.status(200).json({
    status: "success",
    message: "订单支付成功",
  });
};

const updateOrder = async (req, res) => {
  const id = req.params.id;
  const orderInfo = req.body;

  const result = await order.updateOne({ _id: id }, orderInfo);

  res.status(203).json({ result });
};

module.exports = {
  createOrder,
  cancelOrder,
  getOrderList,
  getOrderInfo,
  deleteOrder,
  addLogistic,
  confirmOrder,
  updateOrder,
  pay,
};
