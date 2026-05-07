import { ref, onBeforeMount } from "vue";
// import {
//   getArchitecture,
//   getAttackAlarm,
//   getDataAttackAlarm,
// } from "@/api/architecture";
// import { getEventList } from "@/api/specialMonitoring";
// import { getSpecial } from "@/api/integratedCircuit";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import mockData from "./data.json";

export function useData() {
  const router = useRouter();
  const store = useStore();
  const overview = ref([
    { name: "监测企业数量", value: "0" },
    { name: "风险企业数量", value: "0" },
  ]);
  const attackData = ref([
    {
      title: "网络安全态势",
      page: "/networksecurity",
      name: "网络攻击告警",
      label: "增长",
      value: "0",
      rate: "0",
    },
    {
      title: "数据安全态势",
      page: "/datasecurity",
      name: "数据攻击告警",
      label: "增长",
      value: "0",
      rate: "0",
    },
  ]);

  // const listl = ["大运会", "全国两会", "亚运会", "冬运会"];
  // const listr = ["集成电路", "重点企业", "车联网", "船舶"];

  const listl = ref([]);
  const listr = ref([]);

  function getArchitectureData() {
    const res = mockData.architecture;
    if (res.code == 0) {
      // console.log(res.data);
      rightdata1.value = res.data.atdReportNum;
      rightdata2.value = res.data.reportEnterpriseNum;
      rightdata3.value =
        res.data.knowleageNum > 9999
          ? (res.data.knowleageNum / 10000).toFixed(1) + "万"
          : res.data.knowleageNum.toLocaleString();
      overview.value[1].value =
        res.data.gyEnterpiseNum > 9999
          ? (res.data.gyEnterpiseNum / 10000).toFixed(1) + "万"
          : res.data.gyEnterpiseNum.toLocaleString();
      overview.value[0].value =
        res.data.monitorEnterpriseNum > 9999
          ? (res.data.monitorEnterpriseNum / 10000).toFixed(1) + "万"
          : res.data.monitorEnterpriseNum.toLocaleString();
    }
  }

  function getAttackAlarmData() {
    const res = mockData.attackAlarm;
    if (res.code == 0) {
      // console.log(res.data);
      attackData.value[0].value =
        res.data.total > 9999
          ? (res.data.total / 10000).toFixed(1) + "万"
          : res.data.total.toLocaleString();
      attackData.value[0].rate =
        res.data.yrarOnYear.indexOf("-") === -1
          ? res.data.yrarOnYear
          : res.data.yrarOnYear.slice(1);
      attackData.value[0].label =
        res.data.yrarOnYear.indexOf("-") === -1 ? "增长" : "下降";
    }
  }

  function getDataAttackAlarmData() {
    const res = mockData.dataAttackAlarm;
    if (res.code == 0) {
      // console.log(res.data);
      attackData.value[1].value =
        res.data.total > 9999
          ? (res.data.total / 10000).toFixed(1) + "万"
          : res.data.total.toLocaleString();
      attackData.value[1].rate =
        res.data.yrarOnYear.indexOf("-") === -1
          ? res.data.yrarOnYear
          : res.data.yrarOnYear.slice(1);
      attackData.value[1].label =
        res.data.yrarOnYear.indexOf("-") === -1 ? "增长" : "下降";
    }
  }

  function getEventListData() {
    const res = mockData.eventList;
    if (res.code === 0) {
      listl.value = res.data;
    }
  }

  function getSpecialData() {
    const res = mockData.special;
    if (res.code === 0) {
      listr.value = res.data;
    }
  }

  function gotoEvent(id) {
    store.commit("page/setEventId", id);
    router.push("/specialMonitoring");
  }

  function gotoSpecial(label) {
    if (label !== "集成电路产业链") {
      store.commit("page/setKeyword", label);
      router.push("/keyMonitoring");
    } else {
      router.push("/integratedCircuit");
    }
  }

  onBeforeMount(() => {
    getArchitectureData();
    getAttackAlarmData();
    getDataAttackAlarmData();
    getEventListData();
    getSpecialData();
  });

  const rightdata1 = ref(0);
  const rightdata2 = ref(0);
  const rightdata3 = ref(0);

  // 架构页新增：折线柱状与总览指标（模拟数据）
  const barLineData = ref([
    {
      name: "攻击次数（万次）",
      key: "attackedCount",
      list: [],
    },
    // {
    //   name: "受攻击企业（家）",
    //   key: "attackedCompany",
    //   list: [],
    // },
  ]);

  const totalList = ref([
    {
      label: "产业总产值",
      value: 0,
      unit: "",
      key: "产业总产值",
      icon: "total-icon4",
    },
    {
      label: "工业5G项目",
      value: 0,
      unit: "",
      key: "工业5G项目",
      icon: "total-icon2",
    },
    {
      label: "带动经济增长",
      value: 0,
      unit: "",
      key: "带动经济增长",
      icon: "total-icon1",
      rate: "0%",
    },
    {
      label: "产业增加值超千亿",
      value: 0,
      unit: "",
      key: "产业增加值超千亿",
      icon: "total-icon3",
      rate: "0%",
    },
  ]);

  function getIndustryInternetData() {
    const res = mockData.industryInternet;
    if (res && res.code === 0) {
      const iconMap = {
        产业总产值: "total-icon4",
        工业5G项目: "total-icon2",
        带动经济增长: "total-icon1",
        产业增加值超千亿: "total-icon3",
      };

      function parseValueUnit(text) {
        const m = String(text)
          .trim()
          .match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
        if (m) {
          return { value: parseFloat(m[1]), unit: m[2].trim() };
        }
        return { value: 0, unit: "" };
      }

      totalList.value = (res.data || []).map((item) => {
        const { value, unit } = parseValueUnit(item.text2);
        return {
          label: item.text1,
          value,
          unit,
          key: item.text1,
          icon: iconMap[item.text1] || "total-icon1",
          rate: item.ratio || undefined,
        };
      });
    }
  }

  function getIndustryInternetSecurityData() {
    const res = mockData.industryInternetSecurity;
    if (res && res.code === 0 && res.data) {
      const times = Array.isArray(res.data.time) ? res.data.time : [];
      const companiesRaw = Array.isArray(res.data.attackedCompany)
        ? res.data.attackedCompany
        : [];
      const countsRaw = Array.isArray(res.data.attackedCount)
        ? res.data.attackedCount
        : [];

      const companyList = times.map((t, i) => {
        const v = Number(companiesRaw[i] ?? 0);
        return { label: t, value: isNaN(v) ? 0 : v };
      });

      const countList = times.map((t, i) => {
        const raw = Number(countsRaw[i] ?? 0);
        const v = isNaN(raw) ? 0 : Number((raw / 10000).toFixed(2));
        return { label: t, value: v };
      });

      barLineData.value = [
        { name: "攻击次数（万次）", key: "attackedCount", list: countList },
        // { name: "受攻击企业（家）", key: "attackedCompany", list: companyList },
      ];
    }
  }

  onBeforeMount(() => {
    getIndustryInternetData();
    getIndustryInternetSecurityData();
  });

  return {
    overview,
    attackData,
    listl,
    listr,
    rightdata1,
    rightdata2,
    rightdata3,
    gotoEvent,
    gotoSpecial,
    barLineData,
    totalList,
  };
}
