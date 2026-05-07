/*
 * @Author: wangmeng
 * @Date: 2026-01-15 09:39:30
 * @LastEditors: 最后编辑者
 * @LastEditTime: 2026-02-06 16:27:09
 * @Description: 
 */
import { ref, onBeforeMount, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import mockData from "./data.json";
import { getCompanyDetailInfo } from "@/api/enterpriseRisk";
import { dateFormat } from "@/libs/util";
const companyName = computed(() => {
  return useRoute().query.companyName;
});

export function useData() {
  const warnTips = ref("")
  const warnTipsShow = ref(false);
  const tipDialogVisible = ref(false)
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
    const res = await getCompanyDetailInfo({
      company: companyName.value,
    });
    // const res = mockData.companyDetailInfo;
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
      getWarningTipsData(detailInfo.message)
    }
  }

  function closeTipDialog(){
    tipDialogVisible.value = false
    // warnTipsShow.value = false
  }

  const warnTipDetailInfo = ref({})
  function getWarningTipsData(message){   
    warnTips .value = message.messageInfo
    warnTipDetailInfo.value = message
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
    const today = new Date();
    const labels = [];
    for (let d = 6; d >= 0; d--) {
      const t = new Date(today);
      t.setDate(today.getDate() - d);
      const mm = String(t.getMonth() + 1).padStart(2, "0");
      const dd = String(t.getDate()).padStart(2, "0");
      labels.push(`${mm}-${dd}`);
    }
    attackTotalList.value[i].lineData.category = labels;
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
  const warningListAll = ref([]);
  const dialogVisible = ref(false);
  const activeAlarm = ref({});
  const investigating = ref(false);
  const spacePressCount = ref(0);
  const alarmLoading = ref(false);
  const alarmRevealing = ref(false);
  const displayedAlarmList = ref([]);
  const isInserting = ref(false);
  const initialPhase = ref(true);
  const lowRiskQueue = ref([]);
  const pinMode = ref(0);
  let insertTimer = null;

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
    dynamicAlarmList.value = all.filter((i) => i.damageLevel === "低危");
  }

  async function getWarningData(data) {
    warningListAll.value = data
    warningList.value = data.filter(item => item.level === "低危")
    applySequentialTimes(warningList.value, new Date())
  }

  function applyPinnedTopAnimated(items) {
    const pinned = items.filter(Boolean);
    if (pinned.length === 0) return;
    const ids = pinned.map((i) => i.id);
    const remaining = displayedAlarmList.value.filter((i) => !ids.includes(i.id));
    isInserting.value = true;
    displayedAlarmList.value = [
      ...pinned.map((i) => ({ ...i, _isInserted: true })),
      ...remaining,
    ];
    setTimeout(() => {
      for (const id of ids) {
        const idx = displayedAlarmList.value.findIndex((i) => i.id === id);
        if (idx > -1) {
          displayedAlarmList.value[idx] = { ...displayedAlarmList.value[idx], _isInserted: false };
        }
      }
      isInserting.value = false;
    }, 10000);
  }

  function insertTopAnimated(item) {
    if (!item) return;
    const id = item.id;
    isInserting.value = true;
    const idx = displayedAlarmList.value.findIndex((i) => i.id === id);
    if (idx > -1) {
      const existing = displayedAlarmList.value[idx];
      const rest = displayedAlarmList.value.slice(0, idx).concat(displayedAlarmList.value.slice(idx + 1));
      displayedAlarmList.value = [{ ...existing, _isInserted: true }, ...rest];
    } else {
      displayedAlarmList.value = [{ ...item, _isInserted: true }, ...displayedAlarmList.value];
    }
    setTimeout(() => {
      const insIdx = displayedAlarmList.value.findIndex((i) => i.id === id);
      if (insIdx > -1) {
        displayedAlarmList.value[insIdx] = { ...displayedAlarmList.value[insIdx], _isInserted: false };
      }
      isInserting.value = false;
    }, 10000);
  }

  function handleSpace(e) {
    if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
      const c = spacePressCount.value + 1
      spacePressCount.value = c
      if (c === 1) {
        warningList.value = warningListAll.value
        const list = warningList.value.filter((i) => i.level !== "低危")
        applySequentialTimes(list, new Date())
      } else if (c === 2) {
        pinMode.value = 2
        const midItem = dynamicAlarmListAll.value.find((i) => i.damageLevel === "中危");
        applyPinnedTopAnimated([midItem])
      } else if (c === 3) {
        pinMode.value = 3
        const vulnItem = dynamicAlarmListAll.value.find((i) => i.eventType === "漏洞利用");
        const midItem = dynamicAlarmListAll.value.find((i) => i.damageLevel === "中危");
        applyPinnedTopAnimated([vulnItem, midItem])
      }
      else if (c === 4) {
        warningList.value = warningListAll.value.filter((i) => i.level === "低危")
        applySequentialTimes(warningList.value, new Date())
        // pinMode.value = 4
        // const ransomwareItem = dynamicAlarmListAll.value.find((i) => i.eventType === "勒索病毒");
        // const vulnItem = dynamicAlarmListAll.value.find((i) => i.eventType === "漏洞利用");
        // const midItem = dynamicAlarmListAll.value.find((i) => i.damageLevel === "中危");
        // applyPinnedTopAnimated([ransomwareItem, vulnItem, midItem])
      }
      else if (c === 5) {
        warnTipsShow.value = true
        // warningList.value = warningListAll.value.filter((i) => i.level === "低危")
        // applySequentialTimes(warningList.value, new Date())
      }
      // else if (c === 6) {
        // warnTipsShow.value = true
      // }
    }
  }

  function stopInsertTimer() {
    if (insertTimer) {
      clearInterval(insertTimer);
      insertTimer = null;
    }
  }
  function startInsertTimer() {
    stopInsertTimer();
    insertTimer = setInterval(() => {
      if (lowRiskQueue.value.length === 0) {
        stopInsertTimer();
        return;
      }
      const next = lowRiskQueue.value.shift();
      const insertedId = next.id;
      isInserting.value = true;
      const pinnedCount = pinMode.value === 4 ? 3 : pinMode.value === 3 ? 2 : pinMode.value === 2 ? 1 : 0;
      const before = displayedAlarmList.value.slice(0, pinnedCount);
      const after = displayedAlarmList.value.slice(pinnedCount);
      displayedAlarmList.value = [...before, { ...next, _isInserted: true }, ...after];
      setTimeout(() => {
        const insIdx = displayedAlarmList.value.findIndex((i) => i.id === insertedId);
        if (insIdx > -1) {
          displayedAlarmList.value[insIdx] = { ...displayedAlarmList.value[insIdx], _isInserted: false };
        }
        isInserting.value = false;
      }, 10000);
    }, 10000);
  }

  watch(
    dynamicAlarmList,
    (list) => {
      const hasNonLow = list.some((i) => i.damageLevel !== "低危");
      if (!initialPhase.value || hasNonLow) {
        initialPhase.value = false;
        stopInsertTimer();
        displayedAlarmList.value = list.slice();
        return;
      }
      const low = list.filter((i) => i.damageLevel === "低危");
      displayedAlarmList.value = low.slice(0, 3);
      lowRiskQueue.value = low.slice(3);
      if (lowRiskQueue.value.length > 0) {
        startInsertTimer();
      } else {
        stopInsertTimer();
      }
    },
    { immediate: true, deep: true }
  );

  function closeWarningTips(){
    warnTipsShow.value = false
  }

  function getWarningTips(){
    tipDialogVisible.value = true
  }

  function applySequentialTimes(list, baseDate) {
    const base = new Date(baseDate)
    const maxSec = 24 * 60 * 60 - 1
    let totalSec = 0
    for (let i = 0; i < list.length; i++) {
      const d = new Date(base.getTime() - totalSec * 1000)
      list[i].startTime = dateFormat(d, "YYYY-MM-dd hh:mm:ss")
      if (i < list.length - 1) {
        const step = Math.floor(Math.random() * 9) + 1
        totalSec = Math.min(totalSec + step, maxSec)
      }
    }
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
        }, 10000);
      }
    }, 2000);
  }

  function handleClick(item) {
    activeAlarm.value = item;
    nextTick(() => {
      dialogVisible.value = true;
    });
  }

  onBeforeMount(() => {
    getData();
  });
  onMounted(() => {
    window.addEventListener("keydown", handleSpace)
  })
  onUnmounted(() => {
    window.removeEventListener("keydown", handleSpace)
    stopInsertTimer()
  })

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
    radarData,
    warnTipsShow,
    closeWarningTips,
    tipDialogVisible,
    getWarningTips,
    warnTipDetailInfo,
    closeTipDialog,
    alarmLoading,
    alarmRevealing,
    displayedAlarmList,
    isInserting,
    warnTips
  };
}
