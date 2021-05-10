<template>
  <view class="wrapper">
    <view class="topic-list" v-if="topicList.length">
      <topic-item
        :topic="topic"
        v-for="topic in topicList"
        :key="topic.id"
        @click="toDetailPage(topic._id)"
      ></topic-item>
    </view>
    <view v-else class="empty">
      <u-empty></u-empty>
    </view>
  </view>
</template>

<script>
export default {
  data: () => ({
    topicList: [],
  }),
  methods: {
    async getData() {
      const result = await this.$api.getFocusTopic();
      this.topicList = result.topics;
    },
		toDetailPage(topicId) {
			uni.navigateTo({
				url: "/pages/topic/detail?topicId=" + topicId
			})
		},
  },
  onLoad() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
.empty {
  padding-top: 50%;
}

.topic-list {
  padding: 20rpx;
}
</style>
