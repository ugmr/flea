const Key = "token";

export const setToken = (token) => {
	try {
		uni.setStorageSync(Key, token);
	} catch (e) {
		throw e;
	}
}

export const getToken = () => {
	try {
		const value = uni.getStorageSync(Key);
		return value;
	} catch (e) {
		throw e;
	}
}

export const clearToken = () => {
	try {
	    uni.removeStorageSync(Key);
	} catch (e) {
	    throw e;
	}
}