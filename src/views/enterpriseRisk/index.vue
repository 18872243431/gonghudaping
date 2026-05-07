<template>
  <div class="enterpriseRisk">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab" v-if="timeShow"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <div class="left1">
        <div class="left1-l">
          <div class="header">
            <div class="name" :title="companyName">
              {{ companyName }}
            </div>
            <div class="flag">{{ flag }}</div>
          </div>
          <div class="company-info">
            <div
              class="company-item"
              v-for="item in companyInfo"
              :key="item.name"
            >
              <div class="name">{{ item.name }}</div>
              <div class="value">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="left1-r">
          <chart-box title="网络威胁等级分布">
            <template v-slot:chart>
              <div class="total-list">
                <div
                  class="total-card"
                  v-for="(item, i) in totalList"
                  :key="item.name"
                >
                  <div class="rate-container">
                    <img
                      class="circle"
                      :src="require(`./imgs/circle${i + 1}.png`)"
                      alt=""
                    />
                    <div class="rate">{{ item.rate }}</div>
                  </div>
                  <div class="info">
                    <div class="name">{{ item.name }}</div>
                    <div class="value">
                      <span>{{ formatNumber(item.value) }}</span
                      ><span class="unit">次</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="left2">
        <div class="left2-l">
          <chart-box title="网络攻击告警类型分布">
            <template v-slot:chart>
              <Pie :data="pieData"></Pie>
            </template>
          </chart-box>
        </div>
        <div class="left2-r">
          <chart-box title="网络攻击阶段分布">
            <template v-slot:chart>
              <Radar :option="radarOption" :data="radarData"></Radar>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="card-list">
        <div class="card-item" v-for="item in attackTotalList" :key="item.name">
          <div class="header">
            <div class="title">
              <div class="name">{{ item.name }}数量</div>
              <div class="value">
                <span>{{ item.value }}</span
                ><span class="unit">{{ item.unit }}</span>
              </div>
            </div>
            <div class="ratio">
              <div class="ratio-item">
                <span class="label"
                  >环比{{
                    item.ratio1.indexOf("-") > -1 ? "下降" : "上升"
                  }}</span
                >
                <span class="value">{{
                  item.ratio1.indexOf("-") > -1
                    ? item.ratio1.replace("-", "")
                    : item.ratio1
                }}</span>
              </div>
              <div class="ratio-item">
                <span class="label"
                  >同比{{
                    item.ratio2.indexOf("-") > -1 ? "下降" : "上升"
                  }}</span
                >
                <span class="value">{{
                  item.ratio2.indexOf("-") > -1
                    ? item.ratio2.replace("-", "")
                    : item.ratio2
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center-content">
        <div class="center-content-left">
          <chart-box title="攻击来源TOP5">
            <template v-slot:chart>
              <RectangleNationalSymbolBar
                :data="attackRankData"
                :option="{
                  tooltip: {
                    trigger: 'item',
                    renderMode: 'html',
                    confine: true,
                    formatter: (params) => {
                      const name = params?.name || '';
                      const value = params?.value ?? '';
                      let line1 = name;
                      if (name.indexOf('-') !== -1) {
                        const arr = name.split('-');
                        line1 = arr[1];
                      }
                      const val = formatNumber(value);
                      return `<div style='color:#fff;'>
                        <p style='margin-bottom:6px;font-size:18px;'>${line1}</p>
                        <p style='margin:0;font-size:16px;'>攻击次数&nbsp;&nbsp;&nbsp;&nbsp;${val}</p>
                      </div>`;
                    },
                  },
                }"
              ></RectangleNationalSymbolBar>
            </template>
          </chart-box>
        </div>
        <div class="center-content-right">
          <chart-box title="网络攻击趋势">
            <template v-slot:chart>
                <Line :option="lineOpts" :data="ipData"></Line>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="center-bot">
        <chart-box title="攻击路径分析">
          <template v-slot:chart>
            <Sankey :data="sankeyData"></Sankey>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="暴露端口预警">
          <template v-slot:chart>
            <div class="vulnerability-list">
              <div 
                class="vulnerability-item" 
                v-for="(item, index) in vulnerabilityList" 
                :key="index"
                :class="{ 'high-risk': item.riskLevel === '高危' }"
              >
                <div class="item-main">
                  <div class="item-header">
                    <span class="title">{{ item.title }}</span>
                    <span class="risk-badge" :class="item.riskLevel === '高危' ? 'badge-high' : 'badge-medium'">
                      {{ item.riskLevel }}
                    </span>
                  </div>
                  <div class="item-info">
                    <div class="info-row">
                      <span class="info-item">
                        <label>IP:</label>
                        <span class="value ip-value">{{ item.ip }}</span>
                      </span>
                      <span class="info-item">
                        <label>发现时间:</label>
                        <span class="value">{{ item.findTime }}</span>
                      </span>
                      <span class="info-item">
                        <label>所属领域:</label>
                        <span class="value">{{ item.expertise }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="item-side">
                  <div class="attack-count">
                    <span class="attack-label">被攻击次数</span>
                    <span class="attack-value">{{ formatNumber(item.count) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right3">
        <chart-box title="企业高风险IP告警">
          <template v-slot:chart>
            <el-carousel
              class="ip-list"
              arrow="always"
              indicator-position="none"
              height="248px"
              v-if="ipList.length > 0"
            >
              <el-carousel-item
                class="ip-item"
                v-for="item in ipList"
                :key="item.ip"
              >
                <div class="ip-item-l">
                  <p class="info">{{ item.ip }}</p>
                  <p class="info">{{ item.province }}{{ item.city }}</p>
                </div>
                <div class="ip-item-c"></div>
                <div class="ip-item-r">
                  <div class="info">
                    <span class="label">状态：</span>
                    <span class="status">{{ item.status }}</span>
                  </div>
                  <div class="info">
                    <span class="label">遭受攻击：</span>
                    <div class="tags">
                      <span
                        class="status"
                        v-for="it in item.eventTypeList"
                        :key="it"
                        >{{ it }}</span
                      >
                    </div>
                  </div>
                  <div class="info">
                    <span class="label">攻击IP：</span>
                    <span class="value"
                      >{{ item.attackIpTotal
                      }}<span class="unit">个</span></span
                    >
                  </div>
                  <div class="info">
                    <span class="label">被攻击次数：</span>
                    <span class="value"
                      >{{ item.attackedTotal }}<span class="unit">次</span>
                    </span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import chartBox from "@c/chartBox";
import ActTable from "@c/ActTable";
import ActTabs from "@c/ActTabs";
import Pie from "@c/echarts/Pie/NewPie";
import Radar from "@c/echarts/Radar";
import Line from "@c/echarts/Line/lineArea/index.vue";
import RectangleNationalSymbolBar from "@/components/echarts/bar/RectangleNationalSymbolBar";
import Sankey from "@/components/echarts/Sankey";
import { useDataFun } from "./hooks/useData";
const timeBtnsShow  = computed(() => {
  return useRoute().query.timeBtnsShow;
});
const timeShow = ref(true)
  watch(
    [timeBtnsShow],
    () => {
     if(timeBtnsShow.value&&timeBtnsShow.value==1){
      timeShow.value = false
     }else{
      timeShow.value = true
     }
    },
    { immediate: true }
  );  
function formatNumber(num) {
  if (num == null || num === "") return "";
  num = Number(num);
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return num.toLocaleString();
}
const {
  companyName,
  flag,
  companyInfo,
  totalList,
  pieData,
  radarOption,
  radarData,
  attackTotalList,
  lineOpts,
  sankeyData,
  tabsList,
  activeTab,
  changeTab,
  attackRankData,
  ipData,
  ipList,
  vulnerabilityList,
} = useDataFun();
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.spec2{
  .el-dialog__header{
    text-align: center;
  }
}
</style>
