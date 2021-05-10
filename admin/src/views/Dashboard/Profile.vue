<template>
  <div class="profile">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- 卡片 -->
          <v-card class="card">
            <!-- 卡片头部 -->
            <div class="card-header card-header-primary card-header-info">
              设置我的资料
            </div>
            <!-- 卡片主体 -->
            <div class="card-body text-center">
              <v-container>
                <v-row class="justify-space-between">
                  <v-col cols="6" class="pa-9">
                    <v-form ref="form" class="form" lazy-validation>
                      <v-text-field
                          v-model="profile.userName"
                          label="用户名"
                      >
                      </v-text-field>

                      <v-text-field
                          v-model="roleName"
                          label="角色"
                          disabled
                      >
                      </v-text-field>
                      
                      <v-select
                        v-model="profile.gender"
                        :items="genderItems"
                        label="性别"
                      >
                      </v-select>
                      
                      <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                              v-model="profile.birthday"
                              label="生日"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                            ref="picker"
                            v-model="profile.birthday"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1950-01-01"
                            landscape
                        ></v-date-picker>
                      </v-menu>
                      
                      <v-text-field
                          v-model="profile.address"
                          label="地址"
                      >
                      </v-text-field>
                    </v-form>
                  </v-col>
                  <v-col cols="6" class="px-10 py-10">
                      <div class="img">
                        <v-img
                          class="img-input"
                          src="../../assets/imgs/avator.jpg"
                          height="96"
                          width="96"
                        ></v-img>
                        <v-btn class="img-button">上传头像</v-btn>
                      </div>
                      <v-textarea
                        class="mt-10"
                        v-model="profile.intro"
                        label="个人简介"
                        auto-grow
                      >
                      </v-textarea>
                  </v-col>
                </v-row>
                <v-row class="justify-center">
                  <v-btn class="mb-1" color="primary" @click="updateProfile">
                    保存修改
                  </v-btn>
                </v-row>
              </v-container>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import * as api from "@/api";
import { mapState } from "vuex";
export default {
  name: "Profile",
  data: () => ({
    profile: {},
    roleName: "",
    genderItems: [
      {text: "男", value: "male"},
      {text: "女", value: "female"}
    ],
    menu: false,
  }),
  computed: {
    ...mapState("log", ["userInfo"])
  },
  methods: {
    async getProfile() {
      try {
        const result = await api.getProfile(this.userInfo.id);
        this.profile = result.profile;
        console.log(this.profile)
        this.roleName = result.role.name;
        this.profile.birthday = new Date(this.profile.birthday).toISOString().substr(0, 10);
      } catch {
        this.$toast("获取用户信息失败");
      }
    },
    async updateProfile () {
      const valid = this.$refs.form.validate();
      if(!valid) return;
      try {
        const newProfile = Object.assign({}, this.profile);

        newProfile.birthday = new Date(this.profile.birthday)
        await api.updateProfile(this.profile);
        this.$toast("修改个人信息成功")
      } catch {
        this.$toast("修改个人信息失败");
      }
      await this.getProfile();
    },
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "个人设置");
    await this.getProfile();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}

.img {
  display: flex;
  align-items: center;

  &-input {
    flex: 0 0 96px;
  }

  &-button {
    margin-left: 60px;
  }
}

.form-wrapper {
  padding: 20px 40px;

  .form {
    width: 20%;
  }
}
</style>