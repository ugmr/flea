<template>
	<view class='wrapper'>
		<!-- 话题信息 -->
		<view class="header">
			<view class="header-info">
				<u-image class="header-info-image" width="140" height="140"></u-image>
				<view class="header-info-right">
					<view class="header-info-title">{{topic.name}}</view>
					<view class="header-info-data">{{posts}} 帖子</view>
				</view>
			</view>
			<view class="header-focus">
				<view class="header-focus-list">
					<u-avatar size="48"></u-avatar>
					<view class="u-margin-left-20">{{focus}}关注</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view>
					<u-button size="mini" @click="onClickFocusBtn">
						{{isFocus ? "已关注" : "关注"}}
					</u-button>
				</view>
			</view>
			<view class="header-intro" v-if="topic.intro">
				<rich-text :nodes="topic.intro"></rich-text>
			</view>
		</view>
		<!-- 帖子列表 -->
		<view class="posts">
			<post-item :post="post" v-for="post in postList" :key="post.id"> </post-item>
		</view>
		<!-- 发帖子 -->
		<f-float @click="toAddPage" icon="plus"></f-float>
	</view>
</template>

<script>
	export default {
		data:() => ({
			topicId: "",
			topic: {},
			focus: 0,
			isFocus: false,
			posts: 0,
			postList: []
		}),
		methods: {
			async getData() {
				const result = await this.$api.getTopic(this.topicId)
				this.topic = result.topic
				this.focus = result.focus
				this.isFocus = result.isFocus
				this.posts = result.posts
				
				console.log(this.isFocus)

				const posts = await this.$api.getPostList({
					conditions: {
						topicId: this.topicId
					}
				})
				this.postList = posts.posts
			},
			toAddPage() {
				uni.navigateTo({
					url: "/pages/topic/post/add?topicId=" + this.topic._id
				})
			},
			async onClickFocusBtn() {
				if(this.isFocus) await this.cancelFocus()
				else await this.focusTopic()
			},
			async focusTopic() {
				await this.$api.focusTopic(this.topic._id)
				this.getData()
			},
			async cancelFocus() {
				await this.$api.cancelFocusTopic(this.topic._id)
				this.getData()
			},
			toPostPage(id) {
				uni.navigateTo({
					url: "/pages/post/post?postId=" + id
				})	
			}
		},
		onLoad({topicId}) {
			this.topicId = topicId
			this.getData()
		},
		onShow() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 20rpx 20rpx 0;
}
	
.header {
	margin: 0 16rpx;
	padding: 30rpx;
	border-radius: $uni-border-radius-base;
	background-color: #fff;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	
	&-info {
		min-height: 140rpx;

		&-image {
			float: left;
		}

		&-right {
			margin-left: 160rpx;
			padding: 20rpx 0;
		}

		&-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #000;
		}

		&-data {
			margin-top: 20rpx;
			font-size: 28rpx;
			color: $uni-text-color-grey;
		}
	}

	&-focus {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 28rpx;

		&-list {
			display: flex;
			align-items: center;
			color: $uni-text-color-grey;
		}
	}

	&-intro {
		margin-top: 20rpx;
		font-size: 28rpx;
	}
}

.posts {
	margin-top: 50rpx;
}


</style>
