<template>
  <div class="networksecurity">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-35px"
      style="transform: scale(0.8) translateX(30px)"
    ></ActTabs>
    <div class="left">
      <div class="side-title">工业互联网安全监测对象分布</div>
      <div class="left1">
        <div class="overview-container">
          <el-popover
            placement="right"
            :width="600"
            trigger="hover"
            v-for="(item, i) in overviewData1"
            :key="i"
          >
            <template #reference>
              <div class="overview-item">
                <div class="name">{{ item.name }}</div>
                <img
                  :src="require(`./imgs/icon${item.img}.png`)"
                  alt=""
                  srcset=""
                  class="icon"
                />
                <!-- <div class="icon" :class="`icon${i + 1}`"></div> -->
                <div class="bottom">
                  <div class="info">
                    <div class="label">企业数量</div>
                    <div class="value">
                      {{ item.value1 }}<span class="unit">家</span>
                    </div>
                  </div>
                  <div class="info">
                    <div class="label">行业数量</div>
                    <div class="value">
                      {{ item.value2 }}<span class="unit">个</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div
              style="height: 290px; padding: 20px; backdrop-filter: blur(10px)"
            >
              <act-table
                :showSeq="true"
                :columns="columns2"
                :tableData="item.list"
                :needScroll="false"
              >
              <template #companyTotal="{ row }">
                <span>{{ formatNumber(row.companyTotal) }}</span>
              </template>
               <template #aboveScaleCompanyTotal="{ row }">
                <span>{{ formatNumber(row.aboveScaleCompanyTotal) }}</span>
              </template>
            </act-table>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="left2">
        <div class="list">
          <div class="list-item" v-for="(item, i) in overviewData2" :key="i">
            <div class="item-l">
              <div class="icon" :class="`icon${i + 1}`"></div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div class="item-r">
              <div class="info">
                <div class="label">企业数量</div>
                <div class="value">
                  {{ item.value1 }}<span class="unit">{{ item.unit1 }}</span>
                </div>
              </div>
              <div class="info" style="width: 355px">
                <div class="label">{{ item.label2 }}</div>
                <div class="value">
                  {{ item.value2 }}<span class="unit">{{ item.unit2 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <!-- <div class="bg"></div> -->
      <div class="tips">
        <span class="label">总体安全态势</span>
        <p class="content">
          {{ overviewText }}
        </p>
      </div>
      <div class="map-container">
        <ChinaMap
          :data="mapData"
          :baseOption="{ zoom: 1.13, top: 140, center: [113.97, 29.71] }"
          :option="{
            ...mapOption,
            visualMap2: { ...mapOption.visualMap2, left: 100 },
          }"
          name1="被攻击次数"
          @mapClick="handleClick"
        ></ChinaMap>
      </div>
      <div class="table-container">
        <act-table
          :showSeq="true"
          :columns="columns"
          :tableData="tableData"
          :seqWidth="50"
          class="table16"
        >
          <template #attackedCorpName="{ row }">
            <div
              class="company-name"
              style="text-decoration: underline"
              :title="row.attackedCorpName"
              @click="gotoCompany(row.attackedCorpName)"
            >
              {{ row.attackedCorpName }}
            </div>
          </template>
          <template #attackedCountry="{ row }">
            <div
              class="company-name"
              style="text-decoration: underline"
              @click="gotoCountry(row.attackedCountry)"
              v-flag
            >
              {{ row.attackedCountry }}
            </div>
          </template>
        </act-table>
      </div>
      <div class="bar-container">
        <!-- 图表切换标签页 -->
        <div class="chart-tabs">
          <div
            class="tab-item"
            :class="{ active: currentChart === 'overseas' }"
            @click="switchChart('overseas')"
          >
            境外攻击来源
          </div>
          <div
            class="tab-item"
            :class="{ active: currentChart === 'province' }"
            @click="switchChart('province')"
          >
            被攻击省份分布
          </div>
        </div>

        <div class="bar-content">
          <div style="height: 100%" v-show="currentChart === 'province'">
            <RankBar
              :data="[
                {
                  ...attackData[0],
                  list: attackData[0].list.slice(0, 5),
                },
              ]"
            ></RankBar>
            <el-popover
              placement="right"
              :width="280"
              trigger="hover"
              popper-class="custom-popover"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
              }"
            >
              <template #reference>
                <span class="more" title="更多"
                  ><el-icon style="font-size: var(--font-h3)" class="more-icon"
                    ><CaretBottom /></el-icon
                ></span>
              </template>
              <div
                style="
                  height: 370px;
                  padding: 5px 10px;
                  backdrop-filter: blur(20px);
                  overflow-y: auto;
                "
              >
                <RankBar
                  style="height: 740px"
                  :data="[
                    {
                      ...attackData[0],
                      list: attackData[0].list.slice(0, 20),
                    },
                  ]"
                ></RankBar>
              </div>
            </el-popover>
          </div>
          <div style="height: 100%" v-show="currentChart === 'overseas'">
            <RankBar
              :data="[
                {
                  ...attackData2[0],
                  list: attackData2[0].list.slice(0, 5),
                },
              ]"
              :showNational="true"
              @country-click="gotoCountry"
            ></RankBar>
            <el-popover
              placement="right"
              :width="280"
              trigger="hover"
              popper-class="custom-popover"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
              }"
            >
              <template #reference>
                <span class="more" title="更多"
                  ><el-icon style="font-size: var(--font-h3)" class="more-icon"
                    ><CaretBottom /></el-icon
                ></span>
              </template>
              <div
                style="
                  height: 370px;
                  padding: 5px 10px;
                  backdrop-filter: blur(20px);
                  overflow-y: auto;
                "
              >
                <RankBar
                  style="height: 740px"
                  :data="[
                    {
                      ...attackData2[0],
                      list: attackData2[0].list.slice(0, 20),
                    },
                  ]"
                  :showNational="true"
                  @country-click="gotoCountry"
                ></RankBar>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="side-title">网络安全态势整体分析</div>
      <div class="right1">
        <div class="overflow-container">
          <div
            class="overflow-item"
            v-for="(item, i) in overviewData3"
            :key="i"
          >
            <div class="name">{{ item.name }}</div>
            <div class="item-info">
              <div :class="['item-icon', 'item-icon' + i]"></div>
              <div>
                <span class="value" v-if="i === 0">{{ item.value }}</span>
                <el-popover
                  v-else
                  placement="left"
                  :width="600"
                  trigger="hover"
                >
                  <template #reference>
                    <span class="value">{{ item.value }}</span></template
                  >
                  <div
                    style="
                      height: 290px;
                      padding: 10px 20px;
                      backdrop-filter: blur(10px);
                    "
                  >
                    <act-table
                      v-if="i === 1"
                      :showSeq="true"
                      :columns="popoverColumns1"
                      :tableData="popoverTableData1"
                      :needScroll="false"
                      :seqWidth="60"
                      class="table16"
                    >
                      <template #count="{ row }">
                        <span>{{ formatNumber(row.total) }}</span>
                      </template>
                    </act-table>
                    <act-table
                      v-if="i === 2"
                      :showSeq="true"
                      :columns="popoverColumns2"
                      :tableData="popoverTableData2"
                      :needScroll="false"
                      class="table16"
                    >
                      <template #country="{ row }">
                        <div
                          class="company-name company-name--nowrap"
                          style="text-decoration: underline"
                          @click="gotoCountry(row.country)"
                          v-flag
                        >
                          {{ row.country }}
                        </div>
                      </template>
                      <template #count="{ row }">
                        <span>{{ formatNumber(row.total) }}</span>
                      </template>
                    </act-table>
                    <act-table
                      v-if="i === 3"
                      :showSeq="true"
                      :columns="popoverColumns3"
                      :tableData="popoverTableData3"
                      :needScroll="false"
                      class="table16"
                      height="295px"
                    >
                      <template #name="{ row }">
                        <div
                          class="company-name company-name--nowrap"
                          style="text-decoration: underline"
                          :title="row.name"
                          @click="gotoCompany(row.company)"
                        >
                          {{ row.company }}
                        </div>
                      </template>
                      <template #count="{ row }">
                        <span>{{ formatNumber(row.total) }}</span>
                      </template>
                    </act-table>
                  </div>
                </el-popover>
                <span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right2">
        <div class="chart-card">
          <chart-box title="网络攻击类型排名" :showLine="false">
            <template v-slot:chart>
              <TerminalRankBar
                :data="pieData"
                :option="{
                  grid: { left: 60, right: 0, bottom: 50 },
                  xAxis: {
                    axisLabel: {
                      fontSize: 14,
                      fontFamily: 'SourceHanSansSC',
                      color: '#D0DEEE',
                      align: 'center',
                      interval: 0,
                      margin: 20,
                      width: 80,
                      overflow: 'break',
                    },
                  },
                }"
              ></TerminalRankBar>
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="网络攻击变化趋势" :showLine="false">
            <template v-slot:chart>
              <LineArea :data="lineData"></LineArea>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right3">
        <chart-box title="暴露工业控制系统及设备情况">
          <template v-slot:chart>
            <div class="overview">
              <div class="info">
                <div class="label">暴露资产数量</div>
                <div class="value">{{ overviewRightData1 }}</div>
                <div class="unit">个</div>
              </div>
              <div class="info">
                <div class="label">暴露资产类型</div>
                <el-popover placement="top" :width="600" trigger="hover"
                  ><template #reference
                    ><div class="value">{{ overviewRightData2 }}</div></template
                  >
                  <div
                    style="
                      height: 290px;
                      padding: 20px;
                      backdrop-filter: blur(10px);
                    "
                  >
                    <Pie :data="overviewRightPieData"></Pie>
                  </div>
                </el-popover>
                <div class="unit">类</div>
              </div>
            </div>
            <div class="cards-container">
              <el-carousel
                :interval="3000"
                :autoplay="true"
                indicator-position="none"
                arrow="hover"
                :initial-index="0"
                ref="carouselRef"
                height="150px"
                class="custom-carousel"
              >
                <el-carousel-item
                  v-for="(group, groupIndex) in groupedCards"
                  :key="groupIndex"
                >
                  <div class="cards">
                    <div class="card" v-for="(item, i) in group" :key="i">
                      <div class="logo-container">
                        <el-image
                          class="logo"
                          :src="require(`./imgs/logos2/${item.logo}.png`)"
                          fit="cover"
                        />
                      </div>
                      <div class="card-item">
                        <span class="label">设备及系统数量</span>
                        <span class="value">{{ item.value1 }}</span>
                      </div>
                      <div class="card-item">
                        <span class="label">漏洞数量</span>
                        <span class="value">{{ item.value2 }}</span>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLeft, useCenter, useRight } from "./hooks/useData";
