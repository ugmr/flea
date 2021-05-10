<template>
	<view class="f-card">
		<view class="head" v-if="hasHead">
			<view class="head-title">{{title}}</view>
			<view class="head-subtitle" @click="goTo(action)" v-if="subtitle">
				<text>{{subtitle}}</text>
				<u-icon class="u-margin-left-10" name="arrow-right" size="24"></u-icon>
			</view>
		</view>
		<view :class="hasHead ? 'u-padding-top-20 u-padding-bottom-20':''">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["title", "subtitle", "action"],
		computed: {
			hasHead() {
				return !(!this.title && !this.subtitle)
			}
		},
		methods: {
			goTo(url) {
				uni.navigateTo({url})
			}
		},
	}
</script>

<style lang="scss">

.f-card {
	margin: 20rpx 0;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	background-color: #fff;
	
	.head {
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		&-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #303133;
		}
		
		&-subtitle {
			font-size: 24rpx;
			color: #909399;
		}
	}
}
</style>
