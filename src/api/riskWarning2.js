import fetch from "@/libs/fetch";

export function getTopAll(data = {}) {
  return fetch({
    url: "/riskWarnScreen/all",
    method: "post",
    params: data,
  });
}


export function getIndustry(data = {}) {
  return fetch({
    url: "/riskWarnScreen/industry",
    method: "post",
    params: data,
  });
}

export function getTrend(data = {}) {
  return fetch({
    url: "/riskWarnScreen/trend",
    method: "post",
    params: data,
  });
}



export function getCase(data = {}) {
  return fetch({
    url: "/riskWarnScreen/case",
    method: "post",
    params: data,
  });
}
