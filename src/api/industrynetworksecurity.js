import fetch from "@/libs/fetch";

export function overviewOfKeyMonitoringTargets(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/overviewOfKeyMonitoringTargets",
    method: "post",
    data: data,
  });
}

export function netAttackDistribution(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/netAttackDistribution",
    method: "post",
    data: data,
  });
}

export function networkAttackTypesRank(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/networkAttackTypesRank",
    method: "post",
    data: data,
  });
}

export function netAttackTrend(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/netAttackTrend",
    method: "post",
    data: data,
  });
}

export function attackedCompanyTop(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/attackedCompanyTop",
    method: "post",
    data: data,
  });
}

export function rawMaterialsIndustryAttackedDistribution(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/rawMaterialsIndustryAttackedDistribution",
    method: "post",
    data: data,
  });
}

export function overseasAttackSourcesRank(data = {}) {
  return fetch({
    url: "/rawMaterialsSecurityMacroScreen/overseasAttackSourcesRank",
    method: "post",
    data: data,
  });
}
