import fetch from "@/libs/fetch";

//总体架构

export function getArchitecture() {
  return fetch({
    url: "/homeScreen/statistics",
    method: "post",
  });
}

//网络攻击告警次数及同比
export function getAttackAlarm() {
  return fetch({
    url: "/netSecurityMacroScreen/totalAndYearOnYear",
    method: "post",
    data: {
      timeType: "3",
    },
  });
}

//数据攻击告警次数及同比
export function getDataAttackAlarm() {
  return fetch({
    url: "/dataSecurityMacroScreen/totalAndYearOnYear",
    method: "post",
    data: {
      timeType: "3",
    },
  });
}

//工业互联网发展态势
export function getIndustryInternet() {
  return fetch({
    url: "/homeScreen/banner",
    method: "post",
  });
}

//工业互联网安全发展态势
export function getIndustryInternetSecurity() {
  return fetch({
    url: "/homeScreen/developmentTrend",
    method: "post",
  });
}
