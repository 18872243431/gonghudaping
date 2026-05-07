<template>
  <div class="enterprise-security">
    <div class="left">
      <div class="left1">
         <chart-box title="2025年工业领域网络安全威胁持续攀升">
          <template v-slot:chart>
              <div
                class="overview-item"
                v-for="item in overviewData1"
                :key="item.name"
              >
                <img
                  class="overview-item-icon"
                  :src="require(`./imgs/${item.icon}.png`)"
                  alt=""
                  srcset=""
                />
                <div class="overview-item-name">{{ item.name }}</div>
                <div class="overview-item-value">
                  {{ item.value }}<span class="unit">{{ item.unit }}</span>
                </div>
              </div>
             </template>
        </chart-box>
      
      </div>
      <div class="left2">
        <chart-box title="2025年工业领域网络安全威胁持续攀升">
          <template v-slot:chart>
            <CubeBarLine
                    :single="0"
                    :data="barLineData"
                    :option="{
                      yAxis: [{}, {}],
                      tooltip: {
                        formatter: (params) => {
                          const name = params[0].name;
                          const value1 = params[0].value;
                          const value2 = params[1].value;
                          return `<p style=\'font-family: var(--font-family-body); font-size:20px; color:#ffffff; margin-bottom:10px\'>${name}</p>
                      <p style=\'font-family: var(--font-family-body); font-size:20px; color:#ffffff;\'>受攻击企业：<span style=\'font-family: var(--font-family-num); font-size:24px;\'>${value1}</span>家</p>
                      <p style=\'font-family: var(--font-family-body); font-size:20px; color:#ffffff;\'>攻击次数：<span style=\'font-family: var(--font-family-num); font-size:24px;\'>${value2}</span>万次</p>
                      `;
                        },
                      },
                    }"
                  ></CubeBarLine>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="top-container">
        <chart-box title="2025年漏洞利用攻击企业数量呈扩散态势">
          <template v-slot:chart>
            <div class="top-content">
              <div class="top-phase">
                <template v-for="(item, index) in topPhaseData" :key="item.name">
                  <div class="phase-item">
                    <div class="phase-title">{{ item.name }}：{{ item.title }}</div>
                    <div class="phase-value">{{ item.value }}%</div>
                  </div>

                </template>
              </div>
              <div class="top-image-placeholder">
              </div>
              <div class="top-bars">
                <div class="bar-item" v-for="(barData, index) in topBarData" :key="index">
                  <RankBar :data="[barData]" unit="万次" :option="{
                    yAxis: [
                      {
                        axisLabel: {
                          rich: {
                            seq: { fontSize: 20, color: '#ffffff', padding: [0, 5, 0, 0], fontFamily: '\'DIN\', \'SourceHanSansSC\', sans-serif' },
                            label: { fontSize: 20, color: '#ffffff', fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif' }
                          }
                        }
                      },
                      {
                        axisLabel: { fontSize: 24, color: '#ffffff', fontFamily: '\'DIN\', \'SourceHanSansSC\', sans-serif' }
                      }
                    ]
                  }"></RankBar>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="bottom-container">
        <chart-box title="2025年境外攻击IP地址数量同比增长近四成">
          <template v-slot:chart>
            <div class="bottom-content">
              <div class="bottom-left">
                <div 
                  class="bottom-left-item"
                  v-for="item in bottomLeftData"
                  :key="item.name"
                >
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-value">
                    <span class="number">{{ item.value }}</span>
                    <span class="unit">{{ item.unit }}</span>
                  </div>
                </div>
              </div>
              <div class="bottom-right">
                <TmtDoubleBar 
                  :data="bottomChartData"
                  :typeList="['2024年', '2025年']"
                />
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
       <div class="right2">
        <chart-box title="2025年网络攻击分布不均匀，行业风险分层明显">
          <template v-slot:chart>
            <div class="right2-content-new">
              <div class="chart-section" style="height: 100%; width: 100%;">
                <RankBar :data="industryRiskBarData" unit="万次" :option="{
                  yAxis: [
                    {
                      axisLabel: {
                        rich: {
                          seq: { fontSize: 20, color: '#ffffff', padding: [0, 5, 0, 0], fontFamily: '\'DIN\', \'SourceHanSansSC\', sans-serif' },
                          label: { fontSize: 20, color: '#ffffff', fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif' }
                        }
                      }
                    },
                    {
                      axisLabel: { fontSize: 24, color: '#ffffff', fontFamily: '\'DIN\', \'SourceHanSansSC\', sans-serif' }
                    }
                  ]
                }"></RankBar>
              </div>

              <div class="insight-section">
                  <div class="insight-card" v-for="(card, index) in industryRiskCardData" :key="index" :class="card.cardClass">
                      <div class="card-header">
                          <div class="card-title">{{ card.title }}</div>
                          <div :class="['card-tag', card.tagClass]">{{ card.tag }}</div>
                      </div>
                      <div class="card-desc" style="color: #ffffff !important;" v-html="card.descHtml"></div>
                  </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right1">
        <chart-box title="典型案例">
          <template v-slot:chart>
            <div class="case-content">
              <div class="case-item" v-for="(item, index) in caseData" :key="item.id">
                <div class="case-corner corner-tl"></div>
                <div class="case-corner corner-tr"></div>
                <div class="case-corner corner-bl"></div>
                <div class="case-corner corner-br"></div>
                <div class="case-bg-placeholder" :class="`bg-${index + 1}`"></div>
                <div class="case-info">
                  <div class="case-name">{{ item.name }}</div>
                  <div class="case-name-en">{{ item.nameEn }}</div>
                  <div class="case-divider"></div>
                </div>
                <div class="case-button" @click="index === 0 ? openChangchengDetail() : openBeifangDetail()">
                  <span>查看详情</span>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    
    <el-dialog v-model="dialogVisible" width="fit-content" top="10vh" center custom-class="ratio-dialog" destroy-on-close :show-close="true" append-to-body>
      <div class="iframe-container" style="width: 90vw; max-width: calc(80vh * 32 / 9); aspect-ratio: 32 / 9; position: relative;">
        <iframe :src="currentIframeUrl" style="width: 100%; height: 100%; border: none; display: block;" frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import url1 from '!!file-loader?name=media/[name].[hash:8].[ext]!./enterpriseRisk.html';
