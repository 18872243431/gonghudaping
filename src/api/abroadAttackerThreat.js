import fetch from "@/libs/fetch";

//攻击省份(地图+左上角统计)
export function getProvinceMap(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/provinceMap",
    method: "post",
    data: data,
  });
}

//被攻击行业数量
export function getIndustryCount(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/industryCount",
    method: "post",
    data: data,
  });
}

//被攻击行业TOP4
export function getIndustryTop4(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/industryTop4",
    method: "post",
    data: data,
  });
}

//网络攻击总数
export function getAtdStatistics(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/atdStatistics",
    method: "post",
    data: data,
  });
}

//被攻击企业数
export function getCompanyStatistics(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/companyStatistics",
    method: "post",
    data: data,
  });
}
//网络攻击总数趋势
export function getAtdStatisticsTrend(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/atdStatisticsTrend",
    method: "post",
    data: data,
  });
}

//被攻击企业数趋势
export function getCompanyStatisticsTrend(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/companyStatisticsTrend",
    method: "post",
    data: data,
  });
}

//网络攻击威胁等级分布
export function getSeverity(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/severity",
    method: "post",
    data: data,
  });
}

//家族top5
export function getFamilyTop(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/family",
    method: "post",
    data: data,
  });
}

//攻击IPtop5
export function getAttackIP(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/attackIP",
    method: "post",
    data: data,
  });
}

//告警信息
export function getAlarmInfo(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/alarmInfo",
    method: "post",
    data: data,
  });
}

//被攻击企业排名
export function getAttackedComapnyTop(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/attackedComapnyTop",
    method: "post",
    data: data,
  });
}

export function attackPeriod(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/attackPeriod",
    method: "post",
    data: data,
  });
}

export function attackCountryPercentFun(data = {}) {
  return fetch({
    url: "/outlandAttackScreen/attackCountryPercent",
    method: "post",
    data: data,
  });
}