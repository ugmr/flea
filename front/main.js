import Vue from 'vue'
import App from './App'
import store from "./store"
import uView from "uview-ui"
import * as api from "./api"

Vue.use(uView)

Vue.prototype.$api = api

Vue.filter("publishTime", (originTime) => {
	const date = new Date(originTime)
	const now = new Date()
	
	const year = now.getYear() - date.getYear()
	if(year) return year + "年前"
	const month = now.getMonth() - date.getMonth()
	if(month) return month + "月前"
	const day = now.getDay() - date.getDay()
	if(day) return day + "天前"
	const hour = now.getHours() - date.getHours()
	if(hour) return hour + "小时前"
	const min = now.getMinutes() - date.getMinutes()
	if(min) return min + "分钟前"
	
	return ""
})


Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
