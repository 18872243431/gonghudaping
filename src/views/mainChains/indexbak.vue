<template>
  <div class="mianChains32">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <chart-box title="重点行业安全总览">
        <template v-slot:chart>
          <div class="con">
            <div class="con-l">
              <div class="sin1" v-if="false">
                <div class="level bg1">
                  <div class="label">高风险产业链</div>
                  <div class="valueAll">
                    <span class="num">{{ riskData.high }}</span>
                    <span class="unit">个</span>
                  </div>
                </div>
                <div class="level bg2">
                  <div class="label">中风险产业链</div>
                  <div class="valueAll">
                    <span class="num">{{ riskData.middle }}</span>
                    <span class="unit">个</span>
                  </div>
                </div>
                <div class="level bg3">
                  <div class="label">低风险产业链</div>
                  <div class="valueAll">
                    <span class="num">{{ riskData.low }}</span>
                    <span class="unit">个</span>
                  </div>
                </div>
              </div>
              <div class="sin2" style="margin-bottom: 30px">
                <div class="chartTitle">安全总览</div>
                <div class="sin2-con">
                  <div
                    class="sin"
                    v-for="(item, index) in leftInfo"
                    :key="index"
                  >
                    <div class="img"></div>
                    <div class="ot">
                      <div class="label">{{ item.label }}</div>
                      <div class="valueAll">
                        <div class="dropdown-container" v-if="index === 0">
                          <el-dropdown>
                            <span
                              class="num"
                              style="text-decoration: underline"
                              >{{ formatNumber(item.num) }}</span
                            >
                            <template #dropdown>
                              <el-dropdown-menu class="custom-dropdown-menu">
                                <el-dropdown-item
                                  v-for="itm in specialList"
                                  :key="itm.label"
                                  @click.native="handleClick(itm)"
                                  >{{ itm.label }}</el-dropdown-item
                                >
                              </el-dropdown-menu>
                            </template>
                          </el-dropdown>
                        </div>
                        <span class="num" v-else>{{
                          formatNumber(item.num)
                        }}</span>
                        <span class="unit">{{ item.unit }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="sin3">
                <div class="sin3-content">
                  <div class="chartTitle">攻击来源TOP5</div>
                  <div class="sin3-con">
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
                        :class="{ active: currentChart === 'inside' }"
                        @click="switchChart('inside')"
                      >
                        境内攻击来源
                      </div>
                    </div>
                    <div class="bar-content">
                      <BackgroundBar :data="attackData" :showNational="true" v-show="currentChart === 'overseas' && attackData[0].list.length>0"></BackgroundBar>
                      <BackgroundBar :data="attackData" :showNational="false" v-show="currentChart === 'inside' && attackData[0].list.length>0"></BackgroundBar>
                    </div>
                  </div>
                </div>
                <div class="sin3-content">
                  <div class="chartTitle">攻击类型TOP5</div>
                  <div class="sin3-con">
                    <BackgroundBar2 :data="attackTypeData"></BackgroundBar2>
                  </div>
                </div>
              </div>
            </div>
            <div class="con-r">
              <div class="chartTitle" style="margin-left: 150px">
                重点行业企业地域分布
              </div>
              <div class="map-container">
                <div class="text1">网络攻击次数</div>
                <div class="text2">企业数量</div>
                <ChinaMap
                  :data="mapData"
                  :baseOption="{
                    zoom: 1.11,
                    top: 60,
                    aspectScale: 0.98,
                  }"
                  :option="{
                    ...mapOption,
                    visualMap1: {
                      ...mapOption.visualMap1,
                      left: 200,
                      top: 300,
                    },
                    visualMap2: {
                      ...mapOption.visualMap2,
                      left: 200,
                      top: 430,
                    },
                  }"
                  :showCube="true"
                  name1="网络攻击次数"
                  name2="企业数量"
                ></ChinaMap>
              </div>
              <div class="mapBottom" v-if="false">
                <div class="pie">
                  <div class="chartTitle">网络攻击类型分布</div>
                  <div class="pie-container">
                    <Pie :data="pieData" v-if="pieData.length > 0"></Pie>
                  </div>
                </div>
                <div class="line">
                  <div class="chartTitle">网络攻击趋势</div>
                  <div class="line-container">
                    <Line :option="lineOpts" :data="lineData"></Line>
                  </div>
                </div>
              </div>
              <div class="mapRightCon">
                <div class="sin sin1">
                  <div class="riskWarning">
                    <chart-box title="风险预警" :showLine="false"></chart-box>
                    <vue3-scroll-seamless
                      :dataList="riskWarningData"
                      :classOptions="{ limitMoveNum: 2, step: 0.16 }"
                      class="warning-scroll-container"
                    >
                      <div
                        v-for="data in riskWarningData"
                        :key="data.id"
                        class="warning-item"
                      >
                        <div class="warning-con">
                          <div class="time">
                            {{ data.startTime }} 至
                            {{ data.endTime }} 监测发现，
                          </div>
                          <div class="warning-content">
                            <span class="company"
                              >{{ data.companyName }}（{{ data.ip }}）</span
                            >存在<span class="event">{{ data.eventType }}</span
                            >事件<span class="event">{{
                              formatNumber(data.count)
                            }}</span
                            >次。
                          </div>
                        </div>
                      </div>
                    </vue3-scroll-seamless>
                  </div>
                </div>
                <div class="sin sin2">
                  <chart-box title="各重点行业被攻击态势" :showLine="false">
                    <template v-slot:chart>
                      <div class="table-container">
                        <act-table
                          :showSeq="true"
                          :columns="columns"
                          :tableData="tableData"
                          :seqWidth="60"
                        >
                          <template #riskTotalNum="{ row }">
                            <span style="color: #ffb215"
                              >{{ formatNumber(row.riskTotalNum) }}次</span
                            >
                          </template>
                          <template #riskCompanyCount="{ row }">
                            <span style="color: #4bd2fd">{{
                              formatNumber(row.riskCompanyCount)
                            }}</span>
                          </template>
                        </act-table>
                      </div>
                    </template>
                  </chart-box>
                </div>
              </div>
            </div>
          </div>
        </template>
      </chart-box>
    </div>
    <div class="right">
      <chart-box title="重点行业安全态势">
        <template v-slot:chart>
          <div class="cards-container" v-if="groupedCards.length > 0">
            <div class="carousel-counter" v-if="groupedCards.length > 0">
              {{ currentIndex + 1 }}/{{ groupedCards.length }}
            </div>
            <div class="v-carousel-arrows">
              <div class="arrow up" @click="handleCarousel('up')"></div>
              <div class="arrow down" @click="handleCarousel('down')"></div>
            </div>
            <el-carousel
              :interval="30000"
              :autoplay="true"
              direction="vertical"
              indicator-position="none"
              arrow="hover"
              :initial-index="0"
              ref="carouselRef"
              @change="handleCarouselChange"
              height="150px"
              class="custom-carousel"
            >
              <el-carousel-item
                v-for="(group, groupIndex) in groupedCards"
                :key="groupIndex"
              >
                <div class="cards">
                  <div class="card" v-for="(item, i) in group" :key="i">
                    <div class="card-top">
                      <div class="chartTitle" @click="gotPage(item.name)">
                        {{ item.name }}
                      </div>
                      <div class="chartLevel">
                        <div class="sin">
                          <div class="label">风险企业</div>
                          <div class="value">
                            {{ formatNumber(item.riskCompanyCount) }}
                          </div>
                          <div class="unit">家</div>
                        </div>
                        <div class="sin">
                          <div class="label">高危风险</div>
                          <div class="value">
                            {{ formatNumber(item.highThreatCount) }}
                          </div>
                          <div class="unit">次</div>
                        </div>
                        <div class="sin">
                          <div class="label">风险指数</div>
                          <div class="value">
                            {{ item.riskRatio }}
                            <el-tooltip
                              class="box-item"
                              effect="dark"
                              placement="top"
                            >
                              <template #content>
                                <div style="width: 180px">
                                  网络安全风险指数体系由暴露面指数（20%）、外部威胁指数（30%）及失陷指标指数（50%）三个核心维度加权构成。通过对各维度下的细化指标进行量化评分，最终构成0-100分的综合风险值，并据此划分为高、中、低三个风险等级，综合评估重点产业链的网络安全状况。
                                </div>
                              </template>
                              <el-icon style="color: #fff; margin-left: 4px"
                                ><QuestionFilled
                              /></el-icon>
                            </el-tooltip>
                          </div>
                        </div>
                        <div
                          class="level"
                          :class="
                            item.riskLevel === '高'
                              ? ''
                              : item.riskLevel === '中'
                              ? 'level-middle'
                              : 'level-low'
                          "
                        >
                          {{ item.riskLevel }}风险
                        </div>
                      </div>
                    </div>
                    <div class="card-bot">
                      <div class="card-bot-left">
                        <div class="t">
                          <div class="title">监测企业数量</div>
                          <div class="pieCon">
                            <div class="piel">
                              <div class="ratio-content">
                                <div class="text-num">
                                  <span class="count">{{
                                    formatNumber(item.monitorCompanyNum)
                                  }}</span>
                                  <span>家（{{ item.companyRatio }}%）</span>
                                </div>
                                <div class="text-num">
                                  /{{ formatNumber(item.totalCompanyNum) }}家
                                </div>
                              </div>
                            </div>
                            <div class="pier">
                              <Pie1
                                :data="item.pieData"
                                :titleFontSize="18"
                              ></Pie1>
                            </div>
                          </div>
                        </div>
                        <div class="b">
                          <RankBar :data="item.rankData"></RankBar>
                        </div>
                      </div>
                      <div class="card-bot-right">
                        <div class="t">
                          <Line :option="lineOpts" :data="item.lineData"></Line>
                        </div>
                        <div class="b">
                          <div class="total-info">
                            <div class="attack-total">
                              {{ item.attackerCount }}个
                            </div>
                            <div class="attack-total-text">境外攻击源</div>
                          </div>
                          <div class="attack-country">
                            <div
                              class="attack-country-item"
                              v-for="i in 4"
                              :key="i"
                            >
                              <div :class="['seq', `seq${i}`]">
                                {{ i }}
                              </div>
                              <template v-if="item.attackCountry[i - 1]">
                                <div
                                  class="attack-country-item-name"
                                  v-flag="{
                                    style: 'width:24px;margin-right:5px;',
                                  }"
                                >
                                  {{ item.attackCountry[i - 1].name }}
                                </div>
                                <div class="attack-country-item-value">
                                  <span>
                                    {{
                                      formatNumber(
                                        item.attackCountry[i - 1].value
                                      )
                                    }}</span
                                  >
                                  <span
                                    style="
                                      font-size: var(--font-small);
                                      color: #fff;
                                      margin-left: 3px;
                                    "
                                    >次</span
                                  >
                                </div>
                              </template>
                              <div
                                style="color: #ccc; font-size: var(--font-body)"
                                v-else
                              >
                                暂无数据
                              </div>
                              <!-- <div class="attack-country-item-unit">万</div> -->
                            </div>
                          </div>
                        </div>
                      </div>
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
</template>

