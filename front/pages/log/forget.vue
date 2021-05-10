<template>
	<view class="wrapper">
		<u-navbar :is-back="true" :custom-back="prevStep" title="重制密码" :isFixed="true"></u-navbar>
		<view class="register" v-show="step === 1">
			<view class="register-title">重制密码</view>
			<u-form ref="registerForm">
				<view class="u-flex u-col-center">
					<span>
						+86 
						<u-icon name="arrow-right" color="#909399" size="24"></u-icon>
					</span>
					<u-input 
						class="u-margin-left-20" 
						v-model="mobile" 
						type="number" 
						maxlength="11" 
						placeholder="请输入手机号" 
						:focus="true"
					></u-input>
				</view>
			</u-form>
			<view class="register-button">
				<u-button type="primary" @click="getCode(true)" :disabled="!isValidMobile">下一步</u-button>
			</view>
		</view>
		<view class="code" v-show="step === 2">
			<text class="code-title">输入短信验证码</text>
			<text class="code-subtitle">验证码已发送至<span class="code-subtitle-mobile">（+86）{{mobile}}</span></text>
			<u-message-input 
				v-model="code"
				class="code-form" 
				mode="bottomLine" 
				:maxlength="6" 
				:focus="true" 
				:breathe="false" 
				:bold="false"
				@finish="checkCode"
			></u-message-input>
			<text :class="['code-text', intervalId ? 'code-text-active' : '']" @click="reGetCode">重新获取{{intervalId ? ` (${clock}) ` : ""}}</text>
		</view>
		<view class="reset" v-show="step === 3">
			<view class="reset-title">修改密码</view>
			<u-form class="reset-form" ref="passwordForm">
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
			<u-button class="reset-button" type="primary" @click="reset">修改密码</u-button>
		</view>
		<view class="success" v-show="step == 4">
			<view class="success-title">密码修改成功</view>
			<u-button class="success-button" type="primary" @click="goTo('/pages/log/login')">返回登录</u-button>
		</view>
		<u-toast ref="uToast" />
		<u-modal 
			v-model="showModal" 
			content="该手机号还未注册,是否前往注册？" 
			:show-cancel-button = "true"
			@confirm="goTo('/pages/register/register')" 
			@cancel="showModal = false"
		></u-modal>
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
			showModal: false,
			code: "",
			mobile: "",
			userName: "",
			password: "",
			repeat: ""
		}),
		computed: {
			isValidMobile() {
				const valid = /^1[3456789]\d{9}$/.test(this.mobile);
				return valid;
			}
		},
		methods: {
			goTo(url) {
				uni.navigateTo({url})
			},
			nextStep() {
				if(++this.step > 4) {
					this.step = 1;
				}
			},
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

					if(!result.exist) {
						this.showModal = true;
						return;
					} 
					await api.getCode({
						mobile: this.mobile,
						type: 0
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
						type: "RESET"
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
			async reset () {
				const toast = this.$refs.uToast;
				if(!this.password) {
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
				} 
				else {
					try {
						const result = await api.resetPassword({
							mobile: this.mobile,
							password: this.password,
						});
						this.nextStep();
						console.log(result)
					} catch (e) {
						toast.show({
							title: "密码修改失败",
							type: "error"
						})
					}
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
	padding: 80rpx;
	
	&-title {
		font-size: 48rpx;
		color: #303133;
		margin-bottom: 120rpx;
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

.reset {
	padding: 60rpx;
	
	&-title {
		font-size: 48rpx;
		color: #303133;
	}
	
	&-form {
		margin-top: 180rpx;
	}
	
	
	&-button {
		margin-top: 60rpx;
	}
}

.success {
	padding: 60rpx;
	
	&-title {
		margin-top: 60rpx;
		font-size: 48rpx;
		color: #303133;
		text-align: center;
	}
	
	&-button {
		margin-top: 60rpx;
	}
}
</style>
