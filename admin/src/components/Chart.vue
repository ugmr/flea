<template>
  <div class="chart">
    <div id="container"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: ["option", "width", "height"],
  name: "Chart",
  data: () => ({
    chart: null,
  }),
  mounted() {
    const chart = document.getElementById('container');
    chart.style.width = ( this.width || "800" ) + "px";
    chart.style.height = ( this.height || "600" ) + "px";

    this.chart = echarts.init(chart);
    this.chart.setOption(this.option);
  },
  methods: {
    // 手动更新
    updateOption() {
      this.chart.setOption(this.option)
    }
  },
  watch: {
    option: function (newOption) {
      this.chart.setOption(newOption);
    },
  }
}
</script>

<style lang="scss" scoped>
#container {
  margin: 0 auto;
}
</style>