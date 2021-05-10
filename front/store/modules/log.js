import { setToken, getToken, clearToken } from "../../utils"
import { login, logout } from "../../api"

export default {
	namespaced: true,
	state: {
		isLogin: false,
		userInfo: {}
	},
	mutations: {
		["login"](state, {userInfo, token}) {
			state.isLogin = true;
			state.userInfo = userInfo;
			setToken(token);
			uni.setStorageSync("userInfo", userInfo);
		},
		["logout"](state) {
			state.isLogin = false;
			state.userInfo = {};
			console.log(state)
			clearToken();
			uni.clearStorageSync("userInfo")
		},
		["reload"](state, {userInfo}) {
			state.isLogin = true;
			state.userInfo = userInfo;
		},
		["update"](state, {profilePhoto, userName}) {
			state.userInfo.profilePhoto = profilePhoto
			state.userInfo.userName = userName
			uni.setStorageSync("userInfo", state.userInfo);
		}
	},
	actions: {
		['login']({commit}, {mobile, password}) {
			return login({mobile, password}).then(res => {
				commit("login", {
					userInfo: res.userInfo,
					token: res.token
				});
			})
		},
		['logout']({commit}) {
			logout()
			commit("logout");
			uni.switchTab({
				url: "/pages/home/home"
			})
		}
	}
}