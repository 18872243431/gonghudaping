<template>
  <div class="networksecurity">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <div class="left1">
        <chart-box title="工业互联网安全风险监测对象分布">
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
                  <div class="overview-item" 
                  :style="{ cursor: i === 0 ? 'pointer' : 'default' }"
                    @click="
                      i === 0 && router.push('/industryNetworkSecurity')
                    ">
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
              <template v-for="(item, i) in totalOneList2" :key="i">
                <el-popover
                  v-if="i > 0"
                  placement="bottom-start"
                  :width="800"
                  trigger="hover"
                > 
                  <template #reference> 
                    <div class="total-card" style="cursor: pointer">
                      <total-one :data="item"></total-one>
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
                      v-if="i === 1" 
                      :showSeq="true" 
                      :columns="popoverColumns1" 
                      :tableData="popoverTableData1" 
                      :needScroll="false" 
                    > 
                      <template #total="{ row }"> 
                        <span v-fmt>{{ row.total }}</span> 
                      </template> 
                    </act-table> 
                    <act-table 
                      v-if="i === 2" 
                      :showSeq="true" 
                      :columns="popoverColumns2" 
                      :tableData="popoverTableData2" 
                      :needScroll="false" 
                    > 
                      <template #country="{ row }"> 
                        <div 
                          class="company-name" 
                          style="text-decoration: underline" 
                          @click="gotoCountry(row.country)" 
                          v-flag 
                        > 
                          {{ row.country }} 
                        </div> 
                      </template> 
                      <template #total="{ row }"> 
                        <span v-fmt>{{ row.total }}</span> 
                      </template> 
                    </act-table> 
                    <act-table 
                      v-if="i === 3" 
                      :showSeq="true" 
                      :columns="popoverColumns3" 
                      :tableData="popoverTableData3" 
                      :needScroll="false" 
                    > 
                      <template #company="{ row }"> 
                        <div 
                          class="company-name" 
                          style="text-decoration: underline" 
                          :title="row.company" 
                          @click="gotoCompany(row.company)" 
                        > 
                          {{ row.company }} 
                        </div> 
                      </template> 
                      <template #total="{ row }"> 
                        <span v-fmt>{{ row.total }}</span> 
                      </template> 
                    </act-table> 
                  </div> 
                </el-popover> 
                <div class="total-card" v-else>
                  <total-one :data="item"></total-one>
                </div>
              </template>
            </div>
        </div>
      </div>
      <div class="map-container">
        <!-- <span class="text">被攻击次数</span> -->
        <ChinaMap
          :data="mapData"  
          :showClipDefs="true"
           :style="{ height: '98%', transform: 'scaleX(1.0) scaleY(1.0)',
            top: '100px' ,left:'-130px'}"
          :baseOption="{ zoom: 1.32, top: 190, aspectScale: 0.98 }"
          :option="{
              ...mapOption,
              visualMap2: {
                ...mapOption.visualMap2,
                left: 220,   /* 控制右侧图例的左右位置：需跟随左侧图例同步增加 */
                top: 450,/* 控制右侧图例的上下位置：需跟随左侧图例同步调整 */
              },
            }"
          name1="被攻击次数"
          @mapClick="handleClick"
        ></ChinaMap>
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
        <!-- 切换标签 -->
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
              :showNational="false"
            ></RankBar>
            <el-popover
              placement="right"
              :width="400"
              trigger="hover"
              popper-class="custom-popover"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [0, 100] } }],
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
                  height: 590px;
                  padding: 25px 25px 20px 25px;
                  overflow-y: auto;
                  transform: scale(1.1);
                "
              >
                <RankBar :showNational="false"
                  style="height: 1100px"
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
            ></RankBar>
            <el-popover
              placement="right"
              :width="400"
              trigger="hover"
              popper-class="custom-popover"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [0, 100] } }],
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
                      ...attackData2[0],
                      list: attackData2[0].list.slice(0, 20),
                    },
                  ]"
                  :showNational="true"
                ></RankBar>
              </div>
            </el-popover>
          </div>
        </div>

        <!-- 境外攻击来源图表 -->
        <chart-box
          v-show="currentChart === 'overseas'"
          title="境外攻击来源"
          :showLine="false"
          v-if="false"
        >
          <template v-slot:chart>
            <div class="rank-container"></div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right2">
        <div class="chart-card" style="width: 50%">
          <chart-box title="网络攻击类型排名" :showLine="false">
            <template v-slot:chart>
              <TerminalRankBar
                :data="pieData"
                :option="{
                  grid: { left: 60, right: 0, bottom: 60 },
                  xAxis: {
                    axisLabel: {
                      fontSize: 20,
                      fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif',
                      color: '#ffffff',
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
        <div class="chart-card" style="width: 50%">
          <chart-box title="网络攻击变化趋势" :showLine="false">
            <template v-slot:chart>
              <LineArea :data="lineData" :option="{
                grid: { left: 10, right: 0, bottom: 30 },
              }"></LineArea>
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
            <!-- <div
              class="arrow-left"
              v-if="groupedCards.length > 1"
              @click="carouselRef.prev()"
            ></div>
            <div
              class="arrow-right"
              v-if="groupedCards.length > 1"
              @click="carouselRef.next()"
            ></div> -->
            <div class="cards-container"  v-if="groupedCards.length > 1">
              <el-carousel
                :interval="3000"
                :autoplay="false"
                indicator-position="none"
                arrow="hover"
                :initial-index="0"
                ref="carouselRef"
                height="220px"
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
import ChinaMap from "@/components/echarts/map/ImgChina/index";
import ActTable from "@c/ActTable";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import LineArea from "@c/echarts/Line/lineArea";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index.vue";
import ActTabs from "@c/ActTabs";
import { ref, onMounted, computed, watch } from "vue";
import { getProvinceName3 } from "@/libs/coords";
import { useRouter } from "vue-router";
import Pie from "@c/echarts/Pie/NewPie";
import { CaretBottom } from "@element-plus/icons-vue";
import TotalOne from "@c/ActTotal/one.vue";

const carouselRef = ref(null);
const router = useRouter();
// 控制当前显示的图表
const currentChart = ref("overseas");
const { overviewData1, overviewData2 } = useLeft();
const {
  mapData,
  columns,
  tableData,
  attackData,
  attackData2,
  overviewText,
  mapOption,
} = useCenter();
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

// 转换数据格式以适配TotalOne组件
const totalOneList2 = computed(() => {
  return overviewData3.value.map(item => ({
    label: item.name,
    value: item.value,
    unit: item.unit,
    key: item.key
  }));
});

// 将卡片数据分组，每组3个卡片
const groupedCards = computed(() => {
  const groups = [];
  for (let i = 0; i < cardsData.value.length; i += 3) {
    groups.push(cardsData.value.slice(i, i + 3));
  }
  return groups;
});

const times = ref(["", ""]);

const columns2 = ref([
  { label: "行业", prop: "name", width: 190 },
  { label: "企业数量", prop: "companyTotal", slots: { default: "companyTotal" } },
   { label: "规上企业数量", prop: "aboveScaleCompanyTotal", slots: { default: "aboveScaleCompanyTotal" }, width: 160 },
]);

const popoverColumns1 = ref([
  { label: "攻击端", prop: "ip", width: 190 },
  { label: "攻击省份", prop: "province" },
  { label: "攻击次数", prop: "total" },
]);
const popoverColumns2 = ref([
  { label: "攻击端", prop: "ip", width: 190 },
  { label: "攻击国家", prop: "country" },
  { label: "攻击次数", prop: "total" },
]);
const popoverColumns3 = ref([
  { label: "被攻击企业", prop: "company" },
  { label: "被攻击次数", prop: "total", width: 140 },
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

// 切换图表显示
function switchChart(chartType) {
  currentChart.value = chartType;
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
