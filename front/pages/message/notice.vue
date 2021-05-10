<template>
    <view class="wrap">
        <view class="notice-list">
            <view
                class="notice"
                v-for="notice in noticeList"
                :key = "notice._id"
            >
                <view>{{notice.createdAt.slice(0, 10)}}</view>
                <view class='card'>
                    <view class="card-title">{{notice.title}}</view>
                    <view class="card-content">{{notice.content}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState } from "vuex"

export default {
    data: () => ({

    }),
    computed: {
        ...mapState("chat", ["noticeList"])
    },
    watch: {
        noticeList: {
            immediate: true,
            handler: function() {
                this.$store.dispatch("chat/clearNotice");
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			},
        }
    },
    methods: {
        scrollToBottom() {
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 9999,
					duration: 0
				});
			}, 50)
		},
    },
    mounted() {
        this.$store.dispatch("chat/clearNotice");
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    padding: 20rpx;
}

.notice-list {
    .notice {
        margin-bottom: 20rpx;
        text-align: center;
        & .card {
            margin-top: 20rpx;
            width: 100%;
            padding: 40rpx;
            border-radius: 20rpx;
            background-color: #fff;
            text-align: left;

            &-title {
                color: #000;
                font-weight: 400;
                font-size: 34rpx;
            }

            &-content {
                margin-top: 20rpx;
                font-size: 28rpx;
                color: $uni-text-color-grey;
            }
        }
    }
}
</style>