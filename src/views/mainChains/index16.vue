<template>
  <div class="mianChains16">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-26px"
    ></ActTabs>
    <div class="main-content">
      <div class="left">
        <div class="sin" style="height: 30%">
          <chart-box title="安全总览">
            <template v-slot:chart>
              <div class="sin2-con">
                <div class="sin" v-for="(item, index) in leftInfo" :key="index">
                  <!-- <div class="img"></div> -->
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
                            <el-dropdown-menu class="custom-dropdown-menu sm">
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
            </template>
          </chart-box>
        </div>
        <div class="sin" style="height: 40%">
          <chart-box title="攻击来源TOP5">
            <template v-slot:chart>
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
            </template>
          </chart-box>
        </div>
        <div class="sin" style="height: 25%">
          <chart-box title="攻击类型TOP5">
            <template v-slot:chart>
              <BackgroundBar2 :data="attackTypeData"></BackgroundBar2>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right">
        <div class="side-title">重点行业企业地域分布情况</div>
        <div class="map-container">
          <div class="text1">网络攻击次数</div>
          <div class="text2">企业数量</div>
          <ChinaMap
            :data="mapData"
            :baseOption="{ zoom: 1.14, top: 40, center: [125.97, 29.71] }"
            :option="{
              ...mapOption,
              visualMap1: { ...mapOption.visualMap1, left: 10, top: 390 },
              visualMap2: { ...mapOption.visualMap2, left: 10, top: 520 },
            }"
            :showCube="true"
            name1="网络攻击次数"
            name2="企业数量"
          ></ChinaMap>
        </div>
        <div style="position: absolute; left: 0; bottom: 195px; width: 500px">
          <chart-box title="重点行业安全态势分析"> </chart-box>
        </div>
        <div class="cards-container" v-if="groupedCards.length > 0">
          <el-carousel
            :interval="30000"
            :autoplay="true"
            indicator-position="none"
            arrow="hover"
            :initial-index="0"
            ref="carouselRef"
            height="200px"
            class="custom-carousel"
          >
            <el-carousel-item
              v-for="(group, groupIndex) in groupedCards"
              :key="groupIndex"
            >
              <div class="cards">
                <div class="card" v-for="(item, i) in group" :key="i">
                  <div class="card-l">
                    <div class="sin1 mb-5">
                      <div class="icon"></div>
                      <div
                        class="label"
                        style="cursor: pointer"
                        @click="gotPage(item.name)"
                      >
                        {{ item.name }}
                      </div>
                      <div class="con">
                        <div class="value">
                          {{ formatNumber(item.totalCompanyNum) }}
                        </div>
                        <div class="unit">家</div>
                      </div>
                    </div>
                    <div class="card-l-b">
                      <RankBar
                        :data="item.rankData"
                        :titleFontSize="14"
                        :valueFontSize="14"
                        :badgeFontSize="12"
                      ></RankBar>
                      <!-- <div class="card-l-b-c"></div>
                      <div class="card-l-b-c"></div> -->
                    </div>
                    <!-- <div class="sin2">
                      <div class="sin">
                        <div class="icon bg1"></div>
                        <div class="con">
                          <div class="label">暴露资产</div>
                          <div class="botCon">
                            <div class="num">123</div>
                            <div class="unit">个</div>
                          </div>
                        </div>
                      </div>
                      <div class="sin">
                        <div class="icon bg2"></div>
                        <div class="con">
                          <div class="label">漏洞隐患</div>
                          <div class="botCon">
                            <div class="num">456</div>
                            <div class="unit">个</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="sin3">
                      <div class="y sin">冲冲冲</div>
                      <div class="b sin">冲冲冲</div>
                    </div> -->
                  </div>
                  <div class="card-r">
                    <div class="sin bg1">
                      <div class="label">风险企业：</div>
                      <div class="value">
                        {{ formatNumber(item.riskCompanyCount) }}
                      </div>
                      <div class="unit">家</div>
                    </div>
                    <div class="sin bg2">
                      <div class="label">高危风险：</div>
                      <div class="value">
                        {{ formatNumber(item.highThreatCount) }}
                      </div>
                      <div class="unit">次</div>
                    </div>
                    <div class="sin bg3">
                      <div class="label">风险指数：</div>
                      <div class="value">{{ item.riskRatio }}</div>
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
                    <div class="sin bg4">
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
                        ⚠ {{ item.riskLevel }}风险
                      </div>
                      <!-- <div class="level">⚠{{ item.riskLevel }}风险</div> -->
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="mapRightCon">
          <div class="sin">
            <chart-box title="风险告警">
              <template v-slot:chart>
                <div class="riskWarning">
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
                          {{ data.startTime }} 至 {{ data.endTime }}监测发现
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
              </template>
            </chart-box>
          </div>
          <div class="sin">
            <chart-box title="各重点行业被攻击态势">
              <template v-slot:chart>
                <div class="table-container">
                  <act-table
                    :showSeq="true"
                    :columns="columns"
                    :tableData="tableData"
                    :seqWidth="60"
                    class="table16"
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
  </div>
