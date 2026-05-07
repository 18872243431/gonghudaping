/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-09-27 10:29:48
 * @LastEditTime: 2022-11-22 10:29:51
 */
const isDev = process.env.NODE_ENV === "development";
const baseurl = "/ministry";
const targetIpPort = "https://10.128.13.59:8443";

export default {
  isDev,
  // 项目名称
  name: "国家级工业互联网安全监测与态势感知平台",
  baseurl: baseurl,
  proxy: {
    // "/jsgj": {
    //   target: "http://172.31.131.131:18187",
    //   secure: false,
    //   changeOrigin: true,
    //   ws: true,
    // },
    "/ministry": {
      target: targetIpPort,
      secure: false,
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        "^/ministry": "/act-gateway/api/ads-ministry-monitor-service/ministry",
      },
    },
    "/restApi/ads/upc": {
      target: targetIpPort,
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/restApi/ads/upc": "/act-gateway/api/act-upc" },
    },
  },
};
