import fetch from "@/libs/fetch";

export function getAllMockData(data = {}) {
   return fetch({
      url: "/mockScreen/detail",
      method: "post",
      data: data,
    });
}
