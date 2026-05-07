import { ref, watch } from "vue";
import dataJson from "./data.json";

const tabsList = ref([
  { label: "24小时", value: "1" },
  { label: "近7天", value: "2" },
  { label: "近30天", value: "3" },
  // { label: "近1年", value: "4" },
]);

const activeTab = ref("1");

function changeTab(tab) {
  activeTab.value = tab;
}
export function useLeft() {
  const overviewData1 = ref([
    {
      name: "原材料工业",
      value1: "0",
      value2: "9",
      key: "原材料工业",
      img: "1",
      list: [],
    },
    {
      name: "装备工业",
      value1: "0",
      value2: "8",
      key: "装备工业",
      img: "2",
      list: [],
    },
    {
      name: "消费品工业",
      value1: "0",
      value2: "16",
      key: "消费品工业",
      img: "3",
      list: [],
    },
    {
      name: "电子信息制造业",
      value1: "0",
      value2: "1",
      key: "电子信息制造业",
      img: "4",
      list: [],
    },
  ]);

  const overviewData2 = ref([
    {
      name: "工业企业",
      value1: "",
      unit1: "家",
      value2: "",
      unit2: "家",
      key: "工业企业",
      label2: "规上企业数量",
    },
    {
      name: "平台企业",
      value1: "",
      unit1: "家",
      value2: "",
      unit2: "个",
      key: "平台企业",
      label2: "双跨平台数量",
    },
    {
      name: "标识解析企业",
      value1: "",
      unit1: "家",
      value2: "",
      unit2: "个",
      key: "标识解析企业",
      label2: "顶级节点数量",
    },
  ]);

  function getIndustrialInternetMonitoringDetailData() {
    const res = dataJson.industrialInternetMonitoringDetail;
    if (res.code == 0) {
      overviewData1.value.forEach((item) => {
        const obj = res.data[item.key];
        if (obj) {
          let num1 = 0,
            list = [];
          Object.values(obj).forEach((itm) => {
            num1 += itm.companyTotal;
          });
          Object.keys(obj).forEach((itm) => {
            list.push({
              name: itm,
              ...obj[itm],
            });
          });
          item.value1 =
            num1 > 9999
              ? (num1 / 10000).toFixed(1) + "万"
              : num1.toLocaleString();
          item.list = list;
        }
      });
    }
  }

  function getIndustrialInternetMonitoringData() {
    const res = dataJson.industrialInternetMonitoring;
    if (res.code === 0) {
      overviewData2.value.forEach((item) => {
        const obj = res.data.find((i) => i.key === item.key);
        const num1 = Number(obj.companyTotal);
        item.value1 =
          num1 > 9999
            ? (num1 / 10000).toFixed(1) + "万"
            : num1.toLocaleString();
        const num2 = Number(obj.coverageTotal);
        item.value2 =
          num2 > 9999
            ? (num2 / 10000).toFixed(1) + "万"
            : num2.toLocaleString();
      });
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getIndustrialInternetMonitoringData();
      getIndustrialInternetMonitoringDetailData();
    },
    { immediate: true }
  );

  return { overviewData1, overviewData2 };
}

