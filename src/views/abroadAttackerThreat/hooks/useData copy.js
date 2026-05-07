import { ref, watch } from "vue";
import {
  //攻击省份(地图+左上角统计)
  getProvinceMap,
  //被攻击行业数量
  getIndustryCount,
  //被攻击行业TOP4
  getIndustryTop4,
  //网络攻击总数
  getAtdStatistics,
  //被攻击企业数
  getCompanyStatistics,
  //网络攻击威胁等级分布
  getSeverity,
  // 网络攻击总数趋势
  getAtdStatisticsTrend,
  // 被攻击企业数趋势
  getCompanyStatisticsTrend,
  //家族top5
  getFamilyTop,
  //攻击IPtop5
  getAttackIP,
  //告警信息
  getAlarmInfo,
  //被攻击企业排名
  getAttackedComapnyTop,
} from "@/api/abroadAttackerThreat";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import { getNationalPng } from "@/libs/country";
import { numberFormat } from "@/libs/util";
import mockData from "./data.json";

// 是否使用模拟数据
const useMockData = true;

function setNationalFlag(str) {
  const flag = getNationalPng(str);
  if (flag) {
    return require(`/public/countryFlag/${flag}.png`);
  }
  return "";
}

export function useDataFun(props) {
  const timeBarData = ref([
     { label: '00:00', value: 1 },
      { label: '01:00', value: 1 },
      { label: '02:00', value: 17 },
      { label: '03:00', value: 23 },
      { label: '04:00', value: 27 },
      { label: '05:00', value: 19 },
      { label: '06:00', value: 11 },
      { label: '07:00', value: 2 },
      { label: '08:00', value: 1 },
      { label: '09:00', value: 1 },
      { label: '10:00', value: 1 },
      { label: '11:00', value: 2 },
      { label: '12:00', value: 6 },
      { label: '13:00', value: 7 },
      { label: '14:00', value: 6 },
      { label: '15:00', value: 7 },
      { label: '16:00', value: 3 },
      { label: '17:00', value: 7 },
      { label: '18:00', value: 1 },
      { label: '19:00', value: 1 },
      { label: '20:00', value: 3 },
      { label: '21:00', value: 1 },
      { label: '22:00', value: 1 },
      { label: '23:00', value: 3 },
  ]);
  // ==================== useLeft 相关变量 ====================
  const totalList = ref([
    {
      label: "网络攻击总数",
      value: 0,
      unit: "",
      title: "",
      label1: "环比",
      value1: "",
      status1: "",
      label2: "同比",
      value2: "",
      status2: "",
    },
    {
      label: "攻击企业数量",
      value: 0,
      unit: "",
      title: "",
      label1: "环比",
      value1: "",
      status1: "",
      label2: "同比",
      value2: "",
      status2: "",
    },
  ]);

  const lineData1 = ref({
    legend: ["网络攻击趋势"],
    category: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    values: [
      [10, 20, 30, 42, 21, 50, 60, 70, 80, 90, 100, 110],
    ],
  });

  const lineData2 = ref({
    legend: ["攻击源数量变化趋势"],
    category: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    values: [
      [100, 230, 130, 142, 221, 150, 260, 170, 180, 190, 130, 160],
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

  const data = ref([
    [
      {
        name: "高危",
        value: 0.1,
        num: 10,
        key: "high",
      },
    ],
    [
      {
        name: "中危",
        value: 0.3,
        num: 30,
        key: "middle",
      },
    ],
    [
      {
        name: "低危",
        value: 0.6,
        num: 60,
        key: "low",
      },
    ],
  ]);

  const borderColor = ref([
    "rgba(255, 0, 0, 1)",
    "rgba(255, 140, 0, 1)",
    "rgba(0, 255, 251, 1)",
  ]);
  const colors = ref([
    ["rgba(142, 13, 13, 1)", "rgba(255, 8, 0, 1)", "rgba(194, 16, 16, 1)"],
    ["rgba(142, 131, 13, 1)", "rgba(255, 166, 0, 1)", "rgba(194, 132, 16, 1)"],
    ["rgba(13, 129, 142, 1)", "rgba(0, 255, 229, 1)", "rgba(16, 170, 194, 1)"],
  ]);
  const backgroundColors = ref([
    ["rgba(191, 64, 64, 1)", "rgba(253, 68, 68, 0.25)", "rgba(253, 68, 68, 0)"],
    [
      "rgba(255, 140, 0, 0.53)",
      "rgba(253, 170, 68, 0.25)",
      "rgba(253, 173, 68, 0)",
    ],
    [
      "rgba(0, 187, 255, 0.53)",
      "rgba(68, 182, 253, 0.25)",
      "rgba(68, 247, 253, 0)",
    ],
  ]);

  let option = ref([]);

  borderColor.value.forEach((item, i) => {
    option.value.push({
      title: {
        show: false,
      },
      series: {
        radius: 80,
        shape: "circle",
        colors: colors.value[i],
        backgroundColors: backgroundColors.value[i],
        outline: {
          show: true,
          borderDistance: 3,
          borderWidth: 1,
          borderColor: borderColor.value[i],
        },
        label: {
          show: true,
          fontStyle: "normal",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          fontSize: 24,
          align: "center",
          verticalAlign: "middle",
          color: "#fff",
          position: "inside",
        },
      },
    });
  });

  // ==================== useCenter 相关变量 ====================
  const attackInfo = ref({
    country: "",
    brief: setNationalFlag(props.attackCountry),
    attackCountryCount: "460",
    attackCountryPercent: "4.6%",
    province: "",
    industry: "",
  });
  const overviewText = ref(
    "近7天监测网络攻击 293.2 万次，涉及 1,382 家企业，主要集中在医药制造、专用设备制造和电气机械制造行业。"
  );
  const mapData = ref({
    map: [],
  });
  const mapOption = ref({
    visualMap2: {
      max: 0,
      min: 0,
      text: [0, 0],
    },
  });

  const pieData = ref([
    {
      name: "活跃病毒家族分布情况",
      list: [],
    },
  ]);

  const attackData = ref([
    {
      name: "远控端活跃情况排名",
      list: [],
    },
  ]);

  const warningList = ref({});

  // ==================== useRight 相关变量 ====================
  const industryNameText = ref("");
  const industryList = ref([]);
  const companyList = ref([]);

  // ==================== useLeft 相关方法 ====================
  //网络攻击总数
  async function getAtdStatisticsData() {
    if (useMockData) {
      const res = mockData.atdStatistics;
      if (res.code == 0) {
        const param = numberFormat(res.data.atdNum);
        totalList.value[0] = {
          label: "网络攻击总数",
          value: Number(param.value),
          unit: param.unit + "次",
          title: "",
          label1: res.data.atdHbRatio < 0 ? "环比下降" : "环比增长",
          value1: Math.abs(res.data.atdHbRatio) + "%",
          status1: res.data.atdHbRatio < 0 ? "down" : "up",
          label2: res.data.atdTbRatio < 0 ? "同比下降" : "同比增长",
          value2: Math.abs(res.data.atdTbRatio) + "%",
          status2: res.data.atdTbRatio < 0 ? "down" : "up",
        };
      }
      return;
    }

    const data = {
      attackCountry: attackCountry.value,
    };
    const res = await getAtdStatistics(data);
    if (res.code == 0) {
      const param = numberFormat(res.data.atdNum);
      totalList.value[0] = {
        label: "网络攻击总数",
        value: Number(param.value),
        unit: param.unit + "次",
        title: "",
        label1: res.data.atdHbRatio < 0 ? "环比下降" : "环比增长",
        value1: Math.abs(res.data.atdHbRatio) + "%",
        status1: res.data.atdHbRatio < 0 ? "down" : "up",
        label2: res.data.atdTbRatio < 0 ? "同比下降" : "同比增长",
        value2: Math.abs(res.data.atdTbRatio) + "%",
        status2: res.data.atdTbRatio < 0 ? "down" : "up",
      };
    }
  }

  //被攻击企业数
  async function getCompanyStatisticsData() {
    if (useMockData) {
      const res = mockData.companyStatistics;
      if (res.code == 0) {
        const param = numberFormat(res.data.companyNum);
        totalList.value[1] = {
          label: "攻击企业数量",
          value: Number(param.value),
          unit: param.unit + "家",
          title: "",
          label1: res.data.companyHbRatio < 0 ? "环比下降" : "环比增长",
          value1: Math.abs(res.data.companyHbRatio) + "%",
          status1: res.data.companyHbRatio < 0 ? "down" : "up",
          label2: res.data.companyTbRatio < 0 ? "同比下降" : "同比增长",
          value2: Math.abs(res.data.companyTbRatio) + "%",
          status2: res.data.companyTbRatio < 0 ? "down" : "up",
        };
      }
      return;
    }

    const data = {
      attackCountry: attackCountry.value,
    };
    const res = await getCompanyStatistics(data);
    if (res.code == 0) {
      const param = numberFormat(res.data.companyNum);
      totalList.value[1] = {
        label: "攻击企业数量",
        value: Number(param.value),
        unit: param.unit + "家",
        title: "",
        label1: res.data.companyHbRatio < 0 ? "环比下降" : "环比增长",
        value1: Math.abs(res.data.companyHbRatio) + "%",
        status1: res.data.companyHbRatio < 0 ? "down" : "up",
        label2: res.data.companyTbRatio < 0 ? "同比下降" : "同比增长",
        value2: Math.abs(res.data.companyTbRatio) + "%",
        status2: res.data.companyTbRatio < 0 ? "down" : "up",
      };
    }
  }

  // 威胁等级分布
  async function getSeverityData() {
    if (useMockData) {
      const res = mockData.severity;
      if (res.code == 0) {
        let total = res.data.high + res.data.middle + res.data.low;
        data.value = data.value.map((e) => {
          let item = e[0];
          return [
            {
              name: item.name,
              value: (res.data[item.key] / total).toFixed(1),
              num:
                res.data[item.key] > 9999
                  ? (res.data[item.key] / 10000).toFixed(1) + "万"
                  : res.data[item.key].toLocaleString(),
            },
          ];
        });
      }
      return;
    }

    const param = {
      attackCountry: attackCountry.value,
    };
    const res = await getSeverity(param);
    if (res.code == 0) {
      let total = res.data.high + res.data.middle + res.data.low;
      data.value = data.value.map((e) => {
        let item = e[0];
        return [
          {
            name: item.name,
            value: (res.data[item.key] / total).toFixed(1),
            num:
              res.data[item.key] > 9999
                ? (res.data[item.key] / 10000).toFixed(1) + "万"
                : res.data[item.key].toLocaleString(),
          },
        ];
      });
    }
  }

  // 网络攻击总数趋势
  async function getAtdStatisticsTrendData() {
    if (useMockData) {
      const res = mockData.atdStatisticsTrend;
      if (res.code == 0) {
        lineData1.value = {
          legend: ["网络攻击数量"],
          category: res.data.timeList,
          values: [res.data.dataList],
        };
      }
      return;
    }

    const param = {
      attackCountry: attackCountry.value,
    };
    const res = await getAtdStatisticsTrend(param);
    if (res.code == 0) {
      lineData1.value = {
        legend: ["网络攻击数量"],
        category: res.data.timeList,
        values: [res.data.dataList],
      };
    }
  }

  // 被攻击企业数趋势
  async function getCompanyStatisticsTrendData() {
    if (useMockData) {
      const res = mockData.companyStatisticsTrend;
      if (res.code == 0) {
        lineData2.value = {
          legend: ["攻击源数量"],
          category: res.data.timeList,
          values: [res.data.dataList],
        };
      }
      return;
    }

    const param = {
      attackCountry: attackCountry.value,
    };
    const res = await getCompanyStatisticsTrend(param);
    if (res.code == 0) {
      lineData2.value = {
        legend: ["攻击源数量"],
        category: res.data.timeList,
        values: [res.data.dataList],
      };
    }
  }

  // ==================== useCenter 相关方法 ====================
  //告警信息
  async function getAlarmInfoData() {
    if (useMockData) {
      const res = mockData.alarmInfo;
      if (res.code == 0) {
        warningList.value = groupByProvince(res.data);
        console.log(
          "🚀 ~ getAlarmInfoData ~ warningList.value:",
          warningList.value
        );
      }
      return;
    }

    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getAlarmInfo(data);
    if (res.code == 0) {
      warningList.value = groupByProvince(res.data);
      console.log(
        "🚀 ~ getAlarmInfoData ~ warningList.value:",
        warningList.value
      );
    }
  }

  // 数据格式转换
  function groupByProvince(data) {
    return data.reduce((acc, item) => {
      const province = item.province;
      if (!acc[province]) {
        acc[province] = [];
      }
      acc[province].push(item);
      return acc;
    }, {});
  }

  // 被攻击行业数量
  async function getIndustryCountData() {
    if (useMockData) {
      const res = mockData.industryCount;
      if (res.code == 0) {
        attackInfo.value.industry = res.data;
      }
      return;
    }

    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getIndustryCount(data);
    if (res.code == 0) {
      attackInfo.value.industry = res.data;
    }
  }

  // 地图数据
  async function getProvinceMapData() {
    if (useMockData) {
      const res = mockData.provinceMap;
      if (res.code == 0) {
        mapData.value.map = res.data.map((item) => ({
          name: ChinaNameMap[item.key] || item.key,
          value: Number(item.doc_count),
          warningList: warningList.value[item.key],
        }));
        attackInfo.value.province = res.data.length ? res.data.length : 0;
      }
      return;
    }

    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getProvinceMap(data);
    if (res.code == 0) {
      mapData.value.map = res.data.map((item) => ({
        name: ChinaNameMap[item.key],
        value: Number(item.doc_count),
        warningList: warningList.value[item.key],
      }));
      const valueList = res.data.map((item) => Number(item.doc_count));
      const max = Math.max(...valueList);
      let min = Math.min(...valueList);
      if (max == min && max !== 0) {
        min = 0;
      }
      mapOption.value.visualMap2 = {
        max,
        min,
        text: [max.toLocaleString(), min.toLocaleString()],
      };
      attackInfo.value.province = res.data.length ? res.data.length : 0;
    }
  }

  // 攻击IPtop5
  async function getAttackIPData() {
    if (useMockData) {
      const res = mockData.attackIP;
      if (res.code == 0) {
        attackData.value[0].list = res.data.attackIPList.map((item, i) => {
          return {
            label: item,
            value: Number(res.data.dataList[i]),
          };
        });
      }
      return;
    }

    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getAttackIP(data);
    if (res.code == 0) {
      attackData.value[0].list = res.data.attackIPList.map((item, i) => {
        return {
          label: item,
          value: Number(res.data.dataList[i]),
        };
      });
    }
  }

  //家族top5
  async function getFamilyTopData() {
    if (useMockData) {
      const res = mockData.familyTop;
      if (res.code == 0) {
        pieData.value[0].list = res.data.familyList.map((item, i) => {
          return {
            label: item,
            value: Number(res.data.dataList[i]),
          };
        });
      }
      return;
    }

    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getFamilyTop(data);
    if (res.code == 0) {
      pieData.value[0].list = res.data.familyList.map((item, i) => {
        return {
          label: item,
          value: Number(res.data.dataList[i]),
        };
      });
    }
  }

  // ==================== useRight 相关方法 ====================
  //被攻击行业TOP4
  async function getIndustryTop4Data() {
    if (useMockData) {
      const res = mockData.industryTop4;
      if (res.code == 0) {
        industryList.value = res.data.slice(0, 4).map((item, i) => {
          if (i < 3) {
            industryNameText.value += `${item.key}、`;
          }
          return {
            logo: require(`../imgs/industry/${item.key}.png`),
            name: item.key,
            value1:
              Number(item.companyCount) > 9999
                ? (Number(item.companyCount) / 10000).toFixed(1) + "万"
                : Number(item.companyCount).toLocaleString(),
            value2:
              Number(item.doc_count) > 9999
                ? (Number(item.doc_count) / 10000).toFixed(1) + "万"
                : Number(item.doc_count).toLocaleString(),
            rawValue1: Number(item.companyCount),
            rawValue2: Number(item.doc_count),
          };
        });
        industryNameText.value = industryNameText.value.slice(
          0,
          industryNameText.value.length - 1
        );
      }
      return;
    }

    const data = {
      attackCountry: attackCountry.value,
    };
    const res = await getIndustryTop4(data);
    if (res.code == 0) {
      industryList.value = res.data.map((item, i) => {
        if (i < 3) {
          industryNameText.value += `${item.key}、`;
        }
        try {
          return {
            logo: require(`../imgs/industry/${item.key}.png`),
            name: item.key,
            value1:
              Number(item.companyCount) > 9999
                ? (Number(item.companyCount) / 10000).toFixed(1) + "万"
                : Number(item.companyCount).toLocaleString(),
            value2:
              Number(item.doc_count) > 9999
                ? (Number(item.doc_count) / 10000).toFixed(1) + "万"
                : Number(item.doc_count).toLocaleString(),
            rawValue1: Number(item.companyCount),
            rawValue2: Number(item.doc_count),
          };
        } catch (e) {
          return {
            logo:
              i % 2 == 0
                ? require("../imgs/icon1.png")
                : require("../imgs/icon2.png"),
            name: item.key,
            value1:
              Number(item.companyCount) > 9999
                ? (Number(item.companyCount) / 10000).toFixed(1) + "万"
                : Number(item.companyCount).toLocaleString(),
            value2:
              Number(item.doc_count) > 9999
                ? (Number(item.doc_count) / 10000).toFixed(1) + "万"
                : Number(item.doc_count).toLocaleString(),
            rawValue1: Number(item.companyCount),
            rawValue2: Number(item.doc_count),
          };
        }
      });
      industryNameText.value = industryNameText.value.slice(
        0,
        industryNameText.value.length - 1
      );
    }
  }

  //被攻击企业排名
  async function getAttackedComapnyTopData() {
    if (useMockData) {
      const res = mockData.attackedComapnyTop;
      if (res.code == 0) {
        companyList.value = res.data
        .sort((a, b) => b.atdNum - a.atdNum)
        .map((item) => {
          return {
            ...item,
            atdNum: Number(item.atdNum) > 9999
                ? (Number(item.atdNum) / 10000).toFixed(1) + "万"
                : Number(item.atdNum).toLocaleString(),
          };
        });
      }
      return;
    }

    const data = {
      attackCountry: attackCountry.value,
    };
    const res = await getAttackedComapnyTop(data);
    if (res.code == 0) {
      companyList.value = res.data
        .sort((a, b) => b.atdNum - a.atdNum)
        // .map((item) => {
        //   return {
        //     logo: require("../imgs/logo1.png"),
        //     name: item.companyName,
        //     value1:
        //       Number(item.atdNum) > 9999
        //         ? (Number(item.atdNum) / 10000).toFixed(1) + "万"
        //         : Number(item.atdNum).toLocaleString(),
        //     value2:
        //       Number(item.ipNum) > 9999
        //         ? (Number(item.ipNum) / 10000).toFixed(1) + "万"
        //         : Number(item.ipNum).toLocaleString(),
        //     tags: item.eventTab,
        //   };
        // });
    }
  }

  let attackCountry = ref(props.attackCountry);

  watch(
    () => props.attackCountry,
    async (val) => {
      attackCountry.value = val;

      // useLeft 数据获取
      getAtdStatisticsData();
      getCompanyStatisticsData();
      getSeverityData();
      getAtdStatisticsTrendData();
      getCompanyStatisticsTrendData();

      // useCenter 数据获取
      attackInfo.value.country = val;
      attackInfo.value.brief = setNationalFlag(val);
      await getAlarmInfoData();
      getIndustryCountData();
      getProvinceMapData();
      getAttackIPData();
      getFamilyTopData();

      // useRight 数据获取
      getIndustryTop4Data();
      getAttackedComapnyTopData();
    },
    { immediate: true }
  );

  return {
    // useLeft 返回
    totalList,
    lineOpts,
    lineData1,
    lineData2,
    data,
    option,
    // useCenter 返回
    attackInfo,
    overviewText,
    mapData,
    mapOption,
    attackData,
    pieData,
    // useRight 返回
    industryNameText,
    industryList,
    companyList,
    timeBarData
  };
}
