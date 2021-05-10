<template>
	<view class="wrap">
		<!-- 搜索 -->
		<view class="search">
			<u-search :showAction="false" disabled @click="toSearch()"></u-search>
		</view>
		<!-- 话题列表 -->
		<view class="topic-list">
			<topic-item :topic="topic" v-for="topic in topicList" :key="topic._id" @click="toDetailPage(topic._id)"></topic-item>
		</view>
		<!-- 底部导航栏 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	export default {
		data: () => ({
			topicList: [],
		}),
		methods: {
			toDetailPage(topicId) {
				uni.navigateTo({
					url: "/pages/topic/detail?topicId=" + topicId
				})
			},
			async getData() {
				const result = await this.$api.getTopicList()
				this.topicList = result.topics
			},
			//搜索跳转
			toSearch() {
				uni.navigateTo({
					url: "/pages/topic/search"
				})
			},
		},

		onShow() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 20rpx;
}
.topic-list {
	margin-top: 40rpx;
}

</style>
