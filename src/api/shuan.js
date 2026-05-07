import fetch from "@/libs/fetch";

//互联网资源监测
export function getShuan(data = {}) {
  return fetch({
    url: "/jsgj/largeScreen/dsLoadData",
    method: "post",
    data: data,
  });
}
