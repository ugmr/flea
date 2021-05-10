import { getMessageList, clearMessageList, setMessageList } from "../../utils";
import IO from "@hyoga/uni-socket.io";
import { socketUrl } from "../../config";
import Vue from "vue";

export default {
  namespaced: true,
  state: {
    socketIO: null,
    messageList: {},
    noticeList: [],
    noticeNum: 0,
  },
  mutations: {
    initMessageList(state, userInfo) {
      console.log(userInfo);

      state.messageList[userInfo.id] = {
        profilePhoto: userInfo.profilePhoto,
        userName: userInfo.userName,
        userId: userInfo.id,
        hasNew: 0,
        list: [],
      };
    },
    setMessageList(state, messageList) {
      state.messageList = messageList;
    },
    updateNoticeList(state, notice) {
      Vue.set(state.noticeList, state.noticeList.length, notice);
    },
    clearMessageList(state) {
      state.messageList = {};
      clearMessageList();
    },
    updateMessageList(state, item) {
      const { from, to, avatar, name, message, isme, createdAt } = item;

      const key = isme ? to : from;

      console.log(key);

      if (state.messageList[key]) {
        const messageItem = state.messageList[key];
        const list = messageItem.list;

        if (messageItem.avatar !== avatar) {
          messageItem.avatar = avatar;
        }

        if (messageItem.userName !== name) {
          messageItem.userName = name;
        }

        if (list.length > 100) {
          list.shift();
        }

        Vue.set(list, list.length, {
          message,
          isme,
          createdAt,
        });

        messageItem.hasNew += isme ? 0 : 1;
      } else {
        console.log(1);

        Vue.set(state.messageList, key, {
          profilePhoto: avatar,
          userName: name,
          userId: key,
          hasNew: isme ? 0 : 1,
          list: [{ message, isme, createdAt }],
        });
      }

      setMessageList("chat_" + to, state.messageList);
    },
    deleteMessage(state, { msgKey, storageKey }) {
      console.log(msgKey, storageKey);
      delete state.messageList[msgKey];
      setMessageList("chat_" + storageKey, state.messageList);
    },
    setSocketIO(state, socketIO) {
      state.socketIO = socketIO;
    },
    clearMessageTip(state, { msgKey, storageKey }) {
      if (state.messageList[msgKey]) {
        state.messageList[msgKey].hasNew = 0;
        setMessageList("chat_" + storageKey, state.messageList);
      }
    },
    clearNoticeTip(state) {
      state.noticeList.forEach((notice) => {
        if (!notice.status) {
          notice.status = true;
        }
      });
      state.noticeNum = 0;
    },
    updateNoticeList(state, notice) {
      state.noticeNum++;
      Vue.set(state.noticeList, state.noticeList.length, notice);
    },
  },
  getters: {
    newNoticeNum(state) {
      const num = 0;
      state.chat.noticeList.forEach((notice) => {
        if (notice.status !== 1) {
          num++;
        }
      });
      return num;
    },
  },
  actions: {
    // 初始化
    // App打开且处于登录状态/登录后
    async init(state) {
      // 拿到本地的聊天数据
      const userInfo = state.rootState.log.userInfo;
      const messageList = getMessageList("chat_" + userInfo.id);
      if (messageList) {
        state.commit("setMessageList", messageList);
      }

      // 发起ws链接
      this.dispatch("chat/connect");
      console.log("init app success...");
    },
    // 连接到ws服务器
    connect({ rootState, dispatch, commit }) {
      console.log("当前socketIO URL", socketUrl);
      // 发起ws连接
      const socketIO = IO(socketUrl, {
        query: {},
        transports: ["websocket", "polling"],
        timeout: 5000,
      });

      this.commit("chat/setSocketIO", socketIO);

      const userInfo = rootState.log.userInfo;

      let afterReconnecting = false;

      socketIO.on("error", (error) => {
        console.log(error, "error");
      });
      socketIO.on("reconnect", (attemptNumber) => {
        if (!afterReconnecting) {
          socketIO.disconnect();
          dispatch("connect");
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
        callback(userInfo.id);
        // 初始化数据
        socketIO.emit(
          "initSocketSuccess",
          userInfo.id,
          (allMessage, allNotice) => {
            console.log("init chat data", allMessage, allNotice);
            // allMessage 为数组
            allMessage.map((item) => {
              item.isme = false;
              commit("updateMessageList", item);
            });

            allNotice.map((item) => {
              commit("updateNoticeList", item);
            });
          }
        );
      });
      // 收到消息
      socketIO.on("getPrivateMsg", async (data) => {
        console.log(data);
        data.isme = false;
        // 更新messageList
        commit("updateMessageList", data);
      });
      // 收到系统通知
      socketIO.on("getNoticeMsg", async (data) => {
        console.log(data);
        commit("updateNoticeList", data);
      });
    },
    // 发消息
    sendMessage({ state, commit }, msg) {
      const socketIO = state.socketIO;
      if (!socketIO) return;
      socketIO.emit("sendPrivateMsg", msg, (res) => {
        console.log("send message success" + msg);
        if (res.success) {
          let data = res.data;
          console.log(data);
          data.isme = true;
          // 更新messageList
          commit("updateMessageList", data);
        }
      });
    },

    // 清空通知信息
    async clearNotice({ state, commit }) {
      const socketIO = state.socketIO;
      if (!socketIO) return;
      socketIO.emit("clearNotice", "", (res) => {
        if (res.success) {
          commit("clearNoticeTip");
        }
      });
    },

    // 与ws服务器断开连接
    // 退出登录
    disconnect(state) {
      const socketIO = state.socketIO;
      if (socketIO) {
        socketIO.disconnect();
        commit("setSocketIO", {});
      }
    },
  },
};
