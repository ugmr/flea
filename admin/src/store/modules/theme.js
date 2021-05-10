export default {
  namespaced: true,
  state: {
    dark: false,
  },
  mutations: {
    ["CHANGE_THEME"](state, dark) {
      state.dark = dark;
    },
    ["TOGGLE_THEME"](state, vuetify) {
      const dark = !state.dark;

      state.dark = dark;
      vuetify.theme.dark = dark;
    },
  },
};
