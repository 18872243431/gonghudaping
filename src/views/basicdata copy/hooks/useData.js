import { ref, onBeforeMount } from "vue";
import {
  getPlatform,
  getEnterprise,
  getIndustry,
  getKnowledge,
  getQuality,
  getCommand,
  getProvince,
} from "@/api/basicdata";

export function useLeft() {
  const total = ref(0);
  const totalList1 = ref([
    { name: "通信管理局", value: 0 },
    { name: "工信厅", value: 0 },
  ]);
  const totalList2 = ref([
    { name: "监测企业数量", value: 0, key: "enterpriseNum" },
    { name: "监测规上企业数量", value: 0, key: "gsEnterpriseNum" },
    { name: "IP库", value: 0, key: "ipNum" },
    { name: "域名库", value: 0, key: "domainNum" },
  ]);
  const rankData = ref([]);
  const totalList3 = ref([
    { name: "威胁情报", value: 0, unit: "条", key: "maliceNum" },
    { name: "监测规则", value: 0, unit: "条", key: "ruleNum" },
    { name: "指纹规则", value: 0, unit: "条", key: "fingurNum" },
  ]);

  async function getPlatformData() {
    const res = await getPlatform();
    if (res.code == 0) {
      total.value = res.data.totalCount;
      totalList1.value[0].value = res.data.gjCount;
      totalList1.value[1].value = res.data.gxtCount;
    }
  }

  async function getEnterpriseData() {
    const res = await getEnterprise();
    if (res.code == 0) {
      // console.log(res.data);
      totalList2.value.forEach((item) => {
        item.value = (Number(res.data[item.key]) / 10000).toFixed(1);
      });
    }
  }

  async function getIndustryData() {
    const res = await getIndustry();
    if (res.code == 0) {
      rankData.value = res.data.map((item) => ({
        name: item.label,
        value: item.value,
      }));
    }
  }

  async function getKnowledgeData() {
    const res = await getKnowledge();
    if (res.code == 0) {
      totalList3.value.forEach((item) => {
        const num = Number(res.data[item.key]);
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  onBeforeMount(() => {
    getPlatformData();
    getEnterpriseData();
    getIndustryData();
    getKnowledgeData();
  });

  return {
    total,
    totalList1,
    totalList2,
    totalList3,
    rankData,
  };
}

export function useCenter() {
  const textList = [
    "安全态势",
    "风险预警",
    "协同响应",
    "资产指纹库",
    "基础资源库",
    "安全事件库",
    "威胁情报库",
    "企业工商数据",
    "漏洞隐患",
    "企业IP数据",
    "企业域名数据",
    "资产数据",
    "网络安全告警日志",
  ];
  return { textList };
}

export function useRight() {
  const totalList4 = ref([
    {
      label: "企业IP数据",
      value: 0,
      unit: "条",
      key: "standardNum",
    },
    {
      label: "网络攻击告警日志",
      value: 0,
      unit: "条",
      key: "atdNum",
    },
  ]);

  const totalList5 = ref([
    {
      name: "基础数据",
      list: [
        {
          name: "昨日上报数量",
          value1: { key: "standardTodayNum", value: 0 },
          value2: { key: "standardTodayRatio", value: "" },
        },
        {
          name: "上报数据完整性",
          value1: { key: "standardEffNum", value: 0 },
          value2: { key: "standardEffRatio", value: "" },
        },
        {
          name: "上报数据及时性",
          value1: { key: "standardTimeNum", value: 0 },
          value2: { key: "standardTimeRatio", value: "" },
        },
      ],
    },
    {
      name: "网络攻击告警日志",
      list: [
        {
          name: "昨日上报数量",
          value1: { key: "atdTodayNum", value: 0 },
          value2: { key: "atdTodayRatio", value: "" },
        },
        {
          name: "上报数据完整性",
          value1: { key: "atdEffNum", value: 0 },
          value2: { key: "atdEffRatio", value: "" },
        },
        {
          name: "上报数据及时性",
          value1: { key: "atdTimeNum", value: 0 },
          value2: { key: "atdTimeRatio", value: "" },
        },
      ],
    },
  ]);

  const totalList6 = ref([
    { name: "指令总数", value: 0, key: "cmdTotalNum" },
    { name: "数据总量", value: 0, key: "totalCount" },
    { name: "监测指令数", value: 0, key: "cmdMonitorNum" },
    { name: "监测数据数", value: 0, key: "monitorCount" },
    { name: "通联指令总数", value: 0, key: "cmdNetFlowNum" },
    { name: "通联数据数", value: 0, key: "netFlowCount" },
  ]);

  const barLineData = ref([
    {
      name: "有效数据",
      list: [],
    },
    {
      name: "无效数据",
      list: [],
    },
    {
      name: "及时性",
      list: [],
    },
  ]);

  async function getQualityData() {
    const res = await getQuality();
    if (res.code == 0) {
      // console.log(res.data);
      totalList4.value.forEach((item) => {
        item.value = res.data[item.key];
      });
      totalList5.value.forEach((item) => {
        item.list.forEach((item2) => {
          const num = Number(res.data[item2.value1.key]);
          item2.value1.value =
            num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
          item2.value2.value = res.data[item2.value2.key];
        });
      });
    }
  }

  async function getCommandData() {
    const res = await getCommand();
    if (res.code == 0) {
      // console.log(res.data);
      totalList6.value.forEach((item) => {
        item.value = res.data[item.key];
      });
    }
  }

  async function getProvinceData() {
    const res = await getProvince();
    if (res.code == 0) {
      const data = res.data;
      barLineData.value[0].list = data.validateNum.map((item, i) => ({
        label: data.province[i],
        value: item,
      }));

      barLineData.value[1].list = data.unvalidateNum.map((item, i) => ({
        label: data.province[i],
        value: item,
      }));

      barLineData.value[2].list = data.ratioList.map((item, i) => ({
        label: data.province[i],
        value: item,
      }));
    }
  }

  onBeforeMount(() => {
    getQualityData();
    getCommandData();
    getProvinceData();
  });

  return {
    totalList4,
    totalList5,
    totalList6,
    barLineData,
  };
}
