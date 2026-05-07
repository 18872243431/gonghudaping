import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import {
  getGdSecurityOverview,
  getGdSecurityReport,
  getGdSecurityDataReport,
  getGdSecurityPosture,
  getGdSecurityAttackType,
  getGdSecurityMap,
  getGdSecurityAttackDynamic,
  getGdSecuritySystem,
  getGdSecurityData,
  getGdSecurityRank,
  getGdSecurityReportHandle,
  getGdSecurityOverall,
} from "@/api/gdsecurity";
import mockData from "./data.json";

// 是否使用模拟数据
const useMockData = true;

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

const province = computed(() => {
  const route = useRoute();
  return route.query.provinceName;
});

export function useLeft() {
  const totalOneList = ref([
    {
      label: "规上工业企业",
      value: 0,
      unit: "家",
      key: "aboveStandardIndustrialEnterprise",
    },
    {
      label: "平台企业",
      value: 0,
      unit: "家",
      key: "platformEnterprise",
    },
    { label: "标识解析企业", value: 0, unit: "家", key: "handleEnterprise" },
  ]);

  const overflowData1 = ref([
    {
      name: "监测企业数量",
      value: 0,
      unit: "家",
      key: "enterpriseTotal",
    },
    {
      name: "监测规上企业数量",
      value: 0,
      unit: "家",
      key: "monitorAboveStandardEnterprise",
    },
    {
      name: "监测企业数量占比",
      value: 0,
      unit: "%",
      key: "rate",
    },
  ]);

  const overflowData2 = ref([
    {
      name: "企业信息",
      value1: 0,
      value2: 0,
      key: "companyTotal",
    },
    {
      name: "IP信息",
      value1: 0,
      value2: 0,
      key: "ipTotal",
    },
    // {
    //   name: "域名信息",
    //   value1: 126,
    //   value2: 126,
    // },
  ]);

  const lineData1 = ref({
    legend: ["上报数据"],
    category: [],
    values: [
      [], // 替换为你实际的数据
    ],
  });

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
  const rate = ref(0);

  async function getGdSecurityOverviewData() {
    if (useMockData) {
      const res = mockData.gdSecurityOverview;
      if (res.code == 0) {
        const obj = {
          ...res.data,
          rate:
            res.data.enterpriseTotal === 0
              ? 0
              : (
                  (res.data.monitorAboveStandardEnterprise /
                    res.data.enterpriseTotal) *
                  100
                ).toFixed(1),
        };
        totalOneList.value.forEach((item) => {
          item.value = Number(obj[item.key]);
        });
        overflowData1.value.forEach((item) => {
          const num = obj[item.key];
          item.value =
            num > 9999 && item.key !== "rate"
              ? (num / 10000).toFixed(1) + "万"
              : num.toLocaleString();
        });
      }
      return;
    }

    const res = await getGdSecurityOverview({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      const obj = {
        ...res.data,
        rate:
          res.data.enterpriseTotal === 0
            ? 0
            : (
                (res.data.monitorAboveStandardEnterprise /
                  res.data.enterpriseTotal) *
                100
              ).toFixed(1),
      };
      totalOneList.value.forEach((item) => {
        item.value = Number(obj[item.key]);
      });
      overflowData1.value.forEach((item) => {
        const num = obj[item.key];
        item.value =
          num > 9999 && item.key !== "rate"
            ? (num / 10000).toFixed(1) + "万"
            : num.toLocaleString();
      });
    }
  }

  async function getGdSecurityReportData() {
    if (useMockData) {
      const res = mockData.gdSecurityReport;
      if (res.code == 0) {
        overflowData2.value.forEach((item) => {
          const num = res.data[item.key];
          item.value1 =
            num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
        });
      }
      return;
    }

    const res = await getGdSecurityReport({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      overflowData2.value.forEach((item) => {
        const num = res.data[item.key];
        item.value1 =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  async function getGdSecurityDataReportData() {
    if (useMockData) {
      const res = mockData.gdSecurityDataReport;
      if (res.code == 0) {
        lineData1.value.category = res.data.lineList.map(
          (item) => item.key_as_string
        );
        lineData1.value.values[0] = res.data.lineList.map(
          (item) => item.doc_count
        );
        if (res.data.totalNum)
          rate.value = (
            (res.data.effectivenessNum * 100) /
            res.data.totalNum
          ).toFixed(1);
      }
      return;
    }

    const res = await getGdSecurityDataReport({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      lineData1.value.category = res.data.lineList.map(
        (item) => item.key_as_string
      );
      lineData1.value.values[0] = res.data.lineList.map(
        (item) => item.doc_count
      );
      if (res.data.totalNum)
        rate.value = (
          (res.data.effectivenessNum * 100) /
          res.data.totalNum
        ).toFixed(1);
    }
  }

  watch(
    activeTab,
    (val) => {
      getGdSecurityOverviewData();
      getGdSecurityReportData();
      getGdSecurityDataReportData();
    },
    { immediate: true }
  );

  return {
    overflowData1,
    overflowData2,
    totalOneList,
    lineData1,
    lineOpts,
    rate,
  };
}

export function useCenter() {
  const overviewText = ref("");
  const mapData = ref([
    // { name: "韶关市", value: 100 },
    // { name: "广州市", value: 400 },
    // { name: "茂名市", value: 500 },
    // { name: "惠州市", value: 1000 },
  ]);
  const provinceOption = ref({
    visualMap2: { min: 0, max: 0, text: [0, 0] },
  });
  const pieData = ref([]);
  const columns = ref([
    { label: "时间", prop: "timestamp", width: 190 },
    { label: "风险类型", prop: "eventTypeName" },
    { label: "攻击阶段", prop: "killChainCn" },
    { label: "攻击端", prop: "attackIp", width: 160 },
    { label: "攻击国家", prop: "attackedCountry" },
    { label: "被攻击企业", prop: "attackedCorpName", width: 240 },
    { label: "被攻击IP", prop: "attackedIp", width: 160 },
  ]);
  const tableData = ref([]);

  const selectedCity = ref("");
  const tooltipPosition = ref({ x: 0, y: 0 });
  const tooltipShow = ref(false);
  const provinceInfo = ref([
    { label: "网络攻击次数", value: 0, key: "attackedTotal" },
    { label: "被攻击企业数", value: 0, key: "attackedCompanyTotal" },
    { label: "暴露资产数量", value: 0, key: "assetTtoal" },
    { label: "漏洞隐患数量", value: 0, key: "loopholeTotal" },
  ]);
  function mapClick(params) {
    if (params.name) {
      selectedCity.value = params.name;
      tooltipPosition.value.x = params.event.event.clientX * 2 - 300;
      tooltipPosition.value.y = params.event.event.clientY;
      tooltipShow.value = true;
      provinceInfo.value.forEach((item) => {
        item.value = params.data[item.key];
      });
    }
  }

  async function getGdSecurityPostureData() {
    if (useMockData) {
      const res = mockData.gdSecurityPosture;
      if (res.code == 0) {
        overviewText.value = res.data;
      }
      return;
    }

    const res = await getGdSecurityPosture({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      overviewText.value = res.data;
    }
  }

  async function getGdSecurityMapData() {
    if (useMockData) {
      const res = mockData.gdSecurityMap;
      if (res.code == 0) {
        mapData.value = res.data.map((item) => {
          return {
            ...item,
            name: item.city,
            value: item.attackedTotal,
          };
        });
        const valueList = res.data.map((item) => item.attackedTotal);
        const min = Math.min(...valueList);
        const max = Math.max(...valueList);
        if (max === min) {
          provinceOption.value.visualMap2 = {
            max,
            min: 0,
            text: [max, 0],
          };
        } else {
          provinceOption.value.visualMap2 = {
            max,
            min,
            text: [max, min],
          };
        }
      }
      return;
    }

    const res = await getGdSecurityMap({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      mapData.value = res.data.map((item) => {
        return {
          ...item,
          name: item.city,
          value: item.attackedTotal,
        };
      });
      const valueList = res.data.map((item) => item.attackedTotal);
      const min = Math.min(...valueList);
      const max = Math.max(...valueList);
      if (max === min) {
        provinceOption.value.visualMap2 = {
          max,
          min: 0,
          text: [max, 0],
        };
      } else {
        provinceOption.value.visualMap2 = {
          max,
          min,
          text: [max, min],
        };
      }
    }
  }

  async function getGdSecurityAttackTypeData() {
    if (useMockData) {
      const res = mockData.gdSecurityAttackType;
      if (res.code == 0) {
        pieData.value = res.data.map((item) => {
          return {
            name: item.key,
            value: item.doc_count,
          };
        });
      }
      return;
    }

    const res = await getGdSecurityAttackType({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      pieData.value = res.data.map((item) => {
        return {
          name: item.key,
          value: item.doc_count,
        };
      });
    }
  }

  async function getGdSecurityAttackDynamicData() {
    if (useMockData) {
      const res = mockData.gdSecurityAttackDynamic;
      if (res.code == 0) {
        tableData.value = res.data;
      }
      return;
    }

    const res = await getGdSecurityAttackDynamic({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      tableData.value = res.data;
    }
  }

  watch(
    activeTab,
    (val) => {
      getGdSecurityPostureData();
      getGdSecurityAttackTypeData();
      getGdSecurityMapData();
      getGdSecurityAttackDynamicData();
    },
    { immediate: true }
  );

  return {
    overviewText,
    columns,
    tableData,
    mapData,
    mapClick,
    selectedCity,
    tooltipPosition,
    tooltipShow,
    provinceInfo,
    province,
    pieData,
    provinceOption,
  };
}

export function useRight() {
  const data1 = ref([
    // { name: "Hikvision", src: "Hikvision", unit: "个", num1: 318, num2: 318 },
  ]);
  const data2 = ref([]);
  const totalList2 = ref([
    // {
    //   name: "DTU数据中心",
    //   value: 6273,
    //   value1: 123,
    //   value2: 345,
    //   percentage: 23,
    //   type: "1",
    // },
  ]);

  const totalList3 = ref([
    {
      name: "安全事件通报",
      item1: { label: "通报", value: 0, unit: "例" },
      item2: { label: "涉及企业", value: 0, unit: "家" },
    },
    {
      name: "安全事件处置",
      item1: { label: "处置", value: 0, unit: "例" },
      item2: { label: "处置率", value: 0, unit: "%" },
    },
  ]);

  const overviewData3 = ref([
    {
      name: "网络攻击告警",
      value: 0,
      unit: "次",
      key: "total",
    },
    {
      name: "境内攻击源数量",
      value: 0,
      unit: "个",
      key: "insideAttackIpTotal",
    },
    {
      name: "境外攻击源数量",
      value: 0,
      unit: "个",
      key: "outsideAttackIpTotal",
    },
    {
      name: "被攻击企业数量",
      value: 0,
      unit: "家",
      key: "attackedCorpTotal",
    },
  ]);

  async function getGdSecuritySystemData() {
    if (useMockData) {
      const res = mockData.gdSecuritySystem;
      if (res.code == 0) {
        data1.value = res.data.map((item) => ({
          name: item.vender,
          src: item.vender,
          unit: "个",
          num1: item.deviceCount,
          num2: item.loopholeCount,
        }));
      }
      return;
    }

    const res = await getGdSecuritySystem({
      timeType: activeTab.value,
      province: province.value,
    });
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     {
    //       deviceCount: 2654,
    //       vender: "Hikvision",
    //       loopholeCount: 14,
    //     },
    //     {
    //       deviceCount: 756,
    //       vender: "Rockwell Automation",
    //       loopholeCount: 45,
    //     },
    //     {
    //       deviceCount: 458,
    //       vender: "Moxa",
    //       loopholeCount: 25,
    //     },
    //     {
    //       deviceCount: 185,
    //       vender: "Siemens",
    //       loopholeCount: 123,
    //     },
    //   ],
    // };
    if (res.code == 0) {
      data1.value = res.data.map((item) => ({
        name: item.vender,
        src: item.vender,
        unit: "个",
        num1: item.deviceCount,
        num2: item.loopholeCount,
      }));
    }
  }

  async function getGdSecurityDataData() {
    if (useMockData) {
      const res = mockData.gdSecurityData;
      if (res.code == 0) {
        data2.value = res.data.map((item) => ({
          name: item.deviceName,
          src: item.deviceName,
          unit: "个",
          num1: item.deviceCount,
          num2: item.loopholeCount,
        }));
      }
      return;
    }

    const res = await getGdSecurityData({
      timeType: activeTab.value,
      province: province.value,
    });
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     {
    //       deviceCount: 2654,
    //       deviceName: "ES",
    //       loopholeCount: 14,
    //     },
    //     {
    //       deviceCount: 756,
    //       deviceName: "Oracle",
    //       loopholeCount: 45,
    //     },
    //     {
    //       deviceCount: 458,
    //       deviceName: "Mysql",
    //       loopholeCount: 25,
    //     },
    //     {
    //       deviceCount: 185,
    //       deviceName: "PostgreSQL",
    //       loopholeCount: 123,
    //     },
    //   ],
    // };
    if (res.code == 0) {
      data2.value = res.data.map((item) => ({
        name: item.deviceName,
        src: item.deviceName,
        unit: "个",
        num1: item.deviceCount,
        num2: item.loopholeCount,
      }));
    }
  }

  async function getGdSecurityOverallData() {
    if (useMockData) {
      const res = mockData.gdSecurityOverall;
      if (res.code == 0) {
        overviewData3.value.forEach((item) => {
          const num = Number(res.data[item.key]);
          item.value =
            num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
        });
      }
      return;
    }

    const res = await getGdSecurityOverall({
      timeType: activeTab.value,
      province: province.value,
    });
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: {
    //     total: 23230,
    //     outsideAttackIpTotal: 12330,
    //     attackedCorpTotal: 1330,
    //     insideAttackIpTotal: 33330,
    //   },
    // };
    if (res.code == 0) {
      overviewData3.value.forEach((item) => {
        const num = Number(res.data[item.key]);
        item.value =
          num > 9999 ? (num / 10000).toFixed(1) + "万" : num.toLocaleString();
      });
    }
  }

  async function getGdSecurityRankData() {
    if (useMockData) {
      const res = mockData.gdSecurityRank;
      if (res.code == 0) {
        const max = Math.max(...res.data.map((item) => item.attackedTotal));
        totalList2.value = res.data.map((item, i) => {
          return {
            name: item.attackedIndustry,
            value: item.attackedTotal,
            value1: item.companyTotal,
            value2: item.monitorCompanyTotal,
            percentage1:
              item.companyTotal == 0
                ? 0
                : Number(
                    (
                      (item.monitorCompanyTotal * 100) /
                      item.companyTotal
                    ).toFixed(1)
                  ),
            percentage2: (item.attackedTotal * 100) / max,
            type: i == 0 ? 1 : 2,
          };
        });
      }
      return;
    }

    const res = await getGdSecurityRank({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      const max = Math.max(...res.data.map((item) => item.attackedTotal));
      totalList2.value = res.data.map((item, i) => {
        return {
          name: item.attackedIndustry,
          value: item.attackedTotal,
          value1: item.companyTotal,
          value2: item.monitorCompanyTotal,
          percentage1:
            item.companyTotal == 0
              ? 0
              : Number(
                  (
                    (item.monitorCompanyTotal * 100) /
                    item.companyTotal
                  ).toFixed(1)
                ),
          percentage2: (item.attackedTotal * 100) / max,
          type: i == 0 ? 1 : 2,
        };
      });
    }
  }

  async function getGdSecurityReportHandleData() {
    if (useMockData) {
      const res = mockData.gdSecurityReportHandle;
      if (res.code == 0) {
        totalList3.value[0].item1.value = res.data.total;
        totalList3.value[0].item2.value = res.data.companyTotal;
        totalList3.value[1].item1.value = res.data.disposalTotal;
        if (res.data.total > 0)
          totalList3.value[1].item2.value = (
            (res.data.disposalTotal * 100) /
            res.data.total
          ).toFixed(1);
      }
      return;
    }

    const res = await getGdSecurityReportHandle({
      timeType: activeTab.value,
      province: province.value,
    });
    if (res.code == 0) {
      // console.log(res.data);
      totalList3.value[0].item1.value = res.data.total;
      totalList3.value[0].item2.value = res.data.companyTotal;
      totalList3.value[1].item1.value = res.data.disposalTotal;
      if (res.data.total > 0)
        totalList3.value[1].item2.value = (
          (res.data.disposalTotal * 100) /
          res.data.total
        ).toFixed(1);
    }
  }

  watch(
    activeTab,
    (val) => {
      getGdSecuritySystemData();
      getGdSecurityDataData();
      getGdSecurityRankData();
      getGdSecurityReportHandleData();
      getGdSecurityOverallData();
    },
    { immediate: true }
  );

  return {
    totalList2,
    totalList3,
    data1,
    data2,
    tabsList,
    activeTab,
    changeTab,
    overviewData3,
  };
}
