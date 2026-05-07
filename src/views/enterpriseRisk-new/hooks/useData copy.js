import { ref, onBeforeMount, computed, nextTick } from "vue";
import { getCompanyDetailInfo } from "@/api/enterpriseRisk";
import { useRoute } from "vue-router";
import mockData from "./data.json";

const companyName = computed(() => {
  return useRoute().query.companyName;
});

export function useData() {
   const radarOption = ref({
    radar: {
      indicator: [{ name: "" }],
    },
  });
  const radarData = ref([
    {
      value: [0],
      name: "网络攻击",
    },
  ]);
   const totalList = ref([
    { name: "高危", value: 0, rate: "" },
    { name: "中危", value: 0, rate: "" },
    { name: "低危", value: 0, rate: "" },
  ]);
const vulnerabilityInfo = ref({
    riskIp: [],
    ip: [],
    ipTotal: 0,
    portNum: 0,
    riskIpTotal: 0,
    tags: [],
  });
  const companyInfo = ref([
    { name: "所属行业：", value: "", key: "所属行业" },
    { name: "注册省市：", value: "", key: "注册省市" },
    { name: "公司类型：", value: "", key: "公司类型" },
    { name: "注册资金：", value: "", key: "注册资金" },
  ]);
  const flag = ref("");
  const status = ref("");

  const pieData = ref([]);

  async function getData() {
    // const res = await getCompanyDetailInfo({
    //   company: companyName.value,
    // });
    const res = mockData.companyDetailInfo;
    // console.log("🚀 ~ getData ~ res:", res)
    if (res.code === 0) {
      const { detailInfo, reportInfo } = res.data;
      getCompanyInfoData(detailInfo.companyInfo);
      getAttackTypeData(detailInfo.networkAttackEventTypeDistribution);
      getSecuritySituationData(detailInfo.securityPosture);
      getAttackTotalData(detailInfo.enterpriseSecurityPostureAttack);
      getAttackSourceData(detailInfo.enterpriseSecurityPostureAttackIp);
      getAttackIpData(detailInfo.enterpriseSecurityPostureAttackedIp);
      getDynamicAlarmData(reportInfo.logList);
      getWarningData(detailInfo.dynamicAlarm);
      getTotalListData(detailInfo.networkThreatLevelDistribution)
      getRadarData(detailInfo.networkAttackEventTypeDistribution)
    }
  }

  function getTotalListData(data){
    const total = data.reduce((sum, item) => sum + item.doc_count, 0);
      totalList.value.forEach((item) => {
        const obj = data.find((i) => i.key === item.name);
        if (obj) {
          item.value = obj.doc_count;
          item.rate = ((obj.doc_count / total) * 100).toFixed(1) + "%";
        }
      });
  }

  function getRadarData(data) {
    const total = data.reduce((sum, item) => sum + item.doc_count, 0);
    radarOption.value.radar.indicator = data.map((item) => ({
      name: item.key,
      max: total,
    }));
    radarData.value = [
      {
        value: data.map((item) => item.doc_count),
      }
    ]
  }

  function getCompanyInfoData(data) {
    companyInfo.value.forEach((item) => {
      item.value = data[item.key];
    });
    flag.value = data["企业是否重点"];
    status.value = data["近7天整体安全状态"];
  }

  function getAttackTypeData(data) {
    pieData.value = data.map((item) => ({
      name: item.key,
      value: item.doc_count,
    }));
  }

  const overviewText = ref("");
  const attackTotalList = ref([
    {
      name: "网络攻击",
      value: 0,
      ratio1: "",
      ratio2: "",
      unit: "次",
      lineData: {
        legend: ["网络攻击数量"],
        category: [],
        values: [[]],
      },
    },
    {
      name: "攻击源",
      value: 0,
      ratio1: "",
      ratio2: "",
      unit: "个",
      lineData: {
        legend: ["攻击源数量"],
        category: [],
        values: [
          [], // 替换为你实际的数据
        ],
      },
    },
    {
      name: "被攻击IP",
      value: 0,
      ratio1: "",
      ratio2: "",
      unit: "个",
      lineData: {
        legend: ["被攻击IP数量"],
        category: [],
        values: [
          [], // 替换为你实际的数据
        ],
      },
    },
  ]);

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

  function getSecuritySituationData(data) {
    overviewText.value = data;
  }

  function getAttackTotalData(res) {
    resFmt(0, res);
  }

  function getAttackSourceData(res) {
    resFmt(1, res);
  }

  function getAttackIpData(res) {
    resFmt(2, res);
  }

  function resFmt(i, data) {
    const result = data;
    attackTotalList.value[i].value = formatNumber(result.total);
    attackTotalList.value[i].ratio1 = result.yearOnYear;
    attackTotalList.value[i].ratio2 = result.chainRatio;
    attackTotalList.value[i].lineData.values[0] = result.trendRes.map(
      (item) => item.doc_count
    );
    attackTotalList.value[i].lineData.category = result.trendRes.map(
      (item) => item.key_as_string
    );
  }

  function formatNumber(value) {
    const num = Number(value);
    if (isNaN(num)) return;

    if (num >= 10000) {
      return (num / 10000).toFixed(1) + "万";
    } else {
      return num.toLocaleString();
    }
  }

  const dynamicAlarmListAll = ref([]);
  const dynamicAlarmList = ref([]);
  const warningList = ref([]);
  const dialogVisible = ref(false);
  const activeAlarm = ref({});
  const investigating = ref(false);

  async function getDynamicAlarmData(data) {
    const all = data.map((item, idx) => {
      const level = { 低危: "l", 中危: "m", 高危: "h" }[item.damageLevel];
      const id = `${item.attackedIp || ""}_${item.startTime || ""}_${idx}`;
      return {
        ...item,
        level,
        id,
        orId: item.id,
      };
    });
    dynamicAlarmListAll.value = all;
    dynamicAlarmList.value = all.filter((i) => i.damageLevel !== "高危");
  }

  async function getWarningData(data) {
    warningList.value = data;
  }

  function startInvestigation() {
    if (investigating.value) return;
    investigating.value = true;
    const high = dynamicAlarmListAll.value.find(
      (i) =>
        i.damageLevel === "高危" &&
        dynamicAlarmList.value.findIndex((j) => j.id === i.id) === -1
    );
    setTimeout(() => {
      investigating.value = false;
      if (high) {
        const item = { ...high, _isEntering: true };
        dynamicAlarmList.value = [item, ...dynamicAlarmList.value];
        setTimeout(() => {
          const idx = dynamicAlarmList.value.findIndex((i) => i.id === item.id);
          if (idx > -1) {
            dynamicAlarmList.value[idx]._isEntering = false;
          }
        }, 1000);
      }
    }, 2000);
  }

  function handleClick(item) {
    // console.log(item.detailInfo.feature);
    activeAlarm.value = item;
    nextTick(() => {
      dialogVisible.value = true;
    });
  }

  onBeforeMount(() => {
    getData();
  });

  return {
    flag,
    status,
    companyName,
    companyInfo,
    overviewText,
    attackTotalList,
    lineOpts,
    dynamicAlarmList,
    dialogVisible,
    handleClick,
    activeAlarm,
    warningList,
    pieData,
    startInvestigation,
    investigating,
    vulnerabilityInfo,
    totalList,
    radarOption,
    radarData
  };
}
