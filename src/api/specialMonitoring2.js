import fetch from "@/libs/fetch";

// 演练基本信息
export const getTaskDetail = (data = {}) => {
  return fetch({
    url: "/digitalRealIntegrationScreen/taskDetail",
    method: "post",
    data,
  });
};

// 地图
export const getMap = (data = {}) => {
  return fetch({
    url: "/digitalRealIntegrationScreen/map",
    method: "post",
    data,
  });
};

// 网络攻击特点分析
export const getNetworkAttackAnalysis = (data = {}) => {
  return fetch({
    url: "/digitalRealIntegrationScreen/attackAnalyse",
    method: "post",
    data,
  });
};

// 攻击特征
export const getAttackFeature = (data = {}) => {
  return fetch({
    url: "/digitalRealIntegrationScreen/attackFeature",
    method: "post",
    data,
  });
};

// 高危漏洞排名
export const getHoleRanking = (data = {}) => {
  return fetch({
    url: "/digitalRealIntegrationScreen/highLoopholeRank",
    method: "post",
    data,
  });
};

// 风险企业排名
export const getRiskCompanyRanking = (data = {}) => {
  return fetch({
    url: "/digitalRealIntegrationScreen/riskCompanyRank",
    method: "post",
    data,
  });
};
