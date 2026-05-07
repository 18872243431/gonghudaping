/*
 * @Author: wangmeng
 * @Date: 2025-12-17 09:03:30
 * @LastEditors: 最后编辑者
 * @LastEditTime: 2026-02-06 14:52:56
 * @Description: 
 */
import fetch from "@/libs/fetch";

//服务专题
export function getGuaranteeList(params) {
  return fetch({
    url: "/specialEventScreen/statistics",
    method: "post",
    data: params,
  });
}

//服务专题列表
export function getGuaranteeList2(params) {
  return fetch({
    url: "/specialEventScreen/list",
    method: "post",
    data: params,
  });
}

export function getDetail(params) {
  return fetch({
    url: "/mockScreen/detail",
    method: "post",
    data: params,
  });
}
