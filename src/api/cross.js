import fetch from "@/libs/fetch";
//数据跨境监测
export function getKjLoadData(data = {}) {
  return fetch({
    url: "/jsgj/kjtxLargeScreen/kjtxLoadData",
    method: "post",
    params: data,
  });
}
