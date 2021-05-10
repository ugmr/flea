<template>
	<view
		class="product"
		@tap="toGoods(goods._id)"
	>
		<image mode="widthFix" :src="goods.cover"></image>
		<view class="name">{{ goods.name }}</view>
		<view class="info">
			<view class="price">￥{{ goods.price }}</view>
		</view>
		<view class="info">
			<view class="user">
				<u-avatar :src="goods.user.id" size="40"></u-avatar>
				<text class="username">{{goods.user.userName}}</text>
			</view>
			<view class="slogan">
				<u-tag v-show="goods.user.credit >= 80" :text="goods.user.credit >= 90 ? '信用极好' : '信用良好' " size="mini" shape="circle"/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["goods"],
		methods: {
			toGoods(id) {
				uni.navigateTo({
					url: "/pages/goods/goods?goodsId=" + id
				})
			},
		},
		onLoad() {
			console.log(this.goods)
		}
	}
</script>

<style lang="scss" scoped>
.product {
	padding: 20rpx 15rpx 10rpx;
	background-color: #fff;
	margin: 0 15rpx 15rpx;
	border-radius: 20rpx;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	image {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}
	.name {
		width: 92%;
		padding: 10rpx 4%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		text-align: justify;
		overflow: hidden;
		font-size: 30rpx;
	}
	.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 8rpx 0;
		.user {
			display: flex;
			align-items: center;
			
			.username {
				margin-left: 8rpx;
				max-width: 110rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		.price {
			color: #e65339;
			font-size: 30rpx;
			font-weight: 600;
		}
		.slogan {
			color: #807c87;
			font-size: 24rpx;
		}
	}
}
</style>
