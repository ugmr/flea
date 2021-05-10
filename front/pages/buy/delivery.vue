<template>
	<view class="wrap">
		<u-navbar title="选择收获地址" :isFixed="true">
			<view slot="right" @click="goTo('/pages/delivery/delivery')">
				<u-icon name="setting" size="40" style="margin-right: 15px;"></u-icon>
			</view>
		</u-navbar>
		<view class="list-item" v-for="delivery in deliveryList" :key="delivery._id" @click="choose(delivery)">
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
</template>

<script>
	export default {
		data: () => ({
			deliveryList: []
		}),
		methods: {
			goTo(url) {
				uni.navigateTo({
					url
				})
			},
			async getData() {
				const result = await this.$api.getDeliveryList()
				this.deliveryList = result.list
			},
			choose(delivery) {
				var pages = getCurrentPages(); //当前页面栈  
				if (pages.length > 1) {  
				    var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
				    beforePage.$vm.chooseDelivery(delivery); //触发父页面中的方法change()  
				 }  
				
				uni.navigateBack({
					delta: 1
				})
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	min-height: 100%;
	padding: 20rpx;
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

.empty {
	height: calc(100% - 88rpx);
}
</style>
