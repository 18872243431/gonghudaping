import { ref, onMounted } from "vue";
import dataJson from "./data.json";
import {
  getTopAll,
  getIndustry,
  getTrend,
  getCase
} from "@/api/riskWarning2";
export function useData() {
  const pieData = ref([]);

  const lineData = ref({
    legend: ["通报数", "处置数", "验证数"],
    category: [],
    values: [
      // [10, 20, 30, 42, 21],
      // [13, 27, 23, 33, 16],
      // [15, 24, 21, 51, 19],
    ],
})

  const riskCompanyList = ref([
    // {
    //       "riskLevel": "高危",
    //       "riskType": "未授权访问漏洞",
    //       "time": "2025-12-24 12:53:59",
    //       "title": "AXX车联网服务平台XX车联网服务平台",
    //       "disposal": "处置中",
    //       disposalNum:0,
    //       level:1,
    //   },
    //   {
    //       "riskLevel": "中危",
    //       "riskType": "未授权访问漏洞",
    //       "time": "2025-12-24 12:53:58",
    //       level:2,
    //       "title": "B",
    //       "disposal": "已完成",
    //        disposalNum:1,
    //   },
    //   {
    //       "riskLevel": "低危",
    //       "riskType": "未授权访问漏洞",
    //       "time": "2025-12-24 12:53:57",
    //       "title": "C",
    //       "disposal": "处置中",
    //        disposalNum:0,
    //       level: 3
    //   },
    //   {
    //       "riskLevel": "高危",
    //       "riskType": "未授权访问漏洞",
    //       "time": "2025-12-24 12:53:56",
    //       "title": "D",
    //       "disposal": "已完成",
    //        disposalNum:1,
    //       level: 1
    //   },
    //   {
    //       "riskLevel": "中危",
    //       "riskType": "未授权访问漏洞",
    //       "time": "2025-12-24 12:53:55",
    //       "title": "E",
    //       "disposal": "处置中",
    //        disposalNum:0,
    //       level: 2
    //   },
    //   {
    //       "riskLevel": "低危",
    //       "riskType": "未授权访问漏洞",
    //       "time": "2025-12-24 12:53:54",
    //       "title": "F",
    //       "disposal": "已完成",
    //        disposalNum:1,
    //       level: 3
    //   }
  ]);

  const infoList = ref([
    // { name: "监测风险数", value: 24580 },
    // { name: "研判事件数", value: 8920 },
    // { name: "通报企业数", value: 1240 },
    // { name: "处置完成数", value: 1089 },
    // { name: "验证通过数", value: 1012 },
  ])


async function getInfoListData() {
    // const res = await getTopAll();
    const res = dataJson.item1;
    if (res.code == 0) {
      const data = res.data;
      infoList.value = [
        { name: "监测风险数", value: data.monitorRiskNum },
        { name: "研判事件数", value: data.judgeEventNum },
        { name: "通报企业数", value: data.noticeEnterpriseNum },
        { name: "处置完成数", value: data.disposalNum },
        { name: "验证通过数", value: data.checkNum },
      ];
    }
  }

  async function getPieData() {
    // const res = await getIndustry();
     const res = dataJson.industry;
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.label,
        value: item.reportCount,
        hideInLegend: item.label === '其他行业'
      }));
    }
  }
  
   async function getCaseData() {
    //  const res = await getCase()
    const res = dataJson.caseInfo;
    if (res.code == 0) {
      riskCompanyList.value = res.data.map(item=>{
      const level = { 低危:1, 中危: 2, 高危: 3 }[item.riskLevel];
      const disposalNum = { 处置中:0, 已完成: 1}[item.disposal];
        return {
            ...item,
          level,
          disposalNum
        }
      })
    }
  }

   async  function getLineData() {
      // const res = await getTrend()
    const res = dataJson.lineAreaData;
    if (res.code == 0) {
     lineData.value.category = res.data.time;
     lineData.value.values[0] = res.data.reportNum;
     lineData.value.values[1] = res.data.disposalNum;
     lineData.value.values[2] = res.data.checkNum;
    }
  }


  onMounted(() => {
    getInfoListData();
    getPieData();
    getCaseData();
    getLineData();
  });

  return {
    pieData,
    infoList,
    riskCompanyList,
    lineData
  };
}
