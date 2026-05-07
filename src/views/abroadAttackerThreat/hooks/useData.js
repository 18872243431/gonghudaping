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
  attackPeriod,
  attackCountryPercentFun
} from "@/api/abroadAttackerThreat";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import { getNationalPng } from "@/libs/country";
import { numberFormat } from "@/libs/util";

function setNationalFlag(str) {
  const flag = getNationalPng(str);
  if (flag) {
    return require(`/public/countryFlag/${flag}.png`);
  }
  return "";
}

export function useDataFun(props) {
   const timeBarData = ref([
    //  { label: '00:00', value: 1 },
    //   { label: '01:00', value: 1 },
    //   { label: '02:00', value: 17 },
    //   { label: '03:00', value: 23 },
    //   { label: '04:00', value: 27 },
    //   { label: '05:00', value: 19 },
    //   { label: '06:00', value: 11 },
    //   { label: '07:00', value: 2 },
    //   { label: '08:00', value: 1 },
    //   { label: '09:00', value: 1 },
    //   { label: '10:00', value: 1 },
    //   { label: '11:00', value: 2 },
    //   { label: '12:00', value: 6 },
    //   { label: '13:00', value: 7 },
    //   { label: '14:00', value: 6 },
    //   { label: '15:00', value: 7 },
    //   { label: '16:00', value: 3 },
    //   { label: '17:00', value: 7 },
    //   { label: '18:00', value: 1 },
    //   { label: '19:00', value: 1 },
    //   { label: '20:00', value: 3 },
    //   { label: '21:00', value: 1 },
    //   { label: '22:00', value: 1 },
    //   { label: '23:00', value: 3 },
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
      // "1月",
      // "2月",
      // "3月",
      // "4月",
      // "5月",
      // "6月",
      // "7月",
      // "8月",
      // "9月",
      // "10月",
      // "11月",
      // "12月",
    ],
    values: [
      [
        // 10, 20, 30, 42, 21, 50, 60, 70, 80, 90, 100, 110
      ], // 替换为你实际的数据
    ],
  });

  const lineData2 = ref({
    legend: ["攻击源数量变化趋势"],
    category: [
      // "1月",
      // "2月",
      // "3月",
      // "4月",
      // "5月",
      // "6月",
      // "7月",
      // "8月",
      // "9月",
      // "10月",
      // "11月",
      // "12月",
    ],
    values: [
      [
        // 100, 230, 130, 142, 221, 150, 260, 170, 180, 190, 130, 160
      ], // 替换为你实际的数据
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
        value: 0,
        num: 0,
        key: "high",
      },
    ],
    [
      {
        name: "中危",
        value: 0,
        num: 0,
        key: "middle",
      },
    ],
    [
      {
        name: "低危",
        value: 0,
        num: 0,
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
    attackCountryCount: 12365,
    attackCountryPercent: 0.2568,
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
      list: [
        // {label: '', value: ''}
      ],
    },
  ]);

  const attackData = ref([
    {
      name: "远控端活跃情况排名",
      list: [
        // {label: '美国', value: 282},
        // {label: '中国', value: 231},
        // {label: '荷兰', value: 185},
        // {label: '俄罗斯', value: 130},
        // {label: '乌克兰', value: 98},
      ],
    },
  ]);

  const warningList = ref({});

  // ==================== useRight 相关变量 ====================
  const industryNameText = ref("");
  const industryList = ref([
    // {
    //   name: "医药制造业",
    //   value1: 1234,
    //   value2: 234,
    // },
    // {
    //   name: "通用设备制造业",
    //   value1: 1234,
    //   value2: 234,
    // },
    // {
    //   name: "专用设备制造业",
    //   value1: 1234,
    //   value2: 234,
    // },
    // {
    //   name: "食品制造业",
    //   value1: 1234,
    //   value2: 234,
    // },
  ]);

  const companyList = ref([
    // {
    //   logo: require("../imgs/logo1.png"),
    //   name: "中芯国际集成电路制造有限公司",
    //   value1: 1234,
    //   value2: 234,
    //   tags: ["暴力破解", "漏洞利用", "弱口令"],
    // },
    // {
    //   logo: require("../imgs/logo2.png"),
    //   name: "比亚迪股份有限公司",
    //   value1: 1234,
    //   value2: 234,
    //   tags: ["暴力破解", "漏洞利用", "弱口令"],
    // },
    // {
    //   logo: require("../imgs/logo3.png"),
    //   name: "中国兵器工业集团有限公司",
    //   value1: 1234,
    //   value2: 234,
    //   tags: ["暴力破解", "漏洞利用", "弱口令"],
    // },
    // {
    //   logo: require("../imgs/logo4.png"),
    //   name: "美的集团股份有限公司",
    //   value1: 1234,
    //   value2: 234,
    //   tags: ["暴力破解", "漏洞利用", "弱口令"],
    // },
    // {
    //   logo: require("../imgs/logo3.png"),
    //   name: "中国兵器工业集团有限公司",
    //   value1: 1234,
    //   value2: 234,
    //   tags: ["暴力破解", "漏洞利用", "弱口令"],
    // },
    // {
    //   logo: require("../imgs/logo4.png"),
    //   name: "美的集团股份有限公司",
    //   value1: 1234,
    //   value2: 234,
    //   tags: ["暴力破解", "漏洞利用", "弱口令"],
    // },
  ]);

  // ==================== useLeft 相关方法 ====================
  //网络攻击总数
  async function getAtdStatisticsData() {
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
//新加的柱状图
   async function getAttackPeriodData() {
    const res = await attackPeriod();
    if (res.code == 0) {
      timeBarData.value = res.data.map((item) => ({
        label: item.hr,
        value: item.total,
      }));
    }
  }

  async function getAttackCountryPercentData() {
    const param = {
      attackCountry: attackCountry.value,
    };
    const res = await attackCountryPercentFun(param);
    if (res.code == 0) {
      attackInfo.value.attackCountryCount = res.data.attackCountryCount;
      attackInfo.value.attackCountryPercent =(res.data.attackCountryPercent * 100).toFixed(2) + '%'
    }
  }

  // ==================== useCenter 相关方法 ====================
  //告警信息
  async function getAlarmInfoData() {
    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getAlarmInfo(data);
    if (res.code == 0) {
      warningList.value = groupByProvince(res.data);
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
      // const valueList = res.data.map((item) => Number(item.doc_count));
      // const max = Math.max(...valueList);
      // let min = Math.min(...valueList);
      // if (max == min && max !== 0) {
      //   min = 0;
      // }
      attackInfo.value.province = res.data.length ? res.data.length : 0;
    }
  }

  // 攻击IPtop5
  async function getAttackIPData() {
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
    const data = {
      attackCountry: attackInfo.value.country,
    };
    const res = await getFamilyTop(data);
    if (res.code == 0) {
      // pieData.value = res.data.familyList.map((item, i) => {
      //   return {
      //     name: item,
      //     value: Number(res.data.dataList[i]),
      //   }
      // })

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
    const data = {
      attackCountry: attackCountry.value,
    };
    const res = await getIndustryTop4(data);
    // const res = {
    //   msg: "success",
    //   code: 0,
    //   data: [
    //     {
    //       key: "非金属矿物制品业",
    //       doc_count: 177115,
    //       companyCount: 280,
    //     },
    //     {
    //       key: "医药制造业",
    //       doc_count: 124543,
    //       companyCount: 152,
    //     },
    //     {
    //       key: "酒、饮料和精制茶制造业",
    //       doc_count: 68260,
    //       companyCount: 78,
    //     },
    //     {
    //       key: "计算机、通信和其他电子设备制造业",
    //       doc_count: 66247,
    //       companyCount: 149,
    //     },
    //   ],
    // };
    if (res.code == 0) {
      industryList.value = res.data.map((item, i) => {
        if (i < 3) {
          industryNameText.value += `${item.key}、`;
        }
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
        };
      });
      industryNameText.value = industryNameText.value.slice(
        0,
        industryNameText.value.length - 1
      );
    }
  }

  //被攻击企业排名
  async function getAttackedComapnyTopData() {
    const data = {
      attackCountry: attackCountry.value,
    };
    const res = await getAttackedComapnyTop(data);
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
  }

  let attackCountry = ref(props.attackCountry);

  watch(
    () => props.attackCountry,
    (val) => {
      attackCountry.value = val;

      // useLeft 数据获取
      getAtdStatisticsData();
      getCompanyStatisticsData();
      getSeverityData();
      getAtdStatisticsTrendData();
      getCompanyStatisticsTrendData();
      getAttackPeriodData();
      getAttackCountryPercentData();
      
      // useCenter 数据获取
      attackInfo.value.country = val;
      attackInfo.value.brief = setNationalFlag(val);
      getAlarmInfoData();
      // getIndustryCountData();
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
