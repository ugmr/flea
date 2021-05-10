const express = require("express");
const router = express.Router();

const {
  goods,
  goodsComment,
  post,
  postComment,
  delivery,
  relation,
  blacklist,
} = require("../model/mongo");

const baseController = require("../controller/baseController");
const userController = require("../controller/userController");
const advertController = require("../controller/advertController");
const logController = require("../controller/logController");
const categoryController = require("../controller/categoryController");
const goodsController = require("../controller/goodsController");
const commentController = require("../controller/commentController");
const relationController = require("../controller/relationController");
const topicController = require("../controller/topicController");
const postController = require("../controller/postController");
const collectController = require("../controller/collectController");
const orderController = require("../controller/orderController");
const evaluationController = require("../controller/evaluationController");
const deliveryController = require("../controller/deliveryController");
/**
 * 登录登出
 */
// 用户登陆
router.post("/login", logController.login);
// 用户登出
router.post("/logout", logController.logout);

/**
 * 用户信息
 */
// 用户注册
router.post("/signin", userController.signin);
// 用户注销
router.post("/signoff", userController.signoff);

// 获取用户列表
router.get("/user", userController.getUserList);
// 获取用户信息
router.get("/user/:id", userController.getBaseInfo);
// 验证是否关注
router.post("/check_focus", relationController.checkFocus);

// 修改用户密码
router.put("/password", userController.updatePassword);
// 修改用户个人信息
router.put("/my/profile", userController.updateProfile);

/**
 * 用户关系
 */
// 关注用户
router.post("/my/focus", relationController.setup);
// 取消关注
router.delete("/my/focus/:tid", relationController.cancel);
// 获取关注用户列表
router.get("/user/:id/focus", relationController.getFocus);
// 获取粉丝列表
router.get("/user/:id/follow", relationController.getFollow);

// // 获取所有评价信息
router.get("/user/:id/evaluation", evaluationController.getByUser);

// 获取推广列表
router.get("/advert", advertController.getAllAdvert);
// 获取分类列表
router.get("/category", categoryController.getAllCategory);

/**
 * 用户收货地址
 */
// 获取用户收货地址
router.get("/delivery", deliveryController.getDeliveryList);
router.post("/delivery", deliveryController.addDelivery);
router.put("/delivery/:id", deliveryController.updateDelivery);
router.delete("/delivery/:id", deliveryController.deleteDelivery);

/**
 * 商品相关
 */
// 获取商品列表
router.get("/goods", goodsController.getGoodsList);
// 获取商品详情
router.get("/goods/:id", goodsController.getGoodsInfo);
// 发布商品
router.post("/goods", goodsController.publishGoods);
// 修改我的商品
router.put("/goods/:id", goodsController.updateGoods);
// 删除我的商品
router.delete("/goods/:id", goodsController.deleteGoods);
// 获取商品评论
router.get(
  "/goods/:id/comment",
  commentController.getAllComments(goods, goodsComment)
);
// 发布商品评论
router.post(
  "/goods/:id/comment",
  commentController.publishComment(goods, goodsComment)
);
// 获取收藏列表
router.get("/user/:id/collect", collectController.getCollectList);
// 添加收藏
router.post("/my/collect", collectController.addCollect);
// 取消收藏
router.delete("/my/collect/:gid", collectController.cancelCollect);

// 获取用户订单
router.get("/order", orderController.getOrderList);
// 获取订单详情
router.get("/order/:id", orderController.getOrderInfo);
// 下单
router.post("/order", orderController.createOrder);
// 支付
router.post("/pay", orderController.pay);
// 取消订单
router.post("/order/:id/cancel", orderController.cancelOrder);
// 修改物流信息
router.put("/order/:id/logistic", orderController.addLogistic);
// 删除订单
router.delete("/order/:id", orderController.deleteOrder);
// 确认收货
router.post("/order/:id/confirm", orderController.confirmOrder);

// 获取订单评价信息
router.get("/order/:id/evaluation", evaluationController.get);
// 发布订单评价
router.post("/order/:id/evaluation", evaluationController.add);

/**
 * 话题相关
 */

// 添加话题
router.post("/topic", topicController.addTopic);
// 获取话题列表
router.get("/topic", topicController.getTopicList);
// 获取话题详情
router.get("/topic/:id", topicController.getTopic);

// 获取关注的话题
router.get("/my/topic", topicController.getFocusTopic);
// 关注话题
router.post("/my/topic", topicController.focusTopic);
// 取消关注话题
router.delete("/my/topic/:topicId", topicController.cancelFocus);

// 获取帖子列表
router.get("/post", postController.getAllPosts);
// 获取帖子详情
router.get("/post/:id", postController.getPostInfo);
// 发布帖子
router.post("/post", postController.publishPost);
// 删除帖子
router.delete("/post/:id", postController.deletePost);

// 获取帖子评论信息
router.get(
  "/post/:id/comment",
  commentController.getAllComments(post, postComment)
);
// 回复帖子
router.post(
  "/post/:id/comment",
  commentController.publishComment(post, postComment)
);

router.get("/search", goodsController.search);
router.get("/recommend/goods", goodsController.getRecommendGoods);

module.exports = router;
