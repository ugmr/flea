<template>
	<view>
		<view class="icon">
			<image src="/static/images/success.png"></image>
		</view>
		<view class="tis">
			订单支付成功
		</view>
		<view class="back">
			<view class="btn" @click="back">返回</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount:0
			};
		},
		methods: {
			back() {
				uni.navigateBack({
						delta: 3
				})
			}
		},
	}
</script>

<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
.icon{
	width: 100%;
	margin-top: 10vw;
	image{
		width: 25vw;
		height: 25vw;
	}
}
.tis{
	width: 100%;
	margin-top: 20upx;
	font-size: 48upx;
}
.pay-amount{
	width: 100%;
	margin-top: 10upx;
	font-size: 32upx;
}
.back{
	position: absolute;
	width: 100%;
	bottom: 80upx;
	.btn{
		padding: 0 50upx;
		height: 70upx;
		border: solid 2upx #f06c7a;
		color: #f06c7a;
		align-items: center;
		border-radius: 10upx;
		font-size: 34upx;
	}
}
</style>
