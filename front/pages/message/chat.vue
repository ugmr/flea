<template>
	<view class="content">
		<!-- 顶部导航栏 -->
		<u-navbar :is-back="true" :title="toUserInfo.userName" :isFixed="true" :background="{backgroundColor: '#f8f8f8'}"></u-navbar>
		
		<!-- 聊天内容 -->
		<view class="content-box" @touchstart="touchstart">
			<!-- 聊天列表 -->
			<view class="message" v-for="(item, index) in msgList.list" :key="index">
				<view :class="[item.isme ? 'right' : 'left', 'message-item']" >
					<u-avatar class="avatar" :src="item.isme ? userInfo.profilePhoto : toUserInfo.profilePhoto " size="60" @click="toUser(item.isme)"></u-avatar>
					<view class="content">
						<view class="content-userName">
							{{item.isme ?  userInfo.userName: toUserInfo.userName}}
						</view>
						<view class="content-message">
							{{ item.message }}
						</view>
					</view>
				</view>
			</view> 
		</view>
		
		<!-- 底部输入框 -->
		<view class="footer">
			<view class="footer-input">
				<u-input v-model="input" :clearable="false" height="60" :customStyle="{
				'padding': '0 40rpx',	
				'border-radius': '40rpx',
				'background-color': '#ffffff'
			}"></u-input>
			</view>
			<u-button size="mini" shape="circle" class="footer-button" @click="sendMessage">发送</u-button>
		</view>
	</view>
</template>

<script>
import { mapState } from "vuex"

export default {
	data() {
		return {
			toUserInfo: {
				userName: "",
				userId: ""
			},
			input:"",
			loading: true, //标识是否正在获取数据
			mpInputMargin: false, //适配微信小程序 底部输入框高度被顶起的问题
			msgList: {},
			page: 1
		};
	},
	computed: {
		...mapState("chat", ["messageList"]),
		...mapState("log", ["userInfo"])
	},
	watch: {
		"msgList.list": {
			immediate: true,
			handler: function(newVal,oldVal) {
				this.$store.commit("chat/clearMessageTip", {
					msgKey: this.toUserInfo.id,
					storageKey: this.userInfo.id
				})
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			},
		}
	},
	methods: {
		//发送消息
		sendMessage() {
			const input = this.input.trim()
			if(!input) return

			const data = {
				from: this.userInfo.id,
				to: this.toUserInfo.id,
				avatar: this.userInfo.profilePhoto,
				name: this.userInfo.userName,
				message: input,
				createdAt: new Date()
			}

			this.$store.dispatch("chat/sendMessage", data)

			this.input = ''
		},

		scrollToBottom() {
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 9999,
					duration: 0
				});
			}, 50)
		},
		//用户触摸屏幕的时候隐藏键盘
		touchstart() {
			uni.hideKeyboard();
		},
		toUser(isme) {
			const id = isme ? this.userInfo.id : this.toUserInfo.id 
			uni.navigateTo({
				url: "/pages/userInfo/userInfo?userId=" + id
			})
		}
	},
	async onLoad({userId}) {
		const res = await this.$api.getUserInfo(userId)
		this.toUserInfo = res.user
		
		this.$store.commit("chat/clearMessageTip", {
			msgKey: userId,
			storageKey: this.$store.state.log.userInfo.id
		})

		if(!this.messageList[userId]) {
			this.$store.commit("chat/initMessageList", this.toUserInfo)
		} 
		this.msgList = this.messageList[userId]
	}
};
</script>

<style lang="scss" scoped>

.content-box {
	padding: 20rpx 20rpx 100rpx;

	.message {
		padding-bottom: 20rpx;

		&-item {
			.content {
				padding-top: 10rpx;
				&-title {
					font-size: $uni-font-size-sm;
				}

				&-message {
					display: inline-block;
					margin-top: 20rpx;
					padding: 10rpx 30rpx;
					border-radius: 40rpx;
					border: 1px solid $uni-border-color;
					background-color: #fff;
				}
			}
		}
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: 10rpx 40rpx;
	display: flex;
	align-items: center;
	border-top: 1px solid $uni-border-color;
	background-color: $uni-bg-color-grey;
	
	&-image{
		flex: 0 0 30rpx;
	}

	&-input {
		flex: 1;
	}

	&-button {
		margin-left: 20rpx;
	}
}

.left {
	text-align: left;

	& .avatar {
		float: left;
	}

	& .content {
		margin-left: 80rpx;


		&-message {
			margin-left: -20rpx;
		}
	}
}

.right {
	text-align: right;

	& .avatar {
		float: right;
	}

	& .content {
		margin-right: 80rpx;

		&-message {
			margin-right: -20rpx;
		}
	}
}

</style>
