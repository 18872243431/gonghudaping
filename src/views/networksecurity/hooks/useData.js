import { nextTick, ref, watch } from "vue";
import {
  getOverview,
  getAttackRanking,
  getSecuritySituation,
  getAttackDistribution,
  getAttackTrend,
  getRealTimeAttack,
  getExposedIndustrialControlSystem,
  getExposedIndustrialControlSystemDetail,
  getExposedIndustrialControlSystemDetail2,
  getForeignAttackCountry,
  getInternalAttackSource,
  getForeignAttackSource,
  getAttackedCompany,
} from "@/api/networksecurity";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import { mapDataRes, barDataRes, cardsDataRes } from "./data";

const tabsList = ref([
  { label: "24小时", value: "1" },
  { label: "近7天", value: "2" },
  { label: "近30天", value: "3" },
  // { label: "近1年", value: "4" },
]);

const activeTab = ref("2");

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

  async function getExposedIndustrialControlSystemDetailData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getExposedIndustrialControlSystemDetail(data);
    if (res.code == 0) {
      overviewData1.value.forEach((item) => {
        const obj = res.data[item.key];
        // console.log(obj);
        if (obj) {
          let num1 = 0,
            // num2 = 0,
            list = [];
          Object.values(obj).forEach((itm) => {
            num1 += itm.companyTotal;
            // num2 += itm.aboveScaleCompanyTotal;
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
          // item.value2 =
          //   num2 > 9999
          //     ? (num2 / 10000).toFixed(1) + "万"
          //     : num2.toLocaleString();
          item.list = list;
        }
      });
    }
  }

  async function getExposedIndustrialControlSystemDetailData2() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getExposedIndustrialControlSystemDetail2(data);
    if (res.code === 0) {
      // console.log(res.data, "123");
      overviewData2.value.forEach((item) => {
        const obj = res.data.find((i) => i.key === item.key);
        if (obj) {
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
        }
      });
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getExposedIndustrialControlSystemDetailData();
      getExposedIndustrialControlSystemDetailData2();
    },
    { immediate: true }
  );

  return { overviewData1, overviewData2 };
}

export function useCenter() {
  const overviewText = ref("");
  const mapData = ref({
    map: [],
  });
  const mapOption = ref({
    label: {
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "bold",
    },
    visualMap2: {
      max: 0,
      min: 0,
      text: [0, 0],
    },
  });

  const columns = ref([
    { label: "时间", prop: "timestamp", width: 220 },
    { label: "风险类型", prop: "eventTypeName", width: 220 },
    { label: "攻击端IP", prop: "attackIp", width: 220 },
    { label: "攻击来源", prop: "attackedCountry", width: 220 },
    { label: "被攻击企业", prop: "attackedCorpName" }
  ]);
  const tableData = ref([
    // {
    //   timestamp: "2025-01-01 00:00:00",
    //   eventTypeName: "恶意软件",
    //   killChainCn: "初始访问",
    //   attackIp: "123.123.123.123",
    //   attackedCountry: "中国",
    //   attackedCorpName: "华为",
    //   attackedIp: "123.123.123.123",
    // },
  ]);

  const attackData = ref([
    {
      name: "攻击次数",
      list: [],
    },
  ]);

  const attackData2 = ref([
    {
      name: "攻击次数",
      list: [],
    },
  ]);

  async function getOverviewData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getOverview(data);
    if (res.code == 0) {
      overviewText.value = res.data;
    }
  }

  async function getAttackRankingData() {
    const data = {
      timeType: activeTab.value,
    };
    // const res = mapDataRes;
    const res = await getAttackRanking(data);

    if (res.code == 0) {
      mapData.value.map = res.data.map((item) => ({
        name: ChinaNameMap[item.key],
        value: Number(item.doc_count),
      }));
      // const valueList = res.data.map((item) => Number(item.doc_count));
      // const max = Math.max(...valueList);
      // const min = valueList.length < 2 ? 0 : Math.min(...valueList);
      attackData.value[0].list = res.data.map((item) => ({
        label: ChinaNameMap[item.key],
        value: Number(item.doc_count),
      }));
    }
  }

  async function getRealTimeAttackData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getRealTimeAttack(data);
    if (res.code == 0) {
      tableData.value = res.data;
    }
  }

  async function getForeignAttackCountryData() {
    const data = { timeType: activeTab.value };
    const res = await getForeignAttackCountry(data);
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     { key: "荷兰", doc_count: 1104 },
    //     { key: "美国", doc_count: 466 },
    //     { key: "保加利亚", doc_count: 88 },
    //     { key: "英国", doc_count: 50 },
    //     { key: "新加坡", doc_count: 33 },
    //     { key: "荷兰", doc_count: 1104 },
    //     { key: "美国", doc_count: 466 },
    //     { key: "保加利亚", doc_count: 88 },
    //     { key: "英国", doc_count: 50 },
    //     { key: "新加坡", doc_count: 33 },
    //     { key: "荷兰", doc_count: 1104 },
    //     { key: "美国", doc_count: 466 },
    //     { key: "保加利亚", doc_count: 88 },
    //     { key: "英国", doc_count: 50 },
    //     { key: "新加坡", doc_count: 33 },
    //     { key: "荷兰", doc_count: 1104 },
    //     { key: "美国", doc_count: 466 },
    //     { key: "保加利亚", doc_count: 88 },
    //     { key: "英国", doc_count: 50 },
    //     { key: "新加坡", doc_count: 33 },
    //   ],
    // };
    if (res.code == 0) {
      attackData2.value[0].list = res.data.slice(0, 20).map((item) => ({
        label: item.key,
        value: Number(item.doc_count),
      }));
    }
  }

  watch(
    () => activeTab.value,
    () => {
      getOverviewData();
      getAttackRankingData();
      getRealTimeAttackData();
      getForeignAttackCountryData();
    },
    { immediate: true }
  );

  return {
    overviewText,
    mapData,
    tableData,
    columns,
    attackData,
    attackData2,
    mapOption,
  };
}

