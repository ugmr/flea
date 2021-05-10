const express = require("express");
const router = express.Router();

const baseController = require("../controller/baseController");
const logController = require("../controller/logController");
const userController = require("../controller/userController");
const permissionController = require("../controller/permissionController");
const advertController = require("../controller/advertController");
const noticeController = require("../controller/noticeController");
const roleController = require("../controller/roleController");
const goodsController = require("../controller/goodsController");
const categoryController = require("../controller/categoryController");
const topicController = require("../controller/topicController");
const postController = require("../controller/postController");
const orderController = require("../controller/orderController");

router.post("/login", logController.adminLogin);
router.post("/logout", logController.logout);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put("/password", userController.updatePassword);

router.get("/permission", permissionController.getPermission);
router.post("/check_permission", permissionController.checkPermission);

router.get("/advert", advertController.getAllAdvert);
router.post("/advert", advertController.addAdvert);
router.put("/advert/:id", advertController.updateAdvert);
router.delete("/advert/:id", advertController.deleteAdvert);

router.get("/dashboard/tips", baseController.getTips);
router.get("/dashboard/user", baseController.getNewUser);
router.get("/dashboard/order", baseController.getNewOrder);
router.get("/dashboard/search", baseController.getHotSearch);
router.get("/dashboard/post", baseController.getHotPost);

router.get("/notice", noticeController.getNoticeList);
router.delete("/notice/:id", noticeController.deleteNotice);
router.put("/notice/:id", noticeController.updateNotice);

router.get("/role", roleController.getRoleList);
router.post("/role", roleController.addRole);
router.put("/role/:id", roleController.updateRole);
router.delete("/role/:id", roleController.deleteRole);

router.get("/user", userController.getUserList);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

router.get("/goods", goodsController.getGoodsList);
router.put("/goods/:id", goodsController.updateGoods);
router.delete("/goods/:id", goodsController.deleteGoods);
router.post("/goods", goodsController.publishGoods);

router.get("/order", orderController.getOrderList);
router.put("/order/:id", orderController.updateOrder);
router.delete("/order/:id", orderController.deleteOrder);

router.get("/category", categoryController.getAllCategory);
router.post("/category", categoryController.addCategory);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

router.get("/topic", topicController.getTopicList);
router.post("/topic", topicController.addTopic);
router.put("/topic/:id", topicController.updateTopic);
router.delete("/topic/:id", topicController.deleteTopic);

router.get("/post", postController.getAllPosts);
router.post("/post", postController.publishPost);
router.put("/post/:id", postController.updatePost);
router.delete("/post/:id", postController.deletePost);

module.exports = router;
