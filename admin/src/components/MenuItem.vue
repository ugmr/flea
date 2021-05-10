<template>
  <li class="menu-item" @click="route">
    <slot></slot>
  </li>
</template>

<script>
export default {
  props: ["to"],
  name: "MenuItem",
  methods: {
    route() {
      if(this.to) {
        this.$router.push(this.to);
      } else {
        this.$emit("onClick");
      }
    }
  }
}
</script>

<style scoped>
.menu-item {
  list-style: none;
  margin: 3px 5px;
  padding: 10px 24px;
  cursor: pointer;
  border-radius: 5px;
  transition: .5s;
}

.menu-item:hover {
  background-color: #1976d2;
  color: white;
}
</style>