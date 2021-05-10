<template>
  <view class="wrapper">
    <!-- 导航栏 -->
    <u-navbar :is-back="true" :customBack="back" :title="title" :isFixed="true">
    </u-navbar>
    <!-- 搜索框 -->
    <view class="search">
      <u-search :showAction="false" @search="search"></u-search>
    </view>
    <div class="content">
      <!-- 热门话题 -->
      <view v-if="!showResult" class="card">
        <view class="card-title"> 热门话题 </view>
        <view class="card-list topic-list">
          <topic-item
            v-for="topic in hotTopicList"
            :key="topic._id"
            :topic="topic"
            @click="onClick(topic._id)"
          ></topic-item>
        </view>
      </view>
      <!-- 搜索结果 -->
      <view v-else>
        <view v-show="isNewTopic" class="card">
          <view class="card-title"> 新话题 </view>
          <view class="card-list topic-list">
            <topic-item
              :topic="{
                cover: '',
                name: keyword,
              }"
              @click="onClick"
            ></topic-item>
          </view>
        </view>
        <view class="card u-margin-top-20">
          <view class="card-title"> 搜索结果 </view>
          <view class="card-list topic-list">
            <topic-item
              v-for="topic in searchResult"
              :key="topic._id"
              :topic="topic"
              @click="onClick(topic._id)"
            ></topic-item>
          </view>
        </view>
      </view>
    </div>
  </view>
</template>

<script>
export default {
  data: () => ({
    mode: "search",
    showResult: false,
    hotTopicList: [],
    searchResult: [],
    keyword: "",
  }),
  computed: {
    title() {
      return this.mode === "add" ? "选择话题" : "寻找话题";
    },
    isNewTopic() {
      if (this.mode === "search") return false;
      if (!this.showResult) return false;
      return !this.searchResult.some((item) => {
        return item.name === this.keyword;
      });
    },
  },
  methods: {
    back() {
      if (this.showResult) {
        return (this.showResult = false);
      }
      uni.navigateBack({
        delta: 1,
      });
    },
    async search(value) {
      this.showResult = true;
      this.keyword = value;

      const result = await this.$api.getTopicList({
        conditions: {
			name: this.keyword,
		}
      });
      this.searchResult = result.topics;
    },
    async getData() {
      const result = await this.$api.getTopicList({
        options: {
          limit: 10,
        },
      });
      this.hotTopicList = result.topics;
    },
    onClick(topicId) {
		console.log(this.mode)
      if (this.mode === "search") {
        this.toDetailPage(topicId);
      } else if (this.mode === "add") {
        this.toAddPage({ topicId });
      }
    },
    toAddPage({ topicId }) {
      topicId &&
        uni.navigateTo({
          url: "/pages/topic/post/add?topicId=" + topicId,
        });
      this.keyword &&
        uni.navigateTo({
          url: "/pages/topic/post/add?keyword=" + this.keyword,
        });
    },
    toDetailPage(topicId) {
      uni.navigateTo({
        url: "/pages/topic/detail?topicId=" + topicId,
      });
    },
  },
  onLoad({ mode }) {
    mode == "add" && (this.mode = mode);
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.search {
  padding: 20rpx;
  width: 100%;

  background-color: #fff;
}

.content {
  padding: 20rpx;
}

.card {
  &-title {
    font-size: $uni-font-size-sm;
  }
  &-list {
    margin-top: 20rpx;
  }
}

.clearfix {
  zoom: 1;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
}
</style>
