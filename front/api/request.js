import axios from 'axios'
import { apiConfig } from "../config"
import { getToken } from "../utils"
import store from "../store"

const createRequestFunction = (config) => {
	const request = axios.create(config);
	
	// request拦截器,在请求之前做一些处理
	request.interceptors.request.use(
	    config => {
	        if (store.state.log.isLogin) {
	            // 给请求头添加user-token
	            config.headers["Authorization"] = getToken();
	        }
	        return config;
	    },
	    error => {
	        console.log(error); // for debug
	        return Promise.reject(error);
	    }
	);
	
	//配置成功后的拦截器
	request.interceptors.response.use(res => {
		if(res.data.status === "fail") {
			return Promise.reject()
		}
		return res.data
	}, error => {
		console.log(error)
	    return Promise.reject(error)
	})
	
	return request;
}

//自己定义个适配器，用来适配uniapp的语法
axios.defaults.adapter = function(config) { 
    return new Promise((resolve, reject) => {
        var settle = require('axios/lib/core/settle');
        var buildURL = require('axios/lib/helpers/buildURL');

        uni.request({
            method: config.method.toUpperCase(),
            url: (config.baseURL ? config.baseURL : '' ) + buildURL(config.url, config.params, config.paramsSerializer),
            header: config.headers,
            data: config.data,
            dataType: config.dataType,
            responseType: config.responseType,
            sslVerify: config.sslVerify,
            complete: function complete(response) {
                response = {
                    data: response.data,
                    status: response.statusCode,
                    errMsg: response.errMsg,
                    header: response.header,
                    config: config
                };
				if(response.status && response.status === 401) {
					store.commit("log/logout");
					uni.navigateTo({
						url: "/pages/log/login"
					})
				}

                settle(resolve, reject, response);
            }
        })
    })
}

export const common = createRequestFunction(apiConfig.common);
export const user = createRequestFunction(apiConfig.user);

export default axios;