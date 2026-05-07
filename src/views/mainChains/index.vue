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
                <!-- <div class="text1">网络攻击次数</div>
                <div class="text2">企业数量</div> -->
                <ChinaMap
                  :data="mapData"
                  :baseOption="{
                    zoom: 1.25,
                    top: 60,
                    aspectScale: 0.98,
                  }"
                  :showClipDefs="true"
                  :style="{ height: '98%', transform: 'scaleX(1.0) scaleY(1.0)', top: '100px', left: '-220px' }"
                  :option="{
                    ...mapOption,
                    visualMap1: {
                      ...mapOption.visualMap1,
                      left: 250,   /* 控制左侧图例的左右位置：增加数值向右移 */
                      top: 700, /* 控制左侧图例的上下位置：减小数值向下移 */
                    },
                    visualMap2: {
                      ...mapOption.visualMap2,
                      left: 420,   /* 控制右侧图例的左右位置：需跟随左侧图例同步增加 */
                      top: 700,/* 控制右侧图例的上下位置：需跟随左侧图例同步调整 */
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
                  <!-- 上半部分：被攻击重点行业分布 -->
                  <div class="mrc-top">
                    <div class="chartTitle">被攻击重点行业分布</div>
                    <div class="mrc-bar-wrap">
                      <BackgroundBar :data="staticIndustryData" :showNational="false" />
                    </div>
                  </div>
                  <!-- 分隔线 -->
                  <div class="mrc-divider"></div>
                  <!-- 下半部分：被攻击企业分布 -->
                  <div class="mrc-bottom">
                    <div class="chartTitle">被攻击企业分布</div>
                    <div class="mrc-bar-wrap">
                      <BackgroundBar :data="staticEnterpriseData" :showNational="false" />
                    </div>
                  </div>
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
            <el-carousel
              :interval="30000"
              :autoplay="true"
              direction="horizontal"
              indicator-position="none"
              arrow="hover"
              :initial-index="0"
              ref="carouselRef"
              @change="handleCarouselChange"
              height="100%"
              class="custom-carousel"
            >
              <el-carousel-item
                v-for="(group, groupIndex) in groupedCards"
                :key="groupIndex"
              >
                <div class="slide-content">
                  <div class="main-container">
                    <div class="cards">
                      <div class="card" v-for="(item, i) in group" :key="item.name">
                    <div class="new-card-top">
                          <div class="chartTitle" @click="gotPage(item.name)">
                            {{ item.name }}
                          </div>
                          <div class="top-stats">
                            <div class="stat-box">
                              <div class="label">高危风险</div>
                              <div class="value">
                                <span class="num">{{ formatNumber(item.highThreatCount) }}</span>
                                <span class="unit">次</span>
                              </div>
                            </div>
                            <div class="stat-box right-align">
                              <div class="label">综合风险指数</div>
                              <div class="value">
                                <span class="num highlight">{{ item.riskRatio }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="new-card-bot">
                          <div class="bot-title">
                            风险企业占比
                          </div>
                          <div class="bot-content">
                            <div class="info-list">
                              <div class="info-item">
                                <div class="label">监测企业总数</div>
                                <div class="value">
                                  <span class="num">{{ formatNumber(item.totalCompanyNum) }}</span>
                                  <span class="unit">家</span>
                                </div>
                              </div>
                              <div class="info-item" style="margin-top: 15px;">
                                <div class="label">风险企业数量</div>
                                <div class="value">
                                  <span class="num highlight">{{ formatNumber(item.riskCompanyCount) }}</span>
                                  <span class="unit">家</span>
                                </div>
                              </div>
                            </div>
                            <div class="pie-box">
                              <AbnormalRatePie :percentage="item.companyRatio" title="异常占比" />
                            </div>
                          </div>
                        </div>
                        <div class="risk-warning-container">
                          <div class="warning-header">
                            网络攻击趋势
                          </div>
                          <div class="warn-line">
                            <Line :option="lineOpts" :data="item.lineData" :areaFlag="false"></Line>
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
import RealTimeAttackMonitor from "./components/RealTimeAttackMonitor.vue";
import BackgroundBar from "@c/echarts/bar/BackgroundBar/index.vue";
import BackgroundBar2 from "@c/echarts/bar/TerminalRankBar2/index.vue";
import { useData } from "./hooks/useData";
import chartBox from "@c/chartBox";
import ActTabs from "@c/ActTabs";
import Pie from "@c/echarts/Pie/NewPie";
import AbnormalRatePie from "@c/echarts/Pie/AbnormalRate/index.vue";
import Line from "@c/echarts/Line/lineArea/index.vue";
import ChinaMap from "@/components/echarts/map/ImgChina/index";
import { computed, ref } from "vue";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import { QuestionFilled, Setting, Warning } from "@element-plus/icons-vue";
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
  riskWarningData,
  lineData,
  lineOpts,
  gotPage,
  specialList,
  handleClick,
  currentChart,
  attackData,
  attackTypeData,
  switchChart,
  staticEnterpriseData,
  staticIndustryData,
} = useData();

const carouselRef = ref(null);
const currentIndex = ref(0);

function getSlideLineData(group, index) {
  if (!group || group.length <= index) return lineData.value;
  return {
    legend: [group[index].name],
    category: group[index].lineData.category,
    values: [group[index].lineData.values[0]],
  };
}

function handleCarousel(direction) {
  if (!carouselRef?.value) return;
  if (direction === "up" || direction === "left") {
    carouselRef.value.prev();
  } else if (direction === "down" || direction === "right") {
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
              font-family: var(--font-family-body);
              font-weight: bold;
              font-size: var(--font-small);
              color: #ffffff;
              text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
              font-style: normal;
            }
            .valueAll {
              font-family: var(--font-family-body);
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
            gap: 20px; /* 增加网格间距 */
            padding: 10px; /* 防止阴影被截断 */
            .sin {
              width: calc(50% - 10px); /* 减去 gap 的一半 */
              height: calc(50% - 10px); /* 占据一半高度减去 gap */
              display: flex;
              align-items: center;
              position: relative;
              background: linear-gradient(180deg, rgba(10, 24, 50, 0.4) 0%, rgba(20, 60, 120, 0.2) 100%);
              border: 2px solid rgba(0, 210, 255, 0.6);
              box-shadow: inset 0 0 15px rgba(0, 210, 255, 0.3), 0 0 10px rgba(0, 210, 255, 0.2);
              border-radius: 8px;
              
              /* 增加四个角标装饰 */
              &::before, &::after {
                content: '';
                position: absolute;
                width: 15px;
                height: 15px;
                border: 2px solid #00d2ff;
                z-index: 1;
              }
              &::before {
                top: -2px;
                left: -2px;
                border-right: none;
                border-bottom: none;
              }
              &::after {
                bottom: -2px;
                right: -2px;
                border-left: none;
                border-top: none;
              }
              
              /* 利用伪元素和单独定义的角标类（如果在 HTML 中无法添加 div，可直接用这里的方式或后续通过伪元素加渐变线，由于 HTML 中原本没有额外的 div，所以我们只使用伪元素，对于剩余两个角我们需要在内部使用盒子阴影或改变 DOM。由于我们不能大幅改 DOM，先保持只用 ::before 和 ::after 两个角标，这也是很常见的科技感设计。如果您需要四个角都有，我们可以通过给 .img 添加伪元素来欺骗视觉，或者在内部使用 outline。为了保持一致，我们采用和之前一样的 CSS，不过因为我们没有额外的 DOM 元素，我们通过增加两层阴影或者 box-shadow 来达到效果，或者通过 border-image。为了最稳定，我们保留左上和右下两个角标即可，同样很有科技感。 */

              .img {
                margin-left: 20px; /* 调整间距以适应新背景 */
                width: 93px;
                height: 92px;
                background: url("./imgs/32/5.png") no-repeat center/ 100% 100%;
                position: relative;
              }
              .ot {
                padding: 30px 40px 30px 10px;
                width: calc(100% - 113px);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .label {
                  font-family: var(--font-family-title);
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
                    font-family: var(--font-family-title);
                    font-size: 48px;
                    color: #ffffff;
                  }
                  .unit {
                    font-family: var(--font-family-body);
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
                  font-family: var(--font-family-body);
                  font-weight: 500;
                  font-size: 22px;
                  color: #c7ddff;
                  line-height: 36px;
                  width: 200px;
                  height: 37px;
                  text-align: center;
                  cursor: pointer;
                  background: url(./imgs/tab.png) no-repeat center / 100% 100%;
                  &.active {
                    font-weight: bold;
                    font-size: 22px;
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
          width: 1550px;
          height: 1000px;
          position: absolute;
          top: -85px;
          left: 38px;
          background: url(~assets/img/mapbg1.png) no-repeat center / 100% 100%;
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
          right: 96px; /* 控制左右位置：增大数值向左移，减小数值向右移 */
          top: 20px;  
          width: 498px;
          height: 850px;
          display: flex;
          .sin {
            &.sin1 {
              width: 100%;
              height: 100%;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }
          }

          // 上半部分：行业分布条形图
          .mrc-top {
            flex: 1.2;
            display: flex;
            flex-direction: column;
            padding-bottom: 8px;
          }
          .mrc-bar-wrap {
            flex: 1;
            width: 100%;
            min-height: 0;
          }

          // 分隔线
          .mrc-divider {
            width: 100%;
            height: 1px;
            background: rgba(0, 210, 255, 0.3);
            margin: 4px 0;
            flex-shrink: 0;
          }

          // 下半部分：企业排名表格
          .mrc-bottom {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            width: 100%;
          }
          .mrc-table-wrap {
            flex: 1;
            overflow: hidden;
            padding: 0 8px;
          }
          .mrc-enterprise-table {
            width: 100%;
            table-layout: fixed;   // 关键：固定列宽，不随内容拉伸
            border-collapse: collapse;
            text-align: left;

            th {
              color: #ffffff;
              font-size: 18px;
              font-weight: normal;
              padding: 10px 8px;
              border-bottom: 1px solid rgba(0, 210, 255, 0.2);
              white-space: nowrap;
              // 列宽比例：排名10% | 企业名65% | 总次数25%
              &:nth-child(1) { width: 10%; }
              &:nth-child(2) { width: 70%; text-align: left;}
              &:nth-child(3) { width: 20%; text-align: right;}
            }
            td {
              padding: 10px 8px;
              font-size: 20px;
              color: #ffffff;
              border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
              transition: background 0.3s;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            tbody tr:last-child td {
              border-bottom: none;
            }
            tbody tr:hover td {
              background: rgba(0, 210, 255, 0.08);
            }
          }
          // 排名序号（无方框，斜体蓝色数字）
          .rank-badge {
            font-family: 'DIN', 'SourceHanSansSC', sans-serif;
            font-size: 20px;
            font-weight: bold;
            font-style: italic;
            color: #00d2ff;
            &.rank-normal {
              color: #ffffff;
              opacity: 0.6;
            }
          }
          .ent-name {
            color: #ffffff;
          }
          .ent-count {
            color: #00d2ff;
            font-size: 20px;
            letter-spacing: 1px;
            text-shadow: 0 0 5px rgba(0, 210, 255, 0.3);
            white-space: nowrap;
            text-align: right;
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
        display: none;
      }
      .h-carousel-arrows {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 0;
        transform: translateY(-50%);
        pointer-events: none;
        z-index: 9999;
        .arrow {
          position: absolute;
          top: 0;
          width: 48px;
          height: 48px;
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
        .left {
          left: -16px;
          transform: rotate(180deg);
        }
        .right {
          right: -16px;
        }
      }
      &:hover {
        .h-carousel-arrows .arrow {
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
            .slide-content {
              height: 100%;
              .main-container {
                height: 100%;
                width: 100%;
                position: relative;
                padding: 20px;
                display: flex;
                flex-direction: column;
              }
              .cards {
                height: 100%;
                display: flex;
                flex-direction: row;
                gap: 20px;
                .card {
                  width: calc(50% - 10px);
                  height: 100%;
                  padding: 10px 20px 15px 20px;
                  position: relative;
                  background: linear-gradient(180deg, rgba(10, 24, 50, 0.4) 0%, rgba(20, 60, 120, 0.2) 100%);
                  border: 2px solid rgba(0, 210, 255, 0.6);
                  box-shadow: inset 0 0 15px rgba(0, 210, 255, 0.3), 0 0 10px rgba(0, 210, 255, 0.2);
                  border-radius: 8px;
                  overflow: hidden;
                  
                  /* 增加四个角标装饰 */
                  &::before, &::after {
                    content: '';
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    border: 2px solid #00d2ff;
                    z-index: 1;
                  }
                  &::before {
                    top: -2px;
                    left: -2px;
                    border-right: none;
                    border-bottom: none;
                  }
                  &::after {
                    bottom: -2px;
                    right: -2px;
                    border-left: none;
                    border-top: none;
                  }
                  
                  .new-card-top {
                    height: 215px;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed rgba(77, 213, 255, 0.5);
                    .top-stats {
                      display: flex;
                      justify-content: space-between;
                      margin-top: 15px;
                      padding: 0 10px;
                      .stat-box {
                        .label {
                          font-size: 22px;
                          color: #ffffff;
                          margin-bottom: 5px;
                          font-family: var(--font-family-body);
                        }
                        .value {
                          .num {
                            font-family: var(--font-family-title);
                            font-size: 48px;
                            color: #fff;
                            &.highlight {
                              color: #4dd5ff;
                            }
                          }
                          .unit {
                            font-family: var(--font-family-body);
                            font-weight: 400;
                            font-size: var(--font-body);
                            color: #ffffff;
                            margin-left: 4px;
                          }
                        }
                        &.right-align {
                          text-align: right;
                        }
                      }
                    }
                  }
                  .new-card-bot {
                    height: 330px;
                    margin-top: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed rgba(77, 213, 255, 0.5);
                    .bot-title {
                      display: flex;
                      align-items: center;
                      font-family: var(--font-family-title);
                      font-size: var(--font-h3);
                      letter-spacing: 1px;
                      padding-left: 30px;
                      background: linear-gradient(to bottom, #ffffff 0%, #6df1ff 100%);
                      color: transparent;
                      background-clip: text;
                      -webkit-background-clip: text;
                      position: relative;
                      &::before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 29px;
                        height: 33px;
                        background: url("./imgs/32/12.png") no-repeat center/ 100% 100%;
                      }
                    }
                    .bot-content {
                      display: flex;
                      align-items: center;
                      margin-top: 30px;
                      height: 200px;
                      position: relative;
                      z-index: 1;
                      .info-list {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        gap: 5px;
                        padding-left: 12px;
                        .info-item {
                          .label {
                            font-size: 22px;
                            color: #ffffff;
                            margin-bottom: 8px;
                            font-family: var(--font-family-body);
                          }
                          .value {
                            .num {
                              font-family: var(--font-family-title);
                              font-size: 48px;
                              color: #fff;
                              &.highlight {
                                color: #4dd5ff;
                              }
                            }
                            .unit {
                              font-family: var(--font-family-body);
                              font-weight: 400;
                              font-size: var(--font-body);
                              color: #ffffff;
                              margin-left: 4px;
                            }
                          }
                        }
                      }
                      .pie-box {
                        width: 50%;
                        height: 190px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }
                    }
                  }
                   .risk-warning-container {
                    height: calc(100% - 565px);
                    margin-top: 20px; 
                    position: relative;
                    // Removed background here
                    .warning-header {
                      display: flex;
                      align-items: center;
                      font-family: var(--font-family-title);
                      font-size: var(--font-h3);
                      letter-spacing: 1px;
                      padding-left: 30px;
                      background: linear-gradient(to bottom, #ffffff 0%, #6df1ff 100%);
                      color: transparent;
                      background-clip: text;
                      -webkit-background-clip: text;
                      position: relative;
                      margin-bottom: 20px;
                      &::before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 29px;
                        height: 33px;
                        background: url("./imgs/32/12.png") no-repeat center/ 100% 100%;
                      }
                    }
                    .warn-line {
                      height: calc(100% - 70px);
                      width: 100%;
                      display: flex;
                    }
                    .warning-chart {
                      width: 50%;
                      height: 100%;
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
  font-family: var(--font-family-title);
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
      font-family: var(--font-family-title);
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
    width: 98%;
  }

  .warning-item {
    padding-left: 20px;
    position: relative;
    width: 100%;
    min-height: 50px;
    margin-top: 15px;
    background: rgba(18, 24, 39, 0.8);
    border: 1px solid rgba(77, 213, 255, 0.1);
    border-radius: 4px;
    &::before {
      content: "";
      position: absolute;
      top: 10%;
      left: 0;
      width: 4px;
      height: 80%;
      background: #00f0ff;
      box-shadow: 0 0 10px #00f0ff;
      border-radius: 2px;
    }

    .warning-content {
      .time {
        font-family: var(--font-family-body);
        color: #ffffff;
        margin-bottom: 4px;
         font-size: 22px;
      }
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
      margin-top: 10px;
      font-family: var(--font-family-body);
      color: #ffffff;
        font-size: 22px;
      .company {
        color: #4bd2fd;
      }
      .event {
        color: #ffe264;
      }
    }
  }
}
</style>
