import { ref, watch, onBeforeMount } from "vue";
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

const industry = "集成电路企业";

export function useLeft() {
  const specialList = ref([]);
  const barLineData = ref([
    {
      name: "产量",
      list: [],
    },
    {
      name: "增长率",
      list: [],
    },
  ]);

  const overviewList = ref([
    { value1: 0, value2: 0, key: "上游：半导体材料及设备" },
    { value1: 0, value2: 0, key: "中游：集成电路设计、制造及封测" },
    { value1: 0, value2: 0, key: "下游：集成电路应用领域" },
  ]);

  function getSpecialData() {
    const res = dataJson.special;
    if (res.code === 0) {
      specialList.value = res.data;
    }
  }

  function getProductionTrendData() {
    const res = dataJson.productionTrend;
    if (res.code === 0) {
      barLineData.value[0].list = res.data.map((item) => ({
        label: item.key,
        value: Number(item.total),
      }));
      barLineData.value[1].list = res.data.map((item) => ({
        label: item.key,
        value: Number(item.ratio),
      }));
    }
  }

  function getIndustryMapData() {
    const res = dataJson.industryMap;
    if (res.code === 0) {
      overviewList.value.forEach((item) => {
        const obj = res.data.find((itm) => itm.key === item.key);
        if (obj) {
          item.value1 =
            Number(obj.monitorTotal) > 9999
              ? (Number(obj.monitorTotal) / 10000).toFixed(1) + "万"
              : Number(obj.monitorTotal).toLocaleString();
          item.value2 =
            Number(obj.attackTotal) > 9999
              ? (Number(obj.attackTotal) / 10000).toFixed(1) + "万"
              : Number(obj.attackTotal).toLocaleString();
        }
      });
    }
  }

  onBeforeMount(() => {
    getSpecialData();
    getProductionTrendData();
  });

  watch(
    () => activeTab.value,
    () => {
      getIndustryMapData();
    },
    { immediate: true }
  );

  return {
    barLineData,
    overviewList,
    specialList,
  };
}