import url2 from '!!file-loader?name=media/[name].[hash:8].[ext]!./enterpriseRisk2.html';

// 强制 webpack 打包当前目录下的 imgs 文件夹中的图片，并输出到媒体文件夹对应的相对位置
const req = require.context('!!file-loader?name=media/imgs/[name].[ext]!./imgs', false, /\.(png|jpe?g|gif|svg)$/);
req.keys().forEach(req);

import chartBox from "@c/chartBox";
import CubeBarLine from "@c/echarts/bar/CubeBarLine";
import TmtDoubleBar from "@c/echarts/bar/TmtDoubleBar";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import { useData } from "./hooks/useData";

const dialogVisible = ref(false);
const currentIframeUrl = ref('');

const {
  overviewData1,
  barLineData,
  bottomLeftData,
  bottomChartData,
  topPhaseData,
  topBarData,
  vulnerabilityData,
  vulnerabilityPieData,
  caseData,
  vendorData,
  industryRiskBarData,
  industryRiskCardData
} = useData();


const openChangchengDetail = () => {
  currentIframeUrl.value = url1;
  dialogVisible.value = true;
};

const openBeifangDetail = () => {
  currentIframeUrl.value = url2;
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
.ratio-dialog {
  background-color: #000f28 !important;
  border: 1px solid rgba(0, 210, 255, 0.3);
  box-shadow: inset 0 0 20px rgba(0, 210, 255, 0.05);

  .el-dialog__header {
    padding: 15px 20px;
    border-bottom: 1px solid rgba(0, 210, 255, 0.2);
    text-align: center;
    position: relative;
    
    .el-dialog__title {
      color: #00f3ff;
      font-family: var(--font-family-title);
      font-weight: bold;
      font-size: 24px;
    }
    
    .el-dialog__headerbtn {
      position: absolute;
      top: 5px;
      right: 20px;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #00f3ff;
      font-size: 24px;
    }
  }

  .el-dialog__body {
    padding: 0 !important;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
