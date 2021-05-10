<template>
  <div class="setting">
    <!-- 表格 -->
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- 卡片 -->
          <v-card class="card">
            <!-- 卡片头部 -->
            <div class="card-header card-header-primary card-header-info">
              <h4>修改密码</h4>
            </div>
            <!-- 卡片主体 -->
            <div class="card-body text-center">
              <v-container class="mt-12">
                <v-row class="justify-center">
                  <v-col cols="3">
                    <v-form ref="form" lazy-validation>
                      <v-text-field
                          v-model="password"
                          :error-messages="passwordErrors"
                          label="新密码"
                          type="password"
                          required
                          @input="$v.password.$touch()"
                          @blur="$v.password.$touch()"
                      ></v-text-field>
                      <v-text-field
                          v-model="repeat"
                          :error-messages="repeatErrors"
                          label="重复密码"
                          type="password"
                          required
                          @input="$v.repeat.$touch()"
                          @blur="$v.repeat.$touch()"
                      ></v-text-field>
                    </v-form>
                    <v-btn class="mb-12 mt-12" color="primary" @click="updatePassword">
                      修改密码
                    </v-btn>
                  </v-col>
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
import { validationMixin } from 'vuelidate';
import { minLength, required, maxLength, sameAs } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  name: "Password",
  validations: {
    password: { required, maxLength: maxLength(20), minLength: minLength(6)},
    repeat: { sameAsPassword: sameAs("password")}
  },
  data: () => ({
    password: '',
    repeat: '',
  }),
  computed: {
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('请输入密码');
      !this.$v.password.maxLength && errors.push('密码长度应在6-20之间');
      !this.$v.password.minLength && errors.push('密码长度应在6-20之间');
      return errors
    },
    repeatErrors() {
      const errors = []
      if (!this.$v.repeat.$dirty) return errors
      !this.$v.repeat.sameAsPassword && errors.push('两次密码不一致');
      return errors
    },
    ...mapState("log", ["userInfo"])
  },
  methods: {
    async updatePassword () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        await api.updatePassword({
          password: this.password
        });
        this.$toast("密码修改成功")
      } catch {
        this.$toast("密码修改失败");
      }
      this.password = '';
      this.repeat = '';
      this.$v.$reset();
    }
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "修改密码");
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>