<template>
  <v-app-bar absolute flat app color="transparent" height="72">
    <!-- 标题 -->
    <div class="app-bar-title">
      {{ title }}
    </div>
    <!-- 空白占位 -->
    <v-spacer></v-spacer>
    <!-- 主题切换 -->
    <v-btn
        small
        icon
        class="mr-4"
        depressed
        @click="changeTheme"
    >
      <v-icon v-if="!dark" >fa-lightbulb-o</v-icon>
      <v-icon v-else>fa-moon-o</v-icon>
    </v-btn>
    <!-- 用户 -->
    <Menu icon="mdi-account">
      <MenuItem to="/profile">个人资料&nbsp;&nbsp;</MenuItem>
      <MenuItem to="/password">修改密码&nbsp;&nbsp;</MenuItem>
      <v-divider></v-divider>
      <MenuItem @onClick="logout">退出&nbsp;&nbsp;</MenuItem>
    </Menu>
  </v-app-bar>
</template>

<script>
import MenuItem from "@/components/MenuItem";
import Menu from "@/components/Menu";
import { mapState } from "vuex";

export default {
  name: "AppBar",
  props: {
    title: String,
  },
  components: {
    Menu,
    MenuItem
  },
  computed: {
    ...mapState("theme", ["dark"]),
    ...mapState("log", ["userInfo"]),
  },
  methods: {
    changeTheme() {
      this.$store.commit("theme/TOGGLE_THEME", this.$vuetify);
    },
    logout() {
      this.$store.dispatch("log/LOGOUT");
    }
  }
}
</script>

<style lang="scss" scoped>
.app-bar-title {
  margin-left: 20px;
  font-size: 20px;
}
</style>