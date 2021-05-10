<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="3" v-for="(item, i) in tips" :key="i">
        <Tip
            :color="item.color"
            :icon="item.icon"
            :iconText="item.iconText"
            :to="item.to"
        >
          {{item.text}}
        </Tip>
      </v-col>
    </v-row>
    <!-- 数据概览 -->
    <v-row>
      <v-col cols="12">
        <v-card class="card">
          <div class="card-header card-header-primary card-header-info">
            <v-row justify="space-between">
              <v-col align-self="center">
                <span class="text-body-1">数据概览</span>
              </v-col>
              <v-col cols="1">
                <Tabs v-model="chartIndex" :length="2"></Tabs>
              </v-col>
            </v-row>
          </div>
          <div class="card-body">
            <Chart :option="chartOption" ref="chartRef" width="834" height="432"></Chart>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- 今日热搜 -->
    <v-row>
      <v-col cols="12">
        <v-card class="card">
          <div class="card-header card-header-primary card-header-info">
            <v-tabs background-color="transparent" v-model="tabs.key" @change="getTableData">
              <v-tab v-for="(item, i) in tabs.tables" :key="i" v-text="item.name"></v-tab>
            </v-tabs>
          </div>
          <div class="card-body">
            <v-tabs-items v-model="tabs.key">
              <v-tab-item
                  v-for="(table, i) in tabs.tables"
                  :key="i"
              >
                <v-data-table
                    height="550"
                    :headers="table.headers"
                    :items="table.items"
                    item-key="_id"
                    :page.sync="table.page"
                    :items-per-page="table.itemsPerPage"
                    hide-default-footer
                    :loading="table.loading"
                    loading-text="加载中"
                >
                  <template v-slot:item.index="{ index }">
                    {{ (table.page - 1) * 10 + index + 1 }}
                  </template>
                </v-data-table>
                <!-- 分页 -->
                <div class="text-center pt-2">
                  <v-pagination
                      v-model="table.page"
                      :length="table.pageCount"
                      prev-icon="mdi-chevron-left"
                      next-icon="mdi-chevron-right"
                  ></v-pagination>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Tip from "@/components/Tip";
import Chart from "@/components/Chart";
import Tabs from "@/components/Tabs";
import * as api from "@/api";

export default {
  name: "Dashboard",
  components: {
    Tip,
    Chart,
    Tabs
  },
  data: () => ({
    info: {
      goods: 100,
      newGoods: 100,
      posts: 100,
      users: 100
    },
    chartIndex: 0,
    charts: [
      {
        title: {
          text: "最近一周新增订单数",
          left: "45%"
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {}
        }],
        animation: true,
        tooltip: {
          trigger: 'axis'
        },
      },
      {
        title: {
          text: "最近一周的新增用户量",
          left: "45%"
        },
        xAxis: {
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [10, 20, 30, 40, 50, 60, 70],
          type: 'line'
        }],
        animation: true
      },
    ],
    //
    tabs: {
      key: "",
      tables: [
        {
          name: "今日热搜",
          headers: [
            {text: "索引", value: "index", width: 80},
            {text: "关键字", value: "keyword", width: 600, },
            {text: "搜索次数", value: "score"},
          ],
          items: [],
          page: 1,
          pageCount: 1,
          itemsPerPage: 10,
          loading: false
        },{
          name: "今日热帖",
          headers: [
            {text: "索引", value: "index"},
            {text: "标题", value: "content",},
            {text: "发帖者", value: "user.userName"},
            {text: "话题", value: "topic.name"},
            {text: "点击数", value: "view"},
          ],
          items: [],
          page: 1,
          pageCount: 1,
          itemsPerPage: 10,
          loading: false
        }
      ]
    },
  }),
  computed: {
    tips() {
      return [
        {
          text: this.info.goods + "件",
          icon: "mdi-cart",
          iconText: "新增商品",
          color: "primary",
          to: "/goods"
        }, {
          text: this.info.newGoods + "件",
          icon: "mdi-layers-plus",
          iconText: "待审核商品",
          color: "#7986CB",
          to: "/examine"
        }, {
          text: this.info.posts + "条",
          icon: "mdi-chat-processing",
          iconText: "新增帖子",
          color: "warning",
          to: "/post"
        },  {
          text: this.info.users + "名",
          icon: "mdi-account",
          iconText: "新增用户",
          color: "success",
          to: "/user"
        }
      ]
    },
    chartOption() {
      return this.charts[this.chartIndex];
    }
  },
  methods: {
    async getHotSearchList() {
      try {
        const table = this.tabs.tables[0];
        const result = await api.getHotSearchList();
        table.items = result.result;
        this.pageCount = Math.floor(result.count / table.itemsPerPage);
      } catch(e) {
        console.log(e);
        this.$toast("获取今日热搜列表失败");
      }
    },
    async getHotPostList() {
      try {
        const table = this.tabs.tables[1];
        const result = await api.getHotPostList();
        table.items = result.posts;
        table.pageCount = Math.floor(result.count / table.itemsPerPage) || 1;
      } catch(e) {
        console.log(e);
        this.$toast("获取今日热帖列表失败");
      }
    },
    async getTipsData() {
      const result = await api.getTipsData();
      this.info.goods =  result.goodsNum
      this.info.newGoods = result.newGoodsNum
      this.info.posts = result.postNum
      this.info.users = result.userNum
    },
    getTableData(index) {
      if(index === 0) 
        this.getHotSearchList()
      else if(index === 1)  
        this.getHotPostList()
    },
    async getChartData() {
      const result = await api.getNewUser()
      const result2 = await api.getNewOrder()

      this.charts[1].series[0].data = result.newUser
      this.charts[0].series[0].data = result2.newOrder

      this.$set(this.charts, 1, this.charts[1])
      this.$set(this.charts, 0, this.charts[0])

      this.$refs.chartRef.updateOption()
    },
  },
  created() {
    this.getTipsData()
    this.getChartData()
    this.getTableData()
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}

.chart {
  margin: 0 auto;
}


</style>