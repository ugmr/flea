<template>
	<view class="user-sheet">
		<view class="user-sheet-body" @click="$emit('click')">
			<u-avatar :src="user.profilePhoto" size="large" class="avator" @click="preview(user.profilePhoto)"></u-avatar>
			<text class="userName">{{user.userName}}</text>
			<u-icon v-if="right" class="icon" name="arrow-right" size="32" color="#909399"></u-icon>
			<view v-else>
				<u-button v-if="isSelf" size="medium" type="info" class="u-margin-right-20" @click="goTo('/pages/setting/profile')">编辑资料</u-button>
				<u-button v-else size="medium" :type="hasFocus ? 'info': 'primary'" class="u-margin-right-20" @click="onClick">
					{{hasFocus ? '已关注' : '关注'}}
				</u-button>
			</view>
		</view>
		<view class="user-sheet-foot">
			<u-grid :col="3" :border="false">
				<u-grid-item @click="goTo('/pages/my/collect')">
					<view class="grid-text">{{user.collectNum || 0}}</view>
					<view class="grid-text">收藏</view>
				</u-grid-item>
				<u-grid-item @click="goTo('/pages/my/focus')">
					<view class="grid-text">{{user.focusNum || 0}}</view>
					<view class="grid-text">关注</view>
				</u-grid-item>
				<u-grid-item @click="goTo('/pages/my/follow')">
					<view class="grid-text">{{user.followNum || 0}}</view>
					<view class="grid-text">粉丝</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		props: {
			user: Object,
			right: {
				type: Boolean,
				default: true
			}
		},
		data: () => ({
			hasFocus: false
		}),
		computed: {
			...mapState("log", ["isLogin", "userInfo"]),
			isSelf() {
				if(!this.isLogin) return false
				return this.userInfo.id == this.user.id || this.userInfo.id == this.user._id
			},
 		},
		methods: {
			goTo(url) {
				uni.navigateTo({url: url + "?id=" + this.user.id })
			},
			onClick() {
				if(this.isSelf) {
					this.goTo("/pages/setting/profile")
				} else if(this.hasFocus) {
					this.cancelFocus()
				} else {
					this.focus()
				}
			},
			async focus() {
				await this.$api.focus(this.user.id)
				this.hasFocus = true
			},
			async cancelFocus() {
				await this.$api.cancelFocus(this.user.id)
				this.hasFocus = false
			},
			async checkFocus() {
				const result = await this.$api.checkFocus({
					fromId: this.userInfo.id,
					toId: this.user.id
				})
				this.hasFocus = result.hasFocus
			},
			preview(url) {
				uni.previewImage({
					urls: [url],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				})
			}
		},
		mounted() {
			this.checkFocus()
		},
	
	}
</script>

<style lang="scss" scoped>
.user-sheet {
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	background-color: #fff;
	padding: 20rpx;
	
	&-body {
		display: flex;
		align-items: center;
		
		.avator {
			flex: 2;
		}
		.userName {
			margin-left: 36rpx;
			flex: 9;
			font-size: 36rpx;
			color: #303133;
		}
		
		.icon {
			flex: 1;
		}
	}
	
	&-foot {
		margin-top: 36rpx;
		
		.grid-text {
			color: #303133;
		}
	}
}
</style>
