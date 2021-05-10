import axios from "axios";
import { getToken } from "../libs/utils/token.js";
import store from "../store";
// import router from "@/router";
import { apiConfig } from "@/config";

axios.defaults.timeout = apiConfig.timeout;

const createRequest = (config) => {
  const request = axios.create(config);

  // request拦截器,在请求之前做一些处理
  request.interceptors.request.use(
    (config) => {
      if (store.state.log.isLogin) {
        // 给请求头添加user-token
        config.headers["Authorization"] = getToken();
      }
      return config;
    },
    (error) => {
      console.log(error); // for debug
      return Promise.reject(error);
    }
  );

  //配置成功后的拦截器
  request.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (error) => {
      const { status } = error.response;
      // 如果身份验证未通过，登出
      if (status === 401) {
        store.commit("log/LOGOUT");
      }
      return Promise.reject(error);
    }
  );

  return request;
};

export const common = createRequest({ baseURL: apiConfig.commonURL });
export const admin = createRequest({ baseURL: apiConfig.adminURL });
