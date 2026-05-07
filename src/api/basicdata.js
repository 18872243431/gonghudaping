import fetch from "@/libs/fetch";

//平台对接情况
export function getPlatform(data = {}) {
  return fetch({
    url: "/standardDataScreen/ftpConfigInfo",
    method: "post",
    data: data,
  });
}

//企业基础信息
export function getEnterprise(data = {}) {
  return fetch({
    url: "/standardDataScreen/companyStatistics",
    method: "post",
    data: data,
  });
}

//重点行业监测企业排名
export function getIndustry(data = {}) {
  return fetch({
    url: "/standardDataScreen/companyIndustryStatistics",
    method: "post",
    data: data,
  });
}

//知识库
export function getKnowledge(data = {}) {
  return fetch({
    url: "/standardDataScreen/knowledgeStatistics",
    method: "post",
    data: data,
  });
}

//上报数据质量分析统计
export function getQuality(data = {}) {
  return fetch({
    url: "/standardDataScreen/dataAllStatistics",
    method: "post",
    data: data,
  });
}

//指令信息统计
export function getCommand(data = {}) {
  return fetch({
    url: "/standardDataScreen/commandInfeStatistics",
    method: "post",
    data: data,
  });
}

//省份上报数据有效性实时性排名
export function getProvince(data = {}) {
  return fetch({
    url: "/standardDataScreen/dataProvinceStatistics",
    method: "post",
    data: data,
  });
}

//联网设备库
export function getDevice(data = {}) {
  return fetch({
    url: "/standardDataScreen/deviceStatistics",
    method: "post",
    data: data,
  });
}

//联网设备类型
export function getDeviceType(data = {}) {
  return fetch({
    url: "/standardDataScreen/deviceTypeStatistics",
    method: "post",
    data: data,
  });
}

//安全知识
export function getSafeKnowledge(data = {}) {
  return fetch({
    url: "/standardDataScreen/securityStatistics",
    method: "post",
    data: data,
  });
}

//监测规则
export function getRule(data = {}) {
  return fetch({
    url: "/standardDataScreen/ruleStatistics",
    method: "post",
    data: data,
  });
}

//病毒家族排名
export function getFamily(data = {}) {
  return fetch({
    url: "/standardDataScreen/familyRank",
    method: "post",
    data: data,
  });
}

//威胁情报共享
export function getThreatShare(data = {}) {
  return fetch({
    url: "/standardDataScreen/threatShare",
    method: "post",
    data: data,
  });
}
