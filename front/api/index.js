import axios, { common, user } from "./request.js";
import { mapConfig, kdniaoConfig, kd100Config } from "../config";
import querystring from "querystring";
import md5Hex from "md5-hex";

export function getParams(CustomerName, OrderCode, ShipperCode, LogisticCode) {
  //请求接口指令
  const RequestType = "1002"; //免费即时查询接口指令1002
  // 组装应用级参数
  const RequestData = {
    // CustomerName: CustomerName,
    // OrderCode: OrderCode,
    ShipperCode: ShipperCode,
    LogisticCode: LogisticCode,
  };
  const DataSign = Buffer.from(
    md5Hex(JSON.stringify(RequestData) + kdniaoConfig.apiKey)
  ).toString("base64");
  const reqParams = {
    RequestType,
    EBusinessID: kdniaoConfig.eBusinessID,
    DataSign,
    RequestData: JSON.stringify(RequestData),
    DataType: 2,
  };
  return reqParams;
} // 组装系统级参数

// 第三方API 高德地图
export const geocode = ({ location }) => {
  return axios.get("https://restapi.amap.com/v3/geocode/regeo", {
    params: { location, key: mapConfig.key },
  });
};

export const regeo = ({ address }) => {
  return axios.get("https://restapi.amap.com/v3/geocode/geo", {
    params: { address, key: mapConfig.key },
  });
};

// 物流查询
export const getLogistic = (logistic) => {
  return axios.post(kdniaoConfig.url, querystring.stringify(logistic), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const getCode = ({ mobile }) => {
  return common.post("/sms", { mobile });
};

export const checkCode = ({ mobile, code, type }) => {
  return common.post("/check_sms", { mobile, code, type });
};

export const checkMobile = ({ mobile }) => {
  return common.post("/check_mobile", { mobile });
};

export const checkUsername = ({ userName }) => {
  return common.post("/check_username", { userName });
};

export const resetPassword = ({ mobile, password }) => {
  return common.post("/reset", { mobile, password });
};

// 注册
export const register = ({ mobile, password, userName }) => {
  return user.post("/signin", { mobile, password, userName });
};

// 登陆注销
export const login = ({ mobile, password }) => {
  return user.post("/login", { mobile, password });
};

export const logout = () => {
  return user.post("/logout");
};

export const logoff = () => {
  return user.post("/logoff");
};

export const updatePassword = (password) => {
  return user.put("/password", { password });
};

export const getSelfInfo = (query) => {
  return user.get("/my", { params: query });
};

export const getUserList = (query) => {
  return user.get("/user", { params: query });
};

export const getUserInfo = (id) => {
  return user.get("/user/" + id);
};

export const updateUserInfo = (info) => {
  return user.put("/my/profile", info);
};

// 收货地址
export const getDeliveryList = () => {
  return user.get("/delivery");
};

export const addDelivery = (delivery) => {
  return user.post("/delivery", delivery);
};

export const editDelivery = (id, delivery) => {
  return user.put("/delivery/" + id, delivery);
};

export const deleteDelivery = (id) => {
  return user.delete("/delivery/" + id);
};

// 关注
export const getFocusList = (id) => {
  return user.get(`/user/${id}/focus`);
};

export const focus = (id) => {
  return user.post(`/my/focus`, { to: id });
};

export const cancelFocus = (id) => {
  return user.delete(`/my/focus/` + id);
};

export const checkFocus = (data) => {
  return user.post("/check_focus", data);
};

export const getFollowList = (id) => {
  return user.get(`/user/${id}/follow`);
};

// 黑名单
export const getBlackList = () => {
  return user.get("/blacklist");
};

export const cancelBlackList = (id) => {
  return user.delete("/blacklist/" + id);
};

export const addToBlacklist = (id) => {
  return user.post("/blacklist/" + id);
};

// 获取轮播信息
export const getAdvert = () => {
  return user.get("/advert");
};

export const getSortList = (query) => {
  return user.get("/category", { params: query });
};

// 发布商品
export const publish = (goodsInfo) => {
  return user.post("/goods", goodsInfo);
};

export const editGoodsInfo = (goodsId, goodsInfo) => {
  return user.put("/post/" + goodsId, goodsInfo);
};

export const getGoodsList = (query) => {
  return user.get("/goods", { params: query });
};

export const getGoodsInfo = (id) => {
  return user.get("/goods/" + id);
};

export const updateGoodsInfo = (id, info) => {
  return user.put("/goods/" + id, info);
};

export const deleteGoods = (id) => {
  return user.delete("/goods/" + id);
};

export const getGoodsComments = (id) => {
  return user.get(`/goods/${id}/comment`);
};

export const publishComment = (id, comment) => {
  return user.post(`/goods/${id}/comment`, comment);
};

export const getCollectList = (id) => {
  return user.get(`/user/${id}/collect`);
};

export const collectGoods = (data) => {
  return user.post("/my/collect", data);
};

export const cancelCollect = (goodsId) => {
  return user.delete(`/my/collect/${goodsId}`);
};

// 创建订单
export const createOrder = (data) => {
  return user.post("/order", data);
};

export const deleteOrder = (id) => {
  return user.delete("/order/" + id);
};

export const cancelOrder = (id) => {
  return user.post("/order/" + id + "/cancel");
};

export const getOrderList = (query) => {
  console.log(query);
  return user.get("/order", { params: query });
};

export const getOrderInfo = (id) => {
  return user.get("/order/" + id);
};

export const updateLogistic = (id, logistic) => {
  return user.put("/order/" + id + "/logistic", logistic);
};

export const pay = (orderId) => {
  return user.post("/pay", { orderId });
};

export const confirmOrder = (orderId) => {
  return user.post("/order/" + orderId + "/confirm");
};

// 话题相关

// 获取话题信息
export const getTopic = (topicId) => {
  return user.get("/topic/" + topicId);
};

export const getTopicList = (query) => {
  return user.get("/topic", { params: query });
};

export const createTopic = (data) => {
  return user.post("/topic", data);
};

export const getFocusTopic = () => {
  return user.get("/my/topic");
};

export const focusTopic = (topicId) => {
  return user.post("/my/topic", { topicId });
};

export const cancelFocusTopic = (topicId) => {
  return user.delete("/my/topic/" + topicId);
};
// 帖子
export const createPost = (data) => {
  return user.post("/post", data);
};

export const getPostList = (query) => {
  return user.get("/post", { params: query });
};

export const getPostInfo = (id) => {
  return user.get("/post/" + id);
};

export const getPostComments = (id) => {
  return user.get("/post/" + id + "/comment");
};

export const publishPostComment = (id, data) => {
  return user.post("/post/" + id + "/comment", data);
};

export const addEvaluation = (id, data) => {
  return user.post("/order/" + id + "/evaluation", data);
};

export const getEvaluation = (orderId) => {
  return user.get("/order/" + orderId + "/evaluation");
};

export const getUserEvaluation = (userId) => {
  return user.get("/user/" + userId + "evaluation");
};

export const search = (query) => {
  return user.get("/search", { params: query });
};

export const getRecommendGoods = (query) => {
  return user.get("/recommend/goods", { params: query });
};
