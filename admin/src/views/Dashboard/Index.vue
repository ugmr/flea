<template>
  <v-app class="home">
    <!-- 应用栏 -->
    <AppBar :title="title"></AppBar>
    <!-- 导航栏 -->
    <NavBar></NavBar>
    <!-- 主体 -->
    <v-main>
      <div class="content">
        <router-view v-if="hasAccess"></router-view>
        <Auth v-else></Auth>
      </div>
      <!-- 页脚 -->
      <Footer></Footer>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import AppBar from "@/components/AppBar.vue";
import Auth from "@/components/Auth.vue";

import { mapState } from "vuex";
import * as api from "../../api";

export default {
  name: "Dashboard",
  components: {
    NavBar,
    AppBar,
    Auth
  },
  data: () => ({
    hasAccess: true
  }),
  computed: {
    ...mapState(["title"]),
    ...mapState("theme", ["dark"]),
  },
  methods: {
    changeTheme () {
      this.$store.commit("CHANGE_THEME", this.$vuetify);
    },
    async checkPermission(path) {
      const result = await api.checkPermission(path || this.$route.meta.authPath || this.$router.currentRoute.path);
      this.hasAccess = result.access;
    }
  },
  watch: {
    "$route.path": async function (path) {
      await this.checkPermission(this.$route.meta.authPath || path)
    }
  },
  async mounted() {
    await this.checkPermission()
  }
}
</script>

<style lang="scss" scoped>
.theme--light .v-main {
  background: #f5f5f5;
}
.theme--dark .v-main {
  background: #272727;
}
.content {
  padding: 30px;
  height: 100%;
}
</style>