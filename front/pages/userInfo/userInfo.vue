<template>
	<view class="wrapper">
		<u-navbar :is-back="true" title="用户详情" :isFixed="true">
			<view slot="right" class="nav-wrapper" v-show="!isSelf" @click="action = true">
				<u-icon name="more-dot-fill" size="40"></u-icon>
			</view>
		</u-navbar>
		<!-- 用户基本信息 -->
		<user-sheet :user="userInfo" :right="false"></user-sheet>
		<!-- 选项卡 -->
		<view class="u-margin-top-20">
			<u-tabs-swiper 
				ref="uTabs" 
				:list="list" 
				:current="current" 
				@change="tabsChange" 
				:is-scroll="false"
			></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" class="swiper" height="auto">
			<!-- 商品列表 -->
			<swiper-item class="swiper-item">
				<view v-if="goodsList.length">
					<u-waterfall v-model="goodsList">
						<template v-slot:left="{leftList}">
							<goods-item :goods="item" v-for="(item, index) in leftList" :key="index"></goods-item>
						</template>
						<template v-slot:right="{rightList}">
							<goods-item v-for="(item, index) in rightList" :key="index" :goods="item"></goods-item>
						</template>
					</u-waterfall>
				</view>
				<view v-else class="empty">
					<u-empty text="他还没有发布过商品"></u-empty>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;">
					<view v-if="postList.length">
						<post-item :showRight="false" :post="post" v-for="post in postList" :key="post.id"></post-item>
					</view>
					<view v-else class="empty">
						<u-empty text="他还没有发布过帖子"></u-empty>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

		<u-action-sheet :list="actionList" v-model="action" :cancelBtn="true" @click="onClick"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data: () => ({
			userInfo: {},
			list: [
				{ name: "商品" },
				{ name: "帖子" },
			],
			current: 0,
			swiperCurrent: 0,
			goodsList: [],
			postList: [],
			action: false,
			actionList: [
				{ text: "加入黑名单", color: "black"},
			]
		}),

		computed: {
			isSelf() {
				return this.userInfo.id == this.$store.state.log.userInfo.id
			}
		},

		methods: {
			async getData(id) {
				const result = await this.$api.getUserInfo(id)
				this.userInfo = result.user
				console.log(result)
			},
			async getGoodsList() {
				const result = await this.$api.getGoodsList({
					conditions: {
						userId: this.userInfo.id
					}
				})
				this.goodsList = result.goods
			},
			async getPostList() {
				const result = await this.$api.getPostList({
					conditions:{
						userId: this.userInfo.id
					}
				})
				this.postList = result.posts
			},
			tabsChange(index) {
				this.current = index;
				this.swiperCurrent = index;
				console.log(index)
				if(index == 0) {
					this.getGoodsList()
				}
				else if(index == 1){
					this.getPostList()
				}
			},
			onClick(index) {
			}
		},
		onLoad({userId}) {
			this.getData(userId)
			this.getGoodsList()
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		height: 100%;
		padding: 20rpx 30rpx 0;
	}

	.collect {
		border-top: 1px solid $uni-border-color;
		background-color: #fff;
		padding: 40rpx 40rpx 20rpx 20rpx;
		
		&-user-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			&-username {
				font-size: $uni-font-size-lg;
				color: #000;
			}
			
			&-address {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}
			
			&-price {
				color: $uni-color-error;
				font-size: $uni-font-size-lg;
			}
		}
	
		&-content {
			margin-top: 20rpx;
			
			&-name {
				padding: 0 10rpx;
				font-size: $uni-font-size-lg;
			}
			
			&-photos {
				margin-top: 10rpx;
			}
		}
	
		&-action {
			margin-top: 16rpx;
		}
	}
	
	.empty {
		margin-top: 120rpx;
	}

	.swiper,.swiper-item {
		height: 67.5%;
	}

	.swiper-item {
		margin-top: 20rpx;
	}

	.nav-wrapper {
		margin-right: 20rpx;
	}

</style>
