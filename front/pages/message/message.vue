<template>
	<view class="wrapper">
		<view class="message" @click="toNotice">
			<u-image class="message-image" shape="circle" width="100" height="100" src="/static/images/notice.jpeg"></u-image>
			<view class="message-info">
				<view class="message-info-title">
					系统通知
				</view>
				<view class="message-info-desc">
					{{noticeList.length ? noticeList[0].title : '[暂无消息]'}}
				</view>
			</view>
			<view class="message-right">
					<view class="time" v-if="noticeList.length > 0">
						{{noticeList[noticeList.length-1].createdAt.slice(0, 10)}}
					</view>
					<view class="new" v-show="noticeNum > 0">
						<view class="dot">
							{{ noticeNum }}
						</view>
					</view>
				</view>
		</view>

		<view class="u-margin-top-20">
			<u-swipe-action :show="message.show" :index="index" 
				v-for="(message, index) in messageList" :key="message.userId" 
				@click="deleteMessage(message.userId)"
				:options="options"
				v-if="message.list.length > 0"
			>
				<view class="message" @click="toChatPage(message.userId)">
					<u-image class="message-image" shape="circle" width="100" height="100" :src="message.profilePhoto"></u-image>
					<view class="message-info">
						<view class="message-info-title">
							{{message.userName}}
						</view>
						<view class="message-info-desc">
							{{ message.list[message.list.length-1].message }}
						</view>
					</view>
					<view class="message-right">
						<view class="time">
							{{message.list[message.list.length-1].createdAt.slice(0, 10)}}
						</view>
						<view class="new" v-show="message.hasNew > 0">
							<view class="dot">
								{{message.hasNew}}
							</view>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import { mapGetters, mapState } from "vuex"
	export default {
		data: () => ({
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
		}),
		computed: {
			...mapGetters(["messageList"]),
			...mapState("chat", ["noticeList", "noticeNum"])
		},
		methods: {
			deleteMessage(key) {
				this.$store.commit("chat/deleteMessage",{
					msgKey: key, 
					storageKey: this.$store.state.log.userInfo.id
				})
			},
			toChatPage(userId) {
				uni.navigateTo({
					url: "/pages/message/chat?userId=" + userId
				})
			},
			toNotice() {
				uni.navigateTo({
					url: "/pages/message/notice"
				})
			}
		},
		onShow() {
		}
	}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 20rpx;
}
	
.message {
	padding: 20rpx 30rpx;
	display: flex;
	align-items: center;
	background-color: #fff;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	
	&-image {
		flex: 0 0 100rpx;
	}

	&-info {
		flex: 1;
		margin-left: 40rpx;
		
		&-title {
			font-size: $uni-font-size-base;
			color: #000;
		}

		&-desc {
			margin-top: 10rpx;
			font-size: 28rpx;
			color: $uni-text-color-grey;

			&-new {
				color: $uni-color-error;
			}
		}
	}

	&-right {
		flex: 0 0 160rpx;
		padding: 10rpx 0;
		align-self: flex-start;
		text-align: right;
		.time {
			font-size: 26rpx;
			color: $uni-text-color-grey;
		}

		.new {
			margin-top: 10rpx;
			padding: 0 40rpx;

			.dot {
				display: inline-block;
				width: 36rpx;
				height: 36rpx;
				border-radius: 36rpx;
				background-color: $uni-color-primary;

				color: #fff;
				font-size: $uni-font-size-sm;
				text-align: center;
				line-height: 36rpx;
			}
		}
	}
}
</style>
