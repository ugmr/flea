<template>
	<view>
		<view class="content">
			<!-- 商品信息 -->
			<div class="goods">
				<!-- 发布者信息 -->
				<view class="user-info" @click="toUserPage(goods.user.id)">
					<view class="user-info-avator">
						<u-avatar :src="goods.user.profilePhoto" size="mini"></u-avatar>
					</view>
					<view class="user-info-content">
						<view>
							<text class="user-info-username">{{goods.user.userName}}</text>
							<u-tag class="u-margin-left-40" v-show="goods.user.credit >= 80" :text="goods.user.credit >= 90 ? '信用极好' : '信用良好' " size="mini" shape="circle"/>
						</view>
						<view class="user-info-address">
							发布于{{goods.address}}
						</view>
					</view>
				</view>
				<!-- 价格 -->
				<view class="price">
					<text class="price-prefix">¥</text>
					<text>{{goods.price}}</text>
				</view>
				<!-- 详细信息 -->
				<view class="detail">
					<view class="detail-item">
						<text class="detail-item-text">商品分类: </text>
						<text class="detail-item-value">{{goods.category.name}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-item-text">成色: </text>
						<text class="detail-item-value">{{goods.new}}</text>
					</view>
				</view>
				<!-- 简介 -->
				<view class="intro">
					{{goods.intro}}
				</view>
				<!-- 商品图片 -->
				<view class="photos">
					<u-image
						class="u-margin-top-10"
						v-for="(photo, i) in goods.introPhoto"
						:src="photo"
						:key="i"
						width="100%"
						mode="widthFix"
					></u-image>
				</view>
			</div>
			<!-- 商品评论 -->
			<view class="comments">
				<!-- 评论标题 -->
				<text class="comments-title">全部留言</text>
				<!-- 输入框 -->
				<view class="comments-input">
					<u-avatar :src="userInfo.profilePhoto" size="48"></u-avatar>
					<u-input 
						class="u-margin-left-20" 
						:disabled="true" 
						:border="true"
						:height="48"
						@click="toggleMask"
					></u-input>
				</view>
				<!-- 评论列表 -->
				<view v-if="count > 0">
					<!-- 评论列表 -->
					<view class="comments-list">
						<!-- 评论 -->
						<view class="comments-item" v-for="comment in comments" :key="comment._id">
							<!-- 评论头部 -->
							<view class="u-flex u-row-between">
								<view class="u-flex u-col-center" @click="toUserPage(comment.user.id)">
									<view class="comments-item-avatar">
										<u-avatar :src="comment.user.profilePhoto" size="48"></u-avatar>
									</view>
									<view class="comments-item-username">
										{{comment.user.userName}}
									</view>
								</view>
							</view>
							<!-- 评论内容 -->
							<view class="comments-item-content" @click="toggleMask(comment)">
								{{comment.content}}
							</view>
							<!-- 评论时间 -->
							<view class="comments-item-time">
								发布于{{comment.createdAt | publishTime}}
							</view>
							<!-- 回复信息 -->
							<view class="comments-item-children">
								<!-- 评论 -->
								<view class="comments-item" v-for="child in comment.children" :key="child.id">
									<!-- 评论头部 -->
									<view class="u-flex u-row-between" @click="toUserPage()">
										<view class="u-flex u-col-center">
											<view class="comments-item-avatar">
												<u-avatar :src="child.user.profilePhoto" size="48"></u-avatar>
											</view>
											<view class="comments-item-username">
												{{child.user.userName}}
											</view>
										</view>
									</view>
									<!-- 评论内容 -->
									<view class="comments-item-content" @click="toggleMask(comment)">
										{{child.content}}
									</view>
									<!-- 评论时间 -->
									<view class="comments-item-time">
										发布于{{ child.createdAt | publishTime }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 评论为空图片 -->
				<view v-else class="empty">
					<u-empty mode="list" text="还没有人留言"></u-empty>
				</view>
			</view>
		</view>
		<view class="footer">
			<view v-if="goods.num > 0">
				<view class="footer-icon" @click="collect">
					<u-icon v-if="goods.isCollect" name="star-fill" color="primary" size="42"></u-icon>
					<u-icon v-else name="star" size="42"></u-icon>
					<view class="footer-icon-text">收藏</view>
				</view>
			</view>
			<view v-if="goods.num == 0">
				<u-button  class="footer-button" plain type="info" shape="circle" size="mini">
					<view class="footer-button-text">
						卖掉了
					</view>
				</u-button>
			</view>
			<view v-else-if="isSelf">
				<u-button class="footer-button" plain type="info" shape="circle" size="mini" @click="toEditPage">
					<view class="footer-button-text">
						编辑商品
					</view>
				</u-button>
			</view>
			<view v-else>
				<u-button class="footer-button" plain type="info" shape="circle" size="mini" @click="toChatPage">
					<view class="footer-button-text">
						聊一聊
					</view>
				</u-button>
				<u-button class="footer-button" type="primary" shape="circle" size="mini" @click="toBuyPage">
					<view class="footer-button-text">
						立即购买
					</view>
				</u-button>
			</view>
		</view>
		<ygc-comment 
			ref="ygcComment" 
			:placeholder="'发布评论'" 
			:extra="parentName"
			@pubComment="pubComment"
		></ygc-comment>

		<u-action-sheet :list="actionList" v-model="action" :cancelBtn="true" @click="onClick"></u-action-sheet>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	export default {
		components: {ygcComment},
		data: () => ({
			goods: {
				user: {
					profilePhoto: "",
					userName: "发布者",
					credit: 0,
				},
				price: 800,
				intro: "这里什么也没有哦",
				introPhoto: [],
				isCollect: false,
				category: { name: ""}
			},
			comments: [],
			count: 0,
			parentName: "",
			parentId: "",
			action: false,
			actionList: [
				{ text: "加入黑名单", color: "black"},
				{ text: "举报", color: "red"}
			]
		}),
		computed: {
			...mapState("log", ["userInfo"]),
			isSelf() {
				return this.userInfo.id == this.goods.userId
			}
		},
		methods: {
			async getComments(id) {
				const result = await this.$api.getGoodsComments(id)
				this.comments = result.comments
				this.count = result.count
			},
			async getGoodsInfo(id) {
				const result = await this.$api.getGoodsInfo(id)
				this.goods = result.goods
				
				console.log(this.goods)
			},
			async getData(id) {
				await this.getGoodsInfo(id)
				await this.getComments(id)
			},
			toggleMask(comment) {
				if(comment) {
					this.parentName = comment.user.userName
					this.parentId = comment.id
				}else {
					this.parentName = ""
					this.parentId = ""
				}
				this.$refs.ygcComment.toggleMask()	
			},
			// 发布评论
			async pubComment(content) {
				if(!content) return 

				await this.$api.publishComment(this.goods.id, {
					id: this.goods.id, 
					parentId: this.parentId || null,
					userId: this.userInfo.id,
					content
				})
				this.getComments(this.goods.id)
				this.toggleMask()
			},
			async collect() {
				const hasCollect = this.goods.isCollect
				if(!hasCollect) {
					await this.$api.collectGoods({
						userId: this.$store.state.log.userInfo.id,
						goodsId: this.goods.id
					})
				} else {
					await this.$api.cancelCollect(this.goods.id)
				}
				this.goods.isCollect = !hasCollect
			},
			toBuyPage() {
				uni.navigateTo({
					url: "/pages/buy/buy?goodsId=" + this.goods.id
				})
			},
			toEditPage() {
				uni.navigateTo({
					url: '/pages/goods/publish?goodsId=' + this.goods.id
				})
			},
			toUserPage(id) {
				uni.navigateTo({
					url: "/pages/userInfo/userInfo?userId=" + id
				})
			},
			toChatPage() {
				uni.navigateTo({
					url: "/pages/message/chat?userId=" + this.goods.user.id
				})
			},
		},
		onLoad({goodsId}) {
			this.getData(goodsId)
		}
	}
</script>

<style lang="scss" scoped>

.detail {
	margin-top: 40rpx;
	font-size: 24rpx;
	&-item {
		padding: 10rpx 0;
		
		&-text {
			font-weight: bold;
		}
		
		&-value {
			margin-left: 20rpx;
		}
	}
}

.content {
	margin-bottom: 120rpx;
	
	.goods {
		padding: 10rpx 40rpx;
		background-color: #fff;
		
		.user-info {
			padding: 30rpx 0rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			
			border-bottom: 1px solid $uni-border-color;
			
			&-avator {
				flex: 0;
			}
			
			&-content {
				flex: 1;
				margin-left: 24rpx;
			}
			
			&-address {
				color: $uni-text-color-grey;
				font-size: $uni-font-size-sm;
			}
			
			&-username {
				font-size: $uni-font-size-base;
				font-weight: bold;
			}
		}
		
		.price {
			margin-top: 40rpx;
			color: $uni-color-error;
			font-size: $uni-font-size-subtitle;
			font-weight: bold;
			&-prefix {
				font-size: $uni-font-size-base;
				font-weight: normal;
				margin-right: 10rpx;
			}
		}
		
		.intro {
			margin-top: 40rpx;
			font-size: $uni-font-size-paragraph;
			font-weight: normal;
			color: $uni-text-color;
		}
		
		.photos {
			margin-top: 40rpx;
		}
	}
	
	.comments {
		margin-top: 30rpx;
		padding: 20rpx 40rpx 120rpx;
		background-color: #fff;
		
		&-title {
			font-weight: bold;
		}
		
		&-input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 40rpx;
		}
		
		&-list {
			margin-top: 40rpx;
		}
		
		&-item {
			padding: 20rpx 0;
			border-top: 1px solid $uni-border-color;
			
			&-username {
				font-weight: bold;
			}
			
			&-avatar {
				width: 60rpx;
				margin-top: 10rpx;
			}
			
			&-content {
				margin-left: 60rpx;
				margin-top: 10rpx;
			}
			
			&-time {
				margin-left: 60rpx;
				margin-top: 20rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
			
			&-children {
				margin-top: 30rpx;
				margin-left: 40rpx;
			}
		}
		
	}
	
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
	
	&-icon {
		display: inline-block;
		margin-right: 30rpx;
		
		&-text {
			font-size: $uni-font-size-sm;
		}
	}
	
	&-button {
		margin-left: 12rpx;
		
		&-text {
			font-size: $uni-font-size-sm;
			font-weight: bolder;
		}
	}
}

.empty {
	margin-top: 100rpx;
}
</style>
