import fetch from "@/libs/fetch";
//违规监测
export function getIllegalQueryData(data = {}) {
  return fetch({
    url: "/iims/largeScreen/queryData",
    method: "post",
    params: data,
  });
}

export function getIllegalLoadData(data = {}) {
  return fetch({
    url: "/gpt/largeScreen/loadData",
    method: "post",
    params: data,
  });
}
