<template>
  <div class="background">
    <!-- 背景Canvas -->
    <canvas ref="canvasRef"></canvas>
    <!-- 主题切换 -->
    <div class="theme">
      <v-btn
          x-small
          fab
          @click="changeTheme"
      >
        <v-icon v-if="!this.dark" >fa-lightbulb-o</v-icon>
        <v-icon v-else>fa-moon-o</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Net from "@/libs/net.js";
let net;

export default {
  data: () => ({
    netTheme: {
      dark: {
        lineColor: "#888",
        backgroundColor: "#292f37",
        dotColor: "#fff",
      },
      light: {
        lineColor: "#000",
        backgroundColor: "#eee",
        dotColor: "#333",
      },
    },
  }),
  computed: {
    ...mapState("theme", ["dark"])
  },
  watch: {
    "$store.state.theme.dark": function (dark) {
      net.changeTheme(dark ? this.netTheme.dark : this.netTheme.light);
    }
  },
  methods: {
    changeTheme() {
      this.$store.commit("theme/TOGGLE_THEME", this.$vuetify);
    },
  },
  mounted() {
    const el = this.$el;
    const cvs = this.$refs.canvasRef;
    cvs.width = el.clientWidth;
    cvs.height = el.clientHeight;
    window.onresize = function () {
      cvs.width = el.clientWidth;
      cvs.height = el.clientHeight;
    };
    net = new Net({
      canvas: cvs,
      dotNum: 150,
      dotSize: 1,
      lineDis: 10000,
      extendDis: 5,
      theme: this.dark ? this.netTheme.dark : this.netTheme.light
    });
  },
  destroy() {
    window.onresize = null;
    net.destroy();
  },
};
</script>

<style lang="scss" scoped>
.background {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  user-select: none;
}
.theme {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
