const { CError, ERROR } = require('../libs/error');
const { user } = require("../model/mongo")
// 添加评论
const publishComment = (model, comment) => {
  return async (req, res) => {
    const info = req.body;

    const result = await comment.create(info);

    res.status(201).json({
      comment: result
    });
  };
}

// 删除评论
const deleteComment = (model, comment) => {
  return async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;

    const exist = await model.findOne({_id: id});
    if(!exist) throw new CError(ERROR.DATA_NOT_FOUND, '数据不存在');
    // 删除评论
    await comment.remove({_id: cid, id: id});
    res.status(204).end();
  }
}

// 获取评论列表
const getAllComments = (model, comment) => {
  return async (req, res) => {
    const id = req.params.id;

    // 查询数据库
    let result = await comment.find({id, parentId: null});

    result = await Promise.all(result.map(async (item) => {
      const u = await user.findOne({_id: item.userId});
      const children = await comment.find({parentId: item._id});
      const childrenList  = await Promise.all(children.map(async (child) => {
        const childUser = await user.findOne({_id: child.userId});
        return {
          id: child._id,
          goodsId: child.goodsId,
          parentId: child.parentId,
          content: child.content,
          createdAt: child.createdAt,
          user: {
            id: childUser._id,
            profilePhoto: childUser.profilePhoto,
            userName: childUser.userName
          },
        }
      }))

      return {
        id: item._id,
        goodsId: item.goodsId,
        parentId: item.parentId,
        content: item.content,
        createdAt: item.createdAt,
        user: {
          id: u._id,
          profilePhoto: u.profilePhoto,
          userName: u.userName
        },
        children: childrenList
      }
    }));
    
    const count = await comment.count({id});
    
    res.status(200).json({
      count,
      comments: result
    });
  };
}

module.exports = {
  publishComment,
  deleteComment,
  getAllComments
}