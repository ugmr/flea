<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// 解决页面刷新时，登陆信息丢失的问题
			const token = uni.getStorageSync("token");
			
			let userInfo = uni.getStorageSync("userInfo");
			if(userInfo && token) {
				this.$store.commit("log/reload", {userInfo})
				this.$store.dispatch("chat/init")
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang=scss>
	/*每个页面公共css */
	@import "static/fonts/iconfont.css";
	@import "uview-ui/index.scss";
	
	/* html,body,#app {height: 100%;} */
	uni-page-body,page,#app {
		height: 100%;
		background-color: $uni-bg-color-grey;
	}
</style>
