<template>
	<view ref="tabRef">
		<u-tabbar
			:list="tabList"
			:borderTop="borderTop"
			:inactiveColor="inactiveColor"
			:activeColor="activeColor"
			:midButton="midButton"
			:midButtonSize="midButtonSize"
			:before-switch="beforeSwitch"
			:height="100"
		></u-tabbar>
		<u-popup v-model="show" mode="bottom" :transparent="true">
			<view class="publish-wrapper">
				<view class="publish-list">
					<view class="publish-item" @click="toAddGoodsPage">
						<u-image class="publish-item-image" src="/static/images/add-goods.png" shape="circle" width="100" height="100"></u-image>
						<view class="publish-item-title">发布商品</view>
					</view>
					<view class="publish-item" @click="toAddPostPage">
						<u-image class="publish-item-image" src="/static/images/add-post.png" shape="circle" width="100" height="100"></u-image>
						<view class="publish-item-title">发布帖子</view>
					</view>
				</view>
				<view class="close-button" @click="show = false">
					<u-icon name="close" size="30"></u-icon>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		name: "tabbar",
		data: () => ({
			show: false,
			tabList: [
				{
					iconPath: "home",
					selectedIconPath: "home-fill",
					text: '首页',
					customIcon: false,
					midButton: false,
					pagePath: '/pages/home/home'
				},
				{
					iconPath: "flea-icon flea-icon-topic",
					selectedIconPath: "flea-icon flea-icon-topic-fill",
					text: '话题',
					customIcon: "flea-icon",
					midButton: false,
					pagePath: '/pages/topic/topic'
				},
				{
					iconPath: "/static/images/plus-square-fill.png",
					customIcon: false,
					midButton: true,
				},
				{
					iconPath: "chat",
					selectedIconPath: "chat-fill",
					text: '消息',
					count: 1,
					isDot: false,
					customIcon: false,
					midButton: false,
					pagePath: '/pages/message/message'
				},
				{
					iconPath: "account",
					selectedIconPath: "account-fill",
					text: '我的',
					customIcon: false,
					midButton: false,
					pagePath: '/pages/my/my'
				}
			],
			borderTop: true,
			inactiveColor: '#909399',
			activeColor: '#5098FF',
			midButton: false,
			midButtonSize: 68
		}),
		computed: {
			...mapState("log", ["isLogin"]),
			hasNew() { 
				return this.$store.getters.hasNew
			}
		},
		methods: {
			// 使用NavigateTo跳转，修复发布页面无法返回的问题
			async beforeSwitch(index) {
				const isLogin = this.$store.state.log.isLogin
				if (!isLogin && index >= 2) {
					uni.navigateTo({
						url: "/pages/log/login"
					})
					return false;
				} 
				else if (index === 2) {
					this.show = true
					return false;
				}
				return true
			},
			toAddGoodsPage() {
				uni.navigateTo({
					url: "/pages/goods/publish"
				})
				this.show = false
			},	
			toAddPostPage() {
				uni.navigateTo({
					url: "/pages/topic/search?mode=add"
				})
				this.show = false
			}
		},
		watch: {
			hasNew: {
				immediate: true,
				handler: function(newVal,oldVal) {
					this.tabList[3].count = newVal
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.publish-wrapper {
	background: transparent;
	
	.publish-list {
		.publish-item {
			padding: 40rpx 30rpx;
			display: flex;
			align-items: center;
			
			&-image {
				margin-right: 20rpx;
			}

			&-title {
				flex: 1;
				color: #fff;
				font-size: 36rpx;
			}
		}
	}

	.close-button {
		width: 60rpx;
		height: 60rpx;
		margin: 20rpx auto;
		border-radius: 60rpx;
		background-color: #fff;

		text-align: center;
		line-height: 60rpx;
	}
}
</style>
