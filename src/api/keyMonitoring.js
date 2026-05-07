import fetch from "@/libs/fetch";

//重点监测对象概述
export const keyMonitoringOverview = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/overviewOfKeyMonitoringObjects",
    method: "post",
    data: data,
  });
};

//网络攻击总数
export const networkAttackTotal = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/netAttack",
    method: "post",
    data: data,
  });
};

//境外网络攻击次数
export const foreignNetworkAttackTotal = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/overseasNetAttack",
    method: "post",
    data: data,
  });
};

//攻击IP数量
export const attackIpTotal = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/netAttacdIp",
    method: "post",
    data: data,
  });
};

//总体安全态势
export const overallSecuritySituation = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/overallSecurityPosture",
    method: "post",
    data: data,
  });
};

//网络攻击类型分布
export const networkAttackTypeDistribution = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/netAttackDistribution",
    method: "post",
    data: data,
  });
};

//网络威胁等级分布
export const networkThreatLevelDistribution = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/threatLevelDistribution",
    method: "post",
    data: data,
  });
};

//网络攻击变化趋势
export const networkAttackChangeTrend = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/netAttackTrend",
    method: "post",
    data: data,
  });
};

//攻击国家排名
export const attackCountryRanking = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/attackCountryRank",
    method: "post",
    data: data,
  });
};

//攻击源特征分析
export const attackSourceFeatureAnalysis = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/attackSourceAnalysis",
    method: "post",
    data: data,
  });
};

//被攻击企业区域分布
export const attackedEnterpriseAreaDistribution = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/attackedCompanyAreaDistribution",
    method: "post",
    data: data,
  });
};

//实时攻击动态
export const realTimeAttackDynamics = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/lastAttack",
    method: "post",
    data: data,
  });
};

//被攻击企业排名
export const attackedEnterpriseRanking = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/attackedCompanyRank",
    method: "post",
    data: data,
  });
};

//四大原材料行业遭受攻击分布
export const rawMaterialsAttackDistribution = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/rawMaterialsAttackDistribution",
    method: "post",
    data: data,
  });
};

//境外攻击来源TOP5
export const foreignAttackSourceTop5 = (data = {}) => {
  return fetch({
    url: "/keyMonitoringScreen/foreignAttackSourceTop5",
    method: "post",
    data: data,
  });
};
