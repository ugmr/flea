<template>
	<view class="wrapper">
		<view v-if="goodsList.length">
			<view class="goods-item" v-for="item in goodsList" :key="item._id">
				<view class="goods-item-header" @click="toGoodsPage(item._id)">
					<u-image class="goods-item-header-image" :src="item.cover" width="140" height="140"></u-image>
					<view class="goods-item-header-info">
						<view class="goods-item-header-info-title">{{item.name}}</view>
						<view class="goods-item-header-info-price">¥{{item.price}}</view>
						<view class="goods-item-header-info-data">收藏 {{item.collect}}</view>
					</view>
				</view> 
				<view class="goods-item-footer">
					<u-button v-if="item.status !== 2" shape="circle" size="mini" @click="toEdit(item._id)">编辑</u-button>
					<u-button shape="circle" size="mini" @click="showAction(item._id)">
						<u-icon name="more-dot-fill"></u-icon>
					</u-button>
				</view>
				<view v-if="item.status !== 1" class="check">
					{{ item.status === 0 ? "审核中" : "审核未通过"}}
				</view>
			</view>
		</view>
			
		<view v-else class="empty">
			<u-empty></u-empty>
		</view>
		
		<u-action-sheet :list="actionList" v-model="action" :cancelBtn="true" @click="onClick" @close="onClose"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data: () => ({
			goodsList: [],
			actionId: "",
			action: false,
			actionList: [
				{ text: "删除", color: "red"},
			]
		}),

		methods: {
			async getData() {
				const result = await this.$api.getGoodsList({
					conditions: {
						userId: this.$store.state.log.userInfo.id,
						num: {$gt: 0}
					}
				})

				this.goodsList = result.goods
				
				console.log(this.goodsList)
			},
			showAction(id){
				this.actionId = id
				this.action = true
			},
			async onClick(index) {
				if(index == 0) {
					await this.deleteGoods()
				}
				this.actionId = ""
				await this.getData()
			},
			onClose() {
				this.actionId = ""
			},
			async deleteGoods() {
				if(this.actionId == "") return
				await this.$api.deleteGoods(this.actionId)
			},
			toGoodsPage(id) {
				uni.navigateTo({
					url: "/pages/goods/goods?goodsId=" + id
				})
			},
			toEdit(id) {
				uni.navigateTo({
					url: "/pages/goods/publish?goodsId=" + id
				})
			}
		},

		onLoad() {
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>

.wrapper {
	width: 100%;
}

.empty {
	padding-top: 50%;
}

.goods-item {
	margin: 20rpx;
	padding: 20rpx 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	position: relative;
	&-header {

		&-image {
			margin-top: 20rpx;
			float: left;
		}

		&-info {
			margin-left: 188rpx;

			&-title {
				color: #000;
				font-size: 32rpx;
			}

			&-price {
				margin-top: 20rpx;
				color: $uni-color-error;
			}

			&-data {
				margin-top: 20rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
		}
	}

	&-footer {
		padding: 20rpx 20rpx 0;
		text-align: right;

		& .u-btn {
			margin-left: 20rpx;
		}
	}
	& .check {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		color: $uni-color-error;
	}
}



</style>