export function useCenter() {
  const overflowData1 = ref([
    {
      name: "监测保障企业数量",
      value: 0,
      unit: "家",
      key: "重点企业数量",
    },
    {
      name: "发现风险企业数量",
      value: 0,
      unit: "家",
      key: "风险企业数量",
    },
    // {
    //   name: "风险企业数量",
    //   value: 0,
    //   unit: "个",
    //   key: "风险企业数量",
    // },
  ]);

  const totalOneList = ref([
    { label: "网络攻击总数", value: 0, unit: "次", key: "网络攻击总数" },
    { label: "攻击源数量", value: 0, unit: "个", key: "攻击源数量" },
    {
      label: "境外网络攻击次数",
      value: 0,
      unit: "次",
      key: "境外网络攻击次数",
    },
  ]);

  const totalTwoList = ref([
    {
      title: "网络攻击总数",
      label1: "环比增长",
      value1: "",
      status1: "up",
      // label2: "同比下降",
      // value2: "",
      // status2: "down",
    },
    {
      title: "攻击源数量",
      label1: "环比增长",
      value1: "",
      status1: "up",
      // label2: "同比下降",
      // value2: "",
      // status2: "down",
    },
    {
      title: "境外网络攻击次数",
      label1: "环比增长",
      value1: "",
      status1: "up",
      // label2: "同比下降",
      // value2: "",
      // status2: "down",
    },
  ]);

  const lineData1 = ref({
    legend: ["网络攻击趋势"],
    category: [],
    values: [
      [], // 替换为你实际的数据
    ],
  });

  const lineData2 = ref({
    legend: ["攻击源数量变化趋势"],
    category: [],
    values: [
      [], // 替换为你实际的数据
    ],
  });

  const lineData3 = ref({
    legend: ["被攻击IP地址数量变化趋势"],
    category: [],
    values: [
      [], // 替换为你实际的数据
    ],
  });

  const lineOpts = ref({
    grid: {
      left: 20,
      right: 0,
      top: 10,
      bottom: 5,
      containLabel: true,
    },
    legend: {
      show: false,
    },
  });

  function getOverviewData() {
    const res = dataJson.overview;
    if (res.code === 0) {
      overflowData1.value.forEach((item) => {
        const num = Number(res.data[item.key]);
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  function getMonitorOverviewData() {
    const res = dataJson.monitorOverview;
    if (res.code === 0) {
      totalOneList.value.forEach((item) => {
        item.value = res.data[item.key];
      });
    }
  }

  function getAttackTotalData() {
    const res = dataJson.attackTotal;
    if (res.code === 0) {
      resFmt(0, res);
    }
  }

  function getAttackSourceData() {
    const res = dataJson.attackSource;
    if (res.code === 0) {
      resFmt(1, res);
    }
  }

  function getAttackSourceRankingData() {
    const res = dataJson.attackSourceRanking;
    if (res.code === 0) {
      resFmt(2, res);
    }
  }

  function resFmt(index, res) {
    const value1 = res.data["环比"];
    // const value2 = res.data["同比"];
    totalTwoList.value[index].value1 =
      value1.indexOf("-") === -1 ? value1 : value1.slice(1);
    totalTwoList.value[index].label1 =
      value1.indexOf("-") === -1 ? "环比增长" : "环比下降";
    totalTwoList.value[index].status1 =
      value1.indexOf("-") === -1 ? "up" : "down";
    // totalTwoList.value[index].value2 =
    //   value2.indexOf("-") === -1 ? value2 : value2.slice(1);
    // totalTwoList.value[index].label2 =
    //   value2.indexOf("-") === -1 ? "同比增长" : "同比下降";
    // totalTwoList.value[index].status2 =
    //   value2.indexOf("-") === -1 ? "up" : "down";
  }

  function getAttackTrendData() {
    const res = dataJson.attackTrend;
    if (res.code === 0) {
      lineData1.value.category = res.data.map((item) => item.key_as_string);
      lineData1.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  function getAttackSourceTrendData() {
    const res = dataJson.attackSourceTrend;
    if (res.code === 0) {
      lineData2.value.category = res.data.map((item) => item.key_as_string);
      lineData2.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  function getAttackIpTrendData() {
    const res = dataJson.attackIpTrend;
    if (res.code === 0) {
      lineData3.value.category = res.data.map((item) => item.key_as_string);
      lineData3.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  function showPopover(i) {
    if (i === 0) getIntegratedCompanyListData();
    if (i === 1) getRiskCompanyListData();
  }

  const riskCompanyList = ref([]);

  function getRiskCompanyListData() {
    const res = dataJson.riskCompanyList;
    if (res.code === 0) {
      riskCompanyList.value = res.data;
    }
  }

  const searchCompanyName = ref("");
  const total = ref(0);
  const integratedCompanyList = ref([]);
  const currentPage = ref(1);
  function getIntegratedCompanyListData(value = 1) {
    currentPage.value = value;
    const res = dataJson.integratedCompanyList;
    if (res.code === 0) {
      // 简单模拟搜索功能
      let filteredData = res.data.rows;
      if (searchCompanyName.value) {
        filteredData = filteredData.filter((item) =>
          item.companyname.includes(searchCompanyName.value)
        );
      }
      integratedCompanyList.value = filteredData;
      total.value = res.data.count;
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getOverviewData();
      getMonitorOverviewData();
      getAttackTotalData();
      getAttackSourceData();
      getAttackSourceRankingData();
      getAttackTrendData();
      getAttackSourceTrendData();
      getAttackIpTrendData();
    },
    { immediate: true }
  );

  return {
    overflowData1,
    totalOneList,
    totalTwoList,
    lineData1,
    lineData2,
    lineData3,
    lineOpts,
    showPopover,
    riskCompanyList,
    integratedCompanyList,
    total,
    getIntegratedCompanyListData,
    searchCompanyName,
    currentPage,
  };
}

export function useRight() {
  const pieData = ref([]);
  const rankBarData = ref([]);

  const companyList = ref([]);
  const columns = ref([
    { label: "企业名称", prop: "name", showOverflowTooltip: true },
    { label: "被攻击次数", prop: "value1", width: 140 },
    { label: "被攻击IP个数", prop: "value2", width: 140 },
    { label: "遭受网络攻击类型", prop: "tags", width: 420 },
  ]);

  function getAttackIndustryRankingData() {
    const res = dataJson.attackIndustryRanking;
    if (res.code === 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  function getAttackIndustryTrendData() {
    const res = dataJson.attackIndustryTrend;
    if (res.code === 0) {
      rankBarData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  function getRiskRankingData() {
    const res = dataJson.riskRanking;
    if (res.code === 0) {
      companyList.value = res.data.map((item) => {
        return {
          name: item.companyName,
          value1: item.attackedTotal,
          value2: item.attackedIpTotal,
          tags: item.categoryRank.map((item) => item.key),
        };
      });
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getAttackIndustryRankingData();
      getAttackIndustryTrendData();
      getRiskRankingData();
    },
    { immediate: true }
  );

  return {
    pieData,
    companyList,
    tabsList,
    activeTab,
    changeTab,
    rankBarData,
    columns,
  };
}
