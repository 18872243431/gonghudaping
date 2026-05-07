/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-09-27 10:29:47
 * @LastEditTime: 2022-10-27 11:55:32
 */
import fetch from "@/libs/fetch";

// 登录方法
export function login(data) {
  return fetch({
    url: "/login",
    method: "post",
    data: data,
  });
}

// 退出方法
export function logout() {
  return fetch({
    url: "/logout",
    method: "post",
  });
}

// 获取用户详细信息
export function getInfo() {
  return fetch({
    url: "/getInfo",
    method: "post",
  });
}
// 获取用户详细信息
export function getRouters() {
  return fetch({
    url: "/getRouters",
    method: "post",
  });
}

// 测试get请求
export function testGet() {
  return fetch({
    url: "/mock/testGet",
    method: "get",
  });
}

// 测试post请求
export function testPost() {
  return fetch({
    url: "/mock/testPost",
    method: "post",
  });
}

// 测试静态数据和请求数据并存的情况
export function noStatic() {
  return fetch({
    url: "/mock/noStatic",
    method: "post",
    // baseURL: 'http://39.98.200.240:9090/mock/595/'
  });
}

//获取系统菜单权限
export function getMenuList() {
  return fetch({
    url: "/restApi/ads/upc/platform/index/listMenuTree",
    method: "post",
    data: {
      systemCode: "ministry",
    },
    baseURL: "",
    // baseURL: 'http://39.98.200.240:9090/mock/595/'
  });
}
