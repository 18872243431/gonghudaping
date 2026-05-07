<template>
  <div class="aerospace">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-35px"
      style="transform: scale(0.8) translateX(30px)"
    ></ActTabs>
    <div class="left">
      <PageSelect :title="keyWord" :introduction="introduction" :showDropdown="false"></PageSelect>
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
              <div class="name">{{ item.name }}</div>
              <div>
                <el-popover
                  placement="bottom"
                  :width="i === 0 ? 1200 : 600"
                  trigger="hover"
                  v-if="i === 0"
                >
                  <template #reference>
                    <span class="value" @mouseover="showPopover(i)">{{
                      item.value
                    }}</span>
                  </template>
                  <div
                    style="
                      height: 290px;
                      padding: 20px;
                      backdrop-filter: blur(10px);
                    "
                    v-if="i === 4"
                  >
                    <act-table
                      class="table16"
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
                            font-size: 16px;
                            text-decoration: underline;
                          "
                          @click="goto(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template></act-table
                    >
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
                      class="table16"
                      :columns="[
                        { label: '企业名称', prop: 'companyname', width: 450 },
                        { label: '注册省份', prop: 'registProvince' },
                        {
                          label: '行业小类',
                          prop: 'subIndustryName',
                          width: 350,
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
                            font-size: 16px;
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
                      class="table16"
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
                            font-size: 16px;
                            text-decoration: underline;
                          "
                          @click="goto(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template></act-table
                    >
                  </div>
                </el-popover>
                <span class="value" v-else>{{ item.value }}</span>
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
      <div class="tips">
        <span class="label">总体安全态势</span>
        <p class="content">
          {{ overviewText }}
        </p>
      </div>
      <div class="center-content">
        <div class="top">
          <chart-box title="网络攻击分布情况">
            <template v-slot:chart>
              <div class="total-container">
                <div class="total-box">
                  <div class="total-box-t">
                    <div
                      class="total-card"
                      v-for="(item, i) in totalOneList2"
                      :key="i"
                    >
                      <total-one :data="item"></total-one>
                    </div>
                  </div>
                  <div class="total-box-b">
                    <div
                      class="total-card"
                      v-for="(item2, ind2) in totalTwoList"
                      :key="ind2"
                    >
                      <total-two :data="item2"></total-two>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </chart-box>
        </div>
        <div class="bottom">
          <div class="l">
            <chart-box title="网络攻击类型排名">
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
                        ></battery-rank-bar2>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="risk-list" v-if="false">
                  <div
                    class="risk-item"
                    v-for="(item, i) in riskList"
                    :key="item.name"
                  >
                    <div class="info">
                      <div class="name">
                        <span class="label" :class="`label${i + 1}`">{{
                          item.name
                        }}</span>
                        <span class="value">{{ item.value }}</span>
                      </div>
                      <div class="tags">
                        <div
                          class="tag"
                          :class="`tag${i + 1}`"
                          v-for="tag in item.tags"
                          :ke="tag"
                        >
                          {{ tag }}
                        </div>
                      </div>
                    </div>
                    <div class="chart">
                      <Gauge
                        :option="{
                          gaugeRadius: '80%',
                          progressWidth: 16,
                          axisTickLength: 6,
                          axisTickWidth: 1,
                          axisTickDistance: -22,
                          innerLineRadius: ['51%', '52%'],
                          innerCircleRadius: '48%',
                          ringRadius: 0.9,
                          ringShapeRadius: 3,
                          fontSize: 18,
                          fontColor: '#fff',
                        }"
                        :data="item.rate"
                        :color="item.color"
                      ></Gauge>
                    </div>
                  </div>
                </div>
              </template>
            </chart-box>
          </div>
          <div class="r">
            <div class="t">
              <chart-box title="网络攻击变化趋势">
                <template v-slot:chart>
                  <LineArea :data="lineData"></LineArea>
                </template>
              </chart-box>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="被攻击企业区域分布">
          <template v-slot:chart>
            <div class="map-container">
              <ChinaMap
                :baseOption="{ zoom: 0.96, top: 60 }"
                :data="mapData"
                :option="{
                  ...mapOption,
                  visualMap2: {
                    ...mapOption.visualMap2,
                    left: 100,
                    bottom: 290,
                  },
                }"
                name="遭受攻击企业数"
              ></ChinaMap>
            </div>
          </template>
        </chart-box>
        <div class="attack-list">
          <el-carousel height="180px" indicator-position="none">
            <el-carousel-item v-for="(item, i) in attackedList" :key="i">
              <div class="attack-item">
                <p class="time">{{ item.timestamp }}</p>
                <div class="content">
                  <div class="l">
                    <p class="attack">【{{ item.attackIp }}】</p>
                    <p class="attack">
                      <span v-flag>{{ item.attackCountry }}</span>
                      <span> - {{ item.name }}</span>
                    </p>
                    <span class="type">{{ item.eventTypeIdCn }}</span>
                  </div>
                  <div class="r">
                    <p class="attacked">{{ item.attackedcorpname }}</p>
                    <p class="info">
                      监测发现{{ item.attackedIp }}遭受来自{{
                        item.attackIp
                      }}的{{ item.eventTypeIdCn }}攻击。
                    </p>
                  </div>
                  <div class="attack-arrow"></div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="bar-container" v-if="false">
          <chart-box title="被攻击省份分布" :showLine="false">
            <template v-slot:chart>
              <RankBar :data="attackedData"></RankBar>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right2">
        <chart-box title="被攻击企业排名">
          <template v-slot:chart>
            <act-table
              :showSeq="true"
              :columns="columns2"
              :tableData="companyList"
              :needScroll="true"
              :seqWidth="50"
              class="table16"
            >
              <template #attackedCorpname="{ row }">
                <span
                  style="text-decoration: underline"
                  @click="goto(row.attackedCorpname)"
                  >{{ row.attackedCorpname }}</span
                >
              </template>
              <template #attackedTotal="{ row }">
                {{ formatNumber(row.attackedTotal) }}
              </template>
              <template #attackedIpTotal="{ row }">
                {{ formatNumber(row.attackedIpTotal) }}
              </template>
              <template #attackTypeList="{ row }">
                <div class="tags">
                  <span
                    class="tag"
                    v-for="(tag, i) in row.attackTypeList.slice(0, 2)"
                    :key="i"
                    :title="tag"
                    >{{ tag }}</span
                  >
                </div>
              </template>
            </act-table>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageSelect from "@c/PageSelect/index16.vue";
