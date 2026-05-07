import fetch from "@/libs/fetch";

//数据挖掘分析统计
export function getItem1(data = {}) {
  return fetch({
    url: "/riskWarnScreen/data",
    method: "post",
    params: data,
  });
}

//多维度数字牌统计(研判、通报、处置、验证)
export function getOverview(data = {}) {
  return fetch({
    url: "/riskWarnScreen/all",
    method: "post",
    params: data,
  });
}

//研判事件类型分布
export function getEventType(data = {}) {
  return fetch({
    url: "/riskWarnScreen/eventType",
    method: "post",
    params: data,
  });
}

//通报企业行业排名
export function getIndustryRank(data = {}) {
  return fetch({
    url: "/riskWarnScreen/industry",
    method: "post",
    params: data,
  });
}

//各省通报处置情况排名
export function getProvinceRank(data = {}) {
  return fetch({
    url: "/riskWarnScreen/province",
    method: "post",
    params: data,
  });
}

//处置前后数据
export function getDisposal(data = {}) {
  return fetch({
    url: "/riskWarnScreen/disposal",
    method: "post",
    params: data,
  });
}
