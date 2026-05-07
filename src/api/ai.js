import fetch from "@/libs/fetch";
//生成式人工智能
export function getAigcLoadData(data = {}) {
  return fetch({
    url: "/jsgj/largeScreen/aigcLoadData",
    method: "post",
    params: data,
  });
}
