<template>
	<view>
		<view class="content" v-show="step == 0">
			<view class="content-title">注销后你将放弃以下权益</view>
			<f-card class="u-margin-top-20">
				<view class="card-wrapper">
					1. 您的所有交易记录将被清空，请确保所有交易已完结且无纠纷，账户注销后因历史交易可能产生的退换货、维权相关的资金退回等权益将视作自动放弃。<br>
					2. 您的身份信息、账户信息、权益将被清空且无法恢复。<br>
				</view>
			</f-card>
			<view class="content-title">注销你将满足以下条件</view>
			<f-card class="u-margin-top-20">
				<view class="card-wrapper">
					<view class="subtitle">1. 账户近期不存在交易：</view>
					您的账户近15天内未有过交易记录、近三个月内未发布过闲置商品等。
					<view class="subtitle">2. 账户不存在进行中的违规记录：</view>
					您的账户不存在正在进行中的违规处罚或限权记录。
					<view class="subtitle">3. 账户相关财产权益已结清：</view>
					您的账户不存在冻结中的账户余额等。
					<view class="subtitle">4. 账户下不存在尚未注销的店铺：</view>
					基于相关法律法规要求及店铺经营相关交易安全需要，您须先行完成店铺注销。
					<view class="subtitle">5. 账户不存在未完结的服务：</view>
					您的账户不存在尚未完结的服务。
				</view>
			</f-card>
			<view class="small">点击下方"同意注销"按钮，即表示您已阅读并同意</view>
			<u-button class="u-margin-top-30" type="warning" @click="logoff">同意注销</u-button>
		</view>
		<view class="result" v-show="step == 1">
			<view class="circle">
				<u-icon name="checkmark" size="60" color="#fff" class="u-padding-20"></u-icon>
			</view>
			<view class="u-text-center">注销成功</view>
			<view class="u-text-center">{{time}}秒后退出登陆</view>
		</view>
		
		<view class="result" v-show="step == 2">
			注销失败
		</view>
	</view>
</template>

<script>
	export default {
		data: () => ({
			step: 0,
			timer: null,
			time: -1
		}),
		watch: {
			time: function (newValue) {
				if(newValue == 0) {
					clearInterval(this.timer)
					this.timer = null
					this.$store.commit("log/logout")
					uni.switchTab({
						url: "/pages/home/home"
					})
				}
			}
		},
		methods: {
			async logoff(){
				try {
					const result = await this.$api.logoff()
					this.step = 1
					this.time = 5
					const that = this
					this.timer = setInterval(() => {
						that.time --
					},1000)
				} catch {
					this.step = 2
				}
			}
		},
		onUnload() {
			clearInterval(this.timer)
			this.timer = null
		}
	}
</script>

<style lang="scss">
	.card-wrapper {
		padding: 20rpx;
		
		color: $uni-text-color-grey;
	}
	
	.content {
		padding: 0 20rpx 20rpx;
	
		&-title {
			margin-top: 20rpx;
			font-size: 30rpx;
			font-weight: bolder;
			color: #E9967A;
		}
	}
	
	.subtitle {
		padding: 8rpx 0;
		font-size: 28rpx;
		color: #000;
	}
	
	.small {
		text-align: center;
		margin-top: 10rpx;
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}
	
	.result {
		margin-top: 50%;
	}
	
	.circle {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100%;
		background-color: $uni-color-success;
		margin: auto;
	}
</style>
