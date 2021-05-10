<template>
	<view>
		<view class="content">
			<!-- 商品信息 -->
			<div class="goods">
				<!-- 发布者信息 -->
				<view class="user-info" @click="toUserPage(post.user.id)">
					<view class="user-info-avator">
						<u-avatar :src="post.user.profilePhoto" size="mini"></u-avatar>
					</view>
					<view class="user-info-content">
						<view>
							<text class="user-info-username">{{post.user.userName}}</text>
						</view>
						<view class="user-info-address">
							发布于{{post.createdAt | publishTime}}
						</view>
					</view>
				</view>
				<!-- 简介 -->
				<view class="intro">
					{{post.content}}
				</view>
				<!-- 商品图片 -->
				<view class="photos">
					<u-image
						class="u-margin-top-10"
						v-for="(photo, i) in post.photo"
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
				<text class="comments-title">
					全部留言
				</text>
				<!-- 输入框 -->
				<view class="comments-input">
					<view class="avatar">
						<u-avatar :src="userInfo.profilePhoto" size="48"></u-avatar>
					</view>
					<view class="input">
						<u-input 
						:disabled="true" 
						:border="true"
						:height="48"
						@click="toggleMask"
					></u-input>
					</view>
				</view>
				
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
										发布于{{child.createdAt | publishTime}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view v-else class="empty">
					<u-empty mode="list" text="还没有人留言"></u-empty>
				</view>
				
			</view>
		</view>
		<ygc-comment 
			ref="ygcComment" 
			:placeholder="'发布评论'" 
			:extra="parentName"
			@pubComment="pubComment"
		></ygc-comment>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	export default {
		components: {ygcComment},
		data: () => ({
			postId: "",
			post: {
				user: {
					profilePhoto: "",
					userName: "发布者",
				},
				content: "这里什么也没有哦",
				photo: [],
			},
			comments: [],
			count: 0,
			parentName: "",
			parentId: "",
		}),
		computed: {
			...mapState("log", ["userInfo"]),
			isSelf() {
				return this.userInfo.id == this.post.userId
			}
		},
		methods: {
			async getData() {
				const result = await this.$api.getPostInfo(this.postId)
				this.post = result.post
				
				const comments = await this.$api.getPostComments(this.postId)
				this.comments = comments.comments
				this.count = comments.count
				console.log(this.comments)
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
			async pubComment(content) {
				if(!content) return 

				await this.$api.publishPostComment(this.postId, {
					id: this.postId,
					parentId: this.parentId || null,
					userId: this.userInfo.id,
					content
				})
				this.getData()
				this.toggleMask()
			},
			toBuyPage() {
				uni.navigateTo({
					url: "/pages/buy/buy?goodsId=" + this.goods.id
				})
			},
			toEditPage() {
				uni.navigateTo({
					url: '/pages/publish/publish?goodsId=' + this.goods.id
				})
			},
			toUserPage(id) {
				uni.navigateTo({
					url: "/pages/userInfo/userInfo?userId=" + id
				})
			}
		},
		onLoad({postId}) {
			this.postId = postId
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>

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
			color: $uni-color-paragraph;
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

			.avatar {
				flex: 0 0 60rpx;
			}
			.input {
				flex: 1;
			}
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
