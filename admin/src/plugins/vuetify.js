import Vue from "vue";
import Vuetify, { VSnackbar, VBtn, VIcon } from "vuetify/lib";
import VuetifyToast from "vuetify-toast-snackbar-ng";

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon,
  },
});
Vue.use(VuetifyToast, {
  x: "right",
  y: "top",
  color: "info",
  showClose: true,
  closeText: "关闭",
  closeIcon: "",
});

export default new Vuetify({
  theme: { dark: false },
  icons: {
    iconfont: "fa4",
  },
});
