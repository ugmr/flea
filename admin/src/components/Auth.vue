<template>
  <div class="auth">
    <div class="wrap">
      <div class="status">403</div>
      <div class="desc">权限不足，无法访问</div>
      <div class="action">
        <v-btn to="/dashboard">返回首页</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Auth",
}
</script>

<style lang="scss" scoped>

.auth {
  width: 100%;
  height: 100%;
  position: relative;
  
  .wrap {
    display: block;
    width: 100%;
    position: absolute;
    top: calc(50% - 72px);
    transform: translateY(-50%);
    text-align: center;
  }

  & .status {
    font-size: 100px;
    font-weight: bold;
    color: #1c979a;
  }

  & .desc {
    margin-top: 20px;
    font-size: 16px;
    color: #333;
  }

  & .action {
    margin-top: 40px;
  }
}


</style>