<template>
	<view class="content">
		<!-- 左侧一级分类 -->
		<scroll-view scroll-y class="left-aside">
			<view 
				v-for="(item, index) in category" 
				:key="item.id" 
				class="f-item b-b" 
				:class="{active: index === currentId}" 
				@click="currentId = index"
			>
				{{item.name}}
			</view>
		</scroll-view>
		<!-- 右侧二级分类 -->
		<view class="right-aside">
			<u-grid :col="3" :border="false">
				<u-grid-item 
					v-for="item in children" 
					:key="item.id"
					bgColor="#f8f8f8" 
					:customStyle="{margin: '20rpx 0',padding: '0'}"
					@click="searchItem(item.id)"
				>
					<view class="grid-item">
						<u-icon :name="item.cover ? item.cover : 'photo'" :size="80"></u-icon>
						<view class="grid-text">{{item.name}}</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
	export default {
		data: () => ({
			// 当前一级分类ID
			currentId: 0,
			// 一级分类列表
			category: []
		}),
		computed: {
			children() {
				if(!this.category[this.currentId]) return []
				
				return this.category[this.currentId].children
			}
		},
		async onLoad(){
			await this.loadData();
		},
		methods: {
			// 加载数据
			async loadData(){
				let result = await this.$api.getSortList({
					conditions: {
						show: false
					}
				});
				this.category = result.category;
			},
			searchItem(categoryId) {
				uni.navigateTo({
					url: `/pages/search/searchResult?sort=` + categoryId
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		font-size: 28rpx;
		color: $uni-text-color;
		position: relative;
		
		&.active{
			color: $uni-color-primary;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $uni-bg-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		margin: 10rpx 10rpx 0;
	}
	
	.grid-text {
		margin-top: 20rpx;
		font-size: 20rpx;
		white-space: nowrap;
	}
	
	.grid-item {
		padding: 20rpx 40rpx;
		background-color: #fff;
		border-radius: 16rpx;
		text-align: center;
	}
</style>
