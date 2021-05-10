<template>
  <v-app class="login">
    <v-main>
      <transition name="bounce-in">
        <router-view></router-view>
      </transition>
    </v-main>
    <Background></Background>
  </v-app>
</template>

<script>
import Background from "@/components/Background";

export default {
  name: "Login",
  components: {
    Background
  }
}
</script>

<style lang="scss" scoped>

.bounce-in-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.bounce-in-enter,
.bounce-in-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.login {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

</style>
