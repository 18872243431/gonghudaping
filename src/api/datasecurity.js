import fetch from "@/libs/fetch";

//总体安全态势
export function getOverview(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/overallSecurityPosture",
    method: "post",
    data: data,
  });
}

//安全总览
export function getSecurityOverview(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/safetyOverview",
    method: "post",
    data: data,
  });
}

//数据流动态势
export function getDataFlowDynamic(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/dataFlowPosture",
    method: "post",
    data: data,
  });
}

//数据流动态势-国家IP数量Top3

export function getCountryIpTop3(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/dstCountIpRank",
    method: "post",
    data: data,
  });
}

//实时数据安全事件
export function getRealTimeDataSecurityEvents(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/lastAttackedData",
    method: "post",
    data: data,
  });
}

//数据安全风险类型排名
export function getDataSecurityEvents(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/riskTypeRanking",
    method: "post",
    data: data,
  });
}

//暴露数据资产占比
export function getExposedDataAssets(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/assetRank",
    method: "post",
    data: data,
  });
}

//风险企业排名
export function getRiskEnterpriseRanking(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/riskCorpRanking",
    method: "post",
    data: data,
  });
}

//工业互联网监测覆盖情况
export function getIndustrialInternetMonitoring(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/industryMonitoringCoverage",
    method: "post",
    data: data,
  });
}

//工业互联网安全监测对象
export function getIndustrialInternetMonitoringDetail(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/industrySecurityMonitoringObject",
    method: "post",
    data: data,
  });
}

//数据流动态势-外联国家排名
export function getCountryIpRank(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/outreachCountryRank",
    method: "post",
    data: data,
  });
}

//暗网数据泄露与售卖监测
export function getDarkWebMonitor(data = {}) {
  return fetch({
    url: "/dataSecurityMacroScreen/darkWebMonitor",
    method: "post",
    data: data,
  });
}
