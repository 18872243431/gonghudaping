import fetch from "@/libs/fetch";

//总体安全态势
export function getOverview(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/overallSecurityPosture",
    method: "post",
    data: data,
  });
}

//各省份被攻击次数排名
export function getAttackRanking(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/attackedByProvince",
    method: "post",
    data: data,
  });
}

//网络安全态势整体分析
export function getSecuritySituation(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/holisticAnalysis",
    method: "post",
    data: data,
  });
}

//网络攻击分布情况
export function getAttackDistribution(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/netAttackDistribution",
    method: "post",
    data: data,
  });
}

//网络攻击变化趋势

export function getAttackTrend(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/netAttackTendency",
    method: "post",
    data: data,
  });
}

//实时攻击动态
export function getRealTimeAttack(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/lastAttackedData",
    method: "post",
    data: data,
  });
}

//暴露工业控制系统及设备情况
export function getExposedIndustrialControlSystem(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/industrialControlSystemDeviceInfo",
    method: "post",
    data: data,
  });
}

//工业互联网安全监测对象
export function getExposedIndustrialControlSystemDetail(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/industrySecurityMonitoringObject",
    method: "post",
    data: data,
  });
}

//工业互联网监测覆盖情况

export function getExposedIndustrialControlSystemDetail2(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/industryMonitoringCoverage",
    method: "post",
    data: data,
  });
}

//境外攻击国家Top5
export function getForeignAttackCountry(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/overseasAttackCountryRank",
    method: "post",
    data: data,
  });
}

//境内攻击源排名
export function getInternalAttackSource(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/internalAttackIpRank",
    method: "post",
    data: data,
  });
}

//境外攻击源排名
export function getForeignAttackSource(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/overseasAttackIpRank",
    method: "post",
    data: data,
  });
}

//被攻击企业排名
export function getAttackedCompany(data = {}) {
  return fetch({
    url: "/netSecurityMacroScreen/attackedCompanyRank",
    method: "post",
    data: data,
  });
}
