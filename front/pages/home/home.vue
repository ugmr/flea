<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="header">
			<!-- 定位城市 -->
			<view class="addr" @tap="toLocation">
				{{ city || '位置' }}
				<u-icon class="icon" name="map"></u-icon>
			</view>
			<!-- 搜索框 -->
			<view class="input-box">
				<input
					placeholder="关键字"
					placeholder-style="color:#c0c0c0;"
					@tap="toSearch()"
				/>
				<view class="icon search"></view>
			</view>
			<!-- 右侧图标按钮 -->
			<view class="icon-btn" @tap="toSort()">
				<u-icon class="icon" name="grid"></u-icon>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 轮播图 -->
		<view class="swiper">
			<view class="swiper-box">
				<swiper circular="true" autoplay="true" @change="swiperChange">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id">
						<image :src="swiper.img" @tap="toSwiper(swiper)"></image>
					</swiper-item>
				</swiper>
				<view class="indicator">
					<view
						class="dots"
						v-for="(swiper, index) in swiperList"
						:class="[currentSwiper >= index ? 'on' : '']"
						:key="index"
					></view>
				</view>
			</view>
		</view>
		<!-- 分类列表 -->
		<view class="category-list">
			<view
				class="category"
				v-for="sort in sortList"
				:key="sort.id"
				@tap="toCategory(sort.id)"
			>
				<view class="img"><image :src="sort.cover"></image></view>
				<view class="text">{{ sort.name }}</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="title">
				<image src="/static/img/hua.png"></image>
				 猜你喜欢 
				<image src="/static/img/hua.png"></image>
			</view>
			<view class="list">
				<u-waterfall v-model="goodsList" ref="waterfall">
					<template v-slot:left="{leftList}">
						<goods-item :goods="item" v-for="(item, index) in leftList" :key="index"></goods-item>
					</template>
					<template v-slot:right="{rightList}">
						<goods-item v-for="(item, index) in rightList" :key="index" :goods="item"></goods-item>
					</template>
				</u-waterfall>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
		<!-- 登录提示 -->
		<view class="tool-tip" v-if="!isLogin">
			<view class="content">
				<u-icon class="content-icon" name="bell-fill" size="50"></u-icon>
				<text class="content-title">登录使用更多功能</text>
			</view>
			<view>
				<u-button shape="circle" size="mini" type="primary" @click="toLogin">立即登录</u-button>
			</view>
		</view>
		<!-- 底部导航栏 -->
		<tab-bar></tab-bar>
	</view>
</template>

<script>
import { mapState } from "vuex"

export default {
	data: () => ({
		// 轮播图片
		swiperList: [],
		currentSwiper: 0,
		// 分类菜单
		sortList: [],
		//商品列表
		goodsList: [],
		count: 0,
		page: 1,
		countPerPage: 5,
		loadingText: '正在加载...'
	}),
	computed: {
		...mapState("location", ["city", "longitude", "latitude"]),
		...mapState("log", ["isLogin"])
	},
	//上拉加载
	onReachBottom() {
		let len = this.goodsList.length;
		if (len >= this.count) {
			this.loadingText = '到底了';
			return false;
		}
		this.getGoodsList()
	},
	async onLoad() { 
		try { 
			const location = await this.$store.dispatch("location/GET_LOCATION") 
			this.changeLocation(location) 
		} catch(e) { 
			console.log(e) 
		}
		await this.getAdvertList() 
		await this.getGoodsList() 
		await this.getSortList()
	},
	methods: {
		//分类跳转
		toSort(){
			uni.navigateTo({
				url:'./sort'
			})
		},
		// 地址
		toLocation() {
			uni.navigateTo({
				url:'./location'
			})
		},
		//搜索跳转
		toSearch() {
			uni.navigateTo({
				url: "/pages/search/search"
			})
		},
		//轮播图跳转
		toSwiper(e) {
			uni.navigateTo({
				url: '/pages/goods/goods?goodsId=' + e.src
			});
		},
		//分类跳转
		toCategory(e) {
			uni.navigateTo({
				url: '/pages/search/searchResult?sort=' + e
			});
		},
		toLogin() {
			uni.navigateTo({
				url: "/pages/log/login"
			})
		},
		//轮播图指示器
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		// 修改地址
		async changeLocation({province, city, longitude, latitude }) {
			this.$store.commit("location/SET_LOCATION", { province, city, longitude, latitude }) 
			
			this.goodsList = []
			this.count = 0
			this.page = 1
			this.$refs.waterfall.clear()
			await this.getGoodsList()
		},
		// 获取推广列表 
		async getAdvertList() {
			const result = await this.$api.getAdvert({}, {}, {limit: 4});
			this.swiperList = result.adverts
		}, 
		// 获取商品列表 
		async getGoodsList() {
			try {
				const result = await this.$api.getRecommendGoods({
					longitude: this.longitude,
					latitude: this.latitude,
					limit: this.countPerPage,
					maxDistance: 10,
					skip: this.countPerPage * (this.page - 1)
				});
				for(let i = 0; i < result.goods.length; i ++) {
					this.$set(this.goodsList, this.goodsList.length + i, result.goods[i])
				}
				this.count = result.count; 
				this.page ++; 

				if(this.count == 0) {
					this.loadingText = "到底了"
				}
			} catch(e) { console.log(e); }
		}, 
		// 获取分类列表
		async getSortList() {
			const result = await this.$api.getSortList({
				conditions: {
					show: true,	
				},
				options: {
					limit: 8
				},
			});
			
			this.sortList = result.category;
		}
	}
};
</script>

