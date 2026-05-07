import fetch from "@/libs/fetch";

//工业互联网安全管理对象概述
export function getGdSecurityOverview(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/securityManagementObjectsOverview",
    method: "post",
    data,
  });
}

//基础数据上报情况
export function getGdSecurityReport(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/basicDataReportStatus",
    method: "post",
    data,
  });
}

//安全数据上报情况
export function getGdSecurityDataReport(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/safetyDataReportStatus",
    method: "post",
    data,
  });
}

//总体安全态势
export function getGdSecurityPosture(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/overallSecurityPosture",
    method: "post",
    data,
  });
}

//地图数据
export function getGdSecurityMap(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/mapData",
    method: "post",
    data,
  });
}

//网络攻击类型分布
export function getGdSecurityAttackType(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/netAttackTypeDistribution",
    method: "post",
    data,
  });
}

//实时攻击动态
export function getGdSecurityAttackDynamic(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/lastAttackedData",
    method: "post",
    data,
  });
}

//工控系统及设备暴露情况
export function getGdSecuritySystem(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/industrialSystemEquipmentInfo",
    method: "post",
    data,
  });
}

//数据资产暴露情况
export function getGdSecurityData(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/dataAssetInfo",
    method: "post",
    data,
  });
}

//网络安全态势整体分析
export function getGdSecurityOverall(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/networkSecurityOverallAnalysis",
    method: "post",
    data,
  });
}

//被攻击行业排名
export function getGdSecurityRank(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/attackedIndustryRank",
    method: "post",
    data,
  });
}

//通报处置情况
export function getGdSecurityReportHandle(data = {}) {
  return fetch({
    url: "/provinceSecurityScreen/reportDispositionInfo",
    method: "post",
    data,
  });
}
