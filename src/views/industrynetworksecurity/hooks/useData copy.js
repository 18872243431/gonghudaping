import { reactive, ref, watch } from "vue";
import mockData from "./data.json";

// 使用模拟数据的标志
const useMockData = true;

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

  // === Left Methods ===
  async function keyMonitoringOverviewData() {
    if (useMockData) {
      const res = mockData.keyMonitoringOverview;
      if (res) {
        introduction.value = res.industryInfo;
        totalOneList1.value.forEach((item) => {
          const num = res[item.key];
          item.value =num
        });
      }
      return;
    }

  }

  async function networkAttackTotalData() {
    if (useMockData) {
      const res = mockData.networkAttackTotal;
      if (res) {
        resFmt(0, res);
      }
      return;
    }

  }

  async function foreignNetworkAttackTotalData() {
    if (useMockData) {
      const res = mockData.foreignNetworkAttackTotal;
      if (res) {
        resFmt(1, res);
      }
      return;
    }

  }

  async function attackIpTotalData() {
    if (useMockData) {
      const res = mockData.attackIpTotal;
      if (res) {
        resFmt(2, res);
      }
      return;
    }
  }

  function resFmt(i, res) {
    if(!totalOneList2.value[i]) return;
    totalOneList2.value[i].value = Number(res.total);
  }

  // === Center Methods ===
  async function networkAttackTypeDistributionData() {
    if (useMockData) {
      const res = mockData.networkAttackTypeDistribution;
      if (res) {
        batteryList.value = res.map((item) => ({
          name: item.key,
          value: item.doc_count,
        }));
      }
      return;
    }
  }

  async function networkAttackChangeTrendData() {
    if (useMockData) {
      const res = mockData.networkAttackChangeTrend;
      if (res) {
        lineData.value.category = res.inList.map(
          (item) => item.key_as_string
        );
        lineData.value.values[0] = res.inList.map(
          (item) => item.doc_count
        );
        lineData.value.values[1] = res.overseasList.map(
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

  async function rawMaterialsAttackDistributionData() {
    const res = mockData.rawMaterialsAttackDistribution;
    if (res) {
      const colorMap = {
        "石油化工": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "petrochemical" },
        "建材工业": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "building" },
        "有色金属": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "metal" },
        "钢铁工业": { attackColor: "#00D4FF", riskColor: "#00D4FF", icon: "steel" },
      };
      rawMaterialsList.value = res.map(item => ({
        ...item,
        ...colorMap[item.name]
      }));
    }
  }

  // 境外攻击来源TOP5数据
  const foreignAttackSourceList = ref([]);
  
  async function foreignAttackSourceTop5Data() {
    const res = mockData.foreignAttackSourceTop5;
    if (res) {
      foreignAttackSourceList.value = res;
    }
  }

  // === Right Methods ===
  async function attackedEnterpriseRankingData() {
    if (useMockData) {
      const res = mockData.attackedEnterpriseRanking;
      if (res) {
        companyList.value = res;
      }
      return;
    }

  }

  async function getWarningEventsListData() {
    if (useMockData) {
      const res = mockData.warningEventsList;
    if (res) {
      warningEventsList.value = res;
    }
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
      rawMaterialsAttackDistributionData();
      
      // Center
      networkAttackTypeDistributionData();
      networkAttackChangeTrendData();
      foreignAttackSourceTop5Data();

      // Right
      attackedEnterpriseRankingData();
      getWarningEventsListData();
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
  }
}
