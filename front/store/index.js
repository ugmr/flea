import Vue from 'vue'
import Vuex from 'vuex'
import tabBar from './modules/tabBar'
import location from './modules/location.js'
import log from "./modules/log.js"
import chat from "./modules/chat.js"

Vue.use(Vuex)

const store = new Vuex.Store({
	getters: {
		isLogin(state) {
			return state.log.isLogin
		},
		userId(state) {
			return state.log.userInfo
		},
		messageList(state) {
			return Object.values(state.chat.messageList)
		},
		hasNew(state) {
			let res = 0
			Object.values(state.chat.messageList).map(item => {
				res += item.hasNew
			})
			Object.values(state.chat.noticeList).map(item => {
				res += item.status ? 0 : 1
			})

			return res
		},
	},
	modules: {
		tabBar,
		location,
		log,
		chat
	}
})

export default store
