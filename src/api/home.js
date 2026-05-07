import fetch from "@/libs/fetch";
//导航页
export function getIsLoadData(data = {}) {
  return fetch({
    url: "/jsgj/islargeScreen/isLoadData",
    method: "post",
    params: data,
  });
}


export function getDownFileData(data = {}) {
  return fetch({
    url: "/jsgj/islargeScreen/isLoadData",
    method: "post",
    params: data,
    responseType: 'blob', 
  });
}