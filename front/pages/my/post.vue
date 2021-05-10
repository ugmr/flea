<template>
	<view class="wrapper">
		<view class="post-list" v-if="postList.length">
			<post-item :post="post" :showRight="true" v-for="post in postList" :key="post.id"></post-item>
		</view>
		<view v-else class="empty">
			<u-empty></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data: () => ({
			postList: []
		}),
		methods: {
			async getData() {
				const result = await this.$api.getPostList({
					conditions: {
						userId: this.$store.state.log.userInfo.id
					}
				})

				this.postList = result.posts

				console.log(this.postList)
			}
		},
		onLoad() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
.wrapper {
	height: 100%;
}
.empty {
	padding-top: 50%;
}
	
.post-list {
	padding: 20rpx;
	border-radius: 16rpx;
	background-color: #fff;
}

</style>
