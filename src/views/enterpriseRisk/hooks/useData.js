import { ref, watch, computed } from "vue";
import {
  getCompanyInfo,
  getOverview,
  getAttackType,
  getAttackStage,
  getSecuritySituation,
  getDynamicAlarm,
  getAttackTotal,
  getAttackSource,
  getAttackIp,
  getAttackRank,
  getHighRiskIp,
  getAttackTime,
  getVulnerabilityInfo,
  highRiskPort,
  attackPath,
} from "@/api/enterpriseRisk";
import { useRoute } from "vue-router";

export function useDataFun() {
  const companyName = computed(() => {
    return useRoute().query.companyName;
  });
  const sourceType = computed(() => {
    return useRoute().query.sourceType;
  });
  const uploadlabel = computed(() => {
    return useRoute().query.uploadLabel;
  });
  const screenType = ref(1); //1-网络安全风险视角 2-数据安全风险视角

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

  function toggle() {
    screenType.value = screenType.value == 1 ? 2 : 1;
  }

  const companyInfo = ref([
    // { name: "企业类型：", value: "", key: "" },
    { name: "所属行业：", value: "", key: "所属行业" },
    { name: "注册省市：", value: "", key: "注册省市" },
    { name: "公司类型：", value: "", key: "公司类型" },
    { name: "注册资金：", value: "", key: "注册资金" },
    // { name: "人员规模：", value: "", key: "" },
  ]);
  const flag = ref("");
  const status = ref("");
  const totalList = ref([
    { name: "高危", value: 0, rate: "" },
    { name: "中危", value: 0, rate: "" },
    { name: "低危", value: 0, rate: "" },
  ]);
  async function getCompanyInfoData() {
    const res = await getCompanyInfo({
      sourceType: sourceType.value,
      uploadLabel: uploadlabel.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value, //1-网络安全风险视角 2-数据安全风险视角
    });
    if (res.code == 0) {
      companyInfo.value.forEach((item) => {
        item.value = res.data[item.key];
      });
      flag.value = res.data["企业是否重点"];
      status.value = res.data["近7天整体安全状态"];
    }
  }

  async function getOverviewData() {
    const res = await getOverview({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code == 0) {
      const total = res.data.reduce((sum, item) => sum + item.doc_count, 0);
      totalList.value.forEach((item) => {
        const obj = res.data.find((i) => i.key === item.name);
        if (obj) {
          item.value = obj.doc_count;
          item.rate = ((obj.doc_count / total) * 100).toFixed(1) + "%";
        }
      });
    }
  }

  const pieData = ref([]);

  async function getAttackTypeData() {
    const res = await getAttackType({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      pieData.value = res.data.map((item) => ({
        name: item.key,
        value: item.doc_count,
      }));
    }
  }

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

  async function getAttackStageData() {
    const res = await getAttackStage({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      radarOption.value.radar.indicator = res.data.map((item) => ({
        name: item.key,
      }));
      radarData.value[0].value = res.data.map((item) => item.doc_count);
    }
  }

  const iframeSrc = ref('')
  const overviewText = ref("");
  const btnShow = ref(false)
  const sankeyData = ref({
    nodes: [
      // { name: "10.10.10.1" },
      // { name: "10.10.10.2" },
      // { name: "10.10.10.3" },
      // { name: "10.10.10.4" },
      // { name: "长城汽车" },
      // { name: "169.1.1.1" },
      // { name: "169.1.1.2" },
    ],
    links: [
      // { source: "10.10.10.1", target: "长城汽车", value: 80, attackType: "漏洞利用" },
      // { source: "10.10.10.3", target: "长城汽车", value: 80, attackType: "暴力破解" },
      // { source: "10.10.10.2", target: "长城汽车", value: 60, attackType: "后门植入" },
      // { source: "10.10.10.4", target: "长城汽车", value: 60, attackType: "计算机病毒" },
      // { source: "长城汽车", target: "169.1.1.1", value: 50, attackType: "挖矿木马" },
      // { source: "长城汽车", target: "169.1.1.2", value: 50, attackType: "主机受控" },
      // { source: "长城汽车", target: "169.1.1.2", value: 40, attackType: "勒索病毒" },
      // { source: "长城汽车", target: "169.1.1.1", value: 40, attackType: "APT攻击" }
    ]
  });

  async function getSecuritySituationData() {
    const res = await getSecuritySituation({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      overviewText.value = res.data;
    }
  }

  const dynamicAlarmList = ref([]);

  async function getDynamicAlarmData() {
    const res = await getDynamicAlarm({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      dynamicAlarmList.value = res.data;
    }
  }

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

  async function getAttackTotalData() {
    const res = await getAttackTotal({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      resFmt(0, res);
    }
  }

  async function getAttackSourceData() {
    const res = await getAttackSource({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      resFmt(1, res);
    }
  }

  async function getAttackIpData() {
    const res = await getAttackIp({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      resFmt(2, res);
    }
  }

  function resFmt(i, res) {
    const result = res.data;
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

  const vulnerabilityInfo = ref({
    riskIp: [],
    ip: [],
    ipTotal: 0,
    portNum: 0,
    riskIpTotal: 0,
    tags: [],
  });
  const columns = ref([
    { label: "IP地址", prop: "ip", width: 190 },
    { label: "资产", prop: "asset" },
    { label: "漏洞类型", prop: "loopholeType" },
  ]);

  async function getVulnerabilityInfoData() {
    const res = await getVulnerabilityInfo({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      vulnerabilityInfo.value = res.data;
      const tags = [];
      res.data.riskIp.forEach((obj) => {
        tags.push(obj.ip);
      });
      res.data.riskIp.forEach((obj) => {
        tags.push(obj.info);
      });
      vulnerabilityInfo.value.tags = tags;
    }
  }

  const route = useRoute();
  if (route && route.query && route.query.timeType) {
    activeTab.value = route.query.timeType;
  }
  const attackRankData = ref([]);
  const selectedIp = ref("");
  const ipData = ref({
    legend: ["攻击次数"],
    category: [],
    values: [[]],
  });
  const ipList = ref([]);
  const vulnerabilityList = ref([
    // {
    //   title: "SSH服务 (22)",
    //   count: 4,
    //   ip: "203.0.113.45",
    //   findTime: "2026-03-21 10:00:00",
    //   riskLevel: "高危",
    //   expertise: "Web 服务",
    // },
    // {
    //   title: "Tomcat服务 (8080)",
    //   count: 2,
    //   ip: "203.0.113.48",
    //   findTime: "2026-03-21 10:00:00",
    //   riskLevel: "高危",
    //   expertise: "Web 服务",
    // },
    // {
    //   title: "Redis组件  (6379)",
    //   count: 12,
    //   ip: "203.0.113.47",
    //   findTime: "2026-03-21 10:00:00",
    //   riskLevel: "高危",
    //   expertise: "Web 服务",
    // },
    // {
    //   title: "MySQL数据库 (3306)",
    //   count: 8,
    //   ip: "203.0.113.46",
    //   findTime: "2026-03-21 10:00:00",
    //   riskLevel: "高危",
    //   expertise: "Web 服务",
    // }
  ]);
  async function getAttackRankData() {
    const res = await getAttackRank({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code === 0) {
      attackRankData.value = res.data.map((item) => ({
        name: `${item.country}-${item.country} ${item.ip}`,
        value: item.doc_count,
        ip: item.ip,
      }));
      if (res.data.length > 0) selectedIp.value = res.data[0].ip;
      getAttackTimeData();
    }
  }

  async function getAttackTimeData() {
    const res = await getAttackTime({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
      ip: selectedIp.value,
    });
    if (res.code == 0) {
      ipData.value.category = res.data.map((item) => item.key_as_string);
      ipData.value.values[0] = res.data.map((item) => item.doc_count);
    }
  }

  async function getHighRiskIpData() {
    const res = await getHighRiskIp({
      uploadlabel: uploadlabel.value,
      sourceType: sourceType.value,
      companyName: companyName.value,
      timeType: activeTab.value,
      screenType: screenType.value,
    });
    if (res.code == 0) {
      ipList.value = res.data.map((item) => {
        return {
          ...item,
          attackIpTotal:
            item.attackIpTotal > 9999
              ? (item.attackIpTotal / 10000).toFixed(1) + "万"
              : item.attackIpTotal.toLocaleString(),
          attackedTotal:
            item.attackedTotal > 9999
              ? (item.attackedTotal / 10000).toFixed(1) + "万"
              : item.attackedTotal.toLocaleString(),
        };
      });
    }
  }

  async function getHighRiskPortData() {
    const res = await highRiskPort({
      companyName: companyName.value,
      timeType: activeTab.value,
    });
    if (res.code == 0) {
      vulnerabilityList.value = res.data
    }
  }

  async function getAttackPathData() {
    const res = await attackPath({
      companyName: companyName.value,
      timeType: activeTab.value,
    });
    if (res.code == 0) {
      sankeyData.value.nodes = res.data.nodes
      sankeyData.value.links = res.data.links
    }
  }

  function handleClick(params) {
    const { ip } = params.data;
    if (selectedIp.value !== ip) {
      selectedIp.value = ip;
      getAttackTimeData();
    }
  }

  watch(
    [activeTab, screenType],
    () => {
      getCompanyInfoData();
      getOverviewData();
      getAttackTypeData();
      getAttackStageData();
      getSecuritySituationData();
      getDynamicAlarmData();
      getAttackTotalData();
      getAttackSourceData();
      getAttackIpData();
      getVulnerabilityInfoData();
      getAttackRankData();
      getHighRiskIpData();
      getHighRiskPortData();
      getAttackPathData();
    },
    { immediate: true }
  );

  watch(
    [companyName],
    () => {
      if (companyName.value == '*长城汽车股份有限公司') {
        btnShow.value = true
        iframeSrc.value = '/enterpriseRisk_1.html'
      } else if (companyName.value == '齐鲁制药集团有限公司') {
        btnShow.value = true
        iframeSrc.value = '/enterpriseRisk_2.html'
      } else {
        btnShow.value = false
        iframeSrc.value = ''
      }
    },
    { immediate: true }
  );

  return {
    flag,
    status,
    companyName,
    companyInfo,
    totalList,
    pieData,
    radarOption,
    radarData,
    overviewText,
    dynamicAlarmList,
    attackTotalList,
    lineOpts,
    vulnerabilityInfo,
    columns,
    iframeSrc,
    btnShow,
    sankeyData,
    tabsList,
    activeTab,
    changeTab,
    attackRankData,
    selectedIp,
    ipData,
    ipList,
    handleClick,
    toggle,
    screenType,
    vulnerabilityList
  };
}
