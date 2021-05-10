<template>
	<view class="wrapper">
		<u-navbar :is-back="true" :custom-back="prevStep" title="快速注册" :isFixed="true"></u-navbar>
		<view class="register" v-show="step === 1">
			<text class="register-title">欢迎注册</text>
			<view class="register-form" ref="registerForm">
				<view class="register-form-item">
					<span>
						+86 
						<u-icon name="arrow-right" color="#909399" size="24"></u-icon>
					</span>
					<u-input 
						class="u-margin-left-20 input" 
						v-model="mobile" 
						type="number" 
						maxlength="11" 
						placeholder="请输入手机号" 
						:focus="true"
					></u-input>
				</view>
			</view>
			<view class="register-button">
				<u-button type="primary" @click="getCode(true)" :disabled="!isValidMobile">下一步</u-button>
			</view>
		</view>
		<view class="code" v-show="step === 2">
			<text class="code-title">输入短信验证码</text>
			<text class="code-subtitle">验证码已发送至<text class="code-subtitle-mobile">（+86）{{mobile}}</text></text>
			<view class="code-form" >
				<u-message-input 
					v-model="code"
					mode="bottomLine" 
					:maxlength="6" 
					:focus="true" 
					:breathe="false" 
					:bold="false"
					@finish="checkCode"
				></u-message-input>
			</view>
			<text :class="['code-text', intervalId ? 'code-text-active' : '']" @click="reGetCode">重新获取{{intervalId ? ` (${clock}) ` : ""}}</text>
		</view>
		<view class="success" v-show="step === 3">
			<view class="success-title">设置基本信息</view>
			<u-form class="success-form" ref="passwordForm">
				<u-form-item>
					<view class="u-flex u-col-center">
						<view class="u-flex-10">
							<u-input 
								v-model="userName" 
								type="text" 
								maxlength="20" 
								placeholder="请输入用户名" 
								:focus="true"
							>
							</u-input>
						</view>
						<view class="u-flex-2">
							<u-button type="primary" size="mini" @click="checkUserName">检查</u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item>
					<u-input 
						v-model="password" 
						type="password" 
						maxlength="20" 
						placeholder="请输入密码" 
						:focus="true"
					></u-input>
				</u-form-item>
				<u-form-item>
					<u-input 
						v-model="repeat" 
						type="password" 
						maxlength="20" 
						placeholder="重复输入密码" 
					></u-input>
				</u-form-item>
			</u-form>
			<view class="success-button">
				<u-button type="primary" @click="register">完成注册</u-button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view> 
</template>

<script>
	import * as api from "../../api";
	const ppattern = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/;
	
	export default {
		data: () => ({
			step: 1,
			intervalId: null,
			clock: 0,
			code: "",
			mobile: "",
			userName: "",
			password: "",
			repeat: "",
		}),
		computed: {
			isValidMobile() {
				const valid = /^1[3456789]\d{9}$/.test(this.mobile);
				return valid;
			}
		},
		methods: {
			// 跳转
			goTo(url) {
				uni.navigateTo({url})
			},
			// 上一步
			nextStep() {
				if(++this.step > 3) {
					this.step = 1;
				}
			},
			// 下一步
			prevStep() {
				if(--this.step <= 0) {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			
			async getCode(next) {
				try {
					const result = await api.checkMobile({mobile: this.mobile});
					
					if(result.exist) {
						return this.$refs.uToast.show({
							title: "手机号已被注册",
							type: "error"
						})
					} 
					await api.getCode({
						mobile: this.mobile,
						type: "REGISTER"
					})
					
					next && this.nextStep();
				} catch(e) {
					console.log(e)
				}
			},
			reGetCode() {
				if(this.intervalId) {
					return
				}
				this.clock = 60;
				this.intervalId = setInterval(() => {
					this.clock--;
				}, 1000)
				this.getCode(false);
			},
			async checkCode(value) {
				try {
					const result = await api.checkCode({
						mobile: this.mobile,
						code: value,
						type: "REGISTER"
					});
					
					if(result.valid) {
						this.nextStep();
					} else {
						this.$refs.uToast.show({
							title: "验证码错误",
							type: "error"
						})
					}
				} catch (e) {
					this.$refs.uToast.show({
						title: "验证码校验失败",
						type: "error"
					});
				}
			},
			
			// 用户注册
			async register () {
				const toast = this.$refs.uToast;
				if(!this.userName) {
					return toast.show({
						title: "请输入用户名",
						type: "error"
					})
				}
				else if(!this.password) {
					return toast.show({
						title: '请输入密码',
						type: 'error',
					})
					return;
				} else if (!this.repeat) {
					return toast.show({
						title: '请重复输入密码',
						type: 'error',
					});
				}
				else if(!ppattern.test(this.password) || !ppattern.test(this.repeat)) {
					return toast.show({
						title: '密码格式错误',
						type: 'error'
					})
				}
				else if(this.password !== this.repeat) {
					return toast.show({
						title: '两次密码输入不一致',
						type: 'error',
					})
				} else {
					if(!this.checkUserName()) return;

					try {
						await api.register({
							mobile: this.mobile,
							password: this.password,
							userName: this.userName
						});
						this.goTo('/pages/log/login');
					} catch (e) {
						toast.show({
							title: "注册失败",
							type: "error"
						})
					}
				}
			},
			// 检查用户名是否重复
			async checkUserName() {
				if(!this.userName) return;
				const result = await api.checkUsername({
					userName: this.userName
				})
				if(result.exist) {
					this.$refs.uToast.show({
						title: "用户名已存在",
						type: "error"
					})
					return false;
				} else {
					return this.$refs.uToast.show({
						title: "用户名可用",
						type: "success"
					})
					return true
				}
			}
		},
		watch: {
			clock: function(newValue) {
				if(this.intervalId && newValue <= 0) {
					clearInterval(this.intervalId);
					this.intervalId = null;
					this.clock = 0;
				}
			}
		},
		onReady() {
			this.$refs.passwordForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss">

.wrapper {
	height: 100%;
	padding-top: 100rpx;
}

.register {
	padding: 0 80rpx;

	&-title {
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
	&-button {
		margin-top: 60rpx;
	}
}

.code {
	padding: 0 60rpx;

	&-title {
		display: block;
		font-size: 48rpx;
		color: #303133;
	}
	
	&-subtitle {
		display: block;
		font-size: 24rpx;
		color: #606266;
		margin-top: 20rpx;
		
		&-mobile {
			color: #2979ff;
		}
	}
	
	&-form {
		margin-top: 180rpx;
	}
	
	&-button {
		margin-top: 60rpx;
	}
	
	&-text {
		display: block;
		margin-top: 50rpx;
		font-size: 24rpx;
		color: #2979ff;
		
		&-active {
			color: #909399;
		}
	}
}

.success {
	padding: 0 60rpx;

	&-title {
		font-size: 48rpx;
		color: #303133;
		margin-bottom: 180rpx;
	}
	
	&-button {
		margin-top: 60rpx;
	}
}

</style>
