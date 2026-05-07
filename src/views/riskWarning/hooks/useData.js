import { ref, onMounted } from "vue";
import {
  getItem1,
  getOverview,
  getEventType,
  getIndustryRank,
  getProvinceRank,
  getDisposal,
} from "@/api/riskWarning";

export function useData() {
  const pyramidData = ref([]);
  const overviewData = ref({
    totalNum: 0,
    noticeEnterpriseNum: 0,
    disposalNum: 0,
    ratio: 0,
  });
  const pieData = ref([]);

  const columns = ref([
    { label: "行业名称", prop: "label" },
    { label: "通报次数", prop: "reportCount" },
    { label: "涉及企业数", prop: "enterpriseNum" },
  ]);

  const tableData = ref([]);

  const barLineData = ref([
    {
      name: "通报",
      list: [],
    },
    {
      name: "处置",
      list: [],
    },
    {
      name: "处置率",
      list: [],
    },
  ]);

  const cubeData = ref([
    {
      name: "告警次数",
      list: [
        { label: "处置前", value: 0 },
        { label: "处置后", value: 0 },
      ],
    },
  ]);
  const disposalRatio = ref(0);
  const enterpriseNum = ref(0);

  async function getPyramidData() {
    const res = await getItem1();
    if (res.code == 0) {
      const data = res.data;
      pyramidData.value = [
        { name: "安全告警数据", value: data.actualNum },
        { name: "数据归并降噪", value: data.cleanNum },
        { name: "数据标准化", value: data.standardNum },
        { name: "原始数据接入", value: data.originalNum },
      ];
    }
  }

  async function getOverviewData() {
    const res = await getOverview();
    if (res.code == 0) {
      overviewData.value = res.data;
    }
  }

  async function getEventTypeData() {
    const res = await getEventType();
    if (res.code == 0) {
      pieData.value = res.data.map((item) => ({
        name: item.label,
        value: item.value,
      }));
    }
  }

  async function getIndustryRankData() {
    const res = await getIndustryRank();
    if (res.code == 0) {
      tableData.value = res.data;
    }
  }

  async function getProvinceRankData() {
    const res = await getProvinceRank();
    if (res.code == 0) {
      const data = res.data;
      barLineData.value[0].list = data.reportNum.map((item, i) => ({
        label: data.label[i],
        value: item,
      }));

      barLineData.value[1].list = data.disposalNum.map((item, i) => ({
        label: data.label[i],
        value: item,
      }));

      barLineData.value[2].list = data.ratioNum.map((item, i) => ({
        label: data.label[i],
        value: item,
      }));
    }
  }

  async function getDisposalData() {
    const res = await getDisposal();
    if (res.code == 0) {
      const data = res.data;
      cubeData.value[0].list[0].value = data.disposalBeforeNum;
      cubeData.value[0].list[1].value = data.disposalAfterNum;
      disposalRatio.value = data.disposalRatio;
      enterpriseNum.value = data.enterpriseNum;
    }
  }

  onMounted(() => {
    getPyramidData();
    getOverviewData();
    getEventTypeData();
    getIndustryRankData();
    getProvinceRankData();
    getDisposalData();
  });

  return {
    pyramidData,
    overviewData,
    pieData,
    columns,
    tableData,
    barLineData,
    cubeData,
    disposalRatio,
    enterpriseNum,
  };
}
