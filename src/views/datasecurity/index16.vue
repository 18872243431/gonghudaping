<template>
  <div class="datasecurity">
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
              <div
                class="overview-item"
                :style="{ cursor: i === 0 ? 'pointer' : 'default' }"
                @click="
                  i === 0 && router.push('/industryNetworkSecurity')
                "
              >
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
                :columns="columns3"
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
      <div class="total-container">
        <div class="total-box">
          <div class="total-box-t">
            <div class="total-card" v-for="(item, i) in totalOneList2" :key="i">
              <total-one :data="item"></total-one>
            </div>
          </div>
        </div>
      </div>
      <div class="map-container">
        <WorldMap
          :lines="{ data: worldMapData }"
          :map="worldData"
          :visualMap="{ ...visualMap, left: 90 }"
          @click="mapClick"
        ></WorldMap>
      </div>
      <div class="table-container">
        <act-table :showSeq="true" :columns="columns" :tableData="tableData">
          <template #srcCorpName="{ row }">
            <div class="company-name" :title="row.srcCorpName">
              {{ row.srcCorpName }}
            </div>
          </template>
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
          <template #attackCountry="{ row }">
            <span
              v-flag
              style="text-decoration: underline"
              @click="gotoCountry(row.attackCountry)"
              >{{ row.attackCountry }}</span
            >
          </template>
        </act-table>
      </div>
      <div class="bar-container">
        <chart-box title="外联国家排名" :showLine="false">
          <template v-slot:chart>
            <div class="rank-container" style="height: 100%">
              <RankBar
                :data="[
                  {
                    ...attackData[0],
                    list: attackData[0].list.slice(0, 5),
                  },
                ]"
                :showNational="true"
                @country-click="gotoCountry"
              ></RankBar>
            </div>
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
                  ><el-icon style="font-size: var(--font-h3)"
                    ><CaretBottom /></el-icon
                ></span>
              </template>
              <div
                style="
                  height: 360px;
                  padding: 5px 10px;
                  backdrop-filter: blur(20px);
                  overflow-y: auto;
                "
              >
                <RankBar
                  style="height: 720px"
                  :data="[
                    {
                      ...attackData[0],
                      list: attackData[0].list.slice(0, 20),
                    },
                  ]"
                  :showNational="true"
                ></RankBar>
              </div>
            </el-popover>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="side-title">数据安全态势整体分析</div>
      <div class="right1">
        <div class="chart-card">
          <chart-box title="数据安全风险类型排名" :showLine="false">
            <template v-slot:chart>
              <battery-rank-bar2
                style="height: 120%; margin-top: -20px"
                :data="batteryList"
              ></battery-rank-bar2>
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="暴露数据资产类型分布" :showLine="false">
            <template v-slot:chart>
              <TerminalRankBar
                :data="pieData"
                :option="{ grid: { left: 60, right: 0, bottom: 40 } }"
              ></TerminalRankBar>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right2">
        <chart-box title="潜在数据安全风险企业排名">
          <template v-slot:chart>
            <act-table
              :showSeq="true"
              :columns="columns2"
              :tableData="companyList"
              :needScroll="true"
              :seqWidth="50"
            >
              <template #name="{ row }">
                <div
                  class="company-name"
                  :title="row.name"
                  style="text-decoration: underline"
                  @click="gotoCompany(row.name)"
                >
                  {{ row.name }}
                </div>
              </template>
              <template #value1="{ row }">
                <div class="company-name">
                  {{ formatNumber(row.value1) }}
                </div>
              </template>
              <template #tags="{ row }">
                <div class="tags">
                  <span
                    class="tag"
                    v-for="(tag, i) in row.tags.slice(0, 2)"
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
    <div
      v-if="tooltipShow"
      class="tooltip-container"
      :style="{
        top: tooltipPosition.y + 'px',
        left: tooltipPosition.x + 'px',
      }"
    >
      <span class="close-button" @click="tooltipShow = false"
        ><el-icon><Close /></el-icon
      ></span>
      <div style="padding: 20px">
        <div class="tooltip-title">{{ selectedCountry }}</div>
        <div class="tooltip-content">
          <CircleSymbolBar :data="ipRankData"></CircleSymbolBar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TotalOne from "@c/ActTotal/one.vue";
import { useLeft, useCenter, useRight } from "./hooks/useData";
import chartBox from "@c/chartBox";
import ActTable from "@c/ActTable";
import RankBar from "@c/echarts/bar/BackgroundBar/index16.vue";
import WorldMap from "@c/echarts/map/World.vue";
import BatteryRankBar2 from "@c/echarts/bar/BatterySymbolBar/index16.vue";
import CircleSymbolBar from "@c/echarts/bar/CircleSymbolBar";
import ActTabs from "@c/ActTabs";
import { ref } from "vue";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index16.vue";
import { Close, CaretBottom } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { overviewData1, overviewData2 } = useLeft();
const {
  overviewText,
  totalOneList2,
  tableData,
  attackData,
  worldMapData,
  worldData,
  visualMap,
  mapClick,
  tooltipPosition,
  tooltipShow,
  selectedCountry,
  ipRankData,
} = useCenter();
const { pieData, batteryList, companyList, tabsList, activeTab, changeTab } =
  useRight();

const columns2 = [
  { label: "企业名称", prop: "name", width: 160 },
  { label: "被攻击次数", prop: "value1", width: 90 },
  { label: "遭受网络攻击类型", prop: "tags", width: 160 },
];

const columns3 = ref([
  { label: "行业", prop: "name", width: 190 },
  { label: "企业数量", prop: "companyTotal", slots: { default: "companyTotal" } },
  { label: "规上企业数量", prop: "aboveScaleCompanyTotal", slots: { default: "aboveScaleCompanyTotal" }, width: 160 },
]);

const columns = ref([
  { label: "时间", prop: "timestamp", width: 150 },
  // { label: "风险等级", prop: "severityCn", width: 90 },
  // { label: "风险大类", prop: "eventTypeName", width: 130 },
  { label: "风险类型", prop: "categoryCn", width: 120 },
  { label: "攻击端", prop: "attackIp", width: 130, showOverflowTooltip: true },
  { label: "攻击来源", prop: "attackCountry", width: 100 },
  { label: "被攻击企业", prop: "attackedCorpName" },
  {
    label: "被攻击IP",
    prop: "attackedIp",
    width: 130,
    showOverflowTooltip: true,
  },
]);

function gotoCountry(name) {
  if (name === "中国") return;
  router.push(`/abroadAttackerThreat?countryName=${name}`);
}

function gotoCompany(name) {
  router.push(
    `/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}`
  );
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
</script>

<style scoped lang="scss">
@import "./index16.scss";
</style>
