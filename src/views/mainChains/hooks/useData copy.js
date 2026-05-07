import { ref, onMounted, watch } from "vue";
import {
  getSecurityOverview,
  getSecurityDistribution,
  getSecurityEventNum,
  getRiskEnterpriseNum,
  getAttackTypeDistribution,
  getAttackTrend,
  getRiskWarningList,
  getIndustryChainAttackSituation,
} from "@/api/mainChains";
import { getEventList } from "@/api/specialMonitoring";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import { getSpecial } from "@/api/integratedCircuit";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { mockData } from "./data.json";

export function useData() {
  const currentChart = ref("overseas");
  const attackData = ref([
    {
      name: "境外攻击来源",
      list: [
         { label: "美国", value: 100 },
          { label: "英国", value: 98 },
          { label: "日本", value: 92 },
          { label: "韩国", value: 90 },
          { label: "德国", value: 78 },
      ],
    },
  ]);
  const tabsList = ref([
    { label: "24小时", value: "1" },
    { label: "近7天", value: "2" },
    { label: "近30天", value: "3" },
  ]);
  const activeTab = ref("2");
  function changeTab(tab) {
    activeTab.value = tab;
  }

  const riskData = ref({
    high: 0,
    middle: 0,
    low: 0,
  });
  const leftInfo = ref([
    { label: "重点行业数", num: 0, unit: "个", key: "totalNum" },
    { label: "保障企业数", num: 0, unit: "家", key: "companyNum" },
    { label: "受攻击企业数", num: 0, unit: "家", key: "attackerNum" },
    { label: "网络攻击告警", num: 0, unit: "次", key: "eventNum" },
  ]);

  const cardsData2 = ref([
    // {
    //   name: "新能源汽车",
    //   unit: "家",
    //   num1: 20,
    //   num2: 30,
    //   num3: 40,
    //   num4: 50,
    //   num5: 60,
    //   num6: 70,
    //   type1: "log4j漏洞利用",
    //   type2: "SQL注入攻击",
    //   riskLevel: "高风险",
    //   attackNum: 100,
    //   attackCountry: [
    //     { name: "美国", value: 1100 },
    //     { name: "日本", value: 900 },
    //     { name: "韩国", value: 800 },
    //     { name: "英国", value: 700 },
    //   ],
    // },
  ]);

  const mapData = ref({
    map: [
      // {
      //   name: "云南",
      //   value: 456,
      // },
    ],
    cube: [
      // {
      //   name: "四川",
      //   value: 100,
      // },
    ],
  });
  const mapOption = ref({
    visualMap1: { max: 0, middle: 0, min: 0 },
    visualMap2: { max: 0, min: 0 },
  });
  const pyramidData = ref([]);
  const overviewData = ref({
    totalNum: 0,
    noticeEnterpriseNum: 0,
    disposalNum: 0,
    ratio: 0,
  });
  const pieData = ref([
    // {
    //   name: "网络攻击",
    //   value: 432,
    // },
  ]);
  // 添加风险告警数据
  const riskWarningData = ref([]);
  const columns = ref([
    { label: "产业链", prop: "industryChain" },
    {
      label: "企业数量",
      prop: "riskCompanyCount",
      width: 140,
      slots: { default: "riskCompanyCount" },
    },
    {
      label: "网络攻击次数",
      prop: "riskTotalNum",
      width: 140,
      slots: { default: "riskTotalNum" },
    },
  ]);

  const tableData = ref([
    // {
    //   province: "北京",
    //   reportCount: 0,
    //   enterpriseNum: 0,
    // },
  ]);
  const lineData = ref({
    legend: ["网络攻击趋势"],
    category: [],
    values: [[]],
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

  const terData = ref([
    // { name: "石油", value: 1342 },
  ]);

  const disposalRatio = ref(0);
  const enterpriseNum = ref(0);
  const specialList = ref([]);

  // ========== mapRightCon 静态数据 ==========
  // 被攻击企业排名静态数据
  const staticEnterpriseData = ref([
    {
      name: "被攻击次数",
      list: [
        { label: "某重点关注企业", value: 1138 },
        { label: "某科技研发公司", value: 845 },
        { label: "某金融服务机构", value: 623 },
        { label: "某制造加工厂", value: 412 },
        { label: "某市属三甲医院", value: 289 },
      ],
    }
  ]);

  // 被攻击重点行业分布静态数据（BackgroundBar 格式）
  const staticIndustryData = ref([
    {
      name: "被攻击次数",
      list: [
        { label: "制造业", value: 8900 },
        { label: "金融行业", value: 5200 },
        { label: "教育行业", value: 3800 },
        { label: "医疗卫生", value: 2300 },
        { label: "政府机关", value: 1500 },
      ],
    },
  ]);

  //重点产业链安全总览
  async function getSecurityOverviewData() {
    // 使用模拟数据替代API调用
    const res = mockData.getSecurityOverview;
    if (res.code == 0) {
      riskData.value.high = res.data.high;
      riskData.value.middle = res.data.middle;
      riskData.value.low = res.data.low;
      leftInfo.value.forEach((item) => {
        item.num = res.data[item.key] || 0;
      });
    }
  }

  //保障企业产业链分布情况
  async function getSecurityDistributionData() {
    // 使用模拟数据替代API调用
    const res = mockData.getSecurityDistribution;
    if (res.code == 0) {
      terData.value = res.data.industry.map((item, i) => {
        return {
          name: res.data.industry[i],
          value: res.data.num[i],
        };
      });
    }
  }

  //各省份被攻击安全事件数量
  async function getSecurityEventNumData() {
    // 使用模拟数据替代API调用
    const res = mockData.getSecurityEventNum;
    if (res.code == 0) {
      mapData.value.map = res.data.map((item) => {
        return {
          name: ChinaNameMap[item.key],
          value: item.doc_count,
        };
      });
      const valueList2 = res.data.map((item) => item.doc_count);
    }
  }

  //各省份风险企业数量
  async function getRiskEnterpriseNumData() {
    // 使用模拟数据替代API调用
    const res = mockData.getRiskEnterpriseNum;
    if (res.code == 0) {
      mapData.value.cube = res.data.map((item) => {
        return {
          name: ChinaNameMap[item.province],
          value: item.companyCount,
        };
      });
      const valueList1 = res.data
        .map((item) => item.companyCount)
        .sort((a, b) => a - b);
      let selectedValues = divideArrayIntoThreeSegments(valueList1);
      if (selectedValues.length >= 3) {
        mapOption.value.visualMap1 = {
          max: selectedValues[2],
          middle: selectedValues[1],
          min: selectedValues[0],
        };
      }
    }
  }

  function divideArrayIntoThreeSegments(arr) {
    var length = arr.length;
    var segmentLength = Math.floor(length / 3);
    var remainder = length % 3;

    let segments = [];
    let startIndex = 0;

    for (let i = 0; i < 3; i++) {
      let currentSegmentLength = segmentLength;
      if (remainder > 0) {
        currentSegmentLength += 1;
        remainder -= 1;
      }
      segments.push(arr.slice(startIndex, startIndex + currentSegmentLength));
      startIndex += currentSegmentLength;
    }

    // 从每段中选择一个数，这里选择每段的中间数
    const selectedValues = segments.map(
      (segment) => segment[Math.floor(segment.length / 2)]
    );

    return selectedValues;
  }

  //网络攻击类型分布
  async function getAttackTypeDistributionData() {
    // 使用模拟数据替代API调用
    const res = mockData.getAttackTypeDistribution;
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.eventTypeId,
        value: item.count,
      }));
    }
  }

  //网络攻击趋势
  async function getAttackTrendData() {
    // 使用模拟数据替代API调用
    const res = mockData.getAttackTrend;
    if (res.code == 0) {
      lineData.value.category = res.data.timeList;
      lineData.value.values[0] = res.data.dataList;
    }
  }

  //风险预警
  async function getRiskWarningListData() {
    // 使用模拟数据替代API调用
    const res = mockData.getRiskWarningList;
    if (res.code == 0) {
      riskWarningData.value = res.data;
    }
  }

  //重点产业安全态势分析/各产业链攻击态势
  async function getIndustryChainAttackSituationData() {
    // 使用模拟数据替代API调用
    const res = mockData.getIndustryChainAttackSituation;
    if (res.code == 0) {
      cardsData2.value = res.data.map((item) => {
        const list = item.eventTypeStats.map((item) => {
          return {
            name: item.eventTypeId,
            value: item.count,
          };
        });
        return {
          name: item.industryChain,
          riskCompanyCount: item.riskCompanyCount,
          highThreatCount: item.highThreatCount,
          riskRatio: item.riskRatio,
          riskLevel: item.riskLevel,
          monitorCompanyNum: item.monitorCompanyNum,
          totalCompanyNum: item.totalCompanyNum,
          companyRatio: item.companyRatio,
          attackerCount: item.attackerCount,
          attackCountry: item.topCountries.map((item) => {
            return {
              name: item.country,
              value: item.count,
            };
          }),
          lineData: {
            legend: ["网络攻击趋势"],
            category: item.trend.timeList,
            values: [item.trend.dataList],
          },
        };
      });
      tableData.value = res.data.sort(
        (a, b) => b.riskTotalNum - a.riskTotalNum
      );
    }
  }

  async function getSpecialData() {
    // 使用模拟数据替代API调用
    if (mockData.getSpecial) {
      specialList.value = mockData.getSpecial.data;
    } else {
      // 如果模拟数据中没有getSpecial，则创建一些默认数据
      specialList.value = [
        {
          linkUrl: "/keyMonitoring",
          uploadlabel: "集成电路",
          industryInfo:
            "集成电路产业是信息技术产业的核心，是支撑经济社会发展和保障国家安全的战略性、基础性和先导性产业。",
          label: "集成电路",
          value: "集成电路",
        },
        {
          linkUrl: "/keyMonitoring",
          uploadlabel: "基础软件和工业软件",
          industryInfo:
            "基础软件和工业软件是数字经济的基础设施，是支撑国家信息安全的重要保障。",
          label: "基础软件和工业软件",
          value: "基础软件和工业软件",
        },
      ];
    }
  }

  const store = useStore();
  const router = useRouter();
  function gotPage(title) {
    const item = specialList.value.find((item) => item.label === title);
    if (item) {
      store.commit("page/setKeyword", item.label);
      router.push(item.linkUrl);
    }
  }

  function handleClick(item) {
    store.commit("page/setKeyword", item.label);
    router.push(item.linkUrl);
  }

  onMounted(() => {
    getSpecialData();
    getSecurityDistributionData();
  });

  watch(
    () => activeTab.value,
    async () => {
      getSecurityOverviewData();
      getAttackTypeDistributionData();
      getAttackTrendData();
      getRiskWarningListData();
      getIndustryChainAttackSituationData();
      await getSecurityEventNumData();
      getRiskEnterpriseNumData();
    },
    { immediate: true }
  );

  // 在return中添加
  return {
    tabsList,
    activeTab,
    changeTab,
    riskData,
    pyramidData,
    overviewData,
    pieData,
    columns,
    tableData,
    disposalRatio,
    enterpriseNum,
    mapData,
    mapOption,
    cardsData2,
    riskWarningData,
    lineData,
    lineOpts,
    terData,
    leftInfo,
    gotPage,
    handleClick,
    specialList,
    attackData,
    currentChart,
    staticEnterpriseData,
    staticIndustryData,
  };
}
