import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import overlay from "./modules/overlay";
import log from "./modules/log";
import theme from "./modules/theme";
import notice from "./modules/notice";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: "",
  },
  mutations: {
    ["CHANGE_TITLE"](state, title) {
      state.title = title;
    },
  },
  modules: {
    overlay,
    log,
    theme,
    notice,
  },
  plugins: [
    // 解决页面刷新数据丢失 保存到
    createPersistedState({
      paths: ["log.userInfo", "log.isLogin", "overlay.overlay", "theme.dark"],
    }),
  ],
});
