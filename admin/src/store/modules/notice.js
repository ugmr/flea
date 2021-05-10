const { socketUrl } = require("../../config/index");
const IO = require("socket.io-client");

export default {
  namespaced: true,
  state: {
    socket: null,
  },
  mutations: {
    ["SET_SOCKET"](state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    ["CONNECT"]({ rootState }) {
      console.log("当前socketIO URL", socketUrl);
      // 发起ws连接
      const socketIO = IO(socketUrl, {
        query: {},
        transports: ["websocket", "polling"],
        timeout: 5000,
      });

      this.commit("notice/SET_SOCKET", socketIO);

      const userInfo = rootState.log.userInfo;

      let afterReconnecting = false;

      socketIO.on("error", (error) => {
        console.log(error, "error");
      });
      socketIO.on("reconnect", (attemptNumber) => {
        if (!afterReconnecting) {
          socketIO.disconnect();
          this.dispatch("notice/CONNECT");
          afterReconnecting = true;
          console.log(
            "not reconnecting, open automatically time=>",
            new Date().toLocaleString()
          );
        }
        console.log(
          "reconnect successfully. attemptNumber =>",
          attemptNumber,
          "socket-id => ",
          socketIO.id,
          "time=>",
          new Date().toLocaleString()
        );
      });
      socketIO.on("reconnecting", (attemptNumber) => {
        afterReconnecting = true;
        console.log(
          "reconnecting. attemptNumber =>",
          attemptNumber,
          "time=>",
          new Date().toLocaleString()
        );
      });
      socketIO.on("disconnect", async (reason) => {
        afterReconnecting = false;
        console.log(
          "disconnect in client, disconnect reason =>",
          reason,
          "time=>",
          new Date().toLocaleString()
        );
      });
      socketIO.on("reconnect_error", (error) => {
        afterReconnecting = false;
        console.log(
          "reconnect_error. error =>",
          error,
          "time=>",
          new Date().toLocaleString()
        );
      });
      socketIO.on("initSocket", (data, callback) => {
        callback(userInfo.id, true);
      });
    },
    // 发消息
    ["SEND_NOTICE"]({ state }, msg) {
      return new Promise((resolve, reject) => {
        const socket = state.socket;
        if (!socket) return;

        socket.emit("sendNoticeMsg", msg, (res) => {
          if (res.success) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
  },
};
