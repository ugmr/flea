<template>
	<view>
		<view class="search-wrapper">
			<!-- #ifdef H5-->
			<u-icon name="arrow-left" size="32" class="u-margin-right-20" @click="back"></u-icon>
			<!-- #endif -->
			<u-search class="search" v-model="keyword" @search="search" @custom="search"></u-search>
		</view>
		<view class="content">
			<view class="search-record">
				<view class="record-title">
					<text>历史搜索</text>
					<u-icon name="trash" color="#828282" size="38" @click="confirmDialog = true"></u-icon>
				</view>
				<view class="record-list">
					<u-tag 
						class="record-item" 
						v-for="(item, i) in history" 
						:key="i" 
						:index="item"
						:text="item" 
						type="info" 
						shape="circle"
						bg-color="#f3f4f6"
						border-color="#f2f6fc"
						color="#606266"
						@click="searchItem"
					>
					</u-tag>
				</view>
				<u-modal
					v-model="confirmDialog" 
					content="确认删除全部搜索记录吗?"
					:show-cancel-button="true"
					:mask-close-able="true"
					:async-close="true"
					negative-top="20"
					@confirm="confirmClear"
					@cancel="confirmDialog = false"
				>
				</u-modal>
			</view>
		</view>
	</view>
</template>

<script>
	import { getHistory, setHistory, clearHistory } from "../../utils"
	
	export default {
		data: () => ({
			keyword: "",
			history: [],
			confirmDialog: false,
		}),
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			searchItem(item) {
				uni.navigateTo({
					url: "/pages/search/searchResult?keyword=" + item
				})
			},
			search() {
				this.keyword && setHistory(this.keyword)
				this.history = getHistory()
				uni.navigateTo({
					url: "/pages/search/searchResult?keyword=" + this.keyword
				})
			},
			confirmClear() {
				this.history = []
				clearHistory()
				this.confirmDialog = false
			},
		},
		onLoad() {
			this.history = getHistory()
		}
	}
</script>

<style lang="scss">
	
.search-wrapper {
	width: 100%;
	padding: 20rpx;
	display: flex;
	align-items: center;
}

.search {
	width: 100%;
}

.content {
	padding: 20rpx 20rpx;
	
}

.search-record {
	margin-top: 20rpx;
	padding: 0 30rpx;
	font-size: 32rpx;
	
	.record-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.record-list {
		margin: 20rpx 10rpx 0;
		
		.record-item {
			margin: 20rpx 10rpx 0;
		}
	}
}

</style>
