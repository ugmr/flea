<template>
    <view>
       <view class="wrapper">
           <u-time-line node-top="2" v-if="traces.length">
                <u-time-line-item v-for="(trace, index) in traces" :key="index">
                    <template v-slot:node>
						<view v-if="index == 0" class="u-node" style="background: #19be6b;"></view>
                        <view v-else class="u-node" style="background: #ddd;"></view>
                    </template>
                    <template v-slot:content>
                        <view>
                            <view class="u-order-desc">{{trace.AcceptStation}}</view>
                            <view class="u-order-time">{{trace.AcceptTime}}</view>
                        </view>
                    </template>
                </u-time-line-item>
            </u-time-line>
            <u-time-line node-top="2" v-else>
                <u-time-line-item>
                    <template v-slot:node>
                        <view class="u-node" style="background: #19be6b;"></view>
                    </template>
                    <template v-slot:content>
                        <view>
                            <view class="u-order-desc">暂无物流信息</view>
                            <view class="u-order-time">现在</view>
                        </view>
                    </template>
                </u-time-line-item>
            </u-time-line>
       </view>
    </view>

</template>

<script>
export default {
    data: () => ({
        traces: []
    }),
    async onLoad({types, no}) {
        const result = await this.$api.getLogistic(this.$api.getParams(
            "","",types,types + no
        ))

        // const result = { 
		// 	EBusinessID: "1237100", 
		// 	OrderCode: "", 
		// 	ShipperCode: "ZTO", 
		// 	LogisticCode: "638650888018", 
		// 	Success: true, 
		// 	State: 3, 
		// 	Traces: [
		// 		{ AcceptTime: "2014-06-24 20:18:58", AcceptStation: "已收件[深圳市]" },
		// 		{ AcceptTime: "2014-06-24 20:55:28", AcceptStation: "快件在 深圳 ,准备送往下一站 深圳集散中心 [深圳市]" },
		// 		{ AcceptTime: "2014-06-25 10:23:03", AcceptStation: "派件已签收[深圳市]" },
		// 		{ AcceptTime: "2014-06-25 10:23:03", AcceptStation: "签收人是：已签收[深圳市]" }
		// 	]
        // }
		
        if(result.Success) {
            this.traces = result.Traces
        } 
    }
}
</script>

<style scoped>

.wrapper {
    padding: 40rpx 40rpx 0;
}

.u-node {
    width: 22rpx;
    height: 22rpx;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d0d0d0;
}

.u-order-title {
    color: #333333;
    font-weight: bold;
    font-size: 32rpx;
}

.u-order-desc {
    color: rgb(150, 150, 150);
    font-size: 28rpx;
    margin-bottom: 6rpx;
}

.u-order-time {
    color: rgb(200, 200, 200);
    font-size: 26rpx;
}
</style>