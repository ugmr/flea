<template>
	<view class="wrapper">
		<u-form ref="uForm" labelWidth="200" class="form" :model="delivery">
			<u-form-item label="收货人" prop="name">
				<u-input v-model="delivery.name" placeholder="请输入收货人姓名" :clearable="false"/>
			</u-form-item>
			<u-form-item label="手机号码" prop="mobile">
				<u-input v-model="delivery.mobile" type="number" maxlength="11" placeholder="请输入手机号码" :clearable="false"/>
			</u-form-item>
			<u-form-item label="省市区" prop="area">
				<u-input 
					:value="area"
					:disabled="true" 
					placeholder="请选择地址"
					@click="showPicker = true"
				></u-input>
				<u-picker v-model="showPicker" mode="region" @confirm="pickRegion"></u-picker>
			</u-form-item>
			<u-form-item label="详细地址" prop="address">
				<u-input v-model="delivery.address" placeholder="请输入详细地址" :clearable="false"/>
			</u-form-item>
			<u-form-item label="默认地址">
				<u-switch v-model="delivery.default" activeColor="#4cd964" size="40"></u-switch>
			</u-form-item >
			<u-form-item v-show="isEdit" label="删除收货地址" :labelStyle="{'color': '#dd524d'}" @click="deleteDelivery">
			</u-form-item>
		</u-form>
		<u-button type="primary" class="bottom" @click="saveDelivery">保存地址</u-button>
	</view>
</template>

<script>
	export default {
		data: () => ({
			delivery: {
				name: "",
				mobile: "",
				province: "",
				city: "",
				district: "",
				address: "",
				default: false,
				area: ""
			},
			rules: {
				name: [
					{ required: true, message: '请输入姓名' }
				],
				mobile: [
					{ required: true, message: '请输入手机号码' }
				],
				area: [
					{ required: true, message: '请输入地址' }
				],
				address: [
					{ required: true, message: '请输入详细地址' }
				]
			},
			showPicker: false
		}),
		computed: {
			isEdit() {
				return !!this.delivery._id
			},
			area() {
				return this.delivery.province + this.delivery.city + this.delivery.district
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			pickRegion(region) {
				this.delivery.province = region.province.label
				this.delivery.city = region.city.label
				this.delivery.district = region.area.label
				
				this.delivery.area = this.area
			},
			async deleteDelivery() {
				await this.$api.deleteDelivery(this.delivery._id)
				this.back()
			},
			saveDelivery() {
				const that = this
				this.$refs.uForm.validate(valid => {
					console.log(valid)
					if(!valid) return
					delete that.delivery.area
					that.isEdit ? that.edit() : that.save()
					that.back()
				})
			},
			async save() {
				await this.$api.addDelivery(this.delivery)
			},
			async edit() {
				await this.$api.editDelivery(this.delivery._id, this.delivery)
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(obj) {
			obj.delivery && (this.delivery = JSON.parse(obj.delivery))
			this.delivery.area = this.area
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		height: 100%;
		padding: 10rpx 40rpx;
		display: flex;
		flex-direction: column;
	}
	
	.form {
		flex: 1;
	}
	
	.bottom {
		width: 100%;
	}
</style>
