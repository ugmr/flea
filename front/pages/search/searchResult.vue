<template>
	<view class="wrapper" >
		<u-tabs-swiper 
			v-if="!onlyGoods"
			ref="tabs" 
			:current="currentTab" 
			:list="[
				{ name: '商品' },
				{ name: '帖子' },
			]" 
			:is-scroll="false"
			height="5%"
			@change="changeTab"
		></u-tabs-swiper>
		<swiper :current="swiperCurrent" class="swiper">
			<swiper-item class="swiper-item">
				<scroll-view v-if="goodsList.length" scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<u-waterfall v-model="goodsList" ref="uWaterfall">
						<template v-slot:left="{leftList}">
							<goods-item	:goods="item" v-for="item in leftList" :key="item.id"></goods-item>
						</template>
						<template v-slot:right="{rightList}">
							<goods-item :goods="item" v-for="item in rightList" :key="item.id"></goods-item>
						</template>
					</u-waterfall>
				</scroll-view>
				<view v-else class="empty">
					<u-empty text="搜索结果为空"></u-empty>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item" v-if="!onlyGoods">
				<scroll-view v-if="postList.length" scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<post-item v-for="post in postList" :post="post" :key="post.id"></post-item>
				</scroll-view>
				<view v-else class="empty">
					<u-empty text="搜索结果为空"></u-empty>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data: () => ({
			keyword: "",
			sort: "",
			
			currentTab: 0,
			swiperCurrent: 0,
			goodsList: [],
			postList: [],
			userList: [],
			count: 0,
		}),
		computed: {
			onlyGoods() {
				return !!this.sort;
			}
		},
		methods: {
			getData() {
				if(!this.keyword && !this.sort) return
				if(this.currentTab == 0) {
					this.getGoodsList()
				} else if(this.currentTab == 1){
					this.getPostList()
				}
			},
			changeTab(index) {
				this.currentTab = index;
				this.swiperCurrent = index;
				this.getData()
			},
			async getGoodsList() {
				if(this.sort) {
					const result = await this.$api.getGoodsList({
						conditions: {
							name: this.keyword,
							category: this.sort,
							num: {$gt: 0}
						}
					})
					this.goodsList = result.goods
					this.count = result.count
				}
				else {
					const result = await this.$api.search({
						keyword: this.keyword,
						type: "goods"
					})
					console.log(result)
					this.goodsList = result.result
					this.count = result.result.length
				}
			},
			async getPostList() {
				const result = await this.$api.search({
					keyword: this.keyword,
					type: "post"
				})
				this.postList = result.result
				this.count = result.result.length
			},
			toGoodsPage(id) {
				uni.navigateTo({
					url: "/pages/goods/goods?goodsId=" + id
				})
			},
		},
		onLoad({keyword, sort}) {
			this.keyword = keyword
			this.sort = sort
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
	
.wrapper {
	height: 100%;
}
.swiper {
	height: 95%;
	padding: 20rpx 0;
}

.empty {
	margin-top: 40%;
}

.goods-list-wrapper {
	background-color: #fff;
}

</style>
