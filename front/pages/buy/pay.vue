<template>
	<view>
		<u-navbar :is-back="true" :customBack="cancelPay" title="支付" :isFixed="true"></u-navbar>
		<view class="block">
			<view class="content">
				<view class="orderinfo">
					<view class="row">
						<view class="nominal">订单编号:</view><view class="text">{{orderInfo.no}}</view>
					</view>
					<view class="row">
						<view class="nominal">订单金额:</view><view class="text">{{orderInfo.price}}元</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="paytype='alipay'">
							<view class="left">
								<image src="/static/images/alipay.png"></image>
							</view>
							<view class="center">
								支付宝支付
							</view>
							<view class="right">
								<radio :checked="paytype=='alipay'" color="#f06c7a" />
							</view>
					</view>
					<view class="row" @tap="paytype='wxpay'">
							<view class="left">
								<image src="/static/images/wxpay.png"></image>
							</view>
							<view class="center">
								微信支付
							</view>
							<view class="right">
								<radio :checked="paytype=='wxpay'" color="#f06c7a" />
							</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即支付</view>
			<view class="tis">
				点击立即支付，即代表您同意<view class="terms">
					《条款协议》
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: "",
				redirectTo: "",
				orderInfo: {},
				paytype:'alipay'//支付类型
			};
		},
		methods:{
			async doDeposit(){
				//模板模拟支付
				uni.showLoading({
					title:'支付中...'
				});
				await this.$api.pay(this.orderId)
				setTimeout(() => {}, 700)
				uni.hideLoading();
				uni.showToast({
					title:'支付成功'
				});
				setTimeout(()=>{
					uni.redirectTo({
						url: "/pages/order/order?orderId=" + this.orderId
					})
				},300);
			},
			cancelPay() {
				if(this.redirect) {
					uni.redirectTo({
						url: "/pages/order/order?orderId=" + this.orderId
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			}
		},
		async onLoad({orderId, redirect}) {
			this.orderId = orderId
			this.redirect = redirect || true
			const res = await this.$api.getOrderInfo(orderId)
			this.orderInfo = res.order
		}
	}
</script>

<style lang="scss">
.block{
		width: 94%;
		padding: 0 3% 40upx 3%;
		.title{
			width: 100%;
			font-size: 34upx;
		}
		.content{
			.orderinfo{
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row{
					width: 100%;
					height: 90upx;
					display: flex;
					align-items: center;
					.nominal{
						flex-shrink: 0;
						font-size: 32upx;
						color: #7d7d7d;
					}
					.text{
						width: 70%;
						margin-left: 10upx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						font-size: 32upx;
					}
				}
			}
			.pay-list{
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row{
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;
					.left{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;
						image{
							width: 80upx;
							height: 80upx;
						}
					}
					.center{
						width: 100%;
						font-size: 30upx;
					}
					.right{
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	.pay{
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.btn{
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #f06c7a;
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.2);
		}
		.tis{
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;
			.terms{
				color: #5a9ef7;
			}
		}
	}
</style>
