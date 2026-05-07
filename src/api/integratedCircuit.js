import fetch from "@/libs/fetch";

//重点专题下拉
export function getSpecial(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/getUploadlabelList",
    method: "post",
    data: data,
  });
}

//集成电路产量及同比增长变化趋势
export function getProductionTrend(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/productionAndYearonyearTrend",
    method: "post",
    data: data,
  });
}

//数据总览
export function getOverview(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/dataOverall",
    method: "post",
    data: data,
  });
}

//集成电路产业链图谱
export function getIndustryMap(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/industrialChainGraph",
    method: "post",
    data: data,
  });
}

//监测概览
export function getMonitorOverview(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/monitorOverall",
    method: "post",
    data: data,
  });
}

//网络攻击总数
export function getAttackTotal(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/networkAttack",
    method: "post",
    data: data,
  });
}

//攻击源数量
export function getAttackSource(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/attackSources",
    method: "post",
    data: data,
  });
}

//境外网络攻击次数
export function getAttackSourceRanking(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/overseasNetworkAttack",
    method: "post",
    data: data,
  });
}

//网络攻击趋势
export function getAttackTrend(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/networkAttackTendency",
    method: "post",
    data: data,
  });
}

//攻击源数量变化趋势
export function getAttackSourceTrend(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/attackSourcesTendency",
    method: "post",
    data: data,
  });
}

//被攻击IP地址数量变化趋势
export function getAttackIpTrend(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/attacdedIpTendency",
    method: "post",
    data: data,
  });
}

//产业链遭受网络攻击分布情况
export function getAttackIndustry(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/attackIndustry",
    method: "post",
    data: data,
  });
}

//产业链遭受网络攻击分布情况
export function getAttackIndustryRanking(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/attackedDistribution",
    method: "post",
    data: data,
  });
}

//产业链遭受网络攻击类型排名
export function getAttackIndustryTrend(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/attacdedTypeRank",
    method: "post",
    data: data,
  });
}

//风险企业排名
export function getRiskRanking(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/riskCompanyRanking",
    method: "post",
    data: data,
  });
}

//下钻-集成电力企业分页列表
export function getIntegratedCompanyList(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/selectPage",
    method: "post",
    data: data,
  });
}

//下钻-风险企业列表
export function getRiskCompanyList(data = {}) {
  return fetch({
    url: "/integratedCircuitScreen/riskCompanyRank",
    method: "post",
    data: data,
  });
}