import chartBox from "@c/chartBox";
import ChinaMap from "@/components/echarts/map/China16/index";
import ActTable from "@c/ActTable";
import RankBar from "@c/echarts/bar/BackgroundBar/index16.vue";
import LineArea from "@c/echarts/Line/lineArea16";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index16.vue";
import ActTabs from "@c/ActTabs";
import { ref, computed } from "vue";
import { getProvinceName3 } from "@/libs/coords";
import { useRouter } from "vue-router";
import Pie from "@c/echarts/Pie/NewPie";
import { CaretBottom } from "@element-plus/icons-vue";

const carouselRef = ref(null);
const router = useRouter();
// 图表切换控制变量
const currentChart = ref("overseas");
const { overviewData1, overviewData2 } = useLeft();
const { mapData, tableData, attackData, attackData2, overviewText, mapOption } =
  useCenter();
const {
  overviewData3,
  lineData,
  pieData,
  cardsData,
  tabsList,
  activeTab,
  changeTab,
  popoverTableData1,
  popoverTableData2,
  popoverTableData3,
  overviewRightData1,
  overviewRightData2,
  overviewRightPieData,
} = useRight();

// 将卡片数据分组，每组2个卡片
const groupedCards = computed(() => {
  const groups = [];
  for (let i = 0; i < cardsData.value.length; i += 2) {
    groups.push(cardsData.value.slice(i, i + 2));
  }
  return groups;
});

