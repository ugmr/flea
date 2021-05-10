const { CError, ERROR } = require("../libs/error");
const { user, collect, goods } = require("../model/mongo");

const getCollectList = async (req, res) => {
  const userId = req.params.id;

  const goodsIdList = await collect.find({
    userId,
  });

  const result = await Promise.all(
    goodsIdList.map(async (item) => {
      const userInfo = await user.findOne({ _id: item.userId });

      const goodsInfo = await goods.findOne({ _id: item.targetId });

      const count = await collect.count({ targetId: item.targetId });

      return {
        _id: item._id,
        user: {
          _id: userInfo._id,
          profilePhoto: userInfo.profilePhoto,
          userName: userInfo.userName,
        },
        goods: goodsInfo,
        collect: count,
      };
    })
  );

  res.status(200).json({
    list: result,
    count: result.length,
  });
};

const cancelCollect = async (req, res) => {
  const userId = req.token.id;
  const goodsId = req.params.gid;

  console.log(
    await collect.findOne({
      userId,
      targetId: goodsId,
    })
  );

  const result = await collect.remove({
    userId,
    targetId: goodsId,
  });

  res.status(204).send();
};

const addCollect = async (req, res) => {
  const { userId, goodsId } = req.body;

  const goodsInfo = await goods.findOne({ _id: goodsId });

  if (!goodsInfo) throw new CError(ERROR.BAD_REQUEST, "商品不存在");

  const result = await collect.create({
    userId: userId,
    targetId: goodsId,
  });

  res.status(201).json({ collect: result });
};

module.exports = {
  getCollectList,
  cancelCollect,
  addCollect,
};