export function useCenter() {
  const overviewText = ref("");
  const totalOneList2 = ref([
    {
      label: "数据安全风险告警",
      value: 0,
      unit: "次",
      key: "数据安全风险告警",
    },
    { label: "跨境风险告警", value: 0, unit: "次", key: "跨境风险告警" },
    {
      label: "暴露数据资产",
      value: 0,
      unit: "个",
      key: "暴露数据资产",
    },
    {
      label: "风险企业数量",
      value: 0,
      unit: "家",
      key: "风险企业数量",
    },
  ]);
  const worldData = ref([]);
  const visualMap = ref({ max: 120, min: 0, left: 270 });

  const columns = ref([
    // { label: "时间", prop: "timestamp", width: 190 },
    // { label: "风险等级", prop: "severityCn", width: 100 },
    // { label: "风险大类", prop: "eventTypeName", width: 130 },
    // { label: "风险小类", prop: "categoryCn", width: 130 },
    // { label: "风险企业", prop: "attackedCorpName", showOverflowTooltip: true },
    // { label: "风险IP", prop: "attackedIp", width: 160 },
    // { label: "攻击IP", prop: "attackIp", width: 160 },
    // { label: "攻击国家", prop: "attackCountry", width: 140 },
    { label: "时间", prop: "timestamp", width: 220 },
    { label: "风险类型", prop: "categoryCn", width:220 },
    { label: "攻击端IP", prop: "attackIp", width: 220 },
    { label: "攻击来源", prop: "attackCountry", width: 220 },
    { label: "被攻击企业", prop: "attackedCorpName" },
  ]);
  const tableData = ref([]);

  const attackData = ref([
    {
      name: "外联次数",
      list: [],
    },
  ]);

  const worldMapData = ref([]);

  function getOverviewData() {
    const res = dataJson.overview;
    if (res.code == 0) {
      overviewText.value = res.data;
    }
  }

  function getSecurityOverviewData() {
    const res = dataJson.securityOverview;
    if (res.code == 0) {
      totalOneList2.value.forEach((item) => {
        item.value = res.data[item.key];
      });
    }
  }

  function getCountryIpTop3Data(country) {
    const res = dataJson.countryIpTop3;
    if (res.code == 0) {
      ipRankData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  function getRealTimeDataSecurityEventsData() {
    const res = dataJson.realTimeDataSecurityEvents;
    if (res.code == 0) {
      tableData.value = res.data;
    }
  }

  function getDataFlowDynamicData() {
    const res = dataJson.dataFlowDynamic;
    if (res.code == 0) {
      const list = [];
      res.data.forEach((item) => {
        if (item.by_srcIpCountry.buckets.length > 0) {
          item.by_srcIpCountry.buckets.forEach((item2) => {
            list.push([
              { name: item2.key, value: item2.doc_count },
              { name: item.key, value: item.doc_count },
            ]);
          });
        }
      });
      worldMapData.value = list;
      worldData.value = res.data.map((item) => {
        return {
          name: item.key,
          value: item.doc_count,
        };
      });

      const max = Math.max(...worldData.value.map((item) => item.value));
      visualMap.value.max = max;
      const min = Math.min(...worldData.value.map((item) => item.value));
      visualMap.value.min = max === min && max !== 0 ? 0 : min;
    }
  }

  function getCountryIpRankData() {
    const res = dataJson.countryIpRank;
    if (res.code == 0) {
      attackData.value[0].list = res.data.map((item) => {
        return {
          label: item.key,
          value: item.doc_count,
        };
      });
    }
  }

  const selectedCountry = ref("");
  const tooltipPosition = ref({ x: 0, y: 0 });
  const tooltipShow = ref(false);
  const ipRankData = ref([]);
  function mapClick(params) {
    if (params.componentSubType === "map") {
      console.log(params);
      selectedCountry.value = params.name;
      tooltipPosition.value.x = params.event.event.clientX * 2 - 300;
      tooltipPosition.value.y = params.event.event.clientY;
      tooltipShow.value = true;
      getCountryIpTop3Data(params.name);
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getOverviewData();
      getSecurityOverviewData();
      getRealTimeDataSecurityEventsData();
      getDataFlowDynamicData();
      getCountryIpRankData();
    },
    { immediate: true }
  );

  return {
    overviewText,
    totalOneList2,
    tableData,
    columns,
    attackData,
    worldMapData,
    worldData,
    visualMap,
    mapClick,
    tooltipPosition,
    tooltipShow,
    selectedCountry,
    ipRankData,
  };
}

export function useRight() {
  const pieData = ref([]);

  const batteryList = ref([]);

  const companyList = ref([]);
  const columns2 = ref([
    { label: "企业名称", prop: "name", showOverflowTooltip: true },
    { label: "被攻击次数", prop: "value1", width: 140 },
    { label: "遭受网络攻击类型", prop: "tags", width: 420 },
  ]);

  // 暗网数据泄露与售卖监测数据
  const darkWebMonitorData = ref([]);

  function getDataSecurityEventsData() {
    const res = dataJson.dataSecurityEvents;
    if (res.code == 0) {
      batteryList.value = res.data.map((item) => ({
        name: item.key,
        value: Number(item.doc_count),
      }));
    }
  }

  function getExposedDataAssetsData() {
    const res = dataJson.exposedDataAssets;
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: Number(item.doc_count),
      }));
    }
  }

  function getRiskEnterpriseRankingData() {
    const res = dataJson.riskEnterpriseRanking;
    if (res.code == 0) {
      companyList.value = res.data.map((item) => {
        return {
          name: item.corpname,
          value1: item.attackedTotal,
          value2: item.ipTotal,
          tags: item.categoryCnList,
        };
      });
    }
  }

  // 获取暗网数据泄露与售卖监测数据
  function getDarkWebMonitorData() {
    const res = dataJson.darkWebMonitor;
    if (res.code == 0) {
      darkWebMonitorData.value = res.data.map((item) => ({
        companyName: item.corpName,
        dataType: item.dataType,
        dataVolume: item.dataVolume,
        monitorTime: item.monitorTime,
      }));
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getDataSecurityEventsData();
      getExposedDataAssetsData();
      getRiskEnterpriseRankingData();
      getDarkWebMonitorData();
    },
    { immediate: true }
  );

  return {
    pieData,
    batteryList,
    companyList,
    tabsList,
    activeTab,
    changeTab,
    columns2,
    darkWebMonitorData,
  };
}