import { useDataFun } from "./hooks/useData";
import TotalOne from "@c/ActTotal/one.vue";
import TotalTwo from "@c/ActTotal/two1.vue";
import chartBox from "@c/chartBox";
import BatteryRankBar2 from "@c/echarts/bar/BatteryRankBar2";
import Gauge from "@c/echarts/gauge";
import LineArea from "@c/echarts/Line/lineArea16";
import Pie from "@c/echarts/Pie/NewPie16";
import ActTable from "@c/ActTable";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import ChinaMap from "@/components/echarts/map/China16/index";
import ActTabs from "@c/ActTabs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, watch } from "vue";

const router = useRouter();
const store = useStore();
const keyWord = computed(() => {
  return store.state.page.keyWord;
  // return "车联网企业";
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
  pieOption,
  mapData,
  companyList,
  mapOption,
  attackedList,
  attackedData,
  tabsList,
  activeTab,
  changeTab,
  industryOverviewList,
} = useDataFun(keyWord);

const columns2 = [
  { label: "企业名称", prop: "attackedCorpname", showOverflowTooltip: true },
  { label: "被攻击次数", prop: "attackedTotal", width: 80 },
  { label: "被攻击IP个数", prop: "attackedIpTotal", width: 80 },
  { label: "遭受网络攻击类型", prop: "attackTypeList", width: 180 },
];

watch(
  keyWord,
  (val) => {
    console.log("🚀 ~ val:", val);
    if (val === "车联网企业") {
      totalOneList1.value[0].name = "车联网企业数量";
      totalOneList1.value[1].name = "车联网平台数量";
    } else if (val === "新能源汽车") {
      totalOneList1.value[0].name = "新能源汽车企业数量";
      totalOneList1.value[1].name = "充电桩企业数量";
    } else {
      totalOneList1.value[0].name = "重点企业数量";
      totalOneList1.value[1].name = "监测企业数量";
    }
  },
  {
    immediate: true,
  }
);

function formatNumber(num) {
  if (num == null || num === "") return "";
  const number = Number(num);
  if (isNaN(number)) return num;
  if (number >= 10000) {
    return (number / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return number.toLocaleString();
}

function goto(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}&sourceType=2&uploadLabel=${keyWord.value}`);
}
</script>

<style lang="scss" scoped>
@import "./index16.scss";

:deep() {
  .custom-search-input .el-input__inner {
    border-radius: 20px;
    border: 2px solid #3fc3ff;
    height: 38px;
    color: #184077;
    font-size: 18px;
    background: linear-gradient(90deg, #eaf6ff 0%, #d6eaff 100%);
    box-shadow: none;
    padding: 0 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  }
  .custom-search-input .el-input__inner:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    background: linear-gradient(90deg, #f5fbff 0%, #e3f2ff 100%);
  }
  .custom-search-input .el-input__inner::placeholder {
    color: #c0c9d8;
    font-size: 16px;
    letter-spacing: 1px;
    font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  }
  .el-pagination {
    font-size: var(--font-table, 14px);
  }
  .el-pagination .el-pager li {
    font-size: var(--font-table, 14px);
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    font-size: var(--font-table, 14px);
  }
  .el-pagination .btn-prev .el-icon,
  .el-pagination .btn-next .el-icon {
    font-size: var(--font-table, 14px);
  }
}

.custom-search-button {
  display: inline-block;
  margin-left: 12px;
  border-radius: 20px;
  background: linear-gradient(90deg, #3fc3ff 0%, #409eff 100%);
  color: #fff;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
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
  font-size: 18px;
  font-weight: 500;
  margin-right: 10px;
  vertical-align: middle;
  line-height: 38px;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}
</style>
