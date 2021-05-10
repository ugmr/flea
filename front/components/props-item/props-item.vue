<template>
    <view class="prop">
        <view class="line">
            <view class="title">{{title}}</view>
            <view class="parent">
                <scroll-view class="scroll-view-row" scroll-x :upper-threshold="100" :scroll-left="0">
                    <u-tag 
                        class="tag"
                        v-for="(item, index) in list" 
                        :key="item.value"
                        shape="circle"
                        :type="parentIndex == index ? 'primary':'info'"
                        @click="handleParentClick(index)"
                    >
                        {{item.label}}
                    </u-tag>
                </scroll-view>
            </view>
        </view>
        <view class="child" v-if="parent && parent.children">
            <scroll-view class="scroll-view-row" scroll-x>
                <u-tag
                    class="tag"
                    v-for="(item, index) in parent.children" 
                    :key="item.value"
                    shape="circle"
                    :type="childIndex == index ? 'primary':'info'"
                    @click="handleChildClick(index)"
                >
                    {{item.label}}
                </u-tag>
            </scroll-view>
        </view>
    </view>
</template>

<script>
export default {
    props:[
        "title",
        "list",
        "value",
    ],

    data: () => ({
        parentIndex: -1,
        childIndex: -1
    }),

    computed: {
        parent() {
            if(this.parentIndex < 0) return null
            return this.list[this.parentIndex]
        }
    },

    methods: {
        handleParentClick(index) {
            if(index == this.parentIndex) {
                this.parentIndex = -1
                this.childIndex = -1
            } else {
                this.parentIndex = index
                this.$emit('input', this.parent.value)
            }
        },
        handleChildClick(index) {
            if(index == this.childIndex) {
                this.childIndex = -1
                this.$emit("input", "")
            } else {
                this.childIndex = index
                this.$emit('input', this.parent.children[this.childIndex].value || "")
            }

        }
    },

    watch: {
        value: function () {
            this.list.forEach((item, parentIndex) => {
                if(item.children) {
                    item.children.forEach((child, childIndex) => {
                        if(child.value == this.value) {
                            this.parentIndex = parentIndex
                            this.childIndex = childIndex
                        }
                    })
                } else {
                    if(item.value == this.value) {
                        this.parentIndex = parentIndex
                    }
                }
            })
        }
    }
}
</script>


<style lang="scss" scoped>

.prop {
    padding: 10rpx 0;
}

.line {
    display: flex;

    .title {   
        width: 12%;
        height: 74rpx;
        line-height: 74rpx;
        color: #000;
        font-weight: bold;
    }

    .parent {
        width: 88%;
        padding: 10rpx;
    }
}

.child {
    margin-left: 12%;
    width: 88%;
    padding: 10rpx;
}

.tag {
    margin-right: 20rpx;
}

.scroll-view-row {
    white-space: nowrap;
}

</style>