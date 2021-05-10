const { goods, user, collect, category, post } = require("../model/mongo");
const { today } = require("../libs/date");
const redis = require("../model/redis");
const { CError, ERROR } = require("../libs/error");
const { promisify } = require("util");

const select = promisify(redis.origin.select).bind(redis.origin);
const zadd = promisify(redis.origin.zadd).bind(redis.origin);
const ttl = promisify(redis.origin.ttl).bind(redis.origin);
const zscore = promisify(redis.origin.zscore).bind(redis.origin);
const zincrby = promisify(redis.origin.zincrby).bind(redis.origin);
const expire = promisify(redis.origin.expire).bind(redis.origin);

const getGoodsList = async (req, res) => {
  // 获取参数
  let { conditions, fields, options } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  if (typeof conditions.name !== "undefined") {
    conditions.name = { $regex: conditions.name, $options: "$i" };
  }
  console.log(conditions);
  let result = await goods.find(conditions, fields, options);

  result = await Promise.all(
    result.map(async (item) => {
      let ret = Object.assign({}, item["_doc"]);
      const u = await user.findOne(
        { _id: item.userId },
        {
          userName: 1,
          profilePhoto: 1,
          credit: 1,
        }
      );
      const c = await category.findOne({ _id: item.category });

      const collectNum = await collect.count({ targetId: item._id });

      ret.user = u;
      ret.category = c;
      ret.collect = collectNum;
      return ret;
    })
  );

  const count = await goods.count({ pass: true, num: { $gt: 0 } });

  res.status(200).json({
    goods: result,
    count,
  });
};

const getGoodsInfo = async (req, res) => {
  const id = req.params.id;

  const goodsInfo = await goods.findOne({ _id: id });

  if (!goodsInfo) {
    throw new CError(ERROR.DATA_NOT_FOUND, "商品不存在");
  }

  const u = await user.findOne({ _id: goodsInfo.userId });

  let isCollect = false;
  if (req.token) {
    const result = await collect.findOne({
      userId: req.token.id,
      targetId: id,
    });
    if (result) isCollect = true;
  }

  const categoryInfo = await category.findOne({ _id: goodsInfo.category });

  const result = {
    id: goodsInfo._id,
    name: goodsInfo.name,
    userId: goodsInfo.userId,
    intro: goodsInfo.intro,
    introPhoto: goodsInfo.introPhoto,
    cover: goodsInfo.cover,
    category: {
      name: categoryInfo.name,
      id: categoryInfo._id,
    },
    num: goodsInfo.num,
    new: goodsInfo.new,
    price: goodsInfo.price,
    oldPrice: goodsInfo.oldPrice,
    freight: goodsInfo.freight,
    address: goodsInfo.address,
    pass: goodsInfo.pass,
    createdAt: goodsInfo.createdAt,
    isCollect: isCollect,
    user: {
      id: u._id,
      userName: u.userName,
      profilePhoto: u.profilePhoto,
      credit: u.credit,
    },
  };

  res.status(200).json({ goods: result });
};

const updateGoods = async (req, res) => {
  const goodsId = req.params.id;
  const goodsInfo = req.body;

  console.log(1);

  const result = await goods.findOneAndUpdate({ _id: goodsId }, goodsInfo);

  res.status(203).json({ goods: result });
};

const publishGoods = async (req, res) => {
  const goodsInfo = req.body;

  const result = await goods.create(goodsInfo);

  res.status(201).json({ goods: result });
};

const deleteGoods = async (req, res) => {
  const id = req.params.id;

  await goods.remove({ _id: id });
  await collect.remove({ targetId: id });

  res.status(204).end();
};

const search = async (req, res) => {
  // 获取参数
  let { keyword, type } = req.query;
  if (type === "goods" || type === "post") {
    await select(redis.types.SEARCH);
    const member = await zscore("search", keyword);

    if (member) {
      await zincrby("search", 1, keyword);
    } else {
      await zadd("search", 1, keyword);
    }
    const exp = await ttl("search");
    const expireTime = parseInt(
      (today(1).getTime() - new Date().getTime()) / 1000
    );
    if (exp === -1) {
      console.log(expireTime);
      await expire("search", expireTime);
    }
  }

  let result = null;

  if (type === "goods") {
    conditions = {
      name: {
        $regex: keyword,
        $options: "$i",
      },
      num: { $gt: 0 },
      status: 1,
    };
    result = await goods.find(conditions);
    result = await Promise.all(
      result.map(async (item) => {
        const u = await user.findOne({ _id: item.userId });
        return {
          id: item._id,
          cover: item.cover,
          name: item.name,
          price: item.price,
          oldPrice: item.oldPrice,
          freight: item.freight,
          status: item.status,
          user: {
            id: u._id,
            userName: u.userName,
            profilePhoto: u.profilePhoto,
            credit: u.credit,
          },
        };
      })
    );
  } else if (type === "post") {
    let conditions = {
      content: {
        $regex: keyword,
        $options: "$i",
      },
    };

    const posts = await post.find(conditions);
    result = await Promise.all(
      posts.map(async (item) => {
        const userInfo = await user.findOne(
          { _id: item.userId },
          {
            userName: 1,
            profilePhoto: 1,
          }
        );

        const topicInfo = await topic.findOne({ _id: item.topicId });
        return {
          id: item._id,
          topicId: item.topicId,
          topicName: topicInfo.name,
          photo: item.photo,
          content: item.content,
          createdAt: item.createdAt,
          user: userInfo,
        };
      })
    );
  } else {
    throw new CError(ERROR.FORMAT_INVALID, "未知搜索类型");
  }
  res.status(200).json({
    result: result,
  });
};

const getRecommendGoods = async (req, res) => {
  // 获取参数
  let { longitude, latitude, limit, maxDistance, skip } = req.query;

  longitude = JSON.parse(longitude || "0");
  latitude = JSON.parse(latitude || "0");
  limit = JSON.parse(limit || "0");
  skip = JSON.parse(skip || "0");
  maxDistance = JSON.parse(maxDistance || "0");

  console.log(longitude, latitude, limit, skip, maxDistance);
  let result = await goods
    .find({
      location: {
        $near: [longitude, latitude],
        $maxDistance: maxDistance,
      },
    })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();

  console.log(result);

  result = await Promise.all(
    result.map(async (item) => {
      let ret = Object.assign({}, item);
      const u = await user.findOne(
        { _id: item.userId },
        {
          userName: 1,
          profilePhoto: 1,
          credit: 1,
        }
      );
      const c = await category.findOne({ _id: item.category });

      const collectNum = await collect.count({ targetId: item._id });

      ret.user = u;
      ret.category = c;
      ret.collect = collectNum;
      return ret;
    })
  );

  const count = await goods.count({ pass: true, num: { $gt: 0 } });

  res.status(200).json({
    goods: result,
    count,
  });
};

module.exports = {
  getGoodsList,
  getGoodsInfo,
  deleteGoods,
  publishGoods,
  updateGoods,
  getRecommendGoods,
  search,
};
