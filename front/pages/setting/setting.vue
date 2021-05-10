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
		<view class="list-item"	@click="show = true">
			<u-section 
				:showLine="false" 
				title="清空缓存" 
				:bold="false" 
				subTitle=""
			></u-section>
		</view>

		<u-modal v-model="show" @confirm="clearCache" content="确认清空缓存吗？" :show-cancel-button="true">
		</u-modal>

		<u-button class="u-margin-20" type="error" @click="toLogout">退出登陆</u-button>
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
					title: "个人资料",
					action: "/pages/setting/profile"
				},
				{
					title: "收货地址",
					action: "/pages/delivery/delivery"
				},
				{
					title: "账号",
					action: "/pages/setting/accont/accont"
				},
				{
					title: "关于",
					action: "/pages/about/about"
				},
			],
			show: false
		}),
		methods:{
			...mapMutations(['logout']),

			goTo(url){
				uni.navigateTo({url})
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm) this.logout();
				    }
				});
			},
			logout() {
				this.$store.dispatch("log/logout")
				this.$store.dispatch("chat/disconnect")
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			clearCache() {
				this.$store.commit("chat/clearMessageList")
			}
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