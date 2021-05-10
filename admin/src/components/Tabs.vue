<template>
  <div class="tabs">
    <div
      :class="itemClass(i)"
      v-for="(item, i) in createRange(length)"
      :key="i"
      @click="$emit('change', i)"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ["value", "length"],
  methods: {
    createRange(length) {
      const array = [];
      for(let i = 0; i < length; i++) {
        array.push({});
      }
      return array;
    }
  },
  computed: {
    itemClass() {
      return (i) => [
          'tab-item',
          this.value === i ? 'tab-item-active': ''
      ]
    }
  }
}
</script>

<style scoped>
.tab-item {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 14px;
  margin-left: 5px;
  background-color: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.tab-item:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.tab-item-active {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>