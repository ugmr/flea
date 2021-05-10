<template>
	<view class="wrapper">
		<view v-if="focusList.length">
			<view class="list-item" v-for="item in focusList" :key="item.id">
				<view class="u-flex u-col-center" @click="toUserPage(item.userId)">
					<u-avatar :src="item.profilePhoto" size="48"></u-avatar>
					<text class="u-margin-left-20">{{item.userName}}</text>
				</view>
				<view v-show="isSelf" class="list-item-button" @click="cancel(item.userId)">移除</view>
			</view>
		</view>
		<view v-else class="empty">
			<u-empty text="关注列表为空"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data: () => ({
			userId: "",
			focusList: []
		}),
		computed: {
			isSelf() {
				return this.userId == this.$store.state.log.userInfo.id
			}
		},
		methods: {
			async getData() {
				const result = await this.$api.getFocusList(this.userId)
				this.focusList = result.list
			} ,
			async cancel(id) {
				await this.$api.cancelFocus(id)
				this.getData()
			},
			toUserPage(id) {
				console.log(id)
				uni.navigateTo({
					url: "/pages/userInfo/userInfo?userId=" + id
				})
			}
		},
		onLoad({id}) {
			this.userId = id
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		height: 100%;
	}
	
	.list-item {
		padding: 20rpx 40rpx;
		background-color: #fff;
		border-top: 1px solid $uni-border-color;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		&-button {
			color: $uni-color-primary;
		}
	}
	.empty {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
