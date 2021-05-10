const { topic, userTopic, post } = require("../model/mongo");
const { CError, ERROR } = require("../libs/error");

const getTopicList = async (req, res) => {
  let { conditions = "{}", fields = "{}", options = "{}" } = req.query;

  conditions = JSON.parse(conditions);
  fields = JSON.parse(fields);
  options = JSON.parse(options);

  if (typeof conditions.name !== "undefined") {
    conditions.name = { $regex: conditions.name, $options: "$i" };
  }

  const topics = await topic.find(conditions, fields, options);

  const result = await Promise.all(
    topics.map(async (item) => {
      const postNum = await post.count({ topicId: item._id });

      return {
        _id: item._id,
        cover: item.cover,
        name: item.name,
        intro: item.intro,
        postNum: postNum,
      };
    })
  );

  const count = await topic.count({ conditions });

  res.status(200).json({
    topics: result,
    count,
  });
};

const getTopic = async (req, res) => {
  const topicId = req.params.id;

  const result = {
    topic: {},
    isFocus: false,
  };

  const topicInfo = await topic.findOne({ _id: topicId });
  result.topic = topicInfo;
  // 计算关注人数
  const focus = await userTopic.count({ targetId: topicId });
  result.focus = focus;
  // 当前用户是否关注
  if (req.token) {
    const isFocus = await userTopic.findOne({
      targetId: topicId,
      userId: req.token.id,
    });
    console.log(isFocus);
    result.isFocus = !!isFocus;
  }
  // 贴子数
  result.posts = await post.count({ topicId: topicId });

  res.status(200).json(result);
};

const getFocusTopic = async (req, res) => {
  const id = req.token.id;

  const topics = await userTopic.find({ userId: id });

  const result = await Promise.all(
    topics.map(async (item) => {
      const result = await topic.findOne({ _id: item.targetId });
      let ret = Object.assign({}, result._doc);
      const num = await post.count({ topicId: item.targetId });
      ret.postNum = num;
      return ret;
    })
  );

  res.status(200).json({
    topics: result,
    count: result.length,
  });
};

const focusTopic = async (req, res) => {
  const id = req.token.id;
  const topicId = req.body.topicId;

  const exist = await userTopic.findOne({
    userId: id,
    targetId: topicId,
  });

  if (exist) throw new CError(ERROR.DATA_EXISTED, "数据已存在");

  await userTopic.create({
    userId: id,
    targetId: topicId,
  });

  res.status(200).json({
    message: "成功",
  });
};

const cancelFocus = async (req, res) => {
  const id = req.token.id;
  const topicId = req.params.topicId;

  console.log(id, topicId);

  await userTopic.remove({
    userId: id,
    targetId: topicId,
  });

  res.status(204).send();
};

const addTopic = async (req, res) => {
  const topicInfo = req.body;

  const result = await topic.create(topicInfo);

  res.status(201).json({ topic: result });
};

const updateTopic = async (req, res) => {
  const id = req.params.id;
  const topicInfo = req.body;
  const result = await topic.updateOne({ _id: id }, topicInfo);
  res.status(203).json({
    topic: result,
  });
};
const deleteTopic = async (req, res) => {
  const id = req.params.id;

  await topic.findOneAndDelete({ _id: id });
  await post.deleteMany({ topicId: id });

  res.status(204).send();
};
module.exports = {
  getTopic,
  getTopicList,
  getFocusTopic,
  focusTopic,
  cancelFocus,
  addTopic,
  updateTopic,
  deleteTopic,
};