<style lang="scss" scoped>

.status {
	width: 100%;
	height: 0;
	position: fixed;
	z-index: 10;
	background-color: #fff;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height); //覆盖样式
	/*  #endif  */
}
.header {
	width: 100%;
	padding: 0 4%;
	height: 100rpx;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: $uni-bg-color-grey;

	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */

	.addr {
		width: 140rpx;
		height: 60rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		.icon {
			height: 60rpx;
			display: flex;
			align-items: center;
			font-size: 36rpx;
			color: #ffc50a;
		}
	}
	.input-box {
		width: 100%;
		height: 60rpx;
		background-color: #f5f5f5;
		border-radius: 30rpx;
		position: relative;
		display: flex;
		align-items: center;
		.icon {
			display: flex;
			align-items: center;
			position: absolute;
			top: 0;
			right: 0;
			width: 60rpx;
			height: 60rpx;
			font-size: 34rpx;
			color: #c0c0c0;
		}
		input {
			padding-left: 20rpx;
			height: 28rpx;
			font-size: 28rpx;
		}
	}
	.icon-btn {
		width: 60rpx;
		height: 60rpx;
		flex-shrink: 0;
		display: flex;
		justify-content: flex-end;
		.icon {
			width: 60rpx;
			height: 60rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 42rpx;
		}
	}
}
.place {
	background-color: $uni-bg-color-grey;
	height: 100rpx;
	/*  #ifdef  APP-PLUS  */
	margin-top: var(--status-bar-height);
	/*  #endif  */
}
.swiper {
	width: 100%;
	margin-top: 20rpx;
	display: flex;
	justify-content: center;
	.swiper-box {
		width: 92%;
		height: 30.7vw;

		overflow: hidden;
		border-radius: 15rpx;
		box-shadow: 0rpx 8rpx 25rpx rgba(0, 0, 0, 0.2);
		//兼容ios，微信小程序
		position: relative;
		z-index: 1;
		swiper {
			width: 100%;
			height: 30.7vw;
			swiper-item {
				image {
					width: 100%;
					height: 30.7vw;
				}
			}
		}
		.indicator {
			position: absolute;
			bottom: 20rpx;
			left: 20rpx;
			background-color: rgba(255, 255, 255, 0.4);
			width: 150rpx;
			height: 5rpx;
			border-radius: 3rpx;
			overflow: hidden;
			display: flex;
			.dots {
				width: 0rpx;
				background-color: rgba(255, 255, 255, 1);
				transition: all 0.3s ease-out;
				&.on {
					width: (100%/3);
				}
			}
		}
	}
}

.category-list {
	width: 92%;
	margin: 0 4%;
	padding: 0 0 30rpx 0;
	border-bottom: solid 2rpx #f6f6f6;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.category {
		width: 25%;
		margin-top: 50rpx;
		display: flex;
		flex-wrap: wrap;
		.img {
			width: 100%;
			display: flex;
			justify-content: center;
			image {
				width: 9vw;
				height: 9vw;
			}
		}
		.text {
			margin-top: 16rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24rpx;
			color: #3c3c3c;
		}
	}
}

.goods-list {
	padding: 0 10rpx;
	.title {
		width: 100%;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		color: #f47825;
		font-size: 30rpx;
		margin-top: 10rpx;
		image {
			width: 30rpx;
			height: 30rpx;
		}
	}
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60rpx;
		color: #979797;
		font-size: 24rpx;
	}
	.product-list {
		width: 100%;
		padding: 0 4% 3vw;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
}

.tool-tip {
	position: fixed;
	bottom: 100rpx;
	left: 0;
	width: 100%;
	padding: 20rpx;
	background-color: rgba(0, 0, 0, 0.5);

	display: flex;
	align-items: center;
	justify-content: space-between;

	.content {
		display: flex;
		align-items: center;
		&-icon{
			color: pink;
		}	

		&-title {
			margin-left: 20rpx;
			font-weight: bold;
			color: #fff;
		}
	}
}
</style>


