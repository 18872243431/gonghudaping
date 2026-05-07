import { ref, onBeforeMount, onMounted, watch, computed } from "vue";
import dataJson from "./data.json";
import { getAllMockData } from "@/api/allMockJson";
export function useData() {
  const tabsList = ref(dataJson.tabsList);

  const activeTab = ref("2");

  function changeTab(tab) {
    activeTab.value = tab;
  }

  const overviewData1 = ref([
     {
      "name": "风险企业数量",
      "value": 0,
      "unit": "万家",
      "icon": "icon1"
    },
    {
      "name": "重点产业链企业",
      "value": 0,
      "unit": "家",
      "icon": "icon2"
    },
    {
      "name": "参与演练企业",
      "value": 0,
      "unit": "家",
      "icon": "icon3"
    },
    {
      "name": "通报处置企业",
      "value": 0,
      "unit": "家",
      "icon": "icon4"
    }
  ]);
  const barLineData = ref([
     {
      "name": "受攻击企业（家）",
      "key": "attackedCompany",
      "list": [
        // { "label": "2024-01", "value": 320 },
        // { "label": "2024-02", "value": 220 }
      ]
    },
    {
      "name": "攻击次数（万次）",
      "key": "attackedCount",
      "list": [
        // { "label": "2024-01", "value": 2.4 },
        // { "label": "2024-02", "value": 1.4 }
      ]
    }
  ]);


  const rightData1 = ref({
    total: 0,
    rate: 0,
    list: []
  });


  const vulnerabilityPieData = ref(0);

  // 直接使用 logos2 目录中的文件名（去掉扩展名）作为名称
  const companyList = ref([]);


  const bottomLeftData = ref([]);

  const bottomChartData = ref([]);

  const topPhaseData = ref([]);

  const topBarData = ref([]);

  const vulnerabilityData = ref([

  ]);

  const caseData = ref([]);

  const industryRiskCardData = ref(dataJson.industryRiskCardData);

  const industryRiskBarData = ref(dataJson.industryRiskBarData);

  const vendorData = ref([]);

  async function getEnterpriseSecurityData() {
    const data = {
      timeType: activeTab.value,
      wdId: 'enterpriseSecurity'
    };
    const res = await getAllMockData(data);
    if (res.code == 0) {
      overviewData1.value = res.data.overviewData1 || [];
      barLineData.value = res.data.barLineData || [];
      rightData1.value = res.data.rightData1 || { total: 0, rate: 0, list: [] };
      companyList.value = res.data.companyList || [];
      bottomLeftData.value = res.data.bottomLeftData || [];
      bottomChartData.value = res.data.bottomChartData || [];
      topPhaseData.value = res.data.topPhaseData || [];
      topBarData.value = res.data.topBarData || [];
      vulnerabilityData.value = res.data.vulnerabilityData || [];
      caseData.value = res.data.caseData || [];
      vendorData.value = [...(res.data.vendorData || [])].sort((a, b) => b.count - a.count);
      vulnerabilityPieData.value = res.data.vulnerabilityPieData || 0;
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getEnterpriseSecurityData();
    },
    { immediate: true }
  );

  function formatNumber(value) {
    const num = Number(value);
    if (isNaN(num)) return "";
    if (num >= 10000) {
      return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    } else {
      return num.toLocaleString();
    }
  }

  onBeforeMount(() => {});

  onMounted(() => {});
  return {
    overviewData1,
    barLineData,
    rightData1,
    companyList,
    bottomLeftData,
    bottomChartData,
    topPhaseData,
    topBarData,
    vulnerabilityData,
    caseData,
    vendorData,
    tabsList,
    activeTab,
    changeTab,
    formatNumber,
    vulnerabilityPieData,
    industryRiskCardData,
    industryRiskBarData,
  };
}
