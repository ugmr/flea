const IO = require("socket.io"),
  { notice } = require("../model/mongo"),
  redis = require("../model/redis"),
  logger = require("../libs/log4j")("ws"),
  offlineService = require("../service/offlineService");

function emitAsync(socket, emitName, data, callback) {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.emit) {
      reject("pls input socket");
    }
    socket.emit(emitName, data, (...args) => {
      let response;
      if (typeof callback === "function") {
        response = callback(...args);
      }
      resolve(response);
    });
  });
}

function creatSocket(app) {
  const io = IO(app, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
  });
  //每个客户端socket连接时都会触发 connection 事件
  io.on("connection", async (clientSocket) => {
    const socket_id = clientSocket.id;
    let user_id;
    let is_admin;
    logger.info("connection socketId", socket_id);

    // 必须先把socketID先进行保存， 后台系统不需要保存
    await emitAsync(
      clientSocket,
      "initSocket",
      clientSocket.id,
      (userId, isAdmin) => {
        user_id = userId;
        is_admin = isAdmin;
        if (!isAdmin) {
          redis.origin.hset(redis.types.SOCKET, user_id, clientSocket.id);
        }
        logger.info("initSocket success");
      }
    );
    // 初始化成功并获取消息
    clientSocket.on("initSocketSuccess", async (userId, callback) => {
      logger.info("initSocketSuccess");
      try {
        const allMessage = await offlineService.getOffLineMessage(user_id);
        const allNotice = await notice.find({ userId: user_id });
        // 返回离线信息以及系统通知
        callback(allMessage, allNotice);
        await offlineService.deleteOffLineMessage(user_id);
      } catch (err) {
        console.log(err);
      }
    });
    // 发送/接受消息
    clientSocket.on("sendPrivateMsg", async (data, callback) => {
      try {
        if (!data) return;

        redis.origin.hget(
          redis.types.SOCKET,
          data.to,
          async (err, targetSocketId) => {
            if (err) {
              throw new Error("获取socketid失败");
            }
            if (targetSocketId) {
              io.to(targetSocketId).emit("getPrivateMsg", data);
              console.log("发送成功");
            } else {
              console.log("对方不在线 消息存入离线消息库");
              await offline.addOffLineMessage(data);
            }
          }
        );
        console.log("sendPrivateMsg data=>", data);
        callback({ success: true, message: "发送成功", data: data });
      } catch (error) {
        console.log("error", error.message);
        io.to(socket_id).emit("error", {
          code: 500,
          message: error.message,
        });
      }
    });
    // 通知
    clientSocket.on("sendNoticeMsg", async (data, callback) => {
      try {
        await notice.create(data);
        redis.origin.hget(
          redis.types.SOCKET,
          data.userId,
          async (err, targetSocketId) => {
            if (err) {
              throw new Error("获取socketid失败");
            }
            if (targetSocketId) {
              io.to(targetSocketId).emit("getNoticeMsg", data);
            }
          }
        );
        callback({ success: true });
      } catch (e) {
        callback({ success: false });
      }
    });
    // 修改通知状态
    clientSocket.on("clearNotice", async (data, callback) => {
      try {
        const result = await notice.updateMany(
          { userId: user_id },
          {
            stauts: true,
          }
        );

        console.log(result);

        callback({ success: true });
      } catch (e) {
        callback({ success: false });
      }
    });
    //监听客户端断开连接
    clientSocket.on("disconnect", async () => {
      if (!is_admin) {
        redis.origin.hdel(redis.types.SOCKET, user_id);
      }
    });
  });
}

module.exports = creatSocket;
