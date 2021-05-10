const { post, user, userTopic, topic } = require("../model/mongo");
const { CError, ERROR } = require("../libs/error");

const getAllPosts = async (req, res) => {
  // 获取参数
  let { conditions, fields, options } = req.query;
  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");
  Object.keys(conditions).forEach((key) => {
    const value = conditions[key];
    if (key === "topicId" || key === "userId") {
      return;
    }
    conditions[key] = { $regex: value, $options: "$i" };
  });

  const posts = await post.find(conditions, fields, options);
  const result = await Promise.all(
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

  const count = await post.count(conditions);

  res.status(200).json({
    posts: result,
    count,
  });
};

const getPostInfo = async (req, res) => {
  const id = req.params.id;
  const postInfo = await post.findOne({ _id: id });
  const userInfo = await user.findOne({ _id: postInfo.userId });
  await post.updateOne({ _id: id }, { view: postInfo.view + 1 });

  let result = Object.assign({}, postInfo._doc);

  result.user = {
    id: userInfo._id,
    profilePhoto: userInfo.profilePhoto,
    userName: userInfo.userName,
  };

  res.status(200).json({
    post: result,
  });
};

const publishPost = async (req, res) => {
  const postInfo = req.body;

  const result = await post.create(postInfo);

  res.status(201).json({ post: result });
};

const updatePost = async (req, res) => {
  const id = req.params.id;
  const postInfo = req.body;

  console.log(id, postInfo);

  const result = await post.updateOne({ _id: id }, postInfo);
  res.status(203).json({
    post: result,
  });
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  await post.findOneAndDelete({ _id: postId });

  res.status(204).send();
};

module.exports = {
  getAllPosts,
  getPostInfo,
  publishPost,
  deletePost,
  updatePost,
};
