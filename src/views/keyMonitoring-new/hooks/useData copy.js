import { reactive, ref, watch } from "vue";
import {
  keyMonitoringOverview,
  networkAttackTotal,
  foreignNetworkAttackTotal,
  attackIpTotal,
  overallSecuritySituation,
  networkAttackTypeDistribution,
  networkThreatLevelDistribution,
  networkAttackChangeTrend,
  attackCountryRanking,
  attackSourceFeatureAnalysis,
  attackedEnterpriseAreaDistribution,
  realTimeAttackDynamics,
  attackedEnterpriseRanking,
} from "@/api/keyMonitoring";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import mockData from "./data.json";

// 使用模拟数据的标志
const useMockData = true;
 const industryOverviewList = ref([
    {
      name: "上游(原材料及零部件)",
      value: 27.3,
      color: "#3fc3ff",
    },
    {
      name: "中游(新能源汽车制造)",
      value: 64.3,
      color: "#00dca1",
    },
    {
      name: "下游(汽车后市场服务)",
      value: 8.4,
      color: "#ffbd43",
    },
  ]);
export function useDataFun(keyWord) {
  // === Shared State ===
  const introduction = ref("");
  const activeTab = ref("1");
  const tabsList = ref([
    { label: "24小时", value: "1" },
    { label: "近7天", value: "2" },
    { label: "近30天", value: "3" },
  ]);

  function changeTab(tab) {
    activeTab.value = tab;
  }

  // === Left Data ===
  const totalOneList1 = ref([
    {
      name: "重点企业数量",
      value: 0,
      unit: "家",
      key: "companyTotal",
    },
    {
      name: "监测企业数量",
      value: 0,
      unit: "个",
      key: "monitoringCompanyTotal",
    },
    {
      name: "发现风险企业数量",
      value: 0,
      unit: "个",
      key: "riskCompanyTotal",
    },
  ]);

  const totalOneList2 = ref([
    { label: "网络攻击总数", value: 0, unit: "次" },
    {
      label: "境外网络攻击次数",
      value: 0,
      unit: "次",
    },
  ]);

  const totalTwoList = ref([
    {
      title: "网络攻击总数",
      label1: "环比增长",
      value1: "",
      status1: "up",
      label2: "同比下降",
      value2: "",
      status2: "down",
    },
    {
      title: "境外网络攻击次数",
      label1: "环比增长",
      value1: "",
      status1: "up",
      label2: "同比下降",
      value2: "",
      status2: "down",
    },
    {
      title: "IP攻击次数",
      label1: "环比增长",
      value1: "",
      status1: "up",
      label2: "同比下降",
      value2: "",
      status2: "down",
    },
  ]);

  // === Center Data ===
  const pieOption = ref({
    innerRaduis: ["30%", "40%"],
    outerRaduis: ["30%", "100%"],
    lineRaduis: ["35%", "45%"],
    shadowRadius: "31%",
    colors: [
      "rgba(255, 66, 66, 1)",
      "rgba(255, 128, 53, 1)",
      "rgba(141, 72, 199, 1)",
      "rgba(88, 79, 255, 1)",
      "rgba(255, 189, 67, 1)",
      "rgba(25, 220, 255, 1)",
    ],
  });
  const overviewText = ref("");
  const batteryList = ref([]);
  const riskList = ref([
    {
      name: "高危",
      value: 0,
      tags: [],
      rate: 0,
      color: "rgba(255, 58, 47, 1)",
    },
    {
      name: "中危",
      value: 0,
      tags: [],
      rate: 0,
      color: "rgba(255, 189, 67, 1)",
    },
    {
      name: "低危",
      value: 0,
      tags: [],
      rate: 0,
      color: "rgba(77, 213, 255, 1)",
    },
  ]);

  const lineData = ref({
    legend: ["境内", "境外"],
    category: [],
    values: [[], []],
  });

  const pieData = ref([
    { name: "初始化数据", value: 100, shadowRadius: "31%" },
  ]);

  const columns1 = ref([
    { label: "IP地址", prop: "attackIp" },
    { label: "攻击类型", prop: "attackTypeList" },
    { label: "攻击次数", prop: "attackTotal" },
    { label: "攻击企业", prop: "attackCorpTotal" },
  ]);
  const ipList = ref([]);

  // === Right Data ===
  const mapData = ref({
    map: [],
  });

  const mapOption = ref({
    visualMap2: {
      max: 0,
      min: 0,
      text: [0, 0],
    },
  });

  const columns2 = ref([
    { label: "企业名称", prop: "attackedCorpname", showOverflowTooltip: true },
    { label: "被攻击次数", prop: "attackedTotal", width: 140 },
    { label: "被攻击IP个数", prop: "attackedIpTotal", width: 140 },
    { label: "遭受网络攻击类型", prop: "attackTypeList", width: 420 },
  ]);
  const companyList = ref([]);
  const attackedList = ref([]);
  const attackedData = ref([
    {
      name: "攻击次数",
      list: [],
    },
  ]);

  // === Left Methods ===
  async function keyMonitoringOverviewData() {
    if (useMockData) {
      const res = mockData.keyMonitoringOverview;
      if (res.code == 0) {
        introduction.value = res.data.industryInfo;
        totalOneList1.value.forEach((item) => {
          const num = res.data[item.key];
          item.value =
            num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
        });
      }
      return;
    }

    const res = await keyMonitoringOverview({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      introduction.value = res.data.industryInfo;
      totalOneList1.value.forEach((item) => {
        const num = res.data[item.key];
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  async function networkAttackTotalData() {
    if (useMockData) {
      const res = mockData.networkAttackTotal;
      if (res.code == 0) {
        resFmt(0, res);
      }
      return;
    }

    const res = await networkAttackTotal({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      resFmt(0, res);
    }
  }

  async function foreignNetworkAttackTotalData() {
    if (useMockData) {
      const res = mockData.foreignNetworkAttackTotal;
      if (res.code == 0) {
        resFmt(1, res);
      }
      return;
    }

    const res = await foreignNetworkAttackTotal({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      resFmt(1, res);
    }
  }

  async function attackIpTotalData() {
    if (useMockData) {
      const res = mockData.attackIpTotal;
      if (res.code == 0) {
        resFmt(2, res);
      }
      return;
    }

    const res = await attackIpTotal({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      resFmt(2, res);
    }
  }

  function resFmt(i, res) {
    if(!totalOneList2.value[i]) return;
    totalOneList2.value[i].value = Number(res.data.total);
    const value1 = res.data.chainRatio;
    const value2 = res.data.yearOnYear;
    totalTwoList.value[i].value1 =
      value1.indexOf("-") === -1 ? value1 : value1.slice(1);
    totalTwoList.value[i].label1 =
      value1.indexOf("-") === -1 ? "环比增长" : "环比下降";
    totalTwoList.value[i].status1 = value1.indexOf("-") === -1 ? "up" : "down";
    totalTwoList.value[i].value2 =
      value2.indexOf("-") === -1 ? value2 : value2.slice(1);
    totalTwoList.value[i].label2 =
      value2.indexOf("-") === -1 ? "同比增长" : "同比下降";
    totalTwoList.value[i].status2 = value2.indexOf("-") === -1 ? "up" : "down";
  }

  // === Center Methods ===
  async function overallSecuritySituationData() {
    if (useMockData) {
      const res = mockData.overallSecuritySituation;
      if (res.code == 0) {
        overviewText.value = res.data;
      }
      return;
    }

    const res = await overallSecuritySituation({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      overviewText.value = res.data;
    }
  }

  async function networkAttackTypeDistributionData() {
    if (useMockData) {
      const res = mockData.networkAttackTypeDistribution;
      if (res.code == 0) {
        batteryList.value = res.data.map((item) => ({
          name: item.key,
          value: item.doc_count,
        }));
      }
      return;
    }

    const res = await networkAttackTypeDistribution({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      batteryList.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  async function networkThreatLevelDistributionData() {
    if (useMockData) {
      const res = mockData.networkThreatLevelDistribution;
      if (res.code == 0) {
        const total = res.data.reduce(
          (total, item) => total + item.doc_count,
          0
        );
        riskList.value.forEach((item) => {
          const data = res.data.find((i) => i.severityCn == item.name);
          item.value = data?.doc_count || 0;
          item.rate = (((data?.doc_count || 0) / total) * 100).toFixed(1) - 0;
          item.tags = data?.eventTypeIdCnList || [];
        });
      }
      return;
    }

    const res = await networkThreatLevelDistribution({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      const total = res.data.reduce((total, item) => total + item.doc_count, 0);
      riskList.value.forEach((item) => {
        const data = res.data.find((i) => i.severityCn == item.name);
        item.value = data?.doc_count || 0;
        item.rate = (((data?.doc_count || 0) / total) * 100).toFixed(1) - 0;
        item.tags = data?.eventTypeIdCnList || [];
      });
    }
  }

  async function networkAttackChangeTrendData() {
    if (useMockData) {
      const res = mockData.networkAttackChangeTrend;
      if (res.code == 0) {
        lineData.value.category = res.data.inList.map(
          (item) => item.key_as_string
        );
        lineData.value.values[0] = res.data.inList.map(
          (item) => item.doc_count
        );
        lineData.value.values[1] = res.data.overseasList.map(
          (item) => item.doc_count
        );
      }
      return;
    }

    const res = await networkAttackChangeTrend({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      lineData.value.category = res.data.inList.map(
        (item) => item.key_as_string
      );
      lineData.value.values[0] = res.data.inList.map((item) => item.doc_count);
      lineData.value.values[1] = res.data.overseasList.map(
        (item) => item.doc_count
      );
    }
  }

  async function attackCountryRankingData() {
    if (useMockData) {
      const res = mockData.attackCountryRanking;
      if (res.code == 0) {
        pieData.value = res.data.map((item) => ({
          name: item.key,
          value: item.doc_count,
          shadowRadius: item.shadowRadius || "31%",
        }));

        if (res.colors && Array.isArray(res.colors)) {
          pieOption.value.colors = res.colors;
        }
      }
      return;
    }

    const res = await attackCountryRanking({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
        shadowRadius: "31%",
      }));
    }
  }

  async function attackSourceFeatureAnalysisData() {
    if (useMockData) {
      const res = mockData.attackSourceFeatureAnalysis;
      if (res.code == 0) {
        ipList.value = res.data;
      }
      return;
    }

    const res = await attackSourceFeatureAnalysis({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      ipList.value = res.data;
    }
  }

  // === Right Methods ===
  async function attackedEnterpriseAreaDistributionData() {
    if (useMockData) {
      const res = mockData.attackedEnterpriseAreaDistribution;
      if (res.code == 0) {
        const list = res.data.thermalMapList.map((item) => ({
          name: ChinaNameMap[item.key],
          value: item.doc_count,
        }));
        mapData.value.map = list;
        attackedData.value[0].list = res.data.barChartList
          .map((item) => ({
            label: ChinaNameMap[item.key],
            value: item.doc_count,
          }))
          .slice(0, 5);
      }
      return;
    }

    const res = await attackedEnterpriseAreaDistribution({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      const list = res.data.thermalMapList.map((item) => ({
        name: ChinaNameMap[item.key],
        value: item.doc_count,
      }));
      mapData.value.map = list;
      let min = Math.min(...list.map((item) => item.value));
      const max = Math.max(...list.map((item) => item.value));
      if (max === min) {
        min = 0;
      }
      mapOption.value.visualMap2 = {
        max,
        min,
        text: [max, min],
      };
      attackedData.value[0].list = res.data.barChartList
        .map((item) => ({
          label: ChinaNameMap[item.key],
          value: item.doc_count,
        }))
        .slice(0, 5);
    }
  }

  async function realTimeAttackDynamicsData() {
    if (useMockData) {
      const res = mockData.realTimeAttackDynamics;
      if (res.code == 0) {
        attackedList.value = res.data.map((item) => ({
          ...item,
          name: ChinaNameMap[item.attackProvince],
        }));
      }
      return;
    }

    const res = await realTimeAttackDynamics({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      attackedList.value = res.data.map((item) => ({
        ...item,
        name: ChinaNameMap[item.attackProvince],
      }));
    }
  }

  async function attackedEnterpriseRankingData() {
    if (useMockData) {
      const res = mockData.attackedEnterpriseRanking;
      if (res.code == 0) {
        companyList.value = res.data;
      }
      return;
    }

    const res = await attackedEnterpriseRanking({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      companyList.value = res.data;
    }
  }

  // === Watch ===
  watch(
    [keyWord, activeTab],
    (newVal) => {
      // Left
      keyMonitoringOverviewData();
      networkAttackTotalData();
      foreignNetworkAttackTotalData();
      attackIpTotalData();
      
      // Center
      overallSecuritySituationData();
      networkAttackTypeDistributionData();
      networkThreatLevelDistributionData();
      networkAttackChangeTrendData();
      attackCountryRankingData();
      attackSourceFeatureAnalysisData();

      // Right
      realTimeAttackDynamicsData();
      attackedEnterpriseAreaDistributionData();
      attackedEnterpriseRankingData();
    },
    { immediate: true }
  );

  return {
    // Shared
    keyWord,
    tabsList,
    activeTab,
    changeTab,
    
    // Left
    totalOneList1,
    totalOneList2,
    totalTwoList,
    introduction,

    // Center
    pieOption,
    overviewText,
    batteryList,
    riskList,
    lineData,
    pieData,
    columns1,
    ipList,

    // Right
    industryOverviewList,
    mapData,
    mapOption,
    columns2,
    companyList,
    attackedList,
    attackedData,
  };
}
