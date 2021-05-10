<template>
    <view>
        <my-issue @submit="submit" headTitleValue="交易评价" :headPicValue="profilePhoto"></my-issue>
    </view>
</template>

<script>
export default {
    data: () => ({
        orderId: "",
    }),
    computed: {
        profilePhoto() {
            return this.$store.state.log.userInfo.profilePhoto
        }
    },
    methods: {
        async submit(info) {
			const evaluation = {
				id: this.$store.state.log.userInfo.id,
				score: info.score,
				content: info.textareaValue,
			}
            await this.$api.addEvaluation(this.orderId, evaluation)
			
			uni.navigateBack({
				delta: 1
			})
        }
    },
    onLoad({orderId}) {
        this.orderId = orderId
    }
}
</script>