export default {
  namespaced: true,
  state: {
    overlay: false
  },
  mutations: {
    ['SHOW_OVERLAY'](state) {
      state.overlay = true;
    },
    ['HIDE_OVERLAY'](state) {
      state.overlay = false;
    }
  },
}