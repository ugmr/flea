<template>
	<view class="wrap">
		<view class="content">
			<view class="list-item" v-for="delivery in deliveryList" :key="delivery._id" @click="toEditPage(delivery)">
				<view class="u-flex u-col-center u-row-between">
					<view class="list-item-name">收货人：{{delivery.name}}</view>
					<view class="list-item-mobile">{{delivery.mobile}}</view>
				</view>
				<view class="list-item-address">
					收货地址：{{delivery.province + delivery.city + delivery.district + delivery.address}}
				</view>
			</view>
			<view v-show="!deliveryList.length" class="empty">
				<u-empty text="还没有收货地址"></u-empty>
			</view>
		</view>
		<u-button type="primary" class="add-button" @click="toAddPage">新增收货地址</u-button>
	</view>
</template>

<script>
	export default {
		data: () => ({
			deliveryList: []
		}),
		methods: {
			async getData() {
				const result = await this.$api.getDeliveryList()
				this.deliveryList = result.list;
				console.log(this.deliveryList)
			},
			toAddPage() {
				uni.navigateTo({
					url: "/pages/delivery/addAndEdit"
				})
			},
			toEditPage(delivery) {
				uni.navigateTo({
					url: "/pages/delivery/addAndEdit?delivery=" + JSON.stringify(delivery)
				})
			}
		},
		onShow() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>

.wrap{
	min-height: 100%;
	display: flex;
	flex-direction: column;	
	padding: 20rpx;
}

.content {
	flex: 1;
}

.empty {
	margin-top: 50%;
}

.add-button {
	margin-top: 40rpx;
	width: 100%;
}

.list-item {
	border-top: 1px solid $uni-border-color;
	padding: 30rpx 120rpx 30rpx 40rpx;
	background-color: #fff;
	border-radius: 20rpx;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
 	font-size: $uni-font-size-base;
	
	&-name,&-mobile{
		font-size: $uni-font-size-lg;
	}
	
	&-address {
		margin-top: 10rpx;
		display: block;
		width: 100%;
	}
}

</style>
