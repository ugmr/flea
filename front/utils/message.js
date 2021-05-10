export const getMessageList = (key) => {
	try {
		const value = uni.getStorageSync(key);
		return value || {};
	} catch (e) {
		throw e;
	}
}
// 删除聊天记录
export const clearMessageList = () => {
	const data = uni.getStorageInfoSync()

	data.keys.forEach(key => {
		if(key.startsWith('chat_')) {
			uni.removeStorageSync('key');
		}
	})
}

// 添加聊天记录
export const setMessageList = (key, messageList) => {
	try {
		uni.setStorageSync(key, messageList);
	} catch (e) {
		throw e;
	}
}