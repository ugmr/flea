const express = require("express");
require("express-async-errors");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const auth = require("./middleware/auth");
const cors = require("./middleware/cors");
const errorHandler = require("./middleware/error");
const logger = require("./libs/log4j")("app");
const app = express();

const UserRouter = require("./router/user");
const AdminRouter = require("./router/admin");
const CommonRouter = require("./router/common");

// app 版本
const version = "v1";

// 记录请求
app.use((req, res, next) => {
  logger.info(req.method, req.path);
  next();
});
// 跨域
app.use(cors());

// 解析数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multipart({
    uploadDir: "./public/tmp",
    filename: Date.now(),
  })
);

// 身份认证
app.use(auth());

// 路由
app.use(`/api/common/${version}`, CommonRouter);
app.use(`/api/user/${version}`, UserRouter);
app.use(`/api/admin/${version}`, AdminRouter);

// 错误处理
app.use(errorHandler());

module.exports = app;