const columns = [
  { label: "时间", prop: "timestamp", width: 150 },
  { label: "风险类型", prop: "eventTypeName", width: 140 },
  { label: "攻击端", prop: "attackIp", width: 150 },
  { label: "攻击来源", prop: "attackedCountry", width: 130 },
  { label: "被攻击企业", prop: "attackedCorpName", width: 200 },
];

const columns2 = ref([
  { label: "行业", prop: "name", width: 190},
  { label: "企业数量", prop: "companyTotal", slots: { default: "companyTotal" } },
  { label: "规上企业数量", prop: "aboveScaleCompanyTotal", width: 160, slots: { default: "aboveScaleCompanyTotal" } },
]);

const popoverColumns1 = ref([
  { label: "攻击端", prop: "ip" },
  { label: "攻击省份", prop: "province" },
  { label: "攻击次数", prop: "count" },
]);
const popoverColumns2 = ref([
  { label: "攻击端", prop: "ip" },
  { label: "攻击国家", prop: "country" },
  { label: "攻击次数", prop: "count" },
]);
const popoverColumns3 = ref([
  { label: "被攻击企业", prop: "name", width: 230 },
  { label: "被攻击省份", prop: "province" },
  { label: "被攻击次数", prop: "count" },
]);

function handleClick(params) {
  // console.log(getProvinceName3(params.name));
  router.push(`/gdsecurity?provinceName=${getProvinceName3(params.name)}`);
}

function gotoCountry(name) {
  if (name === "中国") return;
  router.push(`/abroadAttackerThreat?countryName=${name}`);
}

function gotoCompany(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}`);
}

function formatNumber(value) {
  const num = Number(value);
  if (isNaN(num)) return "";
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  } else {
    return num.toLocaleString();
  }
}

// 图表切换方法
function switchChart(chartType) {
  currentChart.value = chartType;
}
</script>

<style lang="scss" scoped>
@import "./index16.scss";
</style>
