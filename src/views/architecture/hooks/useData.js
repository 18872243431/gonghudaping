import { ref, onBeforeMount, computed } from "vue";
import {
  getArchitecture,
  getAttackAlarm,
  getDataAttackAlarm,
  getIndustryInternet,
  getIndustryInternetSecurity,
} from "@/api/architecture";
import { getEventList } from "@/api/specialMonitoring";
import { getSpecial } from "@/api/integratedCircuit";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

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
      name: "数据风险告警",
      label: "增长",
      value: "0",
      rate: "0",
    },
  ]);

  // const listl = ["大运会", "全国两会", "亚运会", "冬运会"];
  // const listr = ["集成电路", "重点企业", "车联网", "船舶"];

  const listl = ref([]);
  const listr = ref([]);
  const title = computed(() => store.getters.title);

  async function getArchitectureData() {
    const res = await getArchitecture();
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

  async function getAttackAlarmData() {
    const res = await getAttackAlarm();
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

  async function getDataAttackAlarmData() {
    const res = await getDataAttackAlarm();
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

  async function getEventListData() {
    const res = await getEventList();
    if (res.code === 0) {
      listl.value = res.data;
    }
  }

  async function getSpecialData() {
    const res = await getSpecial();
    if (res.code === 0) {
      listr.value = res.data;
    }
  }

  function gotoEvent(id) {
    store.commit("page/setEventId", id);
    router.push("/specialMonitoring");
  }

  function gotoSpecial(item) {
    store.commit("page/setKeyword", item.label);
    router.push(item.linkUrl);
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

  const barLineData = ref([
    // {
    //   name: "受攻击企业（家）",
    //   key: "attackedCompany",
    //   list: [
    //     // { label: "2024-01", value: 320 },
    //   ],
    // },
    {
      name: "攻击次数（万次）",
      key: "attackedCount",
      list: [
        // { label: "2024-01", value: 2.4 },
      ],
    },
  ]);

  const totalList = ref([
    {
      label: "产业覆盖范围",
      value: 0,
      unit: "个工业大类全覆盖",
      key: "产业覆盖范围",
      icon: "total-icon2",
    },

    {
      label: "连接工业设备",
      value: 0,
      unit: "亿台套",
      key: "连接工业设备",
      icon: "total-icon1",
      // rate: "0%",
    },
    {
      label: "核心产业规模",
      value: 0,
      unit: "万亿元",
      key: "核心产业规模",
      icon: "total-icon4",
    },
    {
      label: "带动经济增长",
      value: 0,
      unit: "万亿元",
      key: "带动经济增长",
      icon: "total-icon3",
      // rate: "0%",
    },
  ]);

  async function getIndustryInternetData() {
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     {
    //       text1: "核心产业规模",
    //       text2: "1.5万亿元",
    //     },
    //     {
    //       text1: "带动经济增长",
    //       text2: "3.5万亿元",
    //     },
    //     {
    //       text1: "工业互联网拓展",
    //       text2: "41个工业大类全覆盖",
    //     },
    //     {
    //       text1: "连接工业设备",
    //       text2: "1亿余台套",
    //     },
    //   ],
    // };
    const res = await getIndustryInternet();
    if (res.code === 0) {
      const iconMap = {
        核心产业规模: "total-icon4",
        产业覆盖范围: "total-icon2",
        连接工业设备: "total-icon1",
        带动经济增长: "total-icon3",
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

      totalList.value = res.data.map((item) => {
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

  async function getIndustryInternetSecurityData() {
    // const res = {
    //   msg: "",
    //   code: 0,
    //   data: {
    //     time: ["2025", "2024", "2023"],
    //     attackedCount: ["22212", "11313", "4124"],
    //     attackedCompany: ["3213", "2324", "1513"],
    //   },
    // };
    const res = await getIndustryInternetSecurity();
    if (res.code === 0 && res.data) {
      const times = Array.isArray(res.data.time) ? res.data.time : [];
      const companiesRaw = Array.isArray(res.data.attackedCompany)
        ? res.data.attackedCompany
        : [];
      const countsRaw = Array.isArray(res.data.attackedCount)
        ? res.data.attackedCount
        : [];

      // 将数据按 time 排序
      const combined = times.map((t, i) => ({
        time: t,
        company: Number(companiesRaw[i] ?? 0),
        count: Number(countsRaw[i] ?? 0),
      }));
      combined.sort((a, b) => a.time.localeCompare(b.time));

      const companyList = combined.map((item) => ({
        label: item.time,
        value: isNaN(item.company) ? 0 : item.company,
      }));

      const countList = combined.map((item) => {
        const v = isNaN(item.count)
          ? 0
          : Number((item.count / 10000).toFixed(2));
        return { label: item.time, value: v };
      });

      barLineData.value = [
        // { name: "受攻击企业（家）", list: companyList },
        { name: "攻击次数（万次）", list: countList },
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
    title,
  };
}
