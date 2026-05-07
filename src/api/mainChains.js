import fetch from "@/libs/fetch";

//安全总览
export function getSecurityOverview(data = {}) {
  return fetch({
    url: "/industryChainScreen/statistics",
    method: "post",
    data: data,
  });
}

//保障企业产业链分布情况
export function getSecurityDistribution(data = {}) {
  return fetch({
    url: "/industryChainScreen/company",
    method: "post",
    data: data,
  });
}

//各省份被攻击安全事件数量
export function getSecurityEventNum(data = {}) {
  return fetch({
    url: "/industryChainScreen/attackedNumProvinceMap",
    method: "post",
    data: data,
  });
}

//各省份风险企业数量
export function getRiskEnterpriseNum(data = {}) {
  return fetch({
    url: "/industryChainScreen/companyNumProvinceMap",
    method: "post",
    data: data,
  });
}

// 网络攻击类型分布
export function getAttackTypeDistribution(data = {}) {
  return fetch({
    url: "/industryChainScreen/eventTypePie",
    method: "post",
    data: data,
  });
}

// 网络攻击趋势
export function getAttackTrend(data = {}) {
  return fetch({
    url: "/industryChainScreen/riskTrend",
    method: "post",
    data: data,
  });
}

// 风险预警
export function getRiskWarningList(data = {}) {
  return fetch({
    url: "/industryChainScreen/alarm",
    method: "post",
    data: data,
  });
}

// 各产业链攻击态势
export function getIndustryChainAttackSituation(data = {}) {
  return fetch({
    url: "/industryChainScreen/industryChainAnalysis",
    method: "post",
    data: data,
  });
}

export function eventTypeTop5(data = {}) {
  return fetch({
    url: "/industryChainScreen/eventTypeTop5",
    method: "post",
    data: data,
  });
}

export function attackerCountryTop5(data = {}) {
  return fetch({
    url: "/industryChainScreen/attackerCountryTop5",
    method: "post",
    data: data,
  });
}

export function attackerProvinceTop5(data = {}) {
  return fetch({
    url: "/industryChainScreen/attackerProvinceTop5",
    method: "post",
    data: data,
  });
}
