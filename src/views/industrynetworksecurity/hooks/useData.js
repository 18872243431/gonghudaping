import { ref, watch } from "vue";
import { getAllMockData } from "@/api/allMockJson";
import { 
  overviewOfKeyMonitoringTargets, 
  netAttackDistribution,
  networkAttackTypesRank,
  netAttackTrend,
  attackedCompanyTop,
  rawMaterialsIndustryAttackedDistribution,
  overseasAttackSourcesRank,
 } from "@/api/industrynetworksecurity";
export function useDataFun(keyWord) {
  // === Shared State ===
  // 安全事件预警列表数据
const warningEventsList = ref([
  // {
  //   id: 1,
  //   title: '景东新理想水电有限公司',
  //   riskType: '后门植入',
  //   riskLevel: '一般事件',
  //   notifyTime: '2025-12-20',
  //   status: '处置中',
  // },
  // {
  //   id: 2,
  //   title: '景东新理想水电有限公司',
  //   riskType: '后门植入',
  //   riskLevel: '一般事件',
  //   notifyTime: '2025-12-20',
  //   status: '处置中',
  // }
]);
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

  // 四大原材料行业遭受攻击分布数据
  const rawMaterialsList = ref([]);

  // === Center Data ===
  const batteryList = ref([]);

  const lineData = ref({
    legend: ["境内", "境外"],
    category: [],
    values: [[], []],
  });

  // === Right Data ===
  const companyList = ref([]);

  // 境外攻击来源TOP5数据
  const foreignAttackSourceList = ref([]);

  // === Data Fetching ===
  async function getIndustryNetworkSecurityData() {
    const data = {
      timeType: activeTab.value,
      wdId: "industrynetworksecurity",
      uploadlabel: keyWord.value,
    };
    const res = await getAllMockData(data);
    if (res.code == 0) {
      const mockData = res.data;

      // Left: Overview
      if (mockData.keyMonitoringOverview) {
        introduction.value = mockData.keyMonitoringOverview.industryInfo;
        totalOneList1.value[0].value = Number(mockData.keyMonitoringOverview.monitoringCompanyTotal);
      }
      if(mockData.warningEventsList) {
        warningEventsList.value = mockData.warningEventsList;
      }
    }
  }

  async function getOverviewOfKeyMonitoringTargets(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await overviewOfKeyMonitoringTargets(data);
    if (res.code == 0) {
      introduction.value = res.data.industryInfo;
      totalOneList1.value[1].value = Number(res.data.riskCompanyTotal);
    }
  }

   async function getNetAttackDistribution(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await netAttackDistribution(data);
    if (res.code == 0) {
      totalOneList2.value[0].value = Number(res.data.networkAttackTotal);
      totalOneList2.value[1].value = Number(res.data.foreignNetworkAttackTotal);
    }
  }

  async function getNetAttackTypesRank(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await networkAttackTypesRank(data);
    if (res.code == 0) {
      batteryList.value = res.data.map((item) => ({
          name: item.key,
          value: item.doc_count,
        }));
    }
  }

  async function getNetAttackTrend(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await netAttackTrend(data);
    if (res.code == 0) {
      const trendData =res.data;
        lineData.value.category = trendData.inList.map(
          (item) => item.key_as_string
        );
        lineData.value.values[0] = trendData.inList.map(
          (item) => item.doc_count
        );
        lineData.value.values[1] = trendData.overseasList.map(
          (item) => item.doc_count
        );
    }
  }

  async function getAttackedCompanyTop(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await attackedCompanyTop(data);
    if (res.code == 0) {
      companyList.value = res.data;
    }
  }

   async function getRawMaterialsIndustryAttackedDistribution(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await rawMaterialsIndustryAttackedDistribution(data);
    if (res.code == 0) {
      const colorMap = {
        "石油化工": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "petrochemical" },
        "建材工业": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "building" },
        "有色金属": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "metal" },
        "钢铁工业": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "steel" },
        };
        rawMaterialsList.value = res.data.map(item => ({
          ...item,
          ...colorMap[item.name]
        }));
    }
  }

  async function getOverseasAttackSourcesRank(){
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    };
    const res = await overseasAttackSourcesRank(data);
    if (res.code == 0) {
      foreignAttackSourceList.value = res.data.map(item => ({ label: item.country, value: item.attackCount }));
    }
  }

  // === Watch ===
  watch(
    [keyWord, activeTab],
    () => {
      getIndustryNetworkSecurityData();
      getOverviewOfKeyMonitoringTargets();
      getNetAttackDistribution();
      getNetAttackTypesRank();
      getNetAttackTrend();
      getAttackedCompanyTop();
      getRawMaterialsIndustryAttackedDistribution();
      getOverseasAttackSourcesRank();
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
    rawMaterialsList,
    introduction,

    // Center
    batteryList,
    lineData,
    foreignAttackSourceList,

    // Right
    companyList,
    warningEventsList
  };
}
