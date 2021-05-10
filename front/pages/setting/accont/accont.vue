<template>
	<view>
		<view class="list-item" v-for="item in items" :key="item.title"	@click="goTo(item.action)">
			<u-section 
				:showLine="false" 
				:title="item.title" 
				:bold="false" 
				subTitle=""
			></u-section>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data: () => ({
			items: [
				{
					title: "修改密码",
					action: "/pages/setting/accont/password"
				},
				{
					title: "注销账号",
					action: "/pages/setting/accont/signoff"
				},
			]
		}),
		methods:{
			goTo(url){
				uni.navigateTo({url})
			},
		}
	}
</script>

<style lang='scss'>
	
	
	.list-item {
		padding: 30rpx 40rpx;
		background-color: #fff;
		margin-top: 4rpx;
		
		&:nth-child(1), &:nth-child(5) {
			margin-top: 20rpx;
		}
	}
</style>