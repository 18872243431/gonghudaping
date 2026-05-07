import { ref, onBeforeMount } from "vue";
import {
  getTaskDetail,
  getMap,
  getNetworkAttackAnalysis,
  getAttackFeature,
  getHoleRanking,
  getRiskCompanyRanking,
} from "@/api/specialMonitoring2";
import mock from "./data.json";
const USE_MOCK = false;

export function useData() {
  const info = ref({
    name: "",
    range: "",
    count: "",
    time: "",
    content: "",
  });

  async function getTaskDetailData() {
    const res = USE_MOCK ? mock.taskDetail : await getTaskDetail();
    if (res.code === 0) {
      const d = res.data || {};
      info.value = {
        name: d.taskName || "",
        range: d.monitor || "",
        count: d.riskEvent || "",
        time: d.time || "",
        content: d.desc || "",
      };
    }
  }

  const attackTypeList = ref([
    // {
    //   name: "APT攻击",
    //   value: "123",
    //   rate: "100%",
    // },
  ]);

  const attackIpList = ref([
    // {
    //   ip: "192.168.1.1",
    //   value: "233",
    //   country: "中国",
    // },
  ]);

  async function getAttackFeatureData() {
    const res = USE_MOCK ? mock.attackFeature : await getAttackFeature();
    if (res.code === 0) {
      const d = res.data || {};
      const eList = Array.isArray(d.eventList) ? d.eventList : [];
      const iList = Array.isArray(d.ipList) ? d.ipList : [];
      attackTypeList.value = eList.map((item) => {
        const label = item.label === "DDos" ? "DDoS" : item.label;
        const ratio = item.ratio ?? "0";
        const rate = String(ratio).includes("%") ? String(ratio) : `${ratio}%`;
        return { name: label, value: item.num ?? 0, rate };
      });
      attackIpList.value = iList.map((item) => ({
        ip: item.label,
        value: item.num ?? 0,
        country: item.country ?? "",
        name: item.country + "-" + item.label,
      }));
    }
  }

  const holeList = ref([
    // { name: "Zimbra XXE注入", value: 123, content: "获取XXXXXXX权限" },
    // { name: "Log4j2 反序列化漏洞", value: 123, content: "获取XXXXXXX权限" },
  ]);

  async function getHoleRankingData() {
    const res = USE_MOCK ? mock.holeRanking : await getHoleRanking();
    if (res.code === 0) {
      const d = res.data || {};
      const list = Array.isArray(d.loopholeList) ? d.loopholeList : [];
      holeList.value = list.map((item) => ({
        name: item.label,
        value: item.num ?? 0,
        content: item.desc || "",
      }));
    }
  }

  const riskCompanyList = ref([
    // { name: "中国平安", value: "123", risk: 1 },
    // { name: "阿里巴巴", value: "421", risk: 2 },
    // { name: "腾讯", value: "367", risk: 3 },
    // { name: "华为技术有限公司", value: "289", risk: 2 },
    // { name: "比亚迪股份有限公司", value: "198", risk: 1 },
    // { name: "海尔智家股份有限公司", value: "156", risk: 2 },
    // { name: "中国石油化工股份有限公司", value: "342", risk: 3 },
    // { name: "宁德时代新能源科技股份有限公司", value: "275", risk: 2 },
    // { name: "中国中车股份有限公司", value: "184", risk: 1 },
    // { name: "中国船舶集团有限公司", value: "168", risk: 2 },
  ]);

  async function getRiskCompanyRankingData() {
    const res = USE_MOCK
      ? mock.riskCompanyRanking
      : await getRiskCompanyRanking();
    if (res.code === 0) {
      const d = res.data || {};
      const list = Array.isArray(d.companyList) ? d.companyList : [];
      riskCompanyList.value = list.map((item, index) => ({
        ...item,
        name: item.label,
        value: item.num ?? 0,
        risk: item.level === "高危" ? 3 : item.level === "中危" ? 2 : 1,
        top: index + 1,
      }));
    }
  }

  const networkInfo = ref({ total: 0, today: 0 });

  const lineData = ref({
    legend: [],
    category: [],
    values: [],
  });

  async function getNetworkAttackAnalysisData() {
    const res = USE_MOCK
      ? mock.networkAttackAnalysis
      : await getNetworkAttackAnalysis();
    if (res.code === 0) {
      const d = res.data || {};
      const legend = [];
      const values = [];
      let category = [];
      Object.keys(d).forEach((key) => {
        if (key === "attackNum" || key === "dailyNum") return;
        const item = d[key];
        if (item && Array.isArray(item.num)) {
          const name = key === "DDos" || key === "Ddos" ? "DDoS" : key;
          legend.push(name);
          values.push(item.num);
          if (!category.length && Array.isArray(item.time)) {
            category = item.time;
          }
        }
      });
      lineData.value = {
        legend,
        category,
        values,
      };
      networkInfo.value = {
        total: Number(d.attackNum) || 0,
        today: Number(d.dailyNum) || 0,
      };
    }
  }

  const mapData = ref({
    map: [],
    cube: [],
  });

  const mapOption = ref({
    visualMap1: {
      max: 0,
      middle: 0,
      min: 0,
      left: 250,
      bottom: 180,
    },
    visualMap2: {
      left: 300,
      bottom: 180,
    },
  });

  async function getMapData() {
    const res = USE_MOCK ? mock.map : await getMap();
    if (res.code === 0) {
      const d = res.data || {};
      const riskList = Array.isArray(d.riskList) ? d.riskList : [];
      const companyList = Array.isArray(d.companyList) ? d.companyList : [];

      mapData.value.map = riskList.map((item) => ({
        name: item.province,
        value: Number(item.number) || 0,
      }));

      mapData.value.cube = companyList.map((item) => ({
        name: item.province,
        value: Number(item.number) || 0,
      }));

      if (mapData.value.cube.length) {
        const values = mapData.value.cube
          .map((i) => i.value)
          .slice()
          .sort((a, b) => a - b);
        const sel = divideArrayIntoThreeSegments(values);
        mapOption.value.visualMap1 = {
          max: sel[2] || 0,
          middle: sel[1] || 0,
          min: sel[0] || 0,
          left: 250,
          bottom: 180,
        };
      } else {
        mapOption.value.visualMap1 = {
          max: 0,
          middle: 0,
          min: 0,
          left: 250,
          bottom: 180,
        };
      }

      mapOption.value.visualMap2 = {
        left: 300,
        bottom: 180,
      };
    }
  }

  function divideArrayIntoThreeSegments(arr) {
    const length = arr.length;
    const segmentLength = Math.floor(length / 3);
    let remainder = length % 3;
    const segments = [];
    let startIndex = 0;
    for (let i = 0; i < 3; i++) {
      let currentLength = segmentLength;
      if (remainder > 0) {
        currentLength += 1;
        remainder -= 1;
      }
      segments.push(arr.slice(startIndex, startIndex + currentLength));
      startIndex += currentLength;
    }
    return segments.map((s) => s[Math.floor(s.length / 2)] || 0);
  }

  onBeforeMount(() => {
    getTaskDetailData();
    getNetworkAttackAnalysisData();
    getAttackFeatureData();
    getHoleRankingData();
    getRiskCompanyRankingData();
    getMapData();
  });

  return {
    info,
    attackTypeList,
    attackIpList,
    holeList,
    riskCompanyList,
    networkInfo,
    lineData,
    mapData,
    mapOption,
  };
}
