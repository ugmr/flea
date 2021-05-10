<template>
	<view>
		<view class="topic clearfix" @click="handleClick">
			<view class="topic-cover">
				<u-image width="96" height="96" :src="topic.cover"></u-image>
			</view>
			<view class="topic-info">
				<view class="topic-info-title">
					{{topic.name}}
				</view>
				<view v-if="topic.postNum >= 0" class="topic-info-data">
					{{topic.postNum}} 帖子
				</view>
				<view v-else>
					新话题
				</view>
			</view>
			<view class="topic-icon">
				<u-icon name="arrow-right" size="28" class="topic-icon"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"topic-item",
		props: [
			"topic",
		],
		methods: {
			handleClick() {
				this.$emit("click")
			},
		}
	}
</script>

<style lang="scss" scoped>
.topic {
	margin: 20rpx 0;
	padding:  30rpx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	background-color: #fff;
	
	&-image {
		flex: 0 0 96rpx;
	}

	&-info {
		flex: 1;
		margin-left: 20rpx;
		
		&-title {
			font-size: $uni-font-size-base;
			color: #000;
			font-weight: bold;
		}

		&-data {
			flex: 0;
			margin-top: 10rpx;
			color: $uni-text-color-grey;
			font-size: $uni-font-size-sm;
		}
	}

	&-icon {
		flex: 0;
		color: $uni-text-color-grey;
	}
}

.clearfix {
	zoom: 1;
}

.clearfix::after {
	content: "";
	display: block;
	clear: both;
	visibility: hidden;
}
</style>
