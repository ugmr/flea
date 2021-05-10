<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card class="tip" :color="color" :to="to" :elevation="hover ? 8 : 6">
        <div class="tip-wrapper">
          <div class="tip-icon">
            <v-icon>{{icon}}</v-icon>
            <p class="icon-text">{{iconText}}</p>
          </div>
          <div class="tip-text">
            <slot></slot>
          </div>
        </div>
      </v-card>
    </template>
  </v-hover>

</template>

<script>
export default {
  props: ["color", "to", "icon", "iconText"],
  name: "Tip",
}
</script>

<style lang="scss" scoped>

.tip-wrapper {
  width: 100%;
  height: 80px;
}

.tip-icon {
  float: left;
  width: 50%;
  height: 80px;
  line-height: 40px;
  padding: 5px 0;
  text-align: center;
  background-color: rgba(255, 255, 255, .15);
  .v-icon {
    font-size: 30px;
    color: white;
    vertical-align: middle;
  }

  .icon-text {
    color: white;
    font-weight: bold;
    vertical-align: middle;
  }
}

.tip-text {
  float: right;
  width: 50%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>