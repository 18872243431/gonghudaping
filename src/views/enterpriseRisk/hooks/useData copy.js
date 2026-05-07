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
} from "@/api/enterpriseRisk";
import { useRoute } from "vue-router";
// 导入模拟数据
import mockData from "./data.json";

export function useDataFun() {
  const companyName = computed(() => {
    return useRoute().query.companyName;
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
    // 使用模拟数据替代API调用
    const data = mockData.companyInfo;
    companyInfo.value.forEach((item) => {
      item.value = data[item.key];
    });
    flag.value = data["企业是否重点"];
    status.value = data["近7天整体安全状态"];
  }

  async function getOverviewData() {
    // 使用模拟数据替代API调用
    const data = mockData.overview;
    const total = data.reduce((sum, item) => sum + item.doc_count, 0);
    totalList.value.forEach((item) => {
      const obj = data.find((i) => i.key === item.name);
      if (obj) {
        item.value = obj.doc_count;
        item.rate = ((obj.doc_count / total) * 100).toFixed(1) + "%";
      }
    });
  }

  const pieData = ref([]);

  async function getAttackTypeData() {
    // 使用模拟数据替代API调用
    const data = mockData.attackType;
    pieData.value = data.map((item) => ({
      name: item.key,
      value: item.doc_count,
    }));
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
    // 使用模拟数据替代API调用
    const data = mockData.attackStage;
    radarOption.value.radar.indicator = data.map((item) => ({
      name: item.key,
    }));
    radarData.value[0].value = data.map((item) => item.doc_count);
  }

  const iframeSrc = ref('')
  const overviewText = ref("");
  const btnShow = ref(false)
  const sankeyData = ref({
    "nodes": [
            {
                "name": "117.163.102.226"
            },
            {
                "name": "223.84.153.18"
            },
            {
                "name": "202.109.157.217"
            },
            {
                "name": "182.101.207.30"
            },
            {
                "name": "125.95.190.146"
            },
            {
                "name": "195.170.172.216"
            },
            {
                "name": "广东加大实业有限公司"
            }
        ],
        "links": [
            {
                "attackType": "漏洞利用",
                "source": "117.163.102.226",
                "value": 1,
                "target": "广东加大实业有限公司"
            },
            {
                "attackType": "恶意软件",
                "source": "223.84.153.18",
                "value": 1,
                "target": "广东加大实业有限公司"
            },
            {
                "attackType": "漏洞利用",
                "source": "202.109.157.217",
                "value": 1,
                "target": "广东加大实业有限公司"
            },
            {
                "attackType": "漏洞利用",
                "source": "182.101.207.30",
                "value": 1,
                "target": "广东加大实业有限公司"
            },
            {
                "attackType": "漏洞利用",
                "source": "广东加大实业有限公司",
                "value": 1,
                "target": "125.95.190.146"
            },
            {
                "attackType": "其他威胁",
                "source": "广东加大实业有限公司",
                "value": 1,
                "target": "125.95.190.146"
            },
            {
                "attackType": "木马后门",
                "source": "广东加大实业有限公司",
                "value": 1,
                "target": "195.170.172.216"
            }
        ]
  });

  async function getSecuritySituationData() {
    // 使用模拟数据替代API调用
    overviewText.value = mockData.securitySituation;
  }

  const dynamicAlarmList = ref([]);

  async function getDynamicAlarmData() {
    // 使用模拟数据替代API调用
    dynamicAlarmList.value = mockData.dynamicAlarm;
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
    // 使用模拟数据替代API调用
    const result = mockData.attackTotal;
    resFmt(0, { code: 0, data: result });
  }

  async function getAttackSourceData() {
    // 使用模拟数据替代API调用
    const result = mockData.attackSource;
    resFmt(1, { code: 0, data: result });
  }

  async function getAttackIpData() {
    // 使用模拟数据替代API调用
    const result = mockData.attackIp;
    resFmt(2, { code: 0, data: result });
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
    // 使用模拟数据替代API调用
    const data = mockData.vulnerabilityInfo;
    vulnerabilityInfo.value = data;
    const tags = [];
    data.riskIp.forEach((obj) => {
      tags.push(obj.ip);
    });
    data.riskIp.forEach((obj) => {
      tags.push(obj.info);
    });
    vulnerabilityInfo.value.tags = tags;
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
    {
      title: "SSH 弱口令服务 (22端口)",
      status: "已被利用",
      count: 222224,
      ip: "203.0.113.45",
      findTime: "1小时前",
      riskLevel: "高危",
      lastTime: "3分钟前",
      source: "已知黑客IP"
    },
    {
      title: "Tomcat 默认配置 (8080端口)",
      status: "已被利用",
      count: 2,
      ip: "203.0.113.48",
      findTime: "4小时前",
      riskLevel: "高危",
      lastTime: "1小时前",
      source: "APT-C-36"
    },
    {
      title: "Redis 未授权访问 (6379端口)",
      status: "已被扫描",
      count: 12,
      ip: "203.0.113.47",
      findTime: "1天前",
      riskLevel: "高危",
      lastTime: "5分钟前",
      source: "通用扫描器"
    },
    {
      title: "MySQL 弱口令 (3306端口)",
      status: "已被扫描",
      count: 8,
      ip: "203.0.113.46",
      findTime: "2天前",
      riskLevel: "高危",
      lastTime: "6小时前",
      source: "已知恶意IP"
    }
  ]);

  async function getAttackRankData() {
    // 使用模拟数据替代API调用
    const data = mockData.attackRank;
    attackRankData.value = data.map((item) => ({
      name: `${item.country}-${item.country} ${item.ip}`,
      value: item.doc_count,
      ip: item.ip,
    }));
    if (data.length > 0) selectedIp.value = data[0].ip;
    getAttackTimeData();
  }

  async function getAttackTimeData() {
    // 使用模拟数据替代API调用
    const data = mockData.attackTime;
    ipData.value.category = data.map((item) => item.key_as_string);
    ipData.value.values[0] = data.map((item) => item.doc_count);
  }

  async function getHighRiskIpData() {
    // 使用模拟数据替代API调用
    const data = mockData.highRiskIp;
    ipList.value = data.map((item) => {
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
    vulnerabilityList,
  };
}
