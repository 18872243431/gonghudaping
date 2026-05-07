<template>
  <div class="datasecurity">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <div class="left1">
        <chart-box title="工业互联网安全风险监测对象分布" :showLine="false">
          <template v-slot:chart>
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
                  style="
                    height: 290px;
                    padding: 20px;
                    backdrop-filter: blur(10px);
                  "
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
          </template>
        </chart-box>
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
                  <span>{{ item.value1 }}</span>
                  <span class="unit">{{ item.unit1 }}</span>
                </div>
              </div>
              <div class="info" style="width: 426px">
                <div class="label">{{ item.label2 }}</div>
                <div class="value">
                  <span>{{ item.value2 }}</span>
                  <span class="unit">{{ item.unit2 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="bg"></div>
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
          :visualMap="visualMap"
          @click="mapClick"
        ></WorldMap>
      </div>
      <div class="table-container">
        <act-table :showSeq="true" :columns="columns" :tableData="tableData">
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
            <div
              v-flag
              class="company-name"
              style="text-decoration: underline"
              @click="gotoCountry(row.attackCountry)"
            >
              {{ row.attackCountry }}
            </div>
          </template>
        </act-table>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <div class="chart-card">
          <chart-box title="数据安全风险类型排名" :showLine="false">
            <template v-slot:chart>
              <battery-rank-bar2 :data="batteryList"></battery-rank-bar2>
              <!-- <ul class="battery-bar system-scrollbar">
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
              </ul> -->
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="暴露数据资产类型分布" :showLine="false">
            <template v-slot:chart>
              <TerminalRankBar
                :data="pieData"
                :option="{
                  grid: { left: 60, right: 0, bottom: 80 },
                  xAxis: {
                    axisLabel: {
                      interval: 0,
                      fontSize: 20,
                      fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif',
                      color: '#ffffff',
                    }
                  }
                }"
              ></TerminalRankBar>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right2">
        <div class="chart-card rank-card">
          <chart-box title="外联国家排名" :showLine="false">
            <template v-slot:chart>
              <div class="rank-container" style="height: 100%; margin-top: 0%">
                <RankBar
                  :data="[
                    {
                      ...attackData[0],
                      list: attackData[0].list.slice(0, 5),
                    },
                  ]"
                  :showNational="true"
                  :option="{ grid: { top: 0, bottom: 0 } }"
                ></RankBar>
                <el-popover
                  placement="right"
                  :width="400"
                  trigger="hover"
                  popper-class="custom-popover"
                  :popper-options="{
                    modifiers: [
                      { name: 'offset', options: { offset: [0, 100] } },
                    ],
                  }"
                >
                  <template #reference>
                    <span class="more" title="更多"
                      ><el-icon style="font-size: 24px" class="more-icon"
                        ><CaretBottom /></el-icon
                    ></span>
                  </template>
                  <div
                    style="
                      height: 640px;
                      padding: 25px 25px 10px 25px;
                      overflow-y: auto;
                      transform: scale(1.1);
                    "
                  >
                    <RankBar
                      style="height: 1200px"
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
              </div>
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="暗网数据监测" :showLine="false">
            <template v-slot:chart>
              <div class="dark-web-monitor-wrapper">
                <DarkWebMonitorTable :tableData="darkWebMonitorData" />
              </div>
            </template>
          </chart-box>
        </div>
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
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import WorldMap from "@c/echarts/map/World.vue";
import BatteryRankBar2 from "@c/echarts/bar/BatterySymbolBar";
import CircleSymbolBar from "@c/echarts/bar/CircleSymbolBar";
import ActTabs from "@c/ActTabs";
import { ref } from "vue";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index.vue";
import { Close, CaretBottom } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import DarkWebMonitorTable from "./DarkWebMonitorTable.vue";

const router = useRouter();
const { overviewData1, overviewData2 } = useLeft();
const {
  overviewText,
  totalOneList2,
  columns,
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
const {
  pieData,
  batteryList,
  companyList,
  tabsList,
  activeTab,
  columns2,
  changeTab,
  darkWebMonitorData,
} = useRight();

const columns3 = ref([
  { label: "行业", prop: "name", width: 190 },
  { label: "企业数量", prop: "companyTotal", slots: { default: "companyTotal" }  },
  { label: "规上企业数量", prop: "aboveScaleCompanyTotal", slots: { default: "aboveScaleCompanyTotal" }, width: 160 },
]);

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
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
