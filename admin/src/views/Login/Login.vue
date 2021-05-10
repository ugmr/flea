<template>
  <!-- 登陆框 -->
  <v-card class="login_card">
    <!-- 标题 -->
    <v-card-title class="justify-center">
      <img src="../../assets/imgs/icon.png" alt="" class="title_icon" />
      <h3><span class="colorful">Matrix</span> Admin</h3>
    </v-card-title>
    <!-- 登陆表单 -->
    <v-card-text>
      <v-form ref="loginFormRef" lazy-validation>
        <v-text-field
            v-model="mobile"
            :rules="mobileRules"
            label="手机号码"
            type="text"
            required
        ></v-text-field>
        <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="密码"
            type="password"
            required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <!-- 登陆按钮 -->
    <v-card-actions>
      <v-container>
        <v-row justify="space-between">
          <v-btn text color="success"  to="/sign/reset">
            找回密码?
          </v-btn>
          <v-btn color="primary" class="mr-4" @click="login"> 登陆 </v-btn>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
const mpattern = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;

export default {
  name: "Login",
  data: () => ({
    mobile: "",
    mobileRules: [
      (v) => !!v || "手机号码不能为空",
      (v) => mpattern.test(v) || "手机号码不合法",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "密码不能为空",
      (v) => (v.length >= 6 && v.length <= 20) || "密码不合法",
    ],
  }),
  methods: {
    async login() {
      const valid = this.$refs.loginFormRef.validate();
      if(!valid) return;
      try {
        await this.$store.dispatch('log/LOGIN', {
          mobile: this.mobile,
          password: this.password
        });
        this.$router.push({ path: "/dashboard" }, () => {})
        this.$toast("登陆成功");
      } catch {
        this.$toast("用户名或密码错误");
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login_card {
  width: 400px;
  left: calc(50% - 200px);
  top: calc(50% - 250px);
  padding: 15px 8px;
  z-index: 10;
  user-select: none;

  &::v-deep .v-card__title {
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid #aaa;
  }

  .title_icon {
    margin-right: 3px;
    transform: scale(0.8);
  }
  .colorful {
    background: linear-gradient(to right, rgb(255, 0, 0), rgb(0, 255, 255));
    color: transparent;
    -webkit-background-clip: text;
  }
}
</style>