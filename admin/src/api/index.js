import { common, admin } from "./http";
// 上传图片
export const upload = (image) => {
  const formData = new FormData();
  formData.append("file", image, image.name);
  return common.post("/upload", formData, {
    headers: {
      "Content-Type": "application/form-data",
    },
  });
};
// 验证码
export const verify = (data) => common.post("/check_sms", data);
// 重制密码
export const reset = (data) => common.post("/reset", data);
// 登陆/登出
export const login = (info) => admin.post("/login", info);
export const logout = () => admin.post("/logout");

// 权限验证
export const checkPermission = (path) => {
  return admin.post("/check_permission", { path });
};

// 个人信息修改
export const getProfile = () => admin.get("/profile");
export const updateProfile = (profile) => admin.put("/profile", profile);
export const updatePassword = (password) => admin.put("/password", password);

// 首页信息获取
export const getTipsData = () => admin.get("/dashboard/tips");
export const getNewUser = () => admin.get("/dashboard/user");
export const getNewOrder = () => admin.get("/dashboard/order");

// 推广相关
export const getAdvertList = (query) => admin.get("/advert", { params: query });
export const addAdvert = (advert) => admin.post("/advert", advert);
export const updateAdvert = (advert) =>
  admin.put(`/advert/${advert._id}`, advert);
export const deleteAdvert = (id) => admin.delete(`/advert/${id}`);

// 获取用户列表
export const getUserList = (query) => admin.get("/user", { params: query });
export const updateUser = (id, user) => admin.put(`/user/${id}`, user);
export const deleteUser = (id) => admin.delete(`/user/${id}`);
// 获取角色列表
export const getRoleList = (query) => admin.get("/role", { params: query });
export const addRole = (role) => admin.post("/role", role);
export const updateRole = (id, role) => admin.put(`/role/${id}`, role);
export const deleteRole = (id) => admin.delete(`/role/${id}`);
// 获取权限列表
export const getPermissionList = (query) =>
  admin.get("/permission", { params: query });

// 通知
export const getNoticeList = (query) => admin.get("/notice", { params: query });
export const deleteNotice = (id) => admin.delete(`/notice/${id}`);
export const updateNotice = (id, notice) => admin.put(`/notice/${id}`, notice);

// 商品
export const getGoodsList = (query) => admin.get("/goods", { params: query });
export const updateGoods = (id, goods) => admin.put(`/goods/${id}`, goods);
export const deleteGoods = (id) => admin.delete(`/goods/${id}`);
export const addGoods = (goods) => admin.post("/goods", goods);
// 分类
export const getCategoryList = (query) =>
  admin.get("/category", { params: query });
export const addCategory = (data) => admin.post("/category", data);
export const deleteCategory = (id) => admin.delete(`/category/${id}`);
export const updateCategory = (id, data) => admin.put(`/category/${id}`, data);

// 获取热搜列表
export const getHotSearchList = () => admin.get("/dashboard/search");
export const getHotPostList = () => admin.get("/dashboard/post");

// 获取话题
export const getTopicList = (query) => admin.get("/topic", { params: query });
export const addTopic = (topic) => admin.post("/topic", topic);
export const updateTopic = (id, topic) => admin.put(`/topic/${id}`, topic);
export const deleteTopic = (id) => admin.delete(`/topic/${id}`);
// 帖子
export const getPostList = (query) => admin.get("/post", { params: query });
export const deletePost = (id) => admin.delete("/post/" + id);
export const addPost = (data) => admin.post("/post", data);
export const updatePost = (id, data) => admin.put("/post/" + id, data);
// 订单
export const getOrderList = (query) => admin.get("/order", { params: query });
export const updateOrder = (id, order) => admin.put(`/order/${id}`, order);
export const deleteOrder = (id) => admin.delete(`/order/${id}`);
