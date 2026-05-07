import fetch from "@/libs/fetch";

//企业基础信息和整体安全状态
export function getCompanyInfo(data = {}) {
  return fetch({
    url: "/companyRiskScreen/companyInfo",
    method: "post",
    data: data,
  });
}

//网络威胁等级分布
export function getOverview(data = {}) {
  return fetch({
    url: "/companyRiskScreen/networkThreatLevelDistribution",
    method: "post",
    data: data,
  });
}

//网络攻击告警类型分布

export function getAttackType(data = {}) {
  return fetch({
    url: "/companyRiskScreen/networkAttackEventTypeDistribution",
    method: "post",
    data: data,
  });
}

//网络攻击阶段分布

export function getAttackStage(data = {}) {
  return fetch({
    url: "/companyRiskScreen/networkAttackPhaseDistribution",
    method: "post",
    data: data,
  });
}

//安全态势
export function getSecuritySituation(data = {}) {
  return fetch({
    url: "/companyRiskScreen/securityPosture",
    method: "post",
    data: data,
  });
}

//动态告警
export function getDynamicAlarm(data = {}) {
  return fetch({
    url: "/companyRiskScreen/dynamicAlarm",
    method: "post",
    data: data,
  });
}

//企业资产漏洞隐患信息
export function getVulnerabilityInfo(data = {}) {
  return fetch({
    url: "/companyRiskScreen/assetsLoopholeInfo",
    method: "post",
    data: data,
  });
}

//企业安全态势-网络攻击总数
export function getAttackTotal(data = {}) {
  return fetch({
    url: "/companyRiskScreen/enterpriseSecurityPostureAttack",
    method: "post",
    data: data,
  });
}

//企业安全态势-攻击源数量
export function getAttackSource(data = {}) {
  return fetch({
    url: "/companyRiskScreen/enterpriseSecurityPostureAttackIp",
    method: "post",
    data: data,
  });
}

//企业安全态势-被攻击IP数量
export function getAttackIp(data = {}) {
  return fetch({
    url: "/companyRiskScreen/enterpriseSecurityPostureAttackedIp",
    method: "post",
    data: data,
  });
}

//攻击者排名
export function getAttackRank(data = {}) {
  return fetch({
    url: "/companyRiskScreen/attackRank",
    method: "post",
    data: data,
  });
}

//网络攻击时段分析
export function getAttackTime(data = {}) {
  return fetch({
    url: "/companyRiskScreen/attackTiemTrend",
    method: "post",
    data: data,
  });
}

//高风险IP告警
export function getHighRiskIp(data = {}) {
  return fetch({
    url: "/companyRiskScreen/highRiskAlarm",
    method: "post",
    data: data,
  });
}

//演示-企业详情信息
export function getCompanyDetailInfo(data = {}) {
  return fetch({
    url: "/digitalRealIntegrationScreen/companyRiskInfo",
    method: "post",
    data: data,
  });
}

//下载报告
// 下载报告（文件流）
export function downloadReport(data = {}) {
  return fetch({
    url: "/digitalRealIntegrationScreen/downloadCompanyReport",
    method: "post",
    data: data,
    responseType: "blob", // 指定返回类型为 blob，用于处理文件流
  });
}

//通报
export function sendWarning(data = {}) {
  return fetch({
    url: "/digitalRealIntegrationScreen/notifyCompanyReport",
    method: "post",
    data: data,
  });
}

export function highRiskPort(data = {}) {
  return fetch({
    url: "/companyRiskScreen/highRiskPort",
    method: "post",
    data: data,
  });
}

export function attackPath(data = {}) {
  return fetch({
    url: "/companyRiskScreen/attackPath",
    method: "post",
    data: data,
  });
}
