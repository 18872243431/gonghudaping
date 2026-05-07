import { ref, watch, computed, onBeforeMount } from "vue";
import { getProvinceName3 } from "@/libs/coords";
import {
  getSpecialDetail,
  getEventList,
  getRealTimeAttackDynamics,
  getMap,
  getNumberCard,
  getRiskEnterprise,
  getEventTypeDistribution,
  getAttackCountryRanking,
  getAttackIPBehaviorAnalysis,
  getAttackTrend,
} from "@/api/specialMonitoring";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import { useStore } from "vuex";
// 导入模拟数据
import mockData from "./data.json";

const monitorCompanyNum = ref(0);
export function useLeft() {
  const eventList = ref([]);
  const store = useStore();
  const eventId = computed(() => {
    return store.state.page.eventId;
  });
  const info = ref([
    { label: "专项监测任务名称：", value: "", key: "eventName" },
     {
      label: "监测起止时间：",
      value: "",
      key: "time",
    },
    { label: "监测对象数量：", value: "", key: "monitorCompanyNum" },
    {
      label: "专项监测任务概要：",
      value: "",
      key: "eventDesc",
    },
   { label: "风险事件数量：", value: "", key: "riskEvent" },
  ]);
  const noticeData = ref([]);

  const mapData = ref({
    map: [],
    cube: [],
  });
  const mapOption = ref({
    visualMap1: { max: 0, middle: 0, min: 0 },
    visualMap2: { max: 0, min: 0 },
  });

  const provinceName = ref("");

  function handelMapClick(params) {
    provinceName.value = getProvinceName3(params.name);
    if (params.name === "湖北") {
      mapData.value.map = [
        {
          name: "武汉市",
          value: 100,
        },
        {
          name: "襄阳市",
          value: 400,
        },
        { name: "宜昌市", value: 700 },
        { name: "荆州市", value: 700 },
      ];
    }
  }

  function provinceMapClick() {
    provinceName.value = "";
    getMapData(); // 恢复到省级地图
  }

  function handleClick(item) {
    store.commit("page/setEventId", item.id);
  }

  async function getEventListData() {
    const res = await getEventList();
    if (res.code == 0) {
      eventList.value = res.data;
    }
  }

  async function getSpecialDetailData() {
    const res = await getSpecialDetail({ eventId: eventId.value });
    if (res.code == 0) {
      const data = res.data;
      const obj = {
        ...data,
        monitorCompanyNum: data.monitorCompanyNum + "个",
        time: data.startTime + "-" + data.endTime,
      };
      monitorCompanyNum.value = data.monitorCompanyNum;
      info.value.forEach((item) => {
        item.value = obj[item.key];
      });
    }
  }

  async function getRealTimeAttackDynamicsData() {
    const res = await getRealTimeAttackDynamics({ eventId: eventId.value });
    // const res = mockData.realTimeAttackDynamics;
    if (res.code == 0) {
      noticeData.value = res.data;
    }
  }

  async function getMapData() {
    const res = await getMap({ eventId: eventId.value });
    if (res.code == 0) {
      const data = res.data;
      const provinceObj = data.provinceMap;
      const ipObj = data.ipMap;
  
      if (Object.keys(ipObj).length > 0) {
        mapData.value.cube = Object.keys(ipObj).map((item) => {
          return {
            name: ChinaNameMap[item],
            value: ipObj[item],
          };
        });
        const valueList1 = Object.values(ipObj).sort((a, b) => a - b);
        let selectedValues = divideArrayIntoThreeSegments(valueList1);
        mapOption.value.visualMap1 = {
          max: selectedValues[2],
          middle: selectedValues[1],
          min: selectedValues[0],
          left: 0,
          bottom: 350,
        };
      } else {
        mapData.value.cube = [];
        mapOption.value.visualMap1 = {
          max: 0,
          middle: 0,
          min: 0,
        };
      }
  
      if (Object.keys(provinceObj).length > 0) {
        mapData.value.map = Object.keys(provinceObj).map((item) => {
          return {
            name: ChinaNameMap[item],
            value: provinceObj[item],
          };
        });
        // const valueList2 = Object.values(provinceObj);
        // const max2 = Math.max(...valueList2);
        // const min2 = Math.min(...valueList2);
      } else {
        mapData.value.map = [];
        mapOption.value.visualMap2 = {
          max: 0,
          min: 0,
          text: [0, 0],
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

  watch(
    () => eventId.value,
    () => {
      getSpecialDetailData();
      getRealTimeAttackDynamicsData();
      getMapData();
    },
    { immediate: true }
  );

  onBeforeMount(() => {
    getEventListData();
  });

  return {
    eventList,
    info,
    mapData,
    noticeData,
    handelMapClick,
    provinceName,
    provinceMapClick,
    handleClick,
    mapOption,
  };
}

export function useCenter() {
  const store = useStore();
  const eventId = computed(() => {
    return store.state.page.eventId;
  });
  const overflowData1 = ref([
    {
      name: "监测对象数量",
      value: 0,
      unit: "家",
      key: "monitorCompanyNum",
    },
    {
      name: "监测IP地址数量",
      value: 0,
      unit: "个",
      key: "monitorIp",
    },
    {
      name: "监测域名数量",
      value: 0,
      unit: "个",
      key: "monitorDomain",
    },
  ]);

  const totalOneList = ref([
    { label: "网络攻击总数", value: 0, unit: "次", key: "totalNum" },
    { label: "攻击源数量", value: 0, unit: "个", key: "attackNum" },
    { label: "被攻击对象数量", value: 0, unit: "家", key: "attackedNum" },
  ]);

  const totalTwoList = ref([
    {
      title: "网络攻击总数",
      label1: "环比增长",
      value1: "35.1%",
      status1: "up",
    },
    {
      title: "攻击源数量",
      label1: "环比增长",
      value1: "35.1%",
      status1: "up",
    },
    {
      title: "被攻击企业数量",
      label1: "环比增长",
      value1: "35.1%",
      status1: "up",
    },
  ]);

  const columns2 = ref([
    { label: "企业名称", prop: "companyName", showOverflowTooltip: true },
    { label: "被攻击次数", prop: "atdNum", width: 140 },
    { label: "被攻击IP个数", prop: "ipNum", width: 140 },
    { label: "遭受网络攻击类型", prop: "eventTab", width: 220 },
  ]);
  const companyList = ref([]);

  async function getNumberCardData() {
    const res = await getNumberCard({ eventId: eventId.value });
    if (res.code == 0) {
      const data = res.data;
      const num = monitorCompanyNum.value;
      overflowData1.value[0].value =
        num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
  
      overflowData1.value.forEach((item, i) => {
        if (i > 0) {
          const num = data[item.key];
          item.value =
            num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
        }
      });
  
      totalOneList.value.forEach((item) => {
        item.value = data[item.key];
      });
    }
  }

  async function getRiskEnterpriseData() {
    const res = await getRiskEnterprise({ eventId: eventId.value });
    if (res.code == 0) {
      companyList.value = res.data;
    }
  }

  watch(
    eventId,
    () => {
      getNumberCardData();
      getRiskEnterpriseData();
    },
    { immediate: true }
  );
  return {
    overflowData1,
    totalOneList,
    totalTwoList,
    columns2,
    companyList,
    eventId,
  };
}

export function useRight1() {
  const store = useStore();
  const eventId = computed(() => {
    return store.state.page.eventId;
  });
  const pieData = ref([]);
const rankBarData = ref([
      {
        name: "类型1",
        list: [
          { label: "美国", value: 100 },
          { label: "英国", value: 98 },
          { label: "日本", value: 92 },
          { label: "韩国", value: 90 },
          { label: "德国", value: 78 },
        ],
      },
    ]);
  const columns = ref([
    { prop: "country", label: "国家" },
    { prop: "attackNum", label: "攻击来源数量" },
    { prop: "atdNum", label: "攻击次数" },
  ]);

  const tableData = ref([]);

  async function getEventTypeDistributionData() {
    const res = await getEventTypeDistribution({ eventId: eventId.value });
    if (res.code == 0) {
      const data = res.data;
      pieData.value = Object.keys(data).map((item) => ({
        name: item,
        value: data[item],
      }));
    }
  }
  
  async function getAttackCountryRankingData() {
    const res = await getAttackCountryRanking({ eventId: eventId.value });
    if (res.code == 0) {
      tableData.value = res.data;
    }
  }

  watch(
    eventId,
    () => {
      getEventTypeDistributionData();
      getAttackCountryRankingData();
    },
    { immediate: true }
  );

  return {
    columns,
    tableData,
    pieData,
    rankBarData
  };
}

export function useRight2() {
  const store = useStore();
  const eventId = computed(() => {
    return store.state.page.eventId;
  });
  const attackIpList = ref([]);

  const lineData3 = ref({
    legend: ["被攻击IP地址数量变化趋势"],
    category: [],
    values: [[]],
  });

  async function getAttackIPBehaviorAnalysisData() {
    const res = await getAttackIPBehaviorAnalysis({ eventId: eventId.value });
    if (res.code == 0) {
      const data = res.data;
  
      attackIpList.value = data.map((item) => ({
        ip: item.ip,
        country: item.country,
        types: item.eventTypeList,
        count: item.atdNum,
        attackedIps: item.attackedIpList.map((itm) => itm.ip),
        description: `攻击目标集中在${item.provinceList.join(
          "、"
        )}，${item.industryList.join("、")}行业`,
      }));
    }
  }
  
  async function getAttackTrendData() {
    const res = await getAttackTrend({ eventId: eventId.value });
    if (res.code == 0) {
      const data = res.data;
      lineData3.value.category = data.timeList;
      lineData3.value.values[0] = data.dataList;
    }
  }

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

  watch(
    eventId,
    () => {
      getAttackIPBehaviorAnalysisData();
      getAttackTrendData();
    },
    { immediate: true }
  );

  return {
    attackIpList,
    lineData3,
    lineOpts,
  };
}
