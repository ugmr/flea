<template>
	<view>
		<view class="content">
			<!-- 头像 -->
			<view class="list-item" @click="chooseImage">
				<u-section title="头像" :showLine="false">
					<view slot="right" class="u-flex u-col-center">
						<u-avatar :src="info.profilePhoto" width="100" height="100" ></u-avatar>
						<u-icon class="u-margin-left-16" name="arrow-right"></u-icon>
					</view>
				</u-section>
			</view>
			<!-- 用户名 -->
			<view class="list-item" @click="showUserNameModel">
				<u-section 
					:showLine="false" 
					title="昵称" 
					:bold="false" 
					:subTitle="info.userName" 
				>
				</u-section>
				<u-modal 
					v-model="showUserName" 
					title="修改昵称" 
					confirmText="修改"
					:showCancelButton="true"
					@confirm="updateUserName" 
					@cancel="showUserName = false"
				>
					<view class="u-padding-40">
						<u-input 
							placeholder="请输入昵称" 
							v-model="userName"
							:border= "true"
						></u-input>
					</view>
				</u-modal>
			</view>
			<!-- 性别 -->
			<view class="list-item" @click="showGender = true">
				<u-section 
					:showLine="false" 
					title="性别" 
					:bold="false" 
					:subTitle="gender"
				>
				</u-section>
				<u-select 
					v-model="showGender" 
					:list="genderMap" 
					@confirm="updateGender"
				></u-select>
			</view>
			<!-- 生日 -->
			<view class="list-item" @click="showBirthday = true">
				<u-section 
					:showLine="false" 
					title="生日" 
					:bold="false" 
					:subTitle="info.birthday.toLocaleString().slice(0, 10)" 
				>
				</u-section>
				<u-calendar v-model="showBirthday" @change="updateBirthday"></u-calendar>
			</view>
			<!-- 地址 -->
			<view class="list-item" @click="showAddress = true">
				<u-section 
					:showLine="false" 
					title="地址" 
					:bold="false" 
					:subTitle="info.address"
				>
				</u-section>
				<u-picker v-model="showAddress" mode="region" @confirm="updateAddress"></u-picker>
			</view>
			<!-- 简介 -->
			<view class="list-item" @click="showIntro = true">
				<u-section 
					:showLine="false" 
					title="简介" 
					:bold="false" 
					:right="false"
				>
				</u-section>
				<view class="u-margin-40">
					<u-input 
						placeholder="赶快介绍一下自己" 
						v-model="info.intro" 
						type="textarea" 
						:border="true"
						height="150"
						@input="updateIntro"
					></u-input>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import { getToken, debounce } from "../../utils"
	
	export default {
		data: () => ({
			info: {
				birthday: new Date()
			},
			userName: "",
			showUserName: false,
			showGender: false,
			genderMap: [
				{label: "男", value: "male"},
				{label: "女", value: "female"},
			],
			showBirthday: false,
			showAddress: false,
			showIntro: false,
		}),
		computed: {
			...mapState("log", ["userInfo"]),
			gender() {
				return {
					"male": "男",
					"female": "女"
				}[this.info.gender]
			}
		},
		methods: {
			async getUserInfo() {
				const result = await this.$api.getUserInfo(this.userInfo.id)
				this.info = result.user;
			},
			async chooseImage() {
				const that = this;
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						try {
							const image = res.tempFiles[0]
							uni.uploadFile({
								url: "http://192.168.2.225:3000/api/common/v1/upload",
								methods: "POST",
								file: image,
								name: "file",
								filePath: image.path,
								fileType: "image",
								header: {
									"Authorization": getToken()
								},
								success: async (res) => {
									const { url } = JSON.parse(res.data)
									that.info.profilePhoto = url;
									await this.updateUserInfo()
								},
							})
						} catch(e) {
							console.log(e)
						}
					},
				})
			},
			async updateUserInfo() {
				await this.$api.updateUserInfo(this.info);
				await this.getUserInfo()
				this.$store.commit("log/update", {
					profilePhoto: this.info.profilePhoto,
					userName: this.info.userName
				})
			},
			showUserNameModel() {
				this.userName = this.info.userName
				this.showUserName = true
			},
			async updateUserName() {
				if(this.userName == this.info.userName) return this.showUserName = false;
				const result = await this.$api.checkUsername({userName: this.userName});
				if(result.data.exist) {
					return this.$refs.uToast.show({
						title: "用户名已被使用",
						type: "error"
					})
				}
				this.info.userName = this.userName
				await this.updateUserInfo()
			},
			updateGender(value) {
				const gender = value[0].value
				if(gender == this.info.gender) 
					return
				this.info.gender = gender
				this.updateUserInfo()
			},
			updateBirthday(value) {
				const date = new Date(value.result)
				this.info.birthday = date
				this.updateUserInfo()
			},
			updateAddress(value) {
				this.info.address = value.province.label 
					+ value.city.label + value.area.label
				this.updateUserInfo()
			},
			updateIntro: debounce(function () {
				this.updateUserInfo()
			}, 500)
		},
		onLoad() {
			this.getUserInfo()
		}
	}
</script>

<style lang="scss">
	.list-item {
		padding: 26rpx 40rpx;
		background-color: #fff;
		margin-top: 4rpx;
	}
	
	.u-image {
		display: inline-block;
	}
</style>
