<template>
	<view>
		<!-- 导航栏 -->
		<u-navbar :is-back="true" title="参与话题" :isFixed="true">
		</u-navbar>
		<view class="topic">
			<u-image width="64" height="64"></u-image>
			<text class="topic-title">{{'#  ' + topicName + '  #'}}</text>
		</view>

		<view class="input">
			<u-input 
				type="textarea" 
				:clearable="false"
				placeholder="说点什么"
				v-model="content"
				height="200"
				:customStyle="{
					'font-size': '30rpx'
				}"
			></u-input>
			
			<view class="upload">
				<u-upload
					ref="uUpload"
					:action="action" 
					:header="header"
				></u-upload>
			</view>
		</view>
		<view class="submit">
			<u-button 
			:type="content == '' ? 'info' : 'primary'" 
			shape="circle" 
			:disable="content == ''"
			@click="publish"
		>发布</u-button>
		</view>
	</view>
</template>

<script>
	import { getToken } from "../../../utils"

	export default {
		data: () => ({
			topic: {},
			topicId: "",
			keyword: "",
			content: "",

			// 图片上传配置
			action: "http://1.116.185.67:3000/api/common/v1/upload",
			header: {
				"Authorization": getToken(),
			},
		}),
		computed: {
			topicName() {
				return this.keyword ? this.keyword : this.topic.name
			}
		},
		methods: {
			// 获取话题信息
			async getData() {
				const result = await this.$api.getTopic(this.topicId)
				this.topic = result.topic
			},
			// 发布帖子
			async publish() {
				if((!this.topicId || this.topic.id) && !this.keyword) return
				
				const files = this.$refs.uUpload.lists.filter(item => {
					return item.progress == 100;
				}).map(item => {
					return item.response.url.replace("blob:");
				})

				let topicId

				if(this.keyword) {
					const result = await this.$api.createTopic({
						name: this.keyword
					})
					topicId = result.topic._id
				} else {
					topicId = this.topicId
				}
				
				await this.$api.createPost({
					userId: this.$store.state.log.userInfo.id,
					topicId,
					content: this.content,
					photo: files,
				})

				uni.navigateBack({
					delta: 2
				})
			}
		},
		onLoad({topicId, keyword}) {
			keyword && (this.keyword = keyword)

			if(topicId) {
				this.topicId = topicId
				this.getData()
			}
		}
	}
</script>

<style lang="scss" scoped>
.topic {
	margin: 20rpx 20rpx 0;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	
	display: flex;
	align-items: center;
	justify-content: flex-start;

	&-title {
		margin-left: 20rpx;
		color: #000;
	}
}

.input {
	margin: 20rpx 20rpx;
	padding: 10rpx 30rpx;
	border-radius: $uni-border-radius-base;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.1);
	background-color: #fff;
}

.upload {
	padding: 20rpx 10rpx;
	background-color: #fff;
}

.submit {
	padding: 20rpx 10rpx;
}
</style>
