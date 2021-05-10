const Key = "history"
const HistoryLength = 10

// 新增搜索记录
export const setHistory = (value) => {
	try {
		let list = uni.getStorageSync(Key)
		
		if(list === "") {
			list = []
		}
		
		if(list.length >= HistoryLength) {
			list.splice(0, HistoryLength - 1);
		}
		
		const index = list.indexOf(value)
		
		if(index !== -1) {
			list.splice(index, 1)
		}
		
		list.unshift(value);
		
		uni.setStorageSync(Key, list);
	} catch (e) {
		throw e;
	}
}
// 获取搜索记录
export const getHistory = () => {
	try {
		const value = uni.getStorageSync(Key);
		return value || [];
	} catch (e) {
		throw e;
	}
}
// 清空搜索记录
export const clearHistory = () => {
	try {
	    uni.removeStorageSync(Key);
	} catch (e) {
	    throw e;
	}
}