import { ref, onBeforeMount } from "vue";
import dataJson from "./data.json";

export function useLeft() {
  // 基础信息 KPI 列表（6个卡片）
  const kpiList = ref([
    { name: "工商信息", value: "0", unit: "万", id: 1 },
    { name: "监测企业数据", value: "0", unit: "万", id: 2 },
    { name: "IP信息", value: "0", unit: "万", id: 3 },
    { name: "域名信息", value: "0", unit: "万", id: 4 },
    { name: "协议指纹信息", value: "0", unit: "条", id: 5 },
    { name: "设备指纹信息", value: "0", unit: "条", id: 6 },
  ]);
  const rankData = ref([]);
  const pieData = ref([]);

  function getEnterpriseData() {
    const res = dataJson.enterprise;
    if (res.code == 0) {
      // 填充前4个KPI卡片数据
      kpiList.value[0].value = Number(res.data.gsEnterpriseNum);
      kpiList.value[1].value = Number(res.data.enterpriseNum);
      kpiList.value[2].value = Number(res.data.ipNum);
      kpiList.value[3].value = Number(res.data.domainNum);
    }
  }

  function getIndustryData() {
    const res = dataJson.industry;
    if (res.code == 0) {
      rankData.value = res.data.map((item) => ({
        name: item.label,
        value: item.value,
      }));
    }
  }

  function getDeviceData() {
    const res = dataJson.device;
    if (res.code == 0) {
      // 填充后2个KPI卡片数据（不转换为万，直接显示原始数值）
      kpiList.value[4].value = Number(res.data.protoFingerNum);
      kpiList.value[5].value = Number(res.data.deviceFingerNum);
    }
  }

  function getDeviceTypeData() {
    const res = dataJson.deviceType;
    if (res.code == 0) {
      pieData.value = res.data
        .map((item) => ({
          name: item.label,
          value: item.value,
        }))
        .sort((a, b) => b.value - a.value);
    }
  }

  onBeforeMount(() => {
    getEnterpriseData();
    getIndustryData();
    getDeviceData();
    getDeviceTypeData();
  });

  return {
    kpiList,
    rankData,
    pieData,
  };
}

export function useRight() {
  const total1 = ref("");
  const totalList5 = ref([
    {
      name: "规则提取",
      list: [
        {
          name: "恶意IP",
          value: 0,
          key: "ruleMaliceIp",
        },
        {
          name: "恶意域名",
          value: 0,
          key: "ruleMaliceDomain",
        },
        {
          name: "恶意程序",
          value: 0,
          key: "ruleMaliceProgram",
        },
      ],
    },
    {
      name: "共享情报",
      list: [
        {
          name: "恶意IP",
          value: 0,
          key: "shareMaliceIp",
        },
        {
          name: "恶意域名",
          value: 0,
          key: "shareMaliceDomain",
        },
        {
          name: "恶意程序",
          value: 0,
          key: "shareMaliceProgram",
        },
      ],
    },
  ]);
  const total2 = ref("");
  const lineData = ref([]);
  const threatShareList = ref([]);

  function getSafeKnowledgeData() {
    const res = dataJson.safeKnowledge;
    if (res.code == 0) {
      totalList5.value.forEach((item) => {
        item.list.forEach((item2) => {
          item2.value = res.data[item2.key];
        });
      });
      const num = Number(res.data.threatNum);
      total1.value =
        num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
    }
  }

  function getRuleData() {
    const res = dataJson.rule;
    if (res.code == 0) {
      const num = Number(res.data.count);
      total2.value =
        num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      lineData.value = res.data.echart.map((item) => ({
        name: item.familyOrg,
        value: item.num,
      }));
    }
  }

  const rankData2 = ref([]);
  function getFamilyData() {
    const res = dataJson.family;
    if (res.code == 0) {
      rankData2.value = res.data.map((item) => ({
        name: item.key,
        value: Number(item.doc_count),
      }));
    }
  }

  function getThreatShareData() {
    const res = dataJson.threatShare;
    if (res.code == 0) {
      threatShareList.value = res.data;
    }
  }

  onBeforeMount(() => {
    getSafeKnowledgeData();
    getRuleData();
    getFamilyData();
    getThreatShareData();
  });

  return {
    total1,
    totalList5,
    total2,
    lineData,
    rankData2,
    threatShareList,
  };
}
