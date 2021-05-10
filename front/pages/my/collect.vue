<template>
	<view class="wrapper">
		<view v-if="collectList.length">
			<view class="goods-item" v-for="collect in collectList" :key="collect._id">
				<view class="goods-item-header" @click="toGoodsPage(collect.goods._id)">
					<u-image class="goods-item-header-image" :src="collect.goods.cover" width="140" height="140"></u-image>
					<view class="goods-item-header-info">
						<view class="goods-item-header-info-title">{{collect.goods.name}}</view>
						<view class="goods-item-header-info-price">¥{{collect.goods.price}}</view>
						<view class="goods-item-header-info-data">收藏 {{collect.collect}}</view>
					</view>
				</view> 
				<view class="goods-item-footer">
					<u-button size="mini" @click="showConfirmModal(collect.goods._id)">取消收藏</u-button>
				</view>
			</view>
		</view>
		<view v-else class="empty">
			<u-empty text="收藏列表为空"></u-empty>
		</view>

		<u-modal v-model="showModal" :content="content" :show-cancel-button="true" @confirm="cancelCollect"></u-modal>
	</view>
</template>

<script>
	export default {
		data: () => ({
			collectList: [],
			showModal: false,
			content: "确认取消收藏吗？",
			cancelId: ""
		}),
		methods: {
			async getData() {
				const result = await this.$api.getCollectList(
					this.$store.state.log.userInfo.id
				)

				this.collectList = result.list

				console.log(result)
			} ,
			async cancelCollect() {
				await this.$api.cancelCollect(this.cancelId)
				this.getData()
			},
			showConfirmModal(id) {
				this.cancelId = id
				this.showModal = true
			},
			toGoodsPage(id) {
				uni.navigateTo({
					url: "/pages/goods/goods?goodsId=" + id
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
	height: 100%;
}
.empty {
	height: 80%;
	display: flex;
	justify-content: center;
	align-items: center;
}
	

.goods-item {
	margin: 20rpx;
	padding: 20rpx 20rpx;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	background-color: #fff;
	
	background-color: #fff;

	&-header {

		&-image {
			margin-top: 10rpx;
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
}
</style>
