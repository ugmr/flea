<template>
  <view class="wrapper">
    <view class="steps" v-if="order.status > 0">
      <u-steps
        :list="stepList"
        :current="order.status - 1"
        mode="number"
        active-color="#333"
        un-active-color="#c4c4c4"
      ></u-steps>
      <view class="steps-current">
        <view class="steps-current-title">
          {{ statusArray[order.status - 1] }}
        </view>
        <view class="steps-current-desc" v-if="order.status == 1">
          {{ restTime }}后，如果您未付款，订单将自动关闭
        </view>
        <view v-else class="steps-current-logistic">
          <view v-if="!order.logistic.no">
            <u-section title="暂无物流信息" :showLine="false" subTitle=""
              >></u-section
            >
          </view>
          <view v-else @click="toLogisticPage">
            <u-section :title="status" :showLine="false" subTitle=""
              >></u-section
            >
          </view>
        </view>
      </view>
    </view>

    <view v-else class="cancel-text">
      <text>订单已取消</text>
    </view>

    <view class="goods">
      <view class="goods-info">
        <u-image
          class="goods-info-image"
          :src="order.cover"
          width="140"
          height="140"
        ></u-image>
        <view class="goods-info-title">{{ order.goodsName }}</view>
        <view class="goods-info-price">¥ {{ order.goodsPrice }}</view>
      </view>

      <view class="goods-detail">
        <view class="goods-detail-item">
          <text>商品总价</text>
          <text>¥ {{ order.goodsPrice }}</text>
        </view>
        <view class="goods-detail-item">
          <text>运费</text>
          <text>¥ {{ order.freight }}</text>
        </view>
      </view>

      <view class="goods-price">
        <text class="goods-price-title">实付款</text>
        <text class="goods-price-content">¥ {{ order.price }}</text>
      </view>
    </view>

    <view class="delivery">
      <view class="delivery-title">
        <text>收货地址：</text>
        <text>{{ order.delivery.name }}</text>
        <text class="u-margin-left-20">{{ order.delivery.mobile }}</text>
      </view>
      <view class="delivery-address">
        {{ combinedAddress }}
      </view>
      <view class="delivery-copy" @click="copyDelivery">
        <u-icon name="file-text"></u-icon>
        <text>复制</text>
      </view>
    </view>

    <view class="order">
      <view class="order-title">订单信息</view>
      <view class="order-item"> 卖家昵称: {{ order.sellerName }} </view>
      <view class="order-item"> 买家昵称: {{ order.buyerName }} </view>
      <view class="order-item"> 订单编号: {{ order.no }} </view>
      <view class="order-item">
        交易时间: {{ new Date(order.createdAt).toLocaleDateString() }}
      </view>
    </view>

    <view class="footer around">
      <u-button
        v-if="order.status == 1"
        size="medium"
        shape="circle"
        @click="cancelOrder"
        >取消订单</u-button
      >
      <u-button
        v-if="!isSeller && order.status == 1"
        size="medium"
        shape="circle"
        type="primary"
        @click="toPayPage"
        >我要付款</u-button
      >
      <u-button
        v-if="order.status == 0"
        size="medium"
        shape="circle"
        @click="deleteOrder"
        >删除订单</u-button
      >
      <u-button
        v-if="isSeller && order.status == 2"
        size="medium"
        shape="circle"
        @click="showModal = true"
        >添加物流信息</u-button
      >
      <u-button
        v-if="!isSeller && order.status == 2"
        size="medium"
        shape="circle"
        @click="toChatPage"
        >提醒发货</u-button
      >
      <u-button
        v-if="!isSeller && order.status == 3"
        size="medium"
        shape="circle"
        @click="confirm"
        >确认收货</u-button
      >
      <u-button
        v-if="isSeller && order.status == 3"
        size="medium"
        shape="circle"
        @click="showModal = true"
        >修改物流信息</u-button
      >
      <u-button
        v-if="order.status == 4 && !hasEval"
        size="medium"
        shape="circle"
        @click="toAddEvaluate"
        >评价</u-button
      >
      <u-button
        v-if="order.status == 5 || (order.status == 4 && hasEval)"
        size="medium"
        shape="circle"
        @click="toEvalPage"
        >查看评价</u-button
      >
    </view>

    <u-modal
      v-model="showModal"
      title="添加物流"
      @cancel="cancelLogistic"
      @confirm="updateLogistic"
      ref="uModal"
      :show-cancel-button="true"
    >
      <view class="modal-wrapper">
        <u-input
          placeholder="请选择物流"
          v-model="type.label"
          type="select"
          @click="showSelect = true"
        ></u-input>
        <u-input placeholder="请输入物流单号" v-model="logistic"></u-input>
      </view>
    </u-modal>

    <u-select
      v-model="showSelect"
      :list="typeList"
      @confirm="chooseType"
    ></u-select>

    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    orderId: "",
    current: 0,
    statusArray: [
      "等待买家付款",
      "等待卖家发货",
      "等待买家收货",
      "等待买家评价",
      "交易成功",
    ],
    order: {
      delivery: {
        name: "",
        mobile: "",
        province: "",
        city: "",
        district: "",
        address: "",
      },
    },
    showModal: false,
    type: {
      label: "",
      value: "",
    },
    status: "暂无物流信息",
    showSelect: false,
    typeList: [
      {
        value: "STO",
        label: "申通快递",
      },
      {
        value: "HTKY",
        label: "百世物流",
      },
      {
        value: "YTO",
        label: "圆通速递",
      },
	  {
	    value: "HHTT",
	    label: "天天速递",
	  },
    ],
    logistic: "",
    ticker: null,
  }),
  computed: {
    stepList() {
      const result = [
        { name: "拍下" },
        { name: "付款" },
        { name: "发货" },
        { name: "收货" },
        { name: "评价" },
      ];

      for (let i = 0; i < result.length; i++) {
        const prefix = i <= this.order.status - 1 ? "已" : "待";
        result[i].name = prefix + result[i].name;
      }

      return result;
    },
    combinedAddress() {
      const {
        province = "",
        city = "",
        district = "",
        address = "",
      } = this.order.delivery;

      return province + city + district + address;
    },
    restTime() {
      const end = moment(this.order.createdAt).add(1, "days");
      const start = moment();

      const duration = moment.duration(end.diff(start));
      return `${duration.hours()}小时${duration.minutes()}分钟${duration.seconds()}秒`;
    },
    isSeller() {
      return this.order.seller == this.$store.state.log.userInfo.id;
    },
    hasEval() {
      return this.isSeller
        ? this.order.evaluation.seller
        : this.order.evaluation.buyer;
    },
  },
  methods: {
    async getData() {
      const result = await this.$api.getOrderInfo(this.orderId);

      this.order = result.order;

      if (this.order.logistic.no) {
        const result = await this.$api.getLogistic(
          this.$api.getParams(
            "",
            "",
            this.order.logistic.types,
            this.order.logistic.types + this.order.logistic.no
          )
        );

        if (result.data.Success && result.data.Traces.length) {
          this.status = result.data.Traces[0].AcceptStation;
        }
        console.log(result);
      }
      if (this.order.status === 1) {
        if (this.ticker) clearInterval(this.ticker);
        this.ticker = setInterval(() => {
          const createdAt = new Date(this.order.createdAt);
          this.$set(this.order, "createdAt", createdAt);
        }, 1000);
      }
      console.log(result.order);
    },

    copyDelivery() {
      uni.setClipboardData({
        data:
          this.order.delivery.name +
          this.order.delivery.mobile +
          this.order.delivery.province +
          this.order.delivery.city +
          this.order.delivery.district +
          this.order.delivery.address,
        complete() {
          this.$refs.uToast.show({
            title: "复制收货地址信息成功",
            type: "success",
          });
        },
      });
    },

    toPayPage() {
      uni.navigateTo({
        url: "/pages/buy/pay?orderId=" + this.orderId + "&redirect=" + "false",
      });
    },

    toChatPage() {
      uni.navigateTo({
        url: "/pages/message/chat?userId=" + this.order.seller,
      });
    },

    toLogisticPage() {
      uni.navigateTo({
        url:
          "/pages/order/logistic?types=" +
          this.order.logistic.types +
          "&no=" +
          this.order.logistic.no,
      });
    },

    toEvalPage() {
      uni.navigateTo({
        url: "/pages/order/evaluation?orderId=" + this.orderId,
      });
    },

    async cancelOrder() {
      await this.$api.cancelOrder(this.orderId);

      uni.navigateBack({
        delta: 1,
      });
    },

    deleteOrder() {
      this.$api.deleteOrder(this.orderId);
      uni.navigateBack({
        delta: 1,
      });
    },

    cancelLogistic() {
      this.showModal = false;
      this.type = {
        label: "",
        value: "",
      };
      this.logistic = "";
    },

    async updateLogistic() {
      if (!this.type.value || !this.logistic) return;
      await this.$api.updateLogistic(this.orderId, {
        types: this.type.value,
        no: this.logistic,
      });
      this.getData();
    },
    async confirm() {
      await this.$api.confirmOrder(this.orderId);
      this.getData();
    },
    // 评价
    toAddEvaluate() {
      uni.navigateTo({
        url: "/pages/order/addEvaluation?orderId=" + this.orderId,
      });
    },
    chooseType(t) {
      this.type = t[0];
    },
  },
  destoryed() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  },
  onLoad({ orderId }) {
    this.orderId = orderId;
    this.getData();
  },
  onShow() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding-bottom: 112rpx;
}

.steps {
  margin-bottom: 100rpx;
  padding: 60rpx 60rpx 120rpx;
  position: relative;
  background-color: $uni-color-primary;

  &-current {
    position: absolute;
    bottom: 0;
    right: 5%;
    left: 5%;
    width: 90%;
    transform: translateY(50%);
    padding: 30rpx 20rpx;
    border-radius: 16rpx;
    background-color: #fff;

    &-title {
      font-size: $uni-font-size-lg;
      font-weight: bold;
      color: #000;
    }

    &-desc {
      margin-top: 20rpx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }

    &-logistic {
      margin-top: 20rpx;
      padding: 20rpx 0 0;
      border-top: 1px solid $uni-border-color;
    }
  }
}

.cancel-text {
  text-align: center;
  background-color: $uni-color-primary;
  padding: 70rpx 0;

  font-size: 38rpx;
  font-weight: bold;
  color: #000;
}

.goods {
  border-radius: 16rpx;
  padding: 20rpx 40rpx 20rpx 40rpx;
  background-color: #fff;

  &-info {
    height: 160rpx;
    border-bottom: 1px solid $uni-border-color;

    &-image {
      float: left;
    }

    &-title {
      margin-left: 20rpx;
      float: left;
      color: #000;
    }

    &-price {
      float: right;
      color: $uni-color-error;
    }
  }

  &-detail {
    margin-top: 20rpx;
    &-item {
      margin-top: 20rpx 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }
  }

  &-price {
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-title {
      color: #000;
      font-weight: bold;
    }

    &-content {
      color: $uni-color-error;
    }
  }
}

.delivery {
  margin-top: 20rpx;
  padding: 20rpx 40rpx;
  background-color: #fff;
  position: relative;

  &-title {
    font-size: $uni-font-size-base;
    font-weight: bold;
    color: #000;
  }
  &-address {
    max-width: 600rpx;
    margin-top: 10rpx;
    color: $uni-text-color-grey;
  }
  &-copy {
    position: absolute;
    top: 20rpx;
    right: 40rpx;
  }
}

.order {
  margin-top: 20rpx;
  padding: 20rpx 40rpx;
  background-color: #fff;

  &-title {
    margin-bottom: 20rpx;
    font-size: $uni-font-size-base;
    color: #000;
    font-weight: bold;
  }

  &-item {
    padding: 10rpx 0;
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  padding: 20rpx;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-around;

  border-top: 1px solid $uni-border-color;

  background-color: #fff;
}

.modal-wrapper {
  padding: 40rpx;
}

.around {
  justify-content: space-around;
}

.end {
  justify-content: flex-end;
}
</style>
