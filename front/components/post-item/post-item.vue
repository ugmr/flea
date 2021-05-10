<template>
    <view class="post" @click="toPostPage">	
        <view class="post-header">
            <u-avatar class="post-header-avatar" size="60" :src="post.user.profilePhoto"></u-avatar>
            <view class="post-header-info">
                <view clsas="post-header-username">{{post.user.userName}}</view>
                <view class="post-header-time">{{post.createdAt | publishTime}}</view>
            </view>
            <view class="post-header-dot" v-if="showRight">
                <u-icon name="more-dot-fill" size="32"></u-icon>
            </view>
        </view>
        <view class="post-desc">
            {{post.content}}
        </view>
    </view>
</template>

<script>
export default {
	props: ["post", "showRight"],
	methods: {
		toPostPage() {
			uni.navigateTo({
				url: "/pages/topic/post/post?postId=" + this.post.id
			})
		}
	}
}
</script>

<style lang="scss">
.post{
	margin: 20rpx 16rpx;
	padding: 10rpx 20rpx 30rpx;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	background-color: #fff;

	&-header {
		display: flex;
		align-items: center;

		&-avatar {
			margin-right: 20rpx;
		}

		&-info {
			flex: 1;
		}

		&-dot {
			margin-right: 20rpx;
		}

		&-time {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
		}
	}

	&-desc {
		margin-top: 20rpx;
		margin-left: 80rpx;
	}

	&-actions {
		padding: 20rpx 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: $uni-text-color-grey;
	}
}
</style>