<template>
  <div class="aerospace">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <PageSelect :title="keyWord" :introduction="introduction"></PageSelect>
      <div class="left1">
        <div class="overflow-container1">
          <div
            class="overflow-item"
            v-for="(item, i) in totalOneList1"
            :key="i"
            v-show="!(keyWord.includes('新能源汽车') && i === 1)"
          >
            <div class="item-icon"></div>
            <div class="item-info">
              <div class="name">
                {{ item.name }}
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="top"
                  v-if="i === 2"
                >
                  <template #content>
                    <div style="width: 180px">
                      网络安全风险指数体系由暴露面指数（20%）、外部威胁指数（30%）及失陷指标指数（50%）三个核心维度加权构成。通过对各维度下的细化指标进行量化评分，最终构成0-100分的综合风险值，并据此划分为高、中、低三个风险等级，综合评估重点产业链的网络安全状况。
                    </div>
                  </template>
                  <el-icon
                    style="
                      color: #fff;
                      margin-left: -4px;
                      font-size: var(--font-label);
                    "
                    ><QuestionFilled
                  /></el-icon>
                </el-tooltip>
              </div>
              <div>
                <el-popover
                  placement="bottom"
                  :width="i === 0 ? 1400 : 600"
                  trigger="hover"
                  v-if="i === 0"
                >
                  <template #reference
                    ><span class="value" @mouseover="showPopover(i)">{{
                      formatNumber(item.value)
                    }}</span></template
                  >
                  <div
                    style="
                      height: 290px;
                      padding: 10px;
                      backdrop-filter: blur(10px);
                    "
                    v-if="i === 4"
                  >
                    <act-table
                      :showSeq="true"
                      :columns="[{ label: '企业名称', prop: 'key' }]"
                      :tableData="importCompanyList"
                      :needScroll="false"
                    >
                      <template #key="{ row }">
                        <div
                          class="company-name"
                          :title="row.key"
                          style="
                            cursor: pointer;
                            font-size: 18px;
                            text-decoration: underline;
                          "
                          @click="goto(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template>
                    </act-table>
                  </div>
                  <div
                    style="padding: 20px; backdrop-filter: blur(10px)"
                    v-if="i === 0"
                  >
                    <div class="search-item">
                      <span>企业名称：</span>
                      <el-input
                        class="custom-search-input"
                        style="width: 312px; margin-bottom: 10px"
                        placeholder="企业名称"
                        v-model="searchCompanyName"
                      ></el-input>
                      <div
                        class="custom-search-button"
                        @click="getIntegratedCompanyListData(1)"
                      >
                        查询
                      </div>
                    </div>
                    <act-table
                      :showSeq="false"
                      :columns="[
                        { label: '企业名称', prop: 'companyname', width: 500 },
                        { label: '注册省份', prop: 'registProvince' },
                        {
                          label: '行业小类',
                          prop: 'subIndustryName',
                          width: 400,
                        },
                        { label: '注册资金', prop: 'registMoney' },
                      ]"
                      :tableData="integratedCompanyList"
                      :needScroll="false"
                      style="height: 250px"
                    >
                      <template #companyname="{ row }">
                        <div
                          class="company-name"
                          :title="row.companyname"
                          style="
                            cursor: pointer;
                            font-size: 18px;
                            text-decoration: underline;
                          "
                          @click="goto(row.companyname)"
                        >
                          {{ row.companyname }}
                        </div>
                      </template>
                    </act-table>
                    <el-pagination
                      layout="prev, pager, next"
                      :total="total"
                      :current-page="currentPage"
                      style="text-align: right; margin-top: 10px"
                      @current-change="getIntegratedCompanyListData"
                    />
                  </div>
                  <div
                    style="
                      height: 290px;
                      padding: 20px;
                      backdrop-filter: blur(10px);
                    "
                    v-if="i === 5"
                  >
                    <act-table
                      :showSeq="true"
                      :columns="[
                        { label: '企业名称', prop: 'key' },
                        { label: '被攻击次数', prop: 'doc_count', width: 120 },
                      ]"
                      :tableData="riskCompanyList"
                      :needScroll="false"
                    >
                      <template #key="{ row }">
                        <div
                          class="company-name"
                          :title="row.key"
                          style="
                            cursor: pointer;
                            font-size: 18px;
                            text-decoration: underline;
                          "
                          @click="goto(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template>
                    </act-table>
                  </div>
                </el-popover>
                <span class="value" v-else>{{ formatNumber(item.value) }}</span>
                <span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="left2">
        <chart-box title="产业链图谱">
          <template v-slot:chart>
            <div style="text-align: center; height: 300px">
              <img
                src="./imgs/flow2.png"
                v-if="keyWord.includes('新能源')"
                style="width: 100%; height: 462px"
                alt=""
                srcset=""
              />
              <img
                v-else-if="keyWord.includes('集成电路')"
                src="./imgs/flow32.png"
                style="width: 100%; height: 462px"
                alt=""
                srcset=""
              />
              <img
                v-else
                src="./imgs/flow.png"
                style="width: 100%; height: 462px"
                alt=""
                srcset=""
              />
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="center-top">
        <chart-box title="网络攻击分布情况">
          <template v-slot:chart>
            <div class="total-container">
                <div
                  class="total-card"
                  v-for="(item, i) in totalOneList2"
                  :key="i"
                >
                  <total-one :data="item"></total-one>
                </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="center-content swapped">
        <chart-box title="被攻击企业区域分布" class="map-chart-box">
          <template v-slot:chart>
            <div class="map-container">
              <ChinaMap
                :baseOption="baseOption"
                :data="mapData"
               :option="{
                    ...mapOption,
                    visualMap2: {
                      ...mapOption.visualMap2,
                      left: 0,   /* 控制右侧图例的左右位置：需跟随左侧图例同步增加 */
                      top: 500,/* 控制右侧图例的上下位置：需跟随左侧图例同步调整 */
                    },
                  }"
                :showClipDefs="true"
                :style="{ height: '100%', transform: 'scaleX(1.0) scaleY(1.0)', top: '0px', left: '0px' }"
                name1="遭受攻击企业数"
              ></ChinaMap>
            </div>
            <div class="industry-overview-sidebar">
              <div class="panel-header">
                <div class="chartTitle">产业链环节受攻击占比</div>
              </div>
              <div class="dashboard-panel-right">
                <div class="data-container">
                  <div
                    class="data-card"
                    v-for="(item, i) in industryOverviewList"
                    :key="i"
                    :class="getCardClass(i, industryOverviewList.length)"
                  >
                    <div class="card-header">
                      <div class="target-info">
                        <span class="target-name">{{ splitName(item.name).main }}</span>
                        <span class="target-desc">{{ splitName(item.name).sub }}</span>
                      </div>
                      <div class="target-value">{{ item.value }}<span class="target-unit">%</span></div>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" :style="`width: ${item.value}%`"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <div class="l">
          <chart-box title="网络攻击类型排名" :showLine="false">
            <template v-slot:chart>
              <ul class="battery-bar system-scrollbar">
                <li
                  class="item"
                  v-for="(item, i) in batteryList"
                  :key="item.name"
                >
                  <div class="bar-box">
                    <div class="bg"></div>
                    <div class="battery-chart-box">
                      <battery-rank-bar2
                        :data="item"
                        :serial="i + 1"
                        :max="batteryList[0].value"
                        unit="次"
                      ></battery-rank-bar2>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
          </chart-box>
        </div>
        <div class="r">
            <chart-box title="网络攻击变化趋势"  :showLine="false">
              <template v-slot:chart>
                <LineArea :data="lineData" :option="{
                  grid: { left: 20,
                    right: 20,
                    top: 30,
                    bottom: 5,
                    containLabel: true
                  }
                }"></LineArea>
              </template>
            </chart-box>
        </div>
      </div>
      <div class="right2">
        <chart-box title="被攻击企业排名">
          <template v-slot:chart>
            <CustomRankingList
              :listData="sortedCompanyList"
              nameKey="attackedCorpname"
              valueKey="attackedTotal"
            />
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageSelect from "@c/PageSelect";
import { useDataFun } from "./hooks/useData";
import TotalOne from "@c/ActTotal/one.vue";
import chartBox from "@c/chartBox";
import BatteryRankBar2 from "@c/echarts/bar/BatteryRankBar2";
import LineArea from "@c/echarts/Line/lineArea";
import ActTable from "@c/ActTable";
// import ChinaMap from "@/components/echarts/map/China/index";
import ChinaMap from "@/components/echarts/map/ImgChina/index.vue";
import ActTabs from "@c/ActTabs";
import CustomRankingList from "@/components/CustomRankingList/index.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, watch } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";

const router = useRouter();
function formatNumber(num) {
  if (num == null || num === "") return "";
  num = Number(num);
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return num.toLocaleString();
}

const baseOption = {
   roam: false,
    zoom: 1.5,
    top: 180,
      aspectScale: 1,
    center: [107.97, 29.71],
}

const store = useStore();
const keyWord = computed(() => {
  return store.state.page.keyWord;
  // return "低空经济";  新能源汽车  集成电路
});
const {
  totalOneList1,
  totalOneList2,
  totalTwoList,
  introduction,
  total,
  getIntegratedCompanyListData,
  searchCompanyName,
  currentPage,
  integratedCompanyList,
  riskCompanyList,
  showPopover,
  importCompanyList,
  overviewText,
  batteryList,
  riskList,
  lineData,
  pieData,
  columns1,
  ipList,
  mapData,
  columns2,
  companyList,
  mapOption,
  attackedList,
  attackedData,
  tabsList,
  activeTab,
  changeTab,
  industryOverviewList,
} = useDataFun(keyWord);

const splitName = (name) => {
  const parts = name.split(/（|\(/);
  if (parts.length > 1) {
    return {
      main: parts[0],
      sub: parts[1].replace(/）|\)/g, '')
    }
  }
  return { main: name, sub: '' }
};

const getCardClass = (index, total) => {
  if (total === 3) {
    if (index === 1) return 'card-highlight';
    if (index === 2) return 'card-dark';
  } else if (total === 2) {
    if (index === 1) return 'card-dark';
  }
  return '';
};

const sortedCompanyList = computed(() => {
  return [...companyList.value].sort((a, b) => b.attackedTotal - a.attackedTotal);
});

watch(
  keyWord,
  (val) => {
    if (val === "集成电路") {
      totalOneList1.value[0].name = "车联网企业数量";
      totalOneList1.value[1].name = "车联网平台数量";
      industryOverviewList.value = [
        {
          name: "上游（半导体材料及设备）",
          value: 29.2,
          color: "#3fc3ff",
        },
        {
          name: "中游（集成电路设计、制造及封测）",
          value: 65.7,
          color: "#00dca1",
        },
        {
          name: "下游（集成电路应用领域）",
          value: 5.1,
          color: "#ffbd43",
        },
      ]
    } else if (val === "新能源汽车") {
      totalOneList1.value[0].name = "新能源汽车企业数量";
      totalOneList1.value[1].name = "充电桩企业数量";
      industryOverviewList.value = [
        {
          name: "上游（原材料及零部件）",
          value: 27.3,
          color: "#3fc3ff",
        },
        {
          name: "中游（新能源汽车制造）",
          value: 64.3,
          color: "#00dca1",
        },
        {
          name: "下游（汽车后市场服务）",
          value: 8.4,
          color: "#ffbd43",
        },
      ]
    } else {
      totalOneList1.value[0].name = "重点企业数量";
      totalOneList1.value[1].name = "监测企业数量";
      industryOverviewList.value = [
        {
          name: "上游（低空装备产业）",
          value: 82.9,
          color: "#3fc3ff",
        },
        {
          name: "下游（低空基础设施产业）",
          value: 17.1,
          color: "#ffbd43",
        },
      ]
    }
  },
  {
    immediate: true,
  }
);

function goto(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}&sourceType=2&uploadLabel=${keyWord.value}`);
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

:deep() {
  .custom-search-input .el-input__inner {
    border-radius: 20px;
    border: 2px solid #3fc3ff;
    height: 38px;
    color: #184077;
    font-size: var(--font-number-sm);
    background: linear-gradient(90deg, #eaf6ff 0%, #d6eaff 100%);
    box-shadow: none;
    padding: 0 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    font-family: var(--font-family-body);
  }
  .custom-search-input .el-input__inner:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    background: linear-gradient(90deg, #f5fbff 0%, #e3f2ff 100%);
  }
  .custom-search-input .el-input__inner::placeholder {
    color: #c0c9d8;
    font-size: var(--font-body);
    letter-spacing: 1px;
    font-family: var(--font-family-body);
  }
}

.custom-search-button {
  display: inline-block;
  margin-left: 12px;
  border-radius: 20px;
  background: linear-gradient(90deg, #3fc3ff 0%, #409eff 100%);
  color: #fff;
  font-size: var(--font-label);
  height: 38px;
  line-height: 38px;
  padding: 0 32px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
  user-select: none;
  border: none;
}
.custom-search-button:hover {
  background: linear-gradient(90deg, #409eff 0%, #3fc3ff 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.18);
}

.search-item > span {
  color: #fff;
  font-size: var(--font-label);
  font-weight: 500;
  margin-right: 10px;
  vertical-align: middle;
  line-height: 38px;
  font-family: var(--font-family-body);
}
</style>
