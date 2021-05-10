<template>
	<view class="f-float" @click="$emit('click')">
		<u-icon class="f-float-icon" :name="icon" size="44"></u-icon>
	</view>
</template>

<script>
	export default {
		name:"f-float",
		props: [
			"icon"
		],
	}
</script>

<style lang="scss">
.f-float {
	width: 80rpx;
	height: 80rpx;
	border-radius: 180rpx;
	background-color: $uni-color-primary;
	position: fixed;
	bottom: 60rpx;
	right: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;	
	
	&-icon {
		color: #fff;
		font-weight: bold;
	}
}
</style>
