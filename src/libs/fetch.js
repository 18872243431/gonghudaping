/*
 * @Author: cxm
 * @LastEditors: 最后编辑者
 * @Date: 2022-09-27 10:29:48
 * @LastEditTime: 2026-02-04 16:41:42
 */
import axios from "axios";
import { getToken, setToken, setSecretToken } from "@/libs/cookie";
import store from "@/store";
import errorCode from "@/libs/errorCode";
import config from "@/config";
console.log("baseurls", config.baseurl);
const baseurl = config.baseurl;

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseurl,
  timeout: 30000,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["Auth-token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // else {
    //   window.location.href = '/iot/login.html'
    // }

    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              if (value[key] !== null && typeof value[key] !== "undefined") {
                let params = propName + "[" + key + "]";
                let subPart = encodeURIComponent(params) + "=";
                url += subPart + encodeURIComponent(value[key]) + "&";
              }
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    config.headers["menupath"] = "/safeSate/platform";
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (res.headers["Authorization"]) {
      setToken(res.headers["Authorization"]);
    }
    const data = res.data;
    const url = res.config && res.config.url ? res.config.url : "";
    if (!url.includes("/sso/getTokenState")) {
      const refreshToken = res.headers["refresh-token"];
      if (refreshToken) {
        setToken(refreshToken);
        store.dispatch("RefreshToken", refreshToken);
      }
      const refreshSecretToken = res.headers["refresh-secret-token"];
      if (refreshSecretToken) {
        setSecretToken(refreshSecretToken);
      }
    }
    const authToken = res.headers["auth-token"];
    if (authToken && data && typeof data === "object") {
      data["auth-token"] = authToken;
    }
    if (code === 403) {
      // window.location.href = '/iot/login.html'
    }
    if (
      res &&
      ["Token过期或非法", "未授权URL", "不是授权请求源"].includes(
        res.data.message
      )
    ) {
      window.location.href =
        process.env.VUE_APP_SCREEN_WIDTH == 3840
          ? "/login.html"
          : "/login5.html";
      return;
    }
    if (res.status == 506 || res.status == 401 || code == 506) {
      window.location.href =
        process.env.VUE_APP_SCREEN_WIDTH == 3840
          ? "/login.html"
          : "/login5.html";
    }
    if (code === 401) {
      return Promise.reject("令牌验证失败");
    } else if (code === 500) {
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      return Promise.reject("error");
    } else {
      return data;
    }
  },
  (error) => {
    console.log("err" + error);
    // if (status === 404) {
    //   window.location.href = '/login.html'
    // }
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    return Promise.reject(error);
  }
);

export default service;
