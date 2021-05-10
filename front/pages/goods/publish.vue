<template>
	<view>
		<u-navbar backText="取消" title="发布闲置" :isFixed="true"></u-navbar>
		<view class="form-wrapper">
			<u-form ref="uForm">
				<u-form-item label="商品名称" label-width="150" :required="true">
					<u-input v-model="name"></u-input>	
				</u-form-item>
				<u-form-item label="商品简介" labelPosition="top" :required="true">
					<u-input
						v-model="intro" 
						type="textarea" 
						placeholder="简单的介绍一下你的闲置物品吧" 
						:focus="true"
						:fixed="true"
						:border="false"
						:clearable="false"
						height="200"
					></u-input>	
				</u-form-item>
				<u-form-item label="上传图片" labelPosition="top" :required="true">
					<u-upload 
						ref="uUpload"
						:action="action" 
						:header="header"
					></u-upload>
				</u-form-item>
				<u-form-item>
					<view class="u-margin-left-20">
						<u-tag 
							type="info"
							size="mini"
							shape="circle"
							@click="goTo('/pages/home/location')"
						>
							<u-icon name="map-fill" size="32" class="u-margin-right-8"></u-icon>
							<text>{{address == '' ? '发货地' : address}}</text>
						</u-tag>
					</view>
				</u-form-item>
				<u-collapse>
					<u-collapse-item>
						<view slot="title" class="u-flex u-col-center">
							<u-icon name="list-dot" color="#000" size="32"></u-icon>
							<text class="u-margin-left-8 u-font-md">详细信息</text>
						</view>
						<view class="props">
							<props-item title="分类" :list="sortList" v-model="detail.sort"></props-item>
							<props-item title="成色" :list="newList" v-model="detail.new"></props-item>
						</view>
					</u-collapse-item>
				</u-collapse>
				<u-form-item>
					<u-section 
						title="价格" 
						:sub-title="formatPrice" 
						subColor="red" 
						font-size="28" 
						:bold="false"
						leftIcon="rmb"
						@click="showKeyBoard"
					 ></u-section>
					 <f-input ref="priceInput" @confirm="onConfirm"></f-input>
				</u-form-item>
				<u-button v-if="!goodsId" type="primary" @click="publish">发布</u-button>
				<u-button v-else type="primary" @click="edit">修改</u-button>
			</u-form>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { getToken } from "../../utils"
	
	export default {
		data: () => ({
			// 商品ID
			goodsId: "",

			// 表单信息
			name: "",
			intro: "",
			price: 0,
			oldPrice: 0,
			freight: 0,
			priceInput: "",
			address: "",
			detail: {
				new: "",
				sort: ''
			},
			location: [],
			// 分类列表
			sortList: [],
			
			// 成色列表
			newList: [
				{ label: "全新", value: "全新" },
				{ label: "几乎全新", value: "几乎全新" },
				{ label: "轻微使用痕迹", value: "轻微使用痕迹" },
				{ label: "明显使用痕迹", value: "明显使用痕迹" },
			],

			// 图片上传配置
			action: "http://1.116.185.67:3000/api/common/v1/upload",
			header: {
				"Authorization": getToken(),
			},
		}),
		computed: {
			formatPrice() {
				return "¥" + " " +this.price.toFixed(2);
			}
		},
		methods: {
			goTo(url) {
				uni.navigateTo({url})
			},
			changeLocation({province,city, longitude, latitude}) {
				this.address =
					province == city
						? `${city}`
						: `${province} ${city}`
				this.location = [parseFloat(longitude), parseFloat(latitude)];
			},
			showKeyBoard() {
				const a = {
					price: this.price == 0 ? "" : this.price.toString(),
					oldPrice: this.oldPrice == 0 ? "" : this.oldPrice.toString(),
					freight: this.freight == 0 ? "" : this.freight.toString()
				}
				this.$refs.priceInput.showKeyBoard(a);
			},
			onConfirm({price, oldPrice, freight}) {
				this.price = price;
				this.oldPrice = oldPrice;
				this.freight = freight;
			},
			async getLocation () {
				try {
					const location = await this.$store.dispatch("location/GET_LOCATION");
					console.log(location)
					this.changeLocation(location);
				} catch (e){
					console.log(e)
					this.$refs.uToast.show({
						title: '获取位置失败,请检查GPS权限或设备GPS设置',
						type: 'warning',
					})
				}
			},
			async getGoodsInfo() {
				if(!this.goodsId) return

				const result = await this.$api.getGoodsInfo(this.goodsId);
				const { location, name, intro, freight, introPhoto, price, oldPrice, address, category } = result.goods

				this.name = name
				this.intro = intro
				this.price = price
				this.oldPrice = oldPrice
				this.freight = freight
				this.address = address
				this.location = location
				this.detail.sort = category.id
				this.detail.new = result.goods.new
				introPhoto.forEach(url => this.$refs.uUpload.lists.push({ url }))
			},
			async getSortList() {
				const result = await this.$api.getSortList({
					conditions: {
						show: false
					}
				})

				this.sortList = result.category.map(item => {
					const children = item.children.map(child => {
						return {
							label: child.name,
							value: child.id,
						}
					})
					
					return {
						label: item.name,
						value: item.id,
						children: children
					}
				})
			},
			formatData() {
				const files = this.$refs.uUpload.lists.filter(item => {
					return item.progress == 100;
				}).map(item => {
					if(item.url && this.goodsId) return item.url
					console.log(item)
					return item.response.url.replace("blob:", "");
				})

				return {
					name: this.name,
					userId: this.$store.state.log.userInfo.id,
					intro: this.intro,
					introPhoto: files,
					cover: files[0],
					num: 1,
					new: this.detail.new,
					price: this.price,
					oldPrice: this.oldPrice,
					freight: this.freight,
					address: this.address,
					location: this.location,
					category: this.detail.sort
				}
			},
			async publish() {
				try {
					const goodsInfo = this.formatData()
					await this.$api.publish(goodsInfo)
					
					uni.navigateBack({
						delta: 1
					});
				} catch(e) {
					console.log(e)
					this.$refs.uToast.show({
						title: '商品发布失败',
						type: 'warning',
					})
				}
			},
			async edit () {
				try {
					const goodsInfo = this.formatData()
					console.log(goodsInfo)
					await this.$api.updateGoodsInfo(this.goodsId, goodsInfo)
					uni.navigateBack({
						delta: 1
					});
				} catch(e) {
					console.log(e)
					this.$refs.uToast.show({
						title: '商品修改失败',
						type: 'warning',
					})
				}
			}
		},
		async onLoad({goodsId}) {
			await this.getSortList()
			// 发布
			if(!goodsId) {
				await this.getLocation();
				return
			}
			// 编辑
			this.goodsId = goodsId
			await this.getGoodsInfo()
		}
	}
</script>

<style lang="scss" scoped>

.form-wrapper {
	padding: 20rpx 40rpx 0;
}

.keyboard-price {
	padding: 20rpx 40rpx;
}

.props {
	padding: 20rpx 40rpx;
}


</style>
