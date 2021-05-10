<template>
	<view class="wrapper">
		<!-- 商品信息 -->
		<view class="card u-flex u-row-between u-col-top">
			<u-image :src="goods.cover" width="200" height="200" class="card-image"></u-image>
			<view class="card-title">
				<text>{{goods.name}}</text>
			</view>
			<view class="card-price">¥{{goods.price}}</view>
		</view>
		<!-- 物流信息 -->
		<view class="card">
			<view @click="toChoosePage">
				<u-section title="收货地址" :showLine="false">
					<view slot="right" class="u-flex u-col-center">
						<view class="delivery" v-if="currentDelivery">
							<view class="delivery-info">
								<text>{{currentDelivery.name}}</text>
								<text>{{currentDelivery.mobile}}</text>
							</view>
							<view class="delivery-address">
								{{currentAddress}}																					
							</view>
						</view>
						<view class="delivery" v-else>
							无
						</view>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
			<view class="u-flex u-row-between u-margin-top-20">
				<text>运费</text>
				<text class="price ">¥{{goods.freight}}</text>
			</view>
		</view>
		<!-- 购买确认按钮 -->
		<view class="footer">
			<view class="footer-price">
				<text>实付款:</text>
				<text class="price u-margin-left-10">¥{{totalPrice}}</text>
			</view>
			<view class="footer-button u-text-right">
				<u-button type="error" size="medium" shape="circle" @click="buy">
					确认购买
				</u-button>
			</view>
		</view>
		<!-- 提示框 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data: () => ({
			goodsId: "",
			goods: [],
			deliveryList: [],
			currentDelivery: null
		}),
		computed: {
			currentAddress() {
				return this.currentDelivery 
					? this.currentDelivery.province + this.currentDelivery.city + this.currentDelivery.district + this.currentDelivery.address 
					: ""
			},
			totalPrice() {
				return this.goods.price + this.goods.freight
			}
		},
		methods: {
			async getData() {
				const goods = await this.$api.getGoodsInfo(this.goodsId)
				this.goods = goods.goods
				
				const result = await this.$api.getDeliveryList()
				this.deliveryList = result.list;
				
				this.currentDelivery = this.deliveryList.find((item) => item.default)
				if(!this.currentDelivery && this.deliveryList.length) 
					this.currentDelivery = this.deliveryList[0]
			},
			chooseDelivery(delivery) {
				this.currentDelivery = delivery
			},
			toChoosePage() {
				uni.navigateTo({
					url: "/pages/buy/delivery"
				})
			},
			async buy() {

				if(!this.currentDelivery) {
					return this.$refs.uToast.show({
						title: "请填写收货地址",
						type: "warning"
					})
				}
				try {
					const result = await this.$api.createOrder({
						goodsId: this.goods.id,  
						deliveryId: this.currentDelivery._id
					})
					uni.redirectTo({
						url: '/pages/buy/pay?orderId=' + result.order._id 
					})
				} catch(e) {
					console.log(e)
					this.$refs.uToast.show({
						title: "订单创建失败",
						type: "error"
					})
				}
			}		
		},
		async onLoad({goodsId}) {
			this.goodsId = goodsId
			await this.getData()
		},
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		height: 100%;
	}
	
.card {
	margin: 20rpx;
	padding: 16rpx;
	border-radius: 16rpx;
	background-color: #fff;
	position: relative;
	
	
	&-image {
		flex: 0 0 200;
	}
	
	&-title {
		flex: 1;
		margin-top: 20rpx;
		margin-left: 20rpx;
		color: #000;
	}
	
	&-price {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		font-size: 32rpx;
		color: $uni-color-error;
	}
}

.delivery {
	max-width: 300rpx;
	margin-right: 10rpx;
	text-align: right;
	
	&-info {
		color: #000;
		font-size: 30rpx;
	}
	&-address {
		margin-top: 10rpx;
	}
}

.footer {
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 20rpx 30rpx;
	background-color: #fff;
	
	display: flex;
	align-items: center;
	justify-content: flex-end;
	
	&-price {
		margin-right: 40rpx;
	}
}

.price {
	font-size: 32rpx;
	color: $uni-color-error;
}
</style>
