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
import {
  getRiskCompanyList,
  getIntegratedCompanyList,
} from "@/api/integratedCircuit";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";

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

export function useLeft(keyWord) {
  const introduction = ref("");
  const totalOneList1 = ref([
    {
      name: "重点企业数量",
      value: 0,
      unit: "家",
      key: "companyTotal",
    },
    {
      name: "监测风险企业数量",
      value: 0,
      unit: "个",
      key: "monitoringCompanyTotal",
    },
    {
      name: "风险指数",
      value: 0,
      unit: "",
      key: "riskCompanyTotal",
    },
  ]);
  const importCompanyList = ref([]);

  const totalOneList2 = ref([
    { label: "网络攻击总数", value: 0, unit: "次" },
    {
      label: "境外网络攻击次数",
      value: 0,
      unit: "次",
    },
    { label: "攻击IP数", value: 0, unit: "个" },
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

  async function keyMonitoringOverviewData() {
    const res = await keyMonitoringOverview({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      introduction.value = res.data.industryInfo;
      totalOneList1.value.forEach((item) => {
        const num = res.data[item.key];
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
      importCompanyList.value = res.data.company.map((item) => ({
        key: item,
      }));
    }
  }

  async function networkAttackTotalData() {
    const res = await networkAttackTotal({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      resFmt(0, res);
    }
  }

  async function foreignNetworkAttackTotalData() {
    const res = await foreignNetworkAttackTotal({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      resFmt(1, res);
    }
  }

  async function attackIpTotalData() {
    const res = await attackIpTotal({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      resFmt(2, res);
    }
  }
  function resFmt(i, res) {
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

  function showPopover(i) {
    if (i === 1) getIntegratedCompanyListData();
    if (i === 2) getRiskCompanyListData();
  }

  const riskCompanyList = ref([]);

  async function getRiskCompanyListData() {
    const data = {
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
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
      uploadlabel: keyWord.value,
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
    [keyWord, activeTab],
    (newVal) => {
      keyMonitoringOverviewData();
      networkAttackTotalData();
      foreignNetworkAttackTotalData();
      attackIpTotalData();
      getIntegratedCompanyListData();
    },
    { immediate: true }
  );

  return {
    totalOneList1,
    totalOneList2,
    totalTwoList,
    introduction,
    keyWord,
    importCompanyList,
    total,
    getIntegratedCompanyListData,
    searchCompanyName,
    currentPage,
    integratedCompanyList,
    riskCompanyList,
    showPopover,
    importCompanyList,
  };
}

export function useCenter(keyWord) {
  const pieOption = ref({
    innerRaduis: ["30%", "40%"],
    outerRaduis: ["30%", "100%"],
    lineRaduis: ["35%", "45%"],
    shadowRadius: "31%",
  });
  const overviewText = ref("");
  const batteryList = ref([
    // { name: "ddd", value: "123" },
    // { name: "ddd", value: "123" },
    // { name: "ddd", value: "123" },
    // { name: "ddd", value: "123" },
    // { name: "ddd", value: "123" },
  ]);
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
    // { name: "addwd", value: 123 },
    // { name: "addwd", value: 123 },
    // { name: "addwd", value: 123 },
    // { name: "addwd", value: 123 },
    // { name: "addwd", value: 123 },
    // { name: "addwd", value: 123 },
    // { name: "addwd", value: 123 },
  ]);

  const columns1 = ref([
    { label: "IP地址", prop: "attackIp" ,width:200},
    { label: "攻击类型", prop: "attackTypeList" },
    { label: "攻击次数", prop: "attackTotal" },
    { label: "攻击企业", prop: "attackCorpTotal" },
  ]);
  const ipList = ref([]);

  async function overallSecuritySituationData() {
    const res = await overallSecuritySituation({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      overviewText.value = res.data;
    }
  }

  async function networkAttackTypeDistributionData() {
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
    const res = await networkThreatLevelDistribution({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      console.log(res.data);
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
    const res = await networkAttackChangeTrend({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      console.log(res.data);
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
    const res = await attackCountryRanking({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

  async function attackSourceFeatureAnalysisData() {
    const res = await attackSourceFeatureAnalysis({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      ipList.value = res.data;
    }
  }

  watch(
    [keyWord, activeTab],
    (newVal) => {
      overallSecuritySituationData();
      networkAttackTypeDistributionData();
      networkThreatLevelDistributionData();
      networkAttackChangeTrendData();
      attackCountryRankingData();
      attackSourceFeatureAnalysisData();
    },
    { immediate: true }
  );

  return {
    pieOption,
    overviewText,
    batteryList,
    riskList,
    lineData,
    pieData,
    columns1,
    ipList,
  };
}

export function useRight(keyWord) {
  const mapData = ref({
    map: [
      // {
      //   name: "四川",
      //   value: 100,
      // },
    ],
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
  const companyList = ref([
    // {
    //   logo: require("../imgs/attack-bg.png"),
    //   attackedCorpname: "中芯国际集成电路制造有限公司",
    //   attackedTotal: 0,
    //   attackedIpTotal: 0,
    //   attackTypeList: ["测试测试测试测试测试", "测试测试", "测试测试测试测试"],
    // },
  ]);
  const attackedList = ref([
    // {
    //   timestamp: "2024-03-20 15:30:25",
    //   attackIp: "45.67.89.123",
    //   attackCountry: "美国",
    //   name: "加利福尼亚州",
    //   eventTypeIdCn: "DDoS攻击",
    //   attackedcorpname: "某科技有限公司",
    //   attackedIp: "192.168.1.100",
    // },
    // {
    //   timestamp: "2024-03-20 14:45:10",
    //   attackIp: "78.90.123.45",
    //   attackCountry: "俄罗斯",
    //   name: "莫斯科",
    //   eventTypeIdCn: "SQL注入",
    //   attackedcorpname: "某网络科技公司",
    //   attackedIp: "10.0.0.50",
    // },
    // {
    //   timestamp: "2024-03-20 13:20:33",
    //   attackIp: "91.234.56.78",
    //   attackCountry: "德国",
    //   name: "柏林",
    //   eventTypeIdCn: "端口扫描",
    //   attackedcorpname: "某信息技术公司",
    //   attackedIp: "172.16.0.25",
    // },
    // {
    //   timestamp: "2024-03-20 12:15:15",
    //   attackIp: "123.45.67.89",
    //   attackCountry: "巴西",
    //   name: "圣保罗",
    //   eventTypeIdCn: "暴力破解",
    //   attackedcorpname: "某电子商务公司",
    //   attackedIp: "192.168.2.75",
    // },
    // {
    //   timestamp: "2024-03-20 11:05:42",
    //   attackIp: "45.67.89.123",
    //   attackCountry: "中国",
    //   name: "广东省",
    //   eventTypeIdCn: "XSS攻击",
    //   attackedcorpname: "某金融科技公司",
    //   attackedIp: "10.0.1.30",
    // },
  ]);
  const attackedData = ref([
    {
      name: "攻击次数",
      list: [],
    },
  ]);

  async function attackedEnterpriseAreaDistributionData() {
    const res = await attackedEnterpriseAreaDistribution({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      // console.log(res.data, "12345");
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
      attackedData.value[0].list = res.data.barChartList
        .map((item) => ({
          label: ChinaNameMap[item.key],
          value: item.doc_count,
        }))
        .slice(0, 5);
    }
  }

  async function realTimeAttackDynamicsData() {
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
    const res = await attackedEnterpriseRanking({
      timeType: activeTab.value,
      uploadlabel: keyWord.value,
    });
    if (res.code == 0) {
      companyList.value = res.data;
    }
  }

  watch(
    [keyWord, activeTab],
    (newVal) => {
      realTimeAttackDynamicsData();
      attackedEnterpriseAreaDistributionData();
      attackedEnterpriseRankingData();
    },
    { immediate: true }
  );

  return {
    mapData,
    mapOption,
    columns2,
    companyList,
    attackedList,
    attackedData,
    tabsList,
    activeTab,
    changeTab,
  };
}
