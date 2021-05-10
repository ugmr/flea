<template>
  <v-menu
    transition="slide-x-transition"
    bottom
    left
    offset-y
    z-index="10000"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          small
          icon
          class="mr-4"
          depressed
          v-bind="attrs"
          v-on="on"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-card class="menu-list">
      <slot></slot>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: ["icon"],
  name: "Menu",
}
</script>

<style scoped>
.menu-list {
  padding: 5px 0;
}
</style>