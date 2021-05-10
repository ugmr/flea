const express = require("express");
const router = express.Router();

const checkController = require("../controller/checkController");
const smsController = require("../controller/smsController");
const uploadController = require("../controller/uploadController");
const userController = require("../controller/userController");
// 获取短信验证码
router.post("/sms", smsController.send);
router.post("/reset", userController.forget);
// 校验验证码
router.post("/check_sms", smsController.validate);
// 检查用户名
router.post("/check_username", checkController.checkUserName);
// 检查手机号码是否存在
router.post("/check_mobile", checkController.checkMobile);
// 上传文件
router.post("/upload", uploadController.upload);

module.exports = router;
