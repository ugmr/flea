const { orderEvaluation, order, user } = require("../model/mongo");
const { CError, ERROR } = require("../libs/error");

// 获取用户评价
const getByUser = async (req, res) => {
  // 获取参数
  const userId = req.params.id;
  // 查询结果
  const result = await orderEvaluation.find(
    { "seller.id": userId },
    {
      buyer: 1,
    }
  );
  // 返回
  res.status(200).json({
    count: result.length,
    list: result,
  });
};
// 获取订单评价
const get = async (req, res) => {
  // 获取参数
  const orderId = req.params.id;
  // 查询结果
  const result = await orderEvaluation.findOne({ orderId: orderId });

  const orderInfo = await order.findOne(
    { _id: orderId },
    { buyer: 1, seller: 1 }
  );

  const buyer = await user.findOne(
    { _id: orderInfo.buyer },
    { profilePhoto: 1, userName: 1 }
  );

  const seller = await user.findOne(
    { _id: orderInfo.seller },
    { profilePhoto: 1, userName: 1 }
  );

  // 返回
  res.status(200).json({
    evaluation: result,
    buyer,
    seller,
  });
};
// 添加评价
const add = async (req, res) => {
  // 获取参数
  let info = req.body;
  const orderId = req.params.id;

  const orderInfo = await order.findOne({ _id: orderId });

  const isSeller = orderInfo.seller == info.id;
  const evaluation = {
    orderId: orderId,
  };

  if (isSeller)
    evaluation.seller = {
      id: info.id,
      score: info.score,
      content: info.content,
    };
  else
    evaluation.buyer = {
      id: info.id,
      score: info.score,
      content: info.content,
    };

  let result = null;
  const exist = await orderEvaluation.findOne({ orderId: orderId });
  if (exist) {
    await orderEvaluation.updateOne({ _id: exist._id }, evaluation);
    const result = await orderEvaluation.findOne({ _id: exist._id });
    await order.updateOne({ _id: orderId }, { status: 5 });
    const buyerInfo = await user.findOne(
      { _id: orderInfo.buyer },
      { credit: 1 }
    );
    console.log(result);
    const sellerInfo = await user.findOne(
      { _id: orderInfo.seller },
      { credit: 1 }
    );
    await user.updateOne(
      { _id: exist.buyer.id },
      { credit: buyerInfo.credit + (result.buyer.score - 3) }
    );
    await user.updateOne(
      { _id: exist.seller.id },
      { credit: sellerInfo.credit + (result.seller.score - 3) }
    );
  } else {
    result = await orderEvaluation.create(evaluation);
  }

  // 返回
  res.status(201).json({
    evaluation: result,
  });
};

module.exports = {
  add,
  get,
  getByUser,
};
