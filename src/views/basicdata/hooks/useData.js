import { ref, onBeforeMount } from "vue";
import {
  getEnterprise,
  getIndustry,
  getSafeKnowledge,
  getDevice,
  getDeviceType,
  getRule,
  getFamily,
  getThreatShare,
} from "@/api/basicdata";
import { getAllMockData } from "@/api/allMockJson";

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
  const pieData = ref([
    // { name: "工业设备", value: 1250 },
    // { name: "网络设备", value: 980 },
    // { name: "安全设备", value: 750 }, 
    // { name: "服务器", value: 620 },
    // { name: "终端设备", value: 450 },
  ]);

  async function getEnterpriseData() {
    const res = await getEnterprise();
    if (res.code == 0) {
      // 填充前4个KPI卡片数据
      kpiList.value[0].value = Number(res.data.gsEnterpriseNum);
      kpiList.value[1].value = Number(res.data.enterpriseNum);
      kpiList.value[2].value = Number(res.data.ipNum);
      kpiList.value[3].value = Number(res.data.domainNum);
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

  async function getDeviceData() {
    const res = await getDevice();
    if (res.code == 0) {
      // 填充后2个KPI卡片数据（不转换为万，直接显示原始数值）
      kpiList.value[4].value = Number(res.data.protoFingerNum);
      kpiList.value[5].value = Number(res.data.deviceFingerNum);
    }
  }

  async function getDeviceTypeData() {
    const res = await getDeviceType();
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

  async function getSafeKnowledgeData() {
    const res = await getSafeKnowledge();
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

  async function getRuleData() {
    const res = await getRule();
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
  async function getFamilyData() {
    const res = await getFamily();
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     { key: "scanner", doc_count: 562 },
    //     { key: "Puppet;scanner;spam", doc_count: 415 },
    //     { key: "scanner(2022HW)", doc_count: 148 },
    //     { key: "digiccy", doc_count: 143 },
    //     { key: "tor", doc_count: 112 },
    //   ],
    // };
    if (res.code == 0) {
      rankData2.value = res.data.map((item) => ({
        name: item.key,
        value: Number(item.doc_count),
      }));
    }
  }

  async function getThreatShareData() {
    const data = {
      wdId: 'basicdata',
    };
    const res = await getAllMockData(data);
    if (res.code == 0) {
      threatShareList.value = res.data || [];
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
