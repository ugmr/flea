const { post, goods, user, order, topic } = require("../model/mongo");
const { today } = require("../libs/date");
const redis = require("../model/redis");
const { CError, ERROR } = require("../libs/error");
const { promisify } = require("util");

const select = promisify(redis.origin.select).bind(redis.origin);
const zrevrange = promisify(redis.origin.zrevrange).bind(redis.origin);
const zscore = promisify(redis.origin.zscore).bind(redis.origin);

// 获取首页新增数据
const getTips = async (req, res) => {
  const to = today();
  const tomo = today(1);

  const goodsNum = await goods.count({
    createdAt: { $gt: to, $lt: tomo },
    status: 1,
  });

  const newGoodsNum = await goods.count({
    createdAt: { $gt: to, $lt: tomo },
    status: 0,
  });

  const postNum = await post.count({
    createdAt: { $gt: to, $lt: tomo },
  });

  const userNum = await user.count({
    createdAt: { $gte: to, $lt: tomo },
  });

  res.status(200).json({
    goodsNum,
    newGoodsNum,
    postNum,
    userNum,
  });
};

// 一周的新增用户量
const getNewUser = async (req, res) => {
  let ret = [];

  for (let i = 6; i >= 0; i--) {
    const result = await user.count({
      createdAt: { $gt: today(-i), $lt: today(1 - i) },
    });
    ret.push(result);
  }

  res.status(200).json({
    newUser: ret,
  });
};

// 一周内的新增订单数
const getNewOrder = async (req, res) => {
  let ret = [];

  for (let i = 6; i >= 0; i--) {
    const result = await order.count({
      createdAt: { $gt: today(-i), $lt: today(1 - i) },
    });
    ret.push(result);
  }

  res.status(200).json({
    newOrder: ret,
  });
};

const getHotSearch = async (req, res) => {
  // 返回有序集中指定区间内的成员，通过索引，分数从高到低
  const { limit = 100, skip = 0 } = req.body;
  await select(redis.types.SEARCH);
  let result = await zrevrange("search", skip, skip + limit);

  result = await Promise.all(
    result.map(async (keyword) => {
      const score = await zscore("search", keyword);
      return {
        keyword,
        score,
      };
    })
  );

  res.status(200).json({
    result: result,
    count: result.length,
  });
};

const getHotPost = async (req, res) => {
  let result = await post.find(null, null, {
    sort: { view: -1 },
    limit: 100,
  });

  result = await Promise.all(
    result.map(async (p) => {
      const u = await user.findOne({ _id: p.userId }, { userName: 1 });
      const t = await topic.findOne({ _id: p.topicId }, { name: 1 });

      const ret = Object.assign({}, p._doc);
      ret.user = u;
      ret.topic = t;
      return ret;
    })
  );

  res.status(200).json({
    count: result.length,
    posts: result,
  });
};

module.exports = {
  getTips,
  getNewUser,
  getNewOrder,
  getHotPost,
  getHotSearch,
};
