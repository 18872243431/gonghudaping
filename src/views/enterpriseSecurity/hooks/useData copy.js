import { ref, onBeforeMount, onMounted } from "vue";
import dataJson from "./data.json";

export function useData() {
  const tabsList = ref(dataJson.tabsList);

  const activeTab = ref("2");

  function changeTab(tab) {
    activeTab.value = tab;
  }

  const overviewData1 = ref(dataJson.overviewData1);
  const barLineData = ref(dataJson.barLineData);


  const rightData1 = ref(dataJson.rightData1);


  // 直接使用 logos2 目录中的文件名（去掉扩展名）作为名称
  const companyList = ref(dataJson.companyList);


  const bottomLeftData = ref(dataJson.bottomLeftData);

  const bottomChartData = ref(dataJson.bottomChartData);

  const topPhaseData = ref(dataJson.topPhaseData);

  const topBarData = ref(dataJson.topBarData);

  const vulnerabilityPieData = ref(dataJson.vulnerabilityPieData);

  const vulnerabilityData = ref(dataJson.vulnerabilityData);

  const caseData = ref(dataJson.caseData);

  const industryRiskCardData = ref(dataJson.industryRiskCardData);

  const industryRiskBarData = ref(dataJson.industryRiskBarData);

  const vendorData = ref([...(dataJson.vendorData || [])].sort((a, b) => b.count - a.count));

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