<script setup>
import BackgroundBar from "@c/echarts/bar/BackgroundBar/index.vue";
import BackgroundBar2 from "@c/echarts/bar/TerminalRankBar2/index.vue";
import { useData } from "./hooks/useData";
import chartBox from "@c/chartBox";
import RankBar from "@c/echarts/bar/CircleSymbolBar/index.vue";
import ActTabs from "@c/ActTabs";
import ActTable from "@c/ActTable";
import Pie from "@c/echarts/Pie/NewPie";
import Pie1 from "@c/echarts/Pie/NewPie1";
import HillBar from "@c/echarts/bar/HillBar/index.vue";
import Line from "@c/echarts/Line/lineArea/index.vue";
import ChinaMap from "@/components/echarts/map/China/index";
import { computed } from "vue";
import { ref } from "vue";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import { QuestionFilled } from "@element-plus/icons-vue";

const {
  tabsList,
  activeTab,
  changeTab,
  riskData,
  leftInfo,
  pieData,
  mapData,
  mapOption,
  cardsData2,
  tableData,
  columns,
  riskWarningData,
  lineData,
  lineOpts,
  terData,
  gotPage,
  specialList,
  handleClick,
  currentChart,
  attackData,
  attackTypeData,
  switchChart
} = useData();

const carouselRef = ref(null);
const currentIndex = ref(0);

