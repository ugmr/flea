const mongoose = require("mongoose");
const config = require("../config/db").mongodb;
const logger = require("../libs/log4j")("mongodb");

logger.debug(config.url);

// 连接mongodb
mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false, // 使用原生的FindAndModify
  promiseLibrary: global.Promise, // 使用原生Promise
  poolSize: 10, //设置最大连接数
  bufferMaxEntries: false, //禁止使用缓存
});

const connection = mongoose.connection;
connection.once("open", () => {
  logger.info("mongodb连接成功...");
});
connection.on("error", (err) => {
  logger.error("mongodb连接出错: " + err);
  process.exit(1);
});

const settingSchema = require("./schemas/setting");
const advertSchema = require("./schemas/advert");
const blacklistSchema = require("./schemas/blacklist");
const categorySchema = require("./schemas/category");
const collectSchema = require("./schemas/collect");
const deliverySchema = require("./schemas/delivery");
const goodsSchema = require("./schemas/goods");
const goodsCommentSchema = require("./schemas/goodsComment");
const messageSchema = require("./schemas/message");
const noticeSchema = require("./schemas/notice");
const offlineSchema = require("./schemas/offline");
const orderSchema = require("./schemas/order");
const orderEvaluationSchema = require("./schemas/orderEvaluation");
const permissionSchema = require("./schemas/permission");
const postSchema = require("./schemas/post");
const postCommentSchema = require("./schemas/postComment");
const relationSchema = require("./schemas/relation");
const roleSchema = require("./schemas/role");
const topicSchema = require("./schemas/topic");
const userSchema = require("./schemas/user");
const userTopicSchema = require("./schemas/userTopic");

exports.setting = mongoose.model("setting", settingSchema);
exports.advert = mongoose.model("advert", advertSchema);
exports.blacklist = mongoose.model("blacklist", blacklistSchema);
exports.category = mongoose.model("category", categorySchema);
exports.collect = mongoose.model("collect", collectSchema);
exports.delivery = mongoose.model("delivery", deliverySchema);
exports.goods = mongoose.model("goods", goodsSchema);
exports.goodsComment = mongoose.model("goodsComment", goodsCommentSchema);
exports.message = mongoose.model("message", messageSchema);
exports.notice = mongoose.model("notice", noticeSchema);
exports.offline = mongoose.model("offline", offlineSchema);
exports.order = mongoose.model("order", orderSchema);
exports.orderEvaluation = mongoose.model(
  "orderEvaluation",
  orderEvaluationSchema
);
exports.permission = mongoose.model("permission", permissionSchema);
exports.post = mongoose.model("post", postSchema);
exports.postComment = mongoose.model("postComment", postCommentSchema);
exports.relation = mongoose.model("relation", relationSchema);
exports.role = mongoose.model("role", roleSchema);
exports.topic = mongoose.model("topic", topicSchema);
exports.user = mongoose.model("user", userSchema);
exports.userTopic = mongoose.model("userTopic", userTopicSchema);
