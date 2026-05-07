import { ref, watch, onBeforeMount, computed } from "vue";
import {
  getSpecial,
  getProductionTrend,
  getOverview,
  getMonitorOverview,
  getAttackTotal,
  getAttackSource,
  getAttackSourceRanking,
  getAttackTrend,
  getAttackSourceTrend,
  getAttackIpTrend,
  getAttackIndustryRanking,
  getAttackIndustryTrend,
  getRiskRanking,
  getIndustryMap,
  getRiskCompanyList,
  getIntegratedCompanyList,
} from "@/api/integratedCircuit";

const tabsList = ref([
  { label: "24小时", value: "1" },
  { label: "近7天", value: "2" },
  { label: "近30天", value: "3" },
  // { label: "近1年", value: "4" },
]);

const activeTab = ref("3");

function changeTab(tab) {
  activeTab.value = tab;
}

let industry = "集成电路";

export function useLeft(keyWord) {
  industry = keyWord;
  const specialList = ref([]);
  const barLineData = ref([
    {
      name: "产量",
      list: [
        // { label: "11", value: 10 },
        // { label: "12", value: 28 },
      ],
    },
    {
      name: "增长率",
      list: [
        // { label: "41", value: 12 },
        // { label: "42", value: 23 },
      ],
    },
  ]);
  const introduction = computed(() => {
    const item = specialList.value.find((item) => item.label === keyWord);
    if (item) {
      return item.industryInfo;
    }
    return "";
  });

  const overviewList = ref([
    { value1: 0, value2: 0, key: "上游：半导体材料及设备" },
    { value1: 0, value2: 0, key: "中游：集成电路设计、制造及封测" },
    { value1: 0, value2: 0, key: "下游：集成电路应用领域" },
  ]);

  async function getSpecialData() {
    const res = await getSpecial();
    if (res.code === 0) {
      specialList.value = res.data;
    }
  }

  async function getProductionTrendData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getProductionTrend(data);
    if (res.code === 0) {
      console.log(res.data);
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

  async function getIndustryMapData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     {
    //       industry: [
    //         "半导体",
    //         "光刻机",
    //         "EDA",
    //         "硅片",
    //         "刻蚀机",
    //         "硅晶",
    //         "晶圆",
    //         "极紫光",
    //       ],
    //       attackTotal: "1235241",
    //       key: "上游：半导体材料及设备",
    //       monitorTotal: "324",
    //     },
    //     {
    //       industry: ["行骗架构设计", "晶圆制造", "芯片封装"],
    //       attackTotal: "1253241",
    //       key: "中游：集成电路设计、制造及封测",
    //       monitorTotal: "324",
    //     },
    //     {
    //       industry: [
    //         "通信",
    //         "新能源",
    //         "汽车",
    //         "工业",
    //         "航天航空",
    //         "制造业",
    //         "服务业",
    //       ],
    //       attackTotal: "123251",
    //       key: "下游：集成电路应用领域",
    //       monitorTotal: "324",
    //     },
    //   ],
    // };
    const res = await getIndustryMap(data);
    if (res.code === 0) {
      overviewList.value.forEach((item) => {
        const obj = res.data.find((itm) => itm.key === item.key);
        if (obj) {
          item.value1 =
            item.monitorTotal > 9999
              ? (obj.monitorTotal / 10000).toFixed(1) + "万"
              : obj.monitorTotal.toLocaleString();
          item.value2 =
            item.attackTotal > 9999
              ? (obj.attackTotal / 10000).toFixed(1) + "万"
              : obj.attackTotal.toLocaleString();
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
    introduction,
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

  async function getOverviewData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getOverview(data);
    if (res.code === 0) {
      overflowData1.value.forEach((item) => {
        const num = Number(res.data[item.key]);
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  async function getMonitorOverviewData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getMonitorOverview(data);
    if (res.code === 0) {
      totalOneList.value.forEach((item) => {
        item.value = res.data[item.key];
      });
    }
  }

  async function getAttackTotalData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackTotal(data);
    if (res.code === 0) {
      resFmt(0, res);
    }
  }

  async function getAttackSourceData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackSource(data);
    if (res.code === 0) {
      resFmt(1, res);
    }
  }

  async function getAttackSourceRankingData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackSourceRanking(data);
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

  async function getAttackTrendData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackTrend(data);
    if (res.code === 0) {
      // console.log(res.data);
      lineData1.value.category = res.data.map((item) => item.key_as_string);
      lineData1.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  async function getAttackSourceTrendData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackSourceTrend(data);
    if (res.code === 0) {
      // console.log(res.data);
      lineData2.value.category = res.data.map((item) => item.key_as_string);
      lineData2.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  async function getAttackIpTrendData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackIpTrend(data);
    if (res.code === 0) {
      // console.log(res.data);
      lineData3.value.category = res.data.map((item) => item.key_as_string);
      lineData3.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  function showPopover(i) {
    if (i === 0) getIntegratedCompanyListData();
    if (i === 1) getRiskCompanyListData();
  }

  const riskCompanyList = ref([]);

  async function getRiskCompanyListData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getRiskCompanyList(data);
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     { key: "芜湖双笑包装有限公司", doc_count: 12 },
    //     { key: "安徽孟宇汽车部件有限公司", doc_count: 1 },
    //     { key: "安徽工科机械有限公司", doc_count: 1 },
    //   ],
    // };
    if (res.code === 0) {
      riskCompanyList.value = res.data;
    }
  }

  const searchCompanyName = ref("");
  const total = ref(0);
  const integratedCompanyList = ref([]);
  const currentPage = ref(1);
  async function getIntegratedCompanyListData(value = 1) {
    currentPage.value = value;
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
      companyName: searchCompanyName.value,
      page: currentPage.value,
      size: 10,
    };
    const res = await getIntegratedCompanyList(data);
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: {
    //     count: 1,
    //     rows: [
    //       {
    //         officerCategory: "",
    //         personScale: "小于50人",
    //         companynameMd5: null,
    //         source: "CLOUD_PLATFORM",
    //         subIndustryCode: null,
    //         industryCode: null,
    //         registMoneyStart: null,
    //         uploadLabel: "车联网企业",
    //         companytypecategory: "有限责任公司",
    //         enterpriseStatus: "存续",
    //         registMoneyEnd: null,
    //         isAttack: null,
    //         startTime: null,
    //         id: 35,
    //         baseEntity: null,
    //         industryName: "制造业",
    //         subIndustryName: "印刷和记录媒介复制业",
    //         isIndustry: 1,
    //         isimportant: 0,
    //         ip: "111.38.170.80",
    //         uploadCategory: "系统管理员",
    //         isAccessTraffic: 0,
    //         isAccessTrafficStr: "否",
    //         registMoney: "1000万人民币",
    //         createTime: "2024-07-04 17:49:38",
    //         noticeInfo: null,
    //         companyname: "芜湖双笑包装有限公司",
    //         exportType: null,
    //         companynameId: null,
    //         registCity: "芜湖市",
    //         registMoneyNum: 10000000,
    //         isIndustryStr: "是",
    //         endTime: null,
    //         registProvince: "安徽省",
    //         isInternet: 1,
    //       },
    //     ],
    //   },
    // };
    if (res.code === 0) {
      integratedCompanyList.value = res.data.rows;
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

  const companyList = ref([
    // {
    //   logo: require("../imgs/logo1.png"),
    //   name: "测试测试测试测试测试测试测试测试测试测试",
    //   value1: 0,
    //   value2: 0,
    //   tags: ["测试测试测试测试测试", "测试测试", "测试测试测试测试"],
    // },
  ]);
  const columns = ref([
    { label: "企业名称", prop: "name", showOverflowTooltip: true },
    { label: "被攻击次数", prop: "value1", width: 140 },
    { label: "被攻击IP个数", prop: "value2", width: 140 },
    { label: "遭受网络攻击类型", prop: "tags", width: 420 },
  ]);

  async function getAttackIndustryRankingData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackIndustryRanking(data);
    if (res.code === 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  async function getAttackIndustryTrendData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getAttackIndustryTrend(data);
    if (res.code === 0) {
      // console.log(res.data);
      rankBarData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  async function getRiskRankingData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: industry,
    };
    const res = await getRiskRanking(data);
    if (res.code === 0) {
      // console.log(res.data);
      // res.data.forEach((item, i) => {
      //   companyList.value[i].name = item.companyName;
      //   companyList.value[i].value1 = item.attackedTotal;
      //   companyList.value[i].value2 = item.attackedIpTotal;
      //   companyList.value[i].tags = item.categoryRank.map((item) => item.key);
      // });
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