function handleCarousel(direction) {
  if (!carouselRef?.value) return;
  if (direction === "up") {
    carouselRef.value.prev();
  } else if (direction === "down") {
    carouselRef.value.next();
  }
}
function handleCarouselChange(newIndex) {
  currentIndex.value = Number(newIndex) || 0;
}
// 将卡片数据分组，每组2个卡片
const groupedCards = computed(() => {
  const groups = [];
  for (let i = 0; i < cardsData2.value.length; i += 2) {
    groups.push(cardsData2.value.slice(i, i + 2));
  }
  return groups;
});

function formatNumber(value) {
  const num = Number(value);
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + "亿";
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  } else {
    return num.toLocaleString();
  }
}
</script>

<style lang="scss" scoped>
.mianChains32 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: 20px;

  /* Unified font hierarchy for this page */
  --font-h1: 38px; /* Largest numeric highlights */
  --font-h2: 30px; /* Section headers / featured values */
  --font-h3: 24px; /* Card titles / prominent labels */
  --font-body: 20px; /* Regular body text */
  --font-small: 18px; /* Minor labels / units */

  .left {
    width: calc(100% - 1184px);
    height: 100%;
    .con {
      width: 100%;
      height: 100%;
      display: flex;
      &-l {
        width: 35%;
        height: 100%;
        .sin1 {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          .level {
            width: 33%;
            height: 58px;
            display: flex;
            align-items: center;
            gap: 10px;
            position: relative;
            &.bg1 {
              &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.5;
                background: url("./imgs/32/1.png") no-repeat center;
              }
            }
            &.bg2 {
              &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.5;
                background: url("./imgs/32/2.png") no-repeat center;
              }
            }
            &.bg3 {
              &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.5;
                background: url("./imgs/32/3.png") no-repeat center;
              }
            }
            .label {
              padding-left: 50px;
              font-family: SourceHanSansSC, SourceHanSansSC;
              font-weight: bold;
              font-size: var(--font-small);
              color: #ffffff;
              text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
              font-style: normal;
            }
            .valueAll {
              font-family: SourceHanSansSC, SourceHanSansSC;
              font-weight: 500;
              font-size: var(--font-small);
              color: #fdac42;
              line-height: 20px;
              text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
            }
          }
        }
        .sin2 {
          width: 100%;
          height: 400px;
          &-con {
            height: 350px;
            display: flex;
            flex-wrap: wrap;
            .sin {
              width: 50%;
              display: flex;
              align-items: center;
              position: relative;
              &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                opacity: 0.5;
                background: url("./imgs/32/4.png") no-repeat center;
              }
              .img {
                margin-left: 100px;
                width: 93px;
                height: 92px;
                background: url("./imgs/32/5.png") no-repeat center/ 100% 100%;
              }
              .ot {
                padding: 30px 40px 30px 10px;
                width: calc(100% - 193px);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .label {
                  font-family: YouSheBiaoTiHei;
                  font-size: var(--font-h3);
                  letter-spacing: 1px;
                  color: transparent;
                  background: linear-gradient(
                    to bottom,
                    #ffffff 0%,
                    #6df1ff 100%
                  );
                  background-clip: text;
                  -webkit-background-clip: text;
                }
                .valueAll {
                  display: flex;
                  gap: 10px;
                  align-items: center;
                  .num {
                    font-family: YouSheBiaoTiHei;
                    font-size: 48px;
                    color: #ffffff;
                  }
                  .unit {
                    font-family: SourceHanSansSC, SourceHanSansSC;
                    font-weight: 400;
                    font-size: var(--font-body);
                    color: #ffffff;
                  }
                }
              }
            }
          }
        }
        .sin3 {
          height: calc(100% - 460px);
          display: flex;
          .sin3-content{
            width:50%;
            height: 100%;
            .sin3-con{
              height: calc(100% - 50px);
              .bar-content{
                height: calc(100% - 40px);
              }
              .chart-tabs {
                display: flex;
                margin-bottom: 10px;
                overflow: hidden;

                .tab-item {
                  font-family: SourceHanSansSC, SourceHanSansSC;
                  font-weight: 500;
                  font-size: 14px;
                  color: #c7ddff;
                  line-height: 36px;
                  width: 200px;
                  height: 37px;
                  text-align: center;
                  cursor: pointer;
                  background: url(./imgs/tab.png) no-repeat center / 100% 100%;
                  &.active {
                    font-weight: bold;
                    font-size: 14px;
                    color: #ffffff;
                    background: url(./imgs/active-tab.png) no-repeat center / 100% 100%;
                  }
                }
              }
            }
          }
          // &-con {
          //   height: calc(100% - 50px);
          // }
        }
      }
      &-r {
        width: 65%;
        height: 100%;
        background: url("./imgs/32/6.png") no-repeat center/ 100% 100%;
        position: relative;
        .map-container {
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0px;
          left: -40px;
          .text1 {
            position: absolute;
            bottom: 460px;
            left: 200px;
            font-size: 16px;
            color: #fff;
          }
          .text2 {
            position: absolute;
            bottom: 596px;
            left: 200px;
            font-size: 16px;
            color: #fff;
          }
        }
        .mapBottom {
          position: absolute;
          bottom: 20px;
          left: 10%;
          height: 220px;
          width: 90%;
          display: flex;
          .pie {
            width: 30%;
            height: 100%;
            .pie-container {
              width: 100%;
              height: calc(100% - 50px);
              margin-left: -60px;
            }
          }
          .line {
            width: 65%;
            height: 100%;
            padding: 10px;
            backdrop-filter: blur(10px);
            background-color: rgba(30, 44, 77, 0.01);
            .line-container {
              width: 100%;
              height: calc(100% - 50px);
            }
          }
        }
        .mapRightCon {
          position: absolute;
          right: 60px;
          bottom: 20px;
          width: 90%;
          height: 280px;
          display: flex;
          .sin {
            &.sin1 {
              width: 36%;
              height: 100%;
              margin-right: 20px;
              overflow: hidden;
            }
            &.sin2 {
              width: 60%;
              height: 100%;
            }
            .table-container {
              height: 100%;
            }
          }
        }
      }
    }
  }
  .right {
    width: 1184px;
    height: 100%;
    .cards-container {
      height: 100%;
      width: 100%;
      position: relative;
      z-index: 1;
      .carousel-counter {
        position: absolute;
        top: -24px;
        right: 8px;
        z-index: 10001;
        padding: 2px 8px;
        font-size: var(--font-body);
        color: #fff;
        border-radius: 10px;
      }
      .v-carousel-arrows {
        position: absolute;
        left: 50%;
        top: 0;
        width: 0;
        height: 100%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 9999;
        .arrow {
          position: absolute;
          left: 50%;
          width: 48px;
          height: 48px;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10000;
          pointer-events: auto;
          cursor: pointer;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5;
            z-index: -1;
            background: url("~assets/img/arrow-r.png") no-repeat center / 100%
              100%;
          }
        }
        .up {
          top: -16px;
          transform: translateX(-50%) rotate(-90deg);
        }
        .down {
          bottom: -16px;
          transform: translateX(-50%) rotate(90deg);
        }
      }
      &:hover {
        .v-carousel-arrows .arrow {
          opacity: 1;
        }
      }
      .custom-carousel {
        height: 100%;
        :deep(.el-carousel__container) {
          position: relative;
          z-index: 0;
          height: 100% !important;
          .el-carousel__item {
            height: 100%;
            .cards {
              height: 100%;
              display: flex;
              flex-direction: column;
              gap: 5px;
              .card {
                width: 100%;
                height: 50%;
                padding: 20px 30px;
                position: relative;
                &::before {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 0.5;
                  z-index: -1;
                  background: url("./imgs/32/7.png") no-repeat center/ 100% 100%;
                }
                &-top {
                  position: relative;
                  display: flex;
                  align-items: center;
                  height: 50px;
                  .chartLevel {
                    position: absolute;
                    left: 380px;
                    width: calc(100% - 380px);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    .sin {
                      position: relative;
                      width: calc((100% - 127px) / 3);
                      height: 40px;
                      &::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: -1;
                        opacity: 0.5;
                        background: url("./imgs/32/8.png") no-repeat center/
                          100% 100%;
                      }
                      &::before {
                        content: "";
                        position: absolute;
                        left: 20px;
                        top: 12px;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #4dd5ff;
                        box-shadow: 0px 2px 4px 0px #4dd5ff,
                          inset 0px 0px 25px 0px #4dd5ff;
                        border: 1px solid #4dd5ff;
                      }
                      display: flex;
                      padding-left: 47px;
                      align-items: center;
                      gap: 4px;
                      .label {
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: bold;
                        font-size: var(--font-small);
                        color: #ffffff;
                      }
                      .value,
                      .unit {
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: bold;
                        font-size: var(--font-body);
                        color: #ffbd43;
                      }
                    }
                    .level {
                      height: 40px;
                      line-height: 40px;
                      width: 127px;
                      text-align: center;
                      background: rgb(160, 38, 38, 0.7);
                      border-radius: 6px;
                      font-family: SourceHanSansSC, SourceHanSansSC;
                      font-weight: 500;
                      font-size: var(--font-body);
                      color: #ffffff;
                      &.level-middle {
                        background: rgb(254, 182, 14, 0.7);
                      }
                      &.level-low {
                        background: rgb(77, 213, 255, 0.7);
                      }
                    }
                  }
                }
                &-bot {
                  width: 100%;
                  height: calc(100% - 50px);
                  display: flex;
                  &-left {
                    width: 30%;
                    height: 100%;
                    background: url("./imgs/32/9.png") no-repeat center/ 100%
                      100%;
                    display: flex;
                    flex-direction: column;
                    .t {
                      width: 100%;
                      height: 60%;
                      .title {
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: 500;
                        font-size: 17px; /* keep minor title as-is */
                        color: #ffffff;
                        height: 30px;
                        width: 100%;
                        line-height: 30px;
                        padding-left: 20px;
                        margin-top: 10px;
                      }
                      .pieCon {
                        width: 100%;
                        height: calc(100% - 30px);
                        display: flex;
                        .piel {
                          width: 30%;
                          height: 100%;
                          position: relative;
                          .ratio-content {
                            position: absolute;
                            top: 60px;
                            left: 15px;
                            width: 115px;
                          }
                          .text-num {
                            font-family: SourceHanSansSC, SourceHanSansSC;
                            font-weight: 400;
                            font-size: 14px; /* leave tiny text unchanged */
                            color: #d3d6db;
                            line-height: 20px;
                          }
                          .count {
                            font-weight: bold;
                            font-size: 26px; /* keep specific metric size */
                            color: #ffbd43;
                          }
                        }
                        .pier {
                          width: 70%;
                          height: 100%;
                          margin-top: -15px;
                          margin-right: -15px;
                        }
                      }
                    }
                    .b {
                      width: 100%;
                      height: 40%;
                    }
                  }
                  &-right {
                    width: 70%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    margin-left: 16px;
                    padding-top: 26px;
                    .t {
                      width: 100%;
                      height: 60%;
                    }
                    .b {
                      width: 106%;
                      height: 40%;
                      display: flex;
                      margin-top: 16px;
                      .total-info {
                        width: 160px;
                        height: 123px;
                        background: url(./imgs/32/9.png) no-repeat center/ 100%
                          100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        .attack-total {
                          font-family: YouSheBiaoTiHei;
                          font-size: var(--font-h2);
                          color: transparent;
                          line-height: 40px;
                          text-transform: none;
                          background: linear-gradient(
                            180deg,
                            #ffffff 0%,
                            #ff4343 100%
                          );
                          background-clip: text;
                          -webkit-background-clip: text;
                        }
                        .attack-total-text {
                          font-family: SourceHanSansSC, SourceHanSansSC;
                          font-size: var(--font-h3);
                          color: #c5d3d6;
                          line-height: 36px;
                        }
                      }
                      .attack-country {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        width: calc(100% - 203px);
                        .attack-country-item {
                          width: 295px;
                          height: 56px;
                          background: url(./imgs/32/10.png) no-repeat center/
                            100% 100%;
                          display: flex;
                          align-items: center;
                          padding-left: 14px;
                          position: relative;
                          .seq {
                            font-family: Arial, Arial;
                            font-weight: 900;
                            font-size: var(--font-h2);
                            line-height: 46px;
                            text-align: left;
                            font-style: normal;
                            margin-right: 12px;
                            &.seq1 {
                              color: #ff2020;
                            }
                            &.seq2 {
                              color: #ff7820;
                            }
                            &.seq3 {
                              color: #ffb520;
                            }
                            &.seq4 {
                              color: #20eeff;
                            }
                          }
                          &-name {
                            font-family: SourceHanSansSC, SourceHanSansSC;
                            font-weight: 400;
                            font-size: var(--font-h3);
                            color: #c5d3d6;
                            line-height: 36px;
                            text-align: left;
                            font-style: normal;
                          }
                          &-value {
                            font-family: SourceHanSansSC, SourceHanSansSC;
                            font-weight: bold;
                            font-size: var(--font-h2);
                            color: transparent;
                            line-height: 43px;
                            background: linear-gradient(
                              180deg,
                              #ff9797 0%,
                              #e90000 100%
                            );
                            background-clip: text;
                            position: absolute;
                            right: 20px;
                            width: 100px;
                            text-align: right;
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                          }
                          &-unit {
                            font-family: SourceHanSansSC, SourceHanSansSC;
                            font-weight: 400;
                            font-size: var(--font-h3);
                            color: #c5d3d6;
                            line-height: 36px;
                            text-align: left;
                            font-style: normal;
                            margin-left: 10px;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.chartTitle {
  width: 100%;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  font-family: YouSheBiaoTiHei;
  font-size: var(--font-h3);
  letter-spacing: 1px;
  padding-left: 30px;
  background: linear-gradient(to bottom, #ffffff 0%, #6df1ff 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    width: 29px;
    height: 33px;
    background: url("./imgs/32/12.png") no-repeat center/ 100% 100%;
  }
}

.riskWarning {
  position: relative;
  .title {
    width: 100%;
    height: 100%;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.5;
      background: url("./imgs/32/14.png") no-repeat center/ cover;
    }
    .text {
      padding-top: 15px;
      display: flex;
      justify-content: center;
      background: linear-gradient(180deg, #ffffff 70%, #ff3838 100%);
      font-family: YouSheBiaoTiHei;
      font-size: var(--font-h2);
      color: transparent;
      line-height: 39px;
      letter-spacing: 7px;
      background-clip: text;
      -webkit-background-clip: text;
    }
  }
  height: 100%;
  .warning-scroll-container {
    position: absolute;
    top: 58px;
    left: 0px;
    height: 100%;
    overflow: hidden;
    width: 95%;
  }

  .warning-item {
    position: relative;
    width: 100%;
    height: 120px;
    margin-top: 15px;
    &::before {
      content: "";
      position: absolute;
      background: url("./imgs/32/15.png") no-repeat center/ cover;
      height: 100%;
      width: 100%;
      padding-left: 20px;
      margin-bottom: 10px;
      z-index: -1;
    }
    .warning-content {
      .time {
        font-family: SourceHanSansSC, SourceHanSansSC;
        font-size: var(--font-small);
        color: #ffffff;
        margin-bottom: 4px;
      }
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
      font-family: MicrosoftYaHei;
      font-size: var(--font-small);
      color: #ffffff;
      .company {
        color: #4bd2fd;
      }
      .event {
        color: #ffe264;
      }
    }
    .warning-description {
      font-family: MicrosoftYaHei;
      font-size: var(--font-small);
      color: #ffffff;
      letter-spacing: 2px;
      line-height: 30px;
    }
  }
}
</style>
