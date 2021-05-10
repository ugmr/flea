<template>
	<view>
		<view class="content">
			<u-input :border="true" label="新密码" placeholder="请输入新密码" v-model="password"></u-input>
			<u-button class="commit-button" type="primary" @click="updatePassword">立即修改</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data: () => ({
			password: ""
		}),
		methods: {
			async updatePassword() {
				await this.$api.updatePassword(this.password);
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx 40rpx;
		background-color: #fff;
	}	
	.commit-button {
		margin-top: 10%;
	}
</style>