</template>

<script setup>
import BackgroundBar from "@c/echarts/bar/BackgroundBar/index.vue";
import BackgroundBar2 from "@c/echarts/bar/TerminalRankBar2/index.vue";
import { useData } from "./hooks/useData";
import chartBox from "@c/chartBox";
import ActTabs from "@c/ActTabs";
import ActTable from "@c/ActTable";
import Pie from "@c/echarts/Pie/NewPie";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index16.vue";
import RankBar from "@c/echarts/bar/CircleSymbolBar/index16.vue";
import Line from "@c/echarts/Line/lineArea16/index.vue";
import ChinaMap from "@/components/echarts/map/China16/index";
import { computed } from "vue";
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
.mianChains16 {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  --font-h1: 34px;
  --font-h2: 24px;
  --font-h3: 22px;
  --font-body: 16px;
  --font-label: 18px;
  --font-unit: 16px;
  --font-number-lg: 30px;
  --font-number: 26px;
  --font-number-sm: 22px;
  --font-table: 14px;

  .top-stats {
    height: 80px;
    display: flex;
    align-items: center;
    gap: 16px;
    // justify-content: space-around;
    .stats-item {
      display: flex;
      align-items: center;
      &.left {
        width: 388px;
        height: 100%;
        font-family: YouSheBiaoTiHei;
        font-size: var(--font-h2);
        color: rgba(255, 255, 255, 0.9);
        line-height: 34px;
        display: flex;
        justify-content: center;
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
          background: url("./imgs/1.png");
        }
      }
      &.label {
        width: 218px;
        height: 49px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 8px;
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
          background: url("./imgs/2.png");
        }
        .text {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-body);
          color: #ffffff;
        }
        .num {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-number-sm);
          color: #00ffff;
        }
        .unit {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-unit);
          color: #00ffff;
        }
      }
      &.level1 {
        width: 163px;
        height: 36px;
        display: flex;
        justify-content: center;
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
          background: url("./imgs/3.png") no-repeat center;
        }
        .text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: var(--font-label);
          color: #ffffff;
        }
        .num {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-number-sm);
          color: #ff5321;
          line-height: 27px;
          padding-top: 4px;
        }
        .unit {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-unit);
          color: #ff5321;
          line-height: 27px;
          padding-top: 4px;
        }
      }
      &.level2 {
        width: 163px;
        height: 36px;
        display: flex;
        justify-content: center;
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
          background: url("./imgs/4.png") no-repeat center;
        }
        .text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: var(--font-label);
          color: #ffffff;
        }
        .num {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-number-sm);
          color: #ffbd43;
        }
        .unit {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-unit);
          color: #ffbd43;
        }
      }
      &.level3 {
        width: 163px;
        height: 36px;
        display: flex;
        justify-content: center;
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
          background: url("./imgs/5.png") no-repeat center;
        }
        .text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: var(--font-label);
          color: #ffffff;
        }
        .num {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-number-sm);
          color: #00d2ff;
        }
        .unit {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 800;
          font-size: var(--font-unit);
          color: #00d2ff;
        }
      }
    }
    .right-list {
      display: flex;
      align-items: center;
      gap: 60px;
      width: 70%;
      margin-left: 100px;
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    height: calc(100% - 90px);

    .left {
      width: 25%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      .sin2-con {
        width:100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        // padding-left: 30px;
        .sin {
          width: 50%;
          height: 110px;
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 15px;
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 210px;
            height: 110px;
            z-index: -1;
            opacity: 0.5;
            background: url("./imgs/32/4.png") no-repeat center / 100% 100%;
          }  
          // .img {
          //   margin-left: 40px;
          //   width: 52px;
          //   height: 53px;
          //   background: url("./imgs/32/5.png") no-repeat center/ 100% 100%;
          // }
          .ot {
            padding: 30px 40px 30px 10px;
            margin-left: 10px;
            width: 200px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .label {
              font-family: YouSheBiaoTiHei;
              font-size: var(--font-h3);
              letter-spacing: 1px;
              color: transparent;
              background: linear-gradient(to bottom, #ffffff 0%, #6df1ff 100%);
              background-clip: text;
              -webkit-background-clip: text;
            }
            .valueAll {
              display: flex;
              gap: 10px;
              align-items: center;
              .num {
                font-family: YouSheBiaoTiHei;
                font-size: 24px;
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
      .sin{
        .chart-box{
            .chart-wrapper{
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
      }
    }

    .right {
      width: 75%;
      height: 100%;
      position: relative;
      .side-title {
        width: 60%;
        height: 50px;
        font-family: YouSheBiaoTiHei;
        font-size: var(--font-h3);
        color: #ffffff;
        line-height: 50px;
        padding-left: 60px;
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
          background: url(~assets/img/specialMonitoring/left-title1.png)
            no-repeat center / 100% 100%;
        }
      }
      .map-container {
        height: calc(100% - 50px);
        width: 100%;
        position: relative;
        .text1 {
          position: absolute;
          bottom: 420px;
          left: 10px;
          font-size: var(--font-body);
          color: #fff;
        }
        .text2 {
          position: absolute;
          bottom: 540px;
          left: 10px;
          font-size: var(--font-body);
          color: #fff;
        }
      }
      .cards-container {
        position: absolute;
        bottom: 0px;
        height: 200px;
        width: 100%;
        --font-label: 16px;
        --font-number-sm: 20px;
        .custom-carousel {
          height: 100%;
          :deep(.el-carousel__container) {
            height: 100%;
            .el-carousel__item {
              height: 100%;
              .cards {
                display: flex;
                gap: 30px;
                .card {
                  width: 50%;
                  height: 170px;
                  padding: 15px 30px;
                  display: flex;
                  gap: 10px;
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
                    background: url("./imgs/blue.png") no-repeat center / cover;
                  }
                  /* 背景新增玻璃效果 */
                  backdrop-filter: blur(12px) saturate(180%);
                  -webkit-backdrop-filter: blur(12px) saturate(180%);
                  background-color: rgba(30, 44, 77, 0.25);
                  border-radius: 18px;
                  border: 1px solid rgba(255, 255, 255, 0.18);

                  &-l {
                    width: 60%;
                    .sin1 {
                      display: flex;
                      gap: 20px;
                      margin-left: 8px;
                      align-items: center;
                      .icon {
                        width: 31px;
                        height: 32px;
                        background: url("./imgs/bot1.png") no-repeat center /
                          cover;
                      }
                      .label {
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: bold;
                        font-size: var(--font-label);
                        color: rgba(255, 255, 255, 0.9);
                        line-height: 27px;
                        letter-spacing: 1px;
                      }
                      .con {
                        display: flex;
                        .value {
                          font-family: SourceHanSansSC, SourceHanSansSC;
                          font-weight: 800;
                          font-size: var(--font-number-sm);
                          color: #ff6a79;
                        }
                        .unit {
                          font-size: 14px;
                          color: #fff;
                          margin-left: 6px;
                          padding-top: 7px;
                        }
                      }
                    }
                    .sin2 {
                      display: flex;
                      height: 50px;
                      align-items: center;
                      margin-bottom: 16px;
                      .sin {
                        width: 50%;
                        height: 50px;
                        align-items: center;
                        display: flex;
                        .icon {
                          width: 49px;
                          height: 41px;
                          &.bg1 {
                            background: url("./imgs/bot2.png") no-repeat center /
                              cover;
                          }
                          &.bg2 {
                            background: url("./imgs/bot3.png") no-repeat center /
                              cover;
                          }
                        }
                        .con {
                          width: calc(100% - 50px);
                          .label {
                            font-family: SourceHanSansSC, SourceHanSansSC;
                            font-weight: bold;
                            font-size: var(--font-body);
                            color: #ffffff;
                          }
                          .botCon {
                            display: flex;
                            align-items: center;
                            .num {
                              font-family: YouSheBiaoTiHei;
                              font-size: var(--font-number);
                              background: linear-gradient(
                                to bottom,
                                white 0%,
                                white 40%,
                                #ffb215 60%,
                                #ffb215 100%
                              );
                              -webkit-background-clip: text;
                              background-clip: text;
                              color: transparent;
                            }
                            .unit {
                              font-family: SourceHanSansSC, SourceHanSansSC;
                              font-weight: 400;
                              font-size: var(--font-table);
                              color: rgba(255, 255, 255, 0.9);
                            }
                          }
                        }
                      }
                    }
                    .sin3 {
                      display: flex;
                      gap: 20px;
                      .sin {
                        width: 50%;
                        height: 25px;
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: 500;
                        font-size: var(--font-table);
                        color: #ffffff;
                        letter-spacing: 1px;
                        text-align: center;
                        &.y {
                          background: rgba(255, 204, 77, 0.1);
                          box-shadow: inset 0px 0px 11px 0px
                            rgba(255, 199, 77, 0.5);
                          border: 1px solid #ffb64d;
                        }
                        &.b {
                          background: rgba(77, 213, 255, 0.1);
                          box-shadow: inset 0px 0px 11px 0px
                            rgba(77, 213, 255, 0.5);
                          border: 1px solid #4dd5ff;
                        }
                      }
                    }
                    .card-l-b {
                      height: calc(100% - 30px);
                      display: flex;
                      .card-l-b-c {
                        width: 50%;
                        height: 100%;
                      }
                    }
                  }
                  &-r {
                    width: 40%;
                    .sin {
                      display: flex;
                      width: 245px;
                      height: 30px;
                      margin-bottom: 7px;
                      align-items: center;
                      .label {
                        padding-left: 50px;
                        font-family: PingFangSC, PingFang SC;
                        font-weight: 500;
                        font-size: 14px;
                        color: #ffffff;
                      }
                      .value {
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: bold;
                        font-size: 16px;
                        color: #4bd2fd;
                      }
                      .unit {
                        font-size: 14px;
                        color: #fff;
                        padding-top: 5px;
                        margin-left: 5px;
                      }
                      .level {
                        width: 100%;
                        text-align: center;
                        font-family: SourceHanSansSC, SourceHanSansSC;
                        font-weight: bold;
                        font-size: var(--font-label);
                        color: #ffffff;
                      }
                      &.bg1 {
                        background: url("./imgs/bot5.png") no-repeat center /
                          cover;
                      }
                      &.bg2 {
                        background: url("./imgs/bot6.png") no-repeat center /
                          cover;
                      }
                      &.bg3 {
                        background: url("./imgs/bot7.png") no-repeat center /
                          cover;
                      }
                      &.bg4 {
                        // background: url("./imgs/bot4.png") no-repeat center /
                        //   cover;
                        .level {
                          background: rgb(160, 38, 38, 0.7);
                          border-radius: 6px;
                          &.level-middle {
                            background: rgb(254, 182, 14, 0.7);
                          }
                          &.level-low {
                            background: rgb(77, 213, 255, 0.7);
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
      .mapRightCon {
        position: absolute;
        right: 0;
        bottom: 220px;
        width: 490px;
        height: 760px;
        display: flex;
        flex-direction: column;
        .sin {
          height: 50%;
          .table-container {
            height: 100%;
          }
        }
      }
    }
  }
  :deep(.chart-title) {
    align-items: center;
    .title {
      font-size: var(--font-h3);
      margin-top: 4px;
      margin-left: -2px;
    }
    .icon-img {
      width: 28px;
      height: 24px;
    }
    .line,
    .linebox {
      display: none;
    }
  }
}

.riskWarning {
  height: 100%;
  .warning-scroll-container {
    height: 100%;
    overflow: hidden;
  }

  .warning-item {
    position: relative;
    width: 100%;
    padding-left: 20px;
    .time {
      font-family: SourceHanSansSC, SourceHanSansSC;
      font-size: var(--font-body);
      color: #ffffff;
      margin-bottom: 4px;
    }
    .warning-con {
      padding: 15px 20px;
      width: 428px;
      height: 109px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.7;
        z-index: -1;
        background: url("./imgs/red.png") no-repeat center / cover;
      }
      .warning-content {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        flex-wrap: wrap;
        font-family: MicrosoftYaHei;
        font-size: var(--font-body);
        color: #ffffff;
        .company {
          color: #4bd2fd;
        }
        .event {
          color: #ffe264;
        }
      }
      .warning-description {
        font-family: SourceHanSansSC, SourceHanSansSC;
        font-weight: 500;
        font-size: var(--font-table);
        color: #ffffff;
      }
    }
  }
}
</style>
