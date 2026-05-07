import fetch from "@/libs/fetch";

//专题详情
export const getSpecialDetail = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/detail",
    method: "post",
    data,
  });
};

//事件下拉
export const getEventList = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/eventList",
    method: "post",
    data,
  });
};

//实时攻击动态
export const getRealTimeAttackDynamics = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/actualAttack",
    method: "post",
    data,
  });
};

//地图数据
export const getMap = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/map",
    method: "post",
    data,
  });
};

//数字牌
export const getNumberCard = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/digitalSignage",
    method: "post",
    data,
  });
};

//风险企业告警
export const getRiskEnterprise = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/riskCompanyAlarm",
    method: "post",
    data,
  });
};

//事件类型分布
export const getEventTypeDistribution = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/eventTypeEchart",
    method: "post",
    data,
  });
};

//攻击国家排名
export const getAttackCountryRanking = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/attackCountry",
    method: "post",
    data,
  });
};

//攻击IP行为特征分析
export const getAttackIPBehaviorAnalysis = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/attackIPAnalyse",
    method: "post",
    data,
  });
};

//攻击趋势
export const getAttackTrend = (data = {}) => {
  return fetch({
    url: "/specialEventScreen/attackTrend",
    method: "post",
    data,
  });
};