export function useRight() {
  const overviewData3 = ref([
    {
      name: "网络攻击告警",
      value: 0,
      unit: "次",
      key: "网络攻击告警",
    },
    {
      name: "境内攻击源数量",
      value: 0,
      unit: "个",
      key: "境内攻击源数量",
    },
    {
      name: "境外攻击源数量",
      value: 0,
      unit: "个",
      key: "境外攻击源数量",
    },
    {
      name: "风险企业数量",
      value: 0,
      unit: "家",
      key: "被攻击企业数量",
    },
  ]);

  const lineData = ref({
    legend: [],
    category: [],
    values: [],
  });

  const pieData = ref([]);

  const cardsData = ref([
    // { logo: '', value1: 0, value2: 0 },
    // { logo: '', value1: 0, value2: 0 },
    // { logo: '', value1: 0, value2: 0 },
  ]);

  const overviewRightData1 = ref(0);
  const overviewRightData2 = ref(0);
  const overviewRightPieData = ref([]);

  async function getSecuritySituationData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getSecuritySituation(data);
    if (res.code == 0) {
      overviewData3.value.forEach((item) => {
        const num = Number(res.data[item.key]);
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  async function getAttackDistributionData() {
    const data = {
      timeType: activeTab.value,
    };
    // const res = barDataRes;
    const res = await getAttackDistribution(data);
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: Number(item.doc_count),
      }));
    }
  }

  async function getAttackTrendData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getAttackTrend(data);
    if (res.code == 0) {
      // console.log(res.data);
      lineData.value.legend = Object.keys(res.data);
      lineData.value.category = res.data[lineData.value.legend[0]].map(
        (item) => item.key_as_string
      );
      lineData.value.values = lineData.value.legend.map((item) =>
        res.data[item].map((item2) => item2.doc_count)
      );
    }
  }

  async function getExposedIndustrialControlSystemData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getExposedIndustrialControlSystem(data);
    // const res = cardsDataRes;
    if (res.code == 0) {
      // console.log(res.data, "1234");
      overviewRightData1.value =
        res.data.assetTotal > 9999
          ? (res.data.assetTotal / 10000).toFixed(1) + "万"
          : res.data.assetTotal.toLocaleString();
      overviewRightData2.value =
        res.data.assetTypeTotal > 9999
          ? (res.data.assetTypeTotal / 10000).toFixed(1) + "万"
          : res.data.assetTypeTotal.toLocaleString();
      overviewRightPieData.value = res.data.assetInfo.map((item) => ({
        name: item.key,
        value: Number(item.doc_count),
      }));
      cardsData.value = res.data.detail.map((item, index) => {
        return {
          logo: item.vender,
          value1:
            item.deviceCount > 9999
              ? (item.deviceCount / 10000).toFixed(1) + "万"
              : item.deviceCount.toLocaleString(),
          value2:
            item.loopholeCount > 9999
              ? (item.loopholeCount / 10000).toFixed(1) + "万"
              : item.loopholeCount.toLocaleString(),
        };
      });
    }
  }

  const popoverTableData1 = ref([]);
  const popoverTableData2 = ref([]);
  const popoverTableData3 = ref([]);

  async function getInternalAttackSourceData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getInternalAttackSource(data);
    if (res.code == 0) {
      popoverTableData1.value = res.data;
    }
  }
  async function getForeignAttackSourceData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getForeignAttackSource(data);
    if (res.code == 0) {
      popoverTableData2.value = res.data;
    }
  }
  async function getAttackedCompanyData() {
    const data = {
      timeType: activeTab.value,
    };
    const res = await getAttackedCompany(data);
    if (res.code == 0) {
      popoverTableData3.value = res.data;
    }
  }

  watch(
    () => activeTab.value,
    () => {
      cardsData.value = [];
      getSecuritySituationData();
      getAttackDistributionData();
      getAttackTrendData();
      getExposedIndustrialControlSystemData();
      getInternalAttackSourceData();
      getForeignAttackSourceData();
      getAttackedCompanyData();
    },
    { immediate: true }
  );

  return {
    overviewData3,
    lineData,
    pieData,
    cardsData,
    tabsList,
    activeTab,
    changeTab,
    popoverTableData1,
    popoverTableData2,
    popoverTableData3,
    overviewRightData1,
    overviewRightData2,
    overviewRightPieData,
  };
}
