<template>
	<u-keyboard
		ref="uKeyboard" 
		v-model="show"
		@change="valChange"
		@backspace="backspace"
		@confirm="onConfirm"
	>
		<view :class="['keyboard-price', `ac-${active}`]">
			<view class="input">
				<view class="input-label">价格</view>
				<view class="input-content" @click="active = 1">
					<text :class="['text', priceActive ? 'text-active': '']">¥</text>
					<text :class="['input-content-value', 'text', priceActive ? 'text-active' : '']">
						{{priceActive ? price : "0.00" }}
					</text>
					<text v-if="active === 1" :class="['block', priceActive ? 'block-active': '']"></text>
				</view>
			</view>
			
			<view class="input">
				<view class="input-label">原价</view>
				<view class="input-content" @click="active = 2">
					<text :class="['text', oldPriceActive? 'text-active': '']">¥</text>
					<text :class="['input-content-value', 'text', oldPriceActive ? 'text-active': '']">
						{{ oldPriceActive ? oldPrice : "0.00" }}
					</text>
					<text v-if="active === 2" :class="['block', oldPriceActive ? 'block-active': '']"></text>
				</view>
			</view>
			
			<view class="input">
				<view class="input-label">运费</view>
				<view class="input-content" @click="active = 3">
					<text :class="['text', freightActive ? 'text-active': '']">¥</text>
					<text :class="['input-content-value', 'text', freightActive ? 'text-active': '']">
						{{ freightActive ? freight : "0.00" }}
					</text>
					<text v-if="active === 3" :class="['block', freightActive ? 'block-active': '']"></text>
				</view>
				<div class="right">
					<u-checkbox 
						v-model="noFreight" 
						@change="changeFreight"
					>包邮</u-checkbox>
				</div>
			</view>
		</view>
	</u-keyboard>
</template>

<script>
	export default {
		props: ["value"],
		data:() => ({
			show: false,
			active: 1,
			price: "1",
			oldPrice: "",
			freight: "",
			noFreight: false
		}),
		computed: {
			priceActive() {
				return this.price !== "";
			},
			oldPriceActive() {
				return this.oldPrice !== "";
			},
			freightActive() {
				return this.freight !== "";
			}
		},
		methods: {
			showKeyBoard({price, oldPrice, freight}) {
				this.price = price;
				this.oldPrice = oldPrice;
				this.freight = freight;
				this.show = true;
			},
			valChange(value) {
				let temp = this.getValue()
				
				if(this.active === 3 && this.noFreight) return;
				
				const dotIndex = temp.indexOf(".");
				const left = dotIndex == -1 ? temp.length : dotIndex;
				const right = dotIndex == -1 ? 0 : (temp.length -1 - dotIndex);
				if(dotIndex !== -1 && value === ".") return;
				if(dotIndex !== -1 && right >= 2) return;
				if(left >= 9 && !(value === "." || (dotIndex !== -1 && left >= 2))) return
				
				temp += value;
				
				this.setValue(temp);
			},
			backspace() {
				let temp = this.getValue();
				
				if(temp.length >= 1) {
					temp = temp.substring(0, temp.length - 1);
				}
				
				this.setValue(temp);
			},
			changeFreight(value) {
				this.freight = value.value ? "包邮" : "";
			},
			onConfirm(){
				this.$emit("confirm", {
					price: parseFloat(this.price === "" ? "0" : this.price),
					oldPrice: parseFloat(this.oldPrice === "" ? "0": this.oldPrice),
					freight: parseFloat(this.freight === "包邮" || this.freight == "" ? "0" : this.freight)
				})
			},
 			getValue() {
				return this.active === 1
					? this.price : this.active === 2 
					? this.oldPrice : this.freight;
			},
			setValue(value) {
				switch(this.active) {
					case 1: 
						this.price = value;
						break;
					case 2:
						this.oldPrice = value;
						break;
					case 3:
						this.freight = value;
						break;
				}
			}
		},
	}
</script>

<style lang="scss">

.keyboard-price {
	padding: 20rpx 40rpx;
	background-color: #fff;

	.input {
		padding: 10rpx 4rpx;
		
		display: flex;
		align-items: center;
		justify-content: flex-start;
		
		&-label {
			font-weight: 600;
			font-size: 30rpx;
			color: black;
		}
		
		&-content {
			flex: 1;
			position: relative;
			margin-left: 20rpx;
			padding: 6rpx 0;
			font-size: 34rpx;
			outline: none;
			border-bottom: 1px solid $uni-border-color;
			
			&-value {
				margin-left: 10rpx;
			}
		}
		
		.block{
			display: inline-block;
		}
		
		.right {
			margin-bottom: -12rpx;
			border-bottom: 1px solid $uni-border-color;
		}
	}
}

@keyframes myAnimation {
  0% {
    opacity: 0;
    filter: alpha(opacity=0)
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100)
  }
}
.block {
	margin-top: 20rpx;
	position: absolute;
	top: 6rpx;
	left: 24rpx;
	display: none;
	height: 28rpx;
	width: 4rpx;
	-webkit-animation: myAnimation 1s infinite;
	animation: myAnimation 1s infinite;
	background-color: $uni-color-primary;
	
	&-active {
		position: relative;
		top: 0;
		left: 2rpx;
	}
}
.text{
	color: #909399;
	
	&-active {
		color: #303133;
	}
}

</style>
