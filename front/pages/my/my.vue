<template>
	<view>
		<u-navbar :is-back="false" title="我的" :isFixed="true" :background="{backgroundColor: '#f8f8f8'}">
			<view slot="right" @click="goTo('/pages/setting/setting')">
				<u-icon name="setting" size="40" style="margin-right: 15px;"></u-icon>
			</view>
		</u-navbar>
		<view class="content">
			<user-sheet :user="user" @click="toUserInfoPage"></user-sheet>
			
			<f-card title="我的交易">
				<u-grid :col="3" :border="false">
					<u-grid-item @click="goTo('/pages/my/publish')">
						<image src="/static/images/buy.png" style="width: 80rpx; height: 80rpx;"></image>
						<view class="grid-text">我发布的</view>
					</u-grid-item>
					<u-grid-item @click="goTo('/pages/my/sell')">
						<image src="/static/images/sale.png" style="width: 80rpx; height: 80rpx;"></image>
						<view class="grid-text">我卖出的</view>
					</u-grid-item>
					<u-grid-item @click="goTo('/pages/my/buy')">
						<image src="/static/images/order.png" style="width: 80rpx; height: 80rpx;"></image>
						<view class="grid-text">我买到的</view>
					</u-grid-item>
				</u-grid>
			</f-card>
			
			<f-card title="我关注的话题" subtitle="查看全部" action="/pages/my/topic">
				<u-empty text="你还没有关注任何话题" mode="list" v-if="topicList.length == 0"></u-empty>
				<u-grid :col="4" :border="false" v-else>
					<u-grid-item v-for="(item, i) in topicList" :key="i" @click="toDetailPage(item._id)">
						<u-image width="60" height="60" :name="item.cover"></u-image>
						<view class="grid-text">{{item.name}}</view>
					</u-grid-item>
				</u-grid>
			</f-card>
			
			<f-card title="我的帖子" subtitle="查看全部" action="/pages/my/post">
				<u-empty text="你还没有发布过帖子" mode="list" v-if="postList.length == 0"></u-empty>
				<view v-else class="post-list">
					<view class="post-list-item" v-for="(item, i) in postList" :key="i" @click="toPostPage(item.id)">
						<u-image width="80" height="80" :name="item.cover" class="post-list-item-cover"></u-image>
						<view class="post-list-item-text">
							<view class="title">#{{item.topic}}#</view>
							<view class="intro">{{item.content}}</view>
						</view>
					</view>
				</view>
			</f-card>
			
			<f-card 
				title="更多"
				class="mt-20" 
			>
				<view class="list">
					<view class="list-item">商城交易规范</view>
					<view class="list-item">商城交易规范</view>
					<view class="list-item">商城交易规范</view>
					<view class="list-item">商城交易规范</view>
				</view>
			</f-card>
		</view>
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	
	export default {
		data: () => ({
			user: {},
			topicList: [],
			postList: []
		}),
		methods: {
			goTo(url) {
				uni.navigateTo({url})
			},
			toUserInfoPage() {
				uni.navigateTo({
					url: "/pages/userInfo/userInfo?userId=" + this.userInfo.id
				})
			},
			toDetailPage(id) {
				uni.navigateTo({
					url: "/pages/topic/detail?topicId=" + id
				})
			},
			toPostPage(id){
				uni.navigateTo({
					url: "/pages/topic/post/post?postId=" + id
				})
			},
			async getData() {
				const userInfo = await this.$api.getUserInfo(this.userInfo.id)
				this.user = userInfo.user
				console.log(userInfo)
				
				const focusTopic = await this.$api.getFocusTopic({
					options: {
						limit: 4
					}
				})
				this.topicList = focusTopic.topics
				
				const myPost = await this.$api.getPostList({
					conditions: {
						userId: this.userInfo.id,
					},
					options: {
						limit: 4
					}
				})
				this.postList = myPost.posts.map(item => {
					let cover = ""
					if(item.photo.length > 0) cover = item.photo[0]
					
					return {
						id: item.id,
						cover,
						content: item.content,
						topic: item.topicName
					}
				})
			},
		},
		computed: {
			...mapState("log", ["userInfo"])
		},
		onShow() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>

.content {
	padding: 20rpx;
}

.grid-text {
	margin-top: 16rpx;
	color: #303133;
}

.list {
	&-item {
		padding: 14rpx 40rpx;
		color: #303133;
		border-bottom: 1px solid #f2f6fc;
	}
}

.post-list-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	padding: 10rpx 40rpx;
	
	&-cover {
		margin-right: 20rpx;
	}
	
	&-text {
		margin-left: 26rpx;
		flex: 1;
		
		.title {
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		
		.intro {
			max-width: 450rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}

</style>
