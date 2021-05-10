<template>
  <view>
    <u-navbar
      :is-back="true"
      :custom-back="customBack"
      title="所在地"
      :isFixed="true"
      :borderBottom="false"
    ></u-navbar>
    <view class="list">
      <view class="list-item" @click="onClick">
        <view class="item-title">
          <text>获取当前位置</text>
          <text class="subtitle">{{
            city ? city : province ? province : "当前位置"
          }}</text>
        </view>
        <u-icon name="map" size="32" color="#909399"></u-icon>
      </view>
      <view
        v-for="(item, index) in currentList"
        :key="index"
        class="list-item"
        @click="choose(index)"
      >
        <view class="item-title">
          {{ item }}
        </view>
        <u-icon name="arrow-right" size="28" color="#909399"></u-icon>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import cityList from "../../static/cityList.json";
import { mapState } from "vuex";

export default {
  data: () => ({
    parentIndex: -1,
    cityList: cityList.provinces,
    province: "",
    city: "",
    longitude: 0,
    latitude: 0,
  }),
  computed: {
    currentList() {
      if (this.parentIndex >= 0) {
        const citys = this.cityList[this.parentIndex].citys;
        return citys.map((item) => item.citysName);
      } else {
        return this.cityList.map((item) => {
          return item.provinceName;
        });
      }
    },
  },
  methods: {
    back(info) {
      let pages = getCurrentPages(); //获取所有页面栈实例列表

      if (info && info.province && info.city && pages.length >= 2) {
        const prevPage = pages[pages.length - 2];

        prevPage.$vm.changeLocation(info);
      }

      uni.navigateBack({
        delta: 1,
      });
    },
    customBack() {
      if (this.parentIndex < 0) {
        this.back(null);
      } else {
        this.parentIndex = -1;
      }
    },
    async choose(index) {
      if (this.parentIndex < 0) {
        this.parentIndex = index;
      } else {
        const city = this.cityList[this.parentIndex].citys[index].citysName;
        const province = this.cityList[this.parentIndex].provinceName;
        const { data } = await this.$api.regeo({
          address: `中国 ${province} ${city}`,
        });
        const [ longitude, latitude ] =
          data.status == 1
            ? data.geocodes[0].location.split(",")
            : [ 0, 0 ];
        this.back({ city, province, longitude, latitude });
      }
    },
    async getLocation() {
      try {
        const {
          province,
          city,
          longitude,
          latitude,
        } = await this.$store.dispatch("location/GET_LOCATION");
        this.province = province;
        this.city = city;
        this.longitude = longitude;
        this.latitude = latitude;
      } catch (e) {
        this.$refs.uToast.show({
          title: "获取位置失败,请检查GPS权限或设备GPS设置",
          type: "warning",
        });
      }
    },
    async onClick() {
      await this.getLocation();
      this.province &&
        this.city &&
        this.back({
          province: this.province,
          city: this.city,
          longtitude: this.longitude,
          latitude: this.latitude,
        });
    },
    async onLoad() {
      await this.getLocation();
    },
  },
};
</script>

<style lang="scss">
.list {
  padding-bottom: 10rpx;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1px solid #dcdfe6;

  &:last-child {
    border: none;
  }

  .subtitle {
    margin-left: 20rpx;
    font-size: 24rpx;
    color: #909399;
  }
}
</style>
