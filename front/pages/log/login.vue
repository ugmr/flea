<template>
	<view class="wrapper">
		<view class="login">
			<text class="login-title">欢迎登陆</text>
			<view class="login-form" ref="loginForm">
				<view class="login-form-item">
					<view>
						+86 
						<u-icon name="arrow-right" color="#909399" size="24"></u-icon>
					</view>
					<u-input class="u-margin-left-20 input" v-model="mobile" type="number" maxlength="11" placeholder="请输入手机号" :focus="true"></u-input>
				</view>
				<view class="login-form-item">
					<u-input class="input" type="password" v-model="password" placeholder="请输入密码" maxlength="20" :password-icon="true"></u-input>
				</view>
			</view>
			<button class="u-margin-top-40" type="primary" @click="login">登陆</button>
			
			<view class="login-options">
				<text @click="goTo('/pages/log/forget')">忘记密码</text>
				<text @click="goTo('/pages/log/register')">立即注册</text>
			</view>
		</view>
		
		<view class="footer">
			登陆代表同意用户协议，隐私政策，并授权使用您的账号信息（如昵称，头像，收货地址）以便您统一管理
		</view>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	const mPattern = /^1[3456789]\d{9}$/;
	export default {
		data: () => ({
			mobile: "",
			password: "",
		}),
		methods: {
			goTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			async login() {
				if(!this.mobile || !mPattern.test(this.mobile)) {
					return this.$refs.uToast.show({
						title: "请输入正确的手机号码",
						type: "error"
					})
				}
				if(!this.password) {
					return this.$ref.uToast.show({
						title: "请输入密码",
						type: "error"
					})
				}
				
				try {
					await this.$store.dispatch("log/login", {
						mobile: this.mobile,
						password: this.password
					});
					
					this.$store.dispatch("chat/init")
					
					uni.switchTab({
						url: "/pages/home/home"
					});
				} catch(e) {
					console.log(e)
					this.$refs.uToast.show({
						title: "用户名或密码错误",
						type: "error"
					})
				}
			}
		}
	}
</script>

<style lang="scss">

.wrapper {
	height: 100%;
	position: relative;
	overflow: hidden;
}

.login {
	margin-top: 100rpx;
	padding: 0 120rpx;
	
	&-title {
		margin-left: -60rpx;
		font-size: 48rpx;
		color: #303133;
	}
	
	&-form {
		margin-top: 80rpx;
		
		&-item {
			display: flex;
			align-items: center;
			padding: 30rpx 0;

			.input {
				flex: 1;
			}
		}
	}
	
	&-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40rpx;
		
	}
}

.footer {
	margin-top: 200rpx;
	padding: 0 100rpx;
	color: #909399;
}

</style>
