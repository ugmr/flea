const { CError, ERROR } = require("../libs/error");
const { user, relation } = require("../model/mongo");

// 关注
const setup = async (req, res) => {
  // 获取参数
  let fromId;
  if (my) fromId = req.token.id;
  else fromId = req.params.id;
  const toId = req.body.to;

  // 验证参数是否正确
  if (fromId === toId) throw new CError(ERROR.DATA_INVALID, "参数错误");
  const r1 = await user.findOne({ _id: toId });
  const r2 = await user.findOne({ _id: fromId });
  console.log(r1, r2);
  if (!r1 || !r2) throw new CError(ERROR.DATA_NOT_FOUND, "用户不存在");

  // 查询是否已经被关注
  const exist1 = await relation.findOne({
    fromId: toId,
    toId: fromId,
    status: true,
  });
  const exist2 = await relation.findOne({ fromId: fromId, toId: toId });
  if (exist1 || exist2) throw new CError(ERROR.DATA_EXISTED, "关系已存在");

  const exist = await relation.findOne({
    fromId: toId,
    toId: fromId,
    status: false,
  });

  // 关注
  let result;
  if (exist) {
    result = await relation.update(
      { fromId: toId, toId: fromId },
      { status: true }
    );
  }
  result = await relation.create({ fromId: fromId, toId: toId, status: false });

  // 返回
  res.status(201).json({
    result: result,
  });
};

// 取消关注
const cancel = async (req, res) => {
  // 获取参数
  let fromId;
  if (my) fromId = req.token.id;
  else if (req.params.id) fromId = req.params.id;

  const toId = req.params.tid;
  // 验证参数是否正确
  if (!fromId || !toId || fromId === toId)
    throw new CError(ERROR.DATA_INVALID, "参数错误");
  const r1 = await user.findOne({ _id: toId });
  const r2 = await user.findOne({ _id: fromId });
  if (!r1 || !r2) throw new CError(ERROR.DATA_NOT_FOUND, "用户不存在");

  // 查询是否已经被关注
  const exist1 = await relation.findOne({
    fromId: toId,
    toId: fromId,
    status: true,
  });
  const exist2 = await relation.findOne({ fromId: fromId, toId: toId });
  if (!exist1 && !exist2) throw new CError(ERROR.DATA_NOT_FOUND, "关系不存在");

  if (exist1) {
    await relation.update({ fromId: toId, toId: fromId, status: false });
  } else if (exist2) {
    await relation.remove({ _id: exist2._id });
  }

  // 返回
  res.status(204).end();
};

// 获取关注列表
const getFocus = async (req, res) => {
  // 获取参数
  let userId = req.params.id;

  // 验证用户是否存在
  const r1 = await user.findOne({ _id: userId });
  if (!r1) throw new CError(ERROR.DATA_NOT_FOUND, "用户不存在");
  // 查询数据库
  const result1 = await relation.find({ fromId: userId });
  const result2 = await relation.find({ toId: userId, status: true });
  let result = await Promise.all(
    result1.concat(result2).map(async (item) => {
      const u = await user.findOne({ _id: item.toId });

      return {
        id: item.id,
        userId: u._id,
        userName: u.userName,
        profilePhoto: u.profilePhoto,
      };
    })
  );
  console.log(result);
  // 返回
  res.status(200).json({
    count: result.length,
    list: result,
  });
};

// 获取粉丝列表
const getFollow = async (req, res) => {
  // 获取参数
  const userId = req.params.id;
  //
  const r1 = await user.findOne({ _id: userId });
  if (!r1) throw new CError(ERROR.DATA_NOT_FOUND, "用户不存在");

  const fl1 = await relation.find({ toId: userId });
  const fl2 = await relation.find({ fromId: userId, status: true });

  const result1 = await Promise.all(
    fl1.map(async (item) => {
      const u = await user.findOne({ _id: item.fromId });

      return {
        id: item._id,
        userId: u._id,
        userName: u.userName,
        profilePhoto: u.profilePhoto,
      };
    })
  );

  const result2 = await Promise.all(
    fl2.map(async (item) => {
      const u = await user.findOne({ _id: item.toId });

      return {
        id: item._id,
        userId: u._id,
        userName: u.userName,
        profilePhoto: u.profilePhoto,
      };
    })
  );
  const result = result1.concat(result2);
  console.log(result);
  // 返回
  res.status(200).json({
    status: "success",
    message: "获取粉丝列表成功",
    data: {
      count: result.length,
      list: result,
    },
  });
};

// 验证是否关注
const checkFocus = async (req, res) => {
  const { fromId, toId } = req.body;

  const result1 = await relation.find({ fromId, toId });
  const result2 = await relation.find({
    toId: fromId,
    fromId: toId,
    status: true,
  });

  let hasFocus;

  if (result1 || result2) hasFocus = true;
  else hasFocus = false;

  res.status(200).json({
    hasFocus,
  });
};

module.exports = {
  setup,
  cancel,
  getFocus,
  getFollow,
  checkFocus,
};
