<template>
  <div id="app">
    <router-view></router-view>
    <v-overlay
      :value="overlay"
      :z-index="1000"
    >
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState("overlay", ["overlay"]),
    ...mapState("theme", ["dark"])
  },
  methods: {
    updateDarkMode(dark) {
      this.$vuetify.theme.dark = dark
      this.$store.commit("theme/CHANGE_THEME", dark)
    }
  },
  mounted() {
    // 初始化黑暗模式
    let media = window.matchMedia('(prefers-color-scheme: dark)');
    this.updateDarkMode(media.matches || false)
    let callback = (e) => {
      let prefersDarkMode = e.matches;
      this.updateDarkMode(prefersDarkMode)
    };
    media.addEventListener('change', callback);
    // ws连接
    this.$store.dispatch("notice/CONNECT");
  },
  destroyed() {
    let media = window.matchMedia('(prefers-color-scheme: dark)');
    media.removeEventListener('change');
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  font-size: 14px;
}
</style>
