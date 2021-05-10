export default {
	namespaced: true,
	state: {
		tabList: [
			{
				iconPath: "home",
				selectedIconPath: "home-fill",
				text: '首页',
				customIcon: false,
				midButton: false,
				pagePath: '/pages/home/home'
			},
			{
				iconPath: "flea-icon flea-icon-topic",
				selectedIconPath: "flea-icon flea-icon-topic-fill",
				text: '话题',
				customIcon: "flea-icon",
				midButton: false,
				pagePath: '/pages/topic/topic'
			},
			{
				iconPath: "/static/images/plus-square-fill.png",
				customIcon: false,
				midButton: true,
				pagePath: '/pages/publish/publish'
			},
			{
				iconPath: "chat",
				selectedIconPath: "chat-fill",
				text: '消息',
				count: 0,
				isDot: true,
				customIcon: false,
				midButton: false,
				pagePath: '/pages/message/message'
			},
			{
				iconPath: "account",
				selectedIconPath: "account-fill",
				text: '我的',
				customIcon: false,
				midButton: false,
				pagePath: '/pages/my/my'
			}
		],
		borderTop: true,
		inactiveColor: '#909399',
		activeColor: '#5098FF',
		midButton: false,
		midButtonSize: 68
	},
	mutations: {
		setCount(state, count) {
			state.tabList[3].count = count
		}
	}
}