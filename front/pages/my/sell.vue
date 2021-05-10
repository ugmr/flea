<template>
    <view class="wrapper">
        <view v-if="orderList.length" class="order-list">
            <view class="order-item" v-for="order in orderList" :key="order.id" >
                <view class="order-item-header" @click="toOrderPage(order.id)">
                    <u-avatar class="order-item-header-avatar" :src="order.seller.profilePhoto" size="48"></u-avatar>
                    <view class="order-item-header-name">{{order.seller.userName}}</view>
                    <text class="order-item-header-status">
                        {{statusText[order.status]}}
                    </text>
                </view>
                <view class="order-item-content clearfix" @click="toOrderPage(order.id)">
                    <u-image class="order-item-content-image" :src="order.cover" width="140" height="140"></u-image>
                    <view class="order-item-content-goods">{{order.goodsName}}</view>
                </view>
                <view class="order-item-price" @click="toOrderPage(order.id)">
                    实付款 
                    <text class="color-red">￥{{order.price}}</text>
                </view>
                <view class="order-item-actions">
                    <view @click="toChatPage(order.seller.id)">
                        <u-icon name="chat" size="32"></u-icon>
                        <text class="u-margin-left-10">联系买家</text>
                    </view>

                     <view v-if="order.status === 0">
                        <u-button size="mini" shape="circle" @click="deleteOrder(order.id)">删除订单</u-button>
                    </view>

                    <view v-if="order.status >= 1 &&  order.status <= 4">
                        <u-button size="mini" shape="circle" @click="toOrderPage(order.id)">查看订单</u-button>
                    </view>
                    
                    <view v-if="order.status === 5" class="u-flex u-col-center">
                        <u-button size="mini" shape="circle" @click="toOrderPage(order.id)">查看订单</u-button>
                        <u-button size="mini" shape="circle" class="u-margin-left-20" @click="deleteOrder(order.id)">删除订单</u-button>
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="empty">
            <u-empty></u-empty>
        </view>
    </view>
</template>

<script>
export default {
    data: () => ({
        orderList: [],
        statusText: [
            "交易取消",
            "等待买家付款",
            "等待卖家发货",
            "等待买家收货",
            "交易成功",
            "交易成功",
        ],
    }),
    methods: {
        async getData() {
            const userId = this.$store.state.log.userInfo.id
            console.log(userId)
            const result = await this.$api.getOrderList({
                conditions: {
                    seller: userId
                }
            })
            this.orderList = result.orders
        } ,
        toOrderPage(id) {
            uni.navigateTo({
                url: "/pages/order/order?orderId=" + id
            })
        },
		toEvalPage(id) {
			uni.navigateTo({
				url: "/pages/order/evaluation?orderId=" + id
			})
		},
		toAddEvalPage(id) {
			uni.navigateTo({
				url: "/pages/order/addEvaluation?orderId=" + id
			})
		},
        toChatPage(id) {
            uni.navigateTo({
                url: "/pages/message/chat?userId=" + id
            })
        },
        deleteOrder(id) {
            console.log(id)
            this.$api.deleteOrder(id)
            this.getData()    
        },
        async cancelOrder(id) {
            await this.$api.cancelOrder(id)
            this.getData()
        },
    },
    onShow() {
        this.getData()
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    height: 100%;
}

.order-list {
    margin: 0 20rpx;
    .order-item {
        padding: 20rpx;
        margin-top: 20rpx;
        border-radius: 16rpx;
        background-color: #fff;
	    box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);

        &-header {
            display: flex;
            align-items: center;

            &-name {
                margin-left: 10rpx;
                flex: 1;
            }

            &-status {
                flex: 0 0 200;
                color: $uni-color-error;
            }
        }

        &-content {
            margin-top: 20rpx;

            &-image {
                float: left;
            }

            &-goods {
                max-height: 140rpx;
                margin-left: 140rpx;
                padding: 20rpx;
            }
        }

        &-price {
            text-align: right;
        }

        &-actions {
            margin-top: 20rpx;
            padding: 20rpx 10rpx 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid $uni-border-color;
        }
    }
}

.color-red { 
    margin-left: 10rpx;
    color: $uni-color-error;
}

.empty {
	padding-top: 50%;
}
</style>