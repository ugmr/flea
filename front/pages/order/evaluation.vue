<template>
	<view class="wrapper">
		<view class="eval">
			<view class="title">买家评价</view>
				
			<view class="eval-content">
				<div class="left">
					<u-avatar :src="buyer.profilePhoto" size="64"></u-avatar>
				</div>
				
				<div class="right">
					<view class="user">
						<view class="user-name">
							{{buyer.userName}}
						</view>
						<rate size="32" disabled v-model="evaluation.buyer.score"></rate>
					</view>
					
					<view v-if="evaluation.buyer.content" class="content">
						{{evaluation.buyer.content}}
					</view>
					
					<view v-else class="content">
						买家还没有进行评价
					</view>
				</div>
				
			</view>
			
		</view>
		
		
		
		<view class="eval">
			<view class="title">卖家评价</view>
			<view class="eval-content">
				<view class="left">
					<u-avatar :src="seller.profilePhoto" size="64"></u-avatar>
				</view>
			
				<view class="right">
					<view class="user">
						<view class="user-name">
							{{seller.userName}}
						</view>
						<rate size="32" disabled :value="evaluation.seller.score"></rate>
					</view>
					
					<view v-if="evaluation.seller.content" class="content">
						{{evaluation.seller.content}}
					</view>
					
					<view v-else class="content">
						卖家还没有进行评价
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data: () => ({
			orderId: "",
			evaluation: {
				buyer: {
					score: 0,
					content: ""
				},
				seller: {
					score: 0,
					content: ""
				}
			},
			buyer: {
				profilePhoto: "",
				userName: "123"
			},
			seller: {
				profilePhoto: "",
				userName: "123"
			}
		}),
		
		methods: {
			async getData() {
				const result = await this.$api.getEvaluation(this.orderId)
				
				Object.assign(this.evaluation.buyer, result.evaluation.buyer)
				Object.assign(this.evaluation.seller, result.evaluation.seller)
				Object.assign(this.buyer, result.buyer)
				Object.assign(this.seller, result.seller)
				
				console.log(this.evaluation, this.buyer, this.seller)
			}
		},
		
		async onLoad({orderId}) {
			this.orderId = orderId;
			await this.getData()
		}
	}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 10rpx 20rpx;
}
.eval {
	margin-bottom: 60rpx;
	
	&-content {
		background-color: #fff;
		padding: 20rpx 20rpx;
		box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
		border-radius: $uni-border-radius-lg;
		margin-top: 20rpx;
		
		.left {
			float: left;
			padding: 10rpx 0;
		}
		
		.right {
			margin-left: 80rpx;
		}
		
		.content {
			margin-top: 20rpx;
		}
		
		.user-name {
			margin-bottom: 10rpx;
		}
	}
}
</style>