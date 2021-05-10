<template>
	<view class='issue'>
		<view class="issue-head">
			<slot name="headPic"></slot>
			<u-avatar v-if="headPicShow" :src="headPicValue" class="issue-head-pic"></u-avatar>
			<text v-if="headTitleShow" class="issue-head-title">{{headTitleValue.slice(0,5)}}</text>
			
			<view class="issue-head-star-box" v-if="starsShow">
				<image v-for="(item,index) in starsMax" :key="index" :src="(index+1)>formatScore?starDefault:starActive" :class="formatScore==index+1?'active':''" mode="" @click="setScore(index+1)"></image>
			</view>
		</view>
		 <textarea v-if="textareaShow" @blur="blur" :value="infoReceive.textareaValue" :placeholder="textareaPlaceholder"/>
		 <view class="issue-btn-box">
		 	<button v-if="submitShow" class="submit-btn" type="primary" @click="doSubmit">{{submitText}}</button>
			<slot name="submit"></slot>
		 </view>
	</view>
</template>
<script>
	export default {
		props:{
			headPicShow:{ //图片
				type:[String,Boolean],
				default:true,
			},
			headPicValue:{
				type:String,
				default:'/static/images/st_pic.png'
			},
			
			headTitleShow:{ //标题
				type:[String,Boolean],
				default:true,
			},
			headTitleValue:{
				type:String,
				default:"描述相符"
			},
			
			starsShow:{
				type:[String,Boolean],
				default:true,
			},
			starsMax:{ // 星星最大个数
				type:[String,Number],
				default:5,
			},
			starDefault:{ //未选中
				type:String,
				default: '/static/images/st_star.png'
			},
			starActive:{
				type:String,
				default: '/static/images/st_star_active.png'
			},
			score:{  //默认分数
				type:[Number,String],
				default:0
			},
			starsDisabled:{ //是否禁用star
				type:[Boolean],
				default:false
			},
			
			textareaShow:{ // 多行文本显示
				type:[String,Boolean],
				default:true,
			},
			textareaPlaceholder:{
				type:[String],
				default:"宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧"
			},
			
			
			submitShow:{ // 发布按钮
				type:[String,Boolean],
				default:true,
			},
			submitText:{
				type:String,
				default:"发布",
			},
			
			infoReceive:{ // 获取值
				type:Object,
				default:function(){
					return {
						score:0,
						textareaValue:""
					}
				}
			}
		},
		computed:{
			formatScore(){
				return this.infoReceive.score
			}
		},
		methods: {
			/**
			 * @name 设置分数
			 */
			setScore(score){
				if(this.starsDisabled!==false)return
				this.infoReceive.score=score
				this.$emit("scoreChange",score)
			},
			
			/**
			 * @name 获取textarea内容
			 */
			
			blur(e){
				this.infoReceive.textareaValue=e.detail.value
			},
			
			/**
			 * @name 提交
			 */
			doSubmit(){
				this.$emit('submit',this.infoReceive)
			}
		},
		created() {
			this.infoReceive.score=this.score
		}
	}
</script>
<style lang='scss'>
	$backgroundC:#f9f9f9;
	$borderColor:#f5f5f5;
	$white:#ffffff;
	$fontSize:28rpx;
	
	.issue {
		background-color: $backgroundC;
		
		&-head{
			background-color: $white;
			height: 100rpx;
			border-top: 1rpx solid $borderColor;
			border-bottom: 1rpx solid $borderColor;
			padding: 0 25rpx;
			
			&-pic{
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				vertical-align: middle;
				margin-right: 17rpx;
			}
			&-title{
				line-height: 100rpx;
				font-size: 30rpx;
				vertical-align: middle;
				margin-right: 35rpx;
			}
			
			&-star-box{
				display: inline-block;
				
				image{
					width: 32rpx;
					height: 32rpx;
					vertical-align: middle;
					margin-right: 14rpx;
				}
				image.active{
					animation: star_move ease-in 1 1s,star_rotate ease 1.5s infinite 1s;
				}
			}
		}
		textarea{
			width: 100%;
			height: 420rpx;
			background-color: $white;
			font-size: $fontSize;
			color: #898989;
			padding: 24rpx;
			box-sizing: border-box;
			line-height: 40rpx
		}
		&-btn-box{
			padding: 54rpx 30rpx;
			
			button{
				width: 100%;
				height: 80rpx;
				border-radius: 80rpx;
				font-size: $fontSize;
				background-color: #3682FF;
				line-height: 80rpx
			}
		}
	}
	
	@keyframes star_move{
		from{
			width: 50rpx;
			height: 50rpx;
			transform: rotate(180deg)
		}
		to{
			width: 32rpx;
			height: 32rpx;
			transform: rotate(0)
		}
	}
	@keyframes star_rotate{
		0%{
			transform: rotateY(360deg)
		}
		100%{
			transform: rotateY(180deg)
		}
	}
</style>
