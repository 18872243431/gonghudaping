<template>
  <div class="enterpriseRisk">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-15px" v-if="false"
    ></ActTabs>
    <div class="page-type" @click="toggle">
      <span style="margin-right: 5px"
        >{{ screenType == 1 ? "网络" : "数据" }}安全风险视角</span
      >
      <span class="iconfont icon-yqfqiehuan"></span>
    </div>
    <div class="left">
      <div class="left1">
        <chart-box title="企业基础信息">
          <template v-slot:chart>
            <div class="left1-l">
              <div class="header">
                <div class="name" :title="companyName">
                  {{ companyName }}
                </div>
                <div class="flag">{{ flag }}</div>
              </div>
              <div class="status">
                <span class="text">{{ status }}</span>
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
          </template>
        </chart-box>
      </div>
      <div class="left2">
        <div class="left2-l">
          <chart-box title="网络攻击告警类型分布">
            <template v-slot:chart>
              <Pie :data="pieData"></Pie>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="center">
      <!-- <div class="bg"></div> -->
      <div class="tips">
        <span class="label">安全态势</span>
        <p class="content">{{ overviewText }}</p>
      </div>
      <div class="enterprise-bg"></div>
      <div class="imgBtn" @click="toggleImg" v-if="btnShow"></div>
      <div class="warning-content">
        <div class="list system-scrollbar" v-if="dynamicAlarmList.length<=5">
          <div
            class="warning-item"
            v-for="(item, i) in dynamicAlarmList"
            :key="i"
          >
            {{ item.startTime }} 至 {{ item.endTime }} 监测发现企业IP：<span
              class="attacked-ip"
              >{{ item.attackedIp }}</span
            >存在<span class="category">{{ item.category }}</span
            >事件<span class="attack-ip">{{
              formatNumber(item.attackNum)
            }}</span
            >次，攻击IP：<span class="attack-ip">{{ item.attackIp }}。</span>
          </div>
        </div>
        <vue3ScrollSeamless
          v-else
          class="list system-scrollbar"
          :dataList="dynamicAlarmList"
          :classOptions="{ limitMoveNum: 2, step: 0.16, hoverStop: true }"
        >
          <div
            class="warning-item"
            v-for="(item, i) in dynamicAlarmList"
            :key="i"
          >
            {{ item.startTime }} 至 {{ item.endTime }} 监测发现企业IP：<span
              class="attacked-ip"
              >{{ item.attackedIp }}</span
            >存在<span class="category">{{ item.category }}</span
            >事件<span class="attack-ip">{{
              formatNumber(item.attackNum)
            }}</span
            >次，攻击IP：<span class="attack-ip">{{ item.attackIp }}。</span>
          </div>
        </vue3ScrollSeamless>
      </div>
      <div class="warning-table-container" v-if="false">
        <div class="top">
          <div class="total">
            <div class="item">
              <span class="label">IP数量：</span>
              <span class="value">{{ vulnerabilityInfo.ipTotal }}</span>
            </div>
            <div class="item" style="margin-left: 20px; margin-right: 30px">
              <span class="label">风险IP数量：</span>
              <span class="value">{{ vulnerabilityInfo.riskIpTotal }}</span>
            </div>
            <div class="item item3">
              <span class="label">高危端口：</span>
              <span class="value">{{ vulnerabilityInfo.portNum }}</span>
            </div>
          </div>
          <div class="list">
            <div
              class="item"
              :class="`item${i + 1}`"
              v-for="(item, i) in vulnerabilityInfo.tags"
              :title="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <p class="title" v-if="vulnerabilityInfo.ip.length > 0">
          暴露资产及漏洞信息
        </p>
        <div class="table" v-if="vulnerabilityInfo.ip.length > 0">
          <act-table
            :showSeq="true"
            :columns="columns"
            :tableData="vulnerabilityInfo.ip"
          ></act-table>
        </div>
      </div>
      <div class="card-list">
        <div
          class="card-item"
          v-for="item in attackTotalList.slice(1, 3)"
          :key="item.name"
        >
          <div class="header">
            <div class="title">
              <div class="name">{{ item.name }}数量</div>
              <div class="value">
                {{ item.value }}<span class="unit">次</span>
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
          <div class="title">{{ item.name }}趋势</div>
          <div class="line-container">
            <Line :option="lineOpts" :data="item.lineData"></Line>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="攻击来源">
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
      <div class="right2">
        <chart-box title="网络攻击趋势">
          <template v-slot:chart>
            <div class="line-container">
              <!-- <div class="ip">（{{ selectedIp }}）</div> -->
              <Line :option="lineOpts" :data="ipData"></Line>
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
                      }}<span class="unit">次</span></span
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
    <el-dialog
      v-model="dialogVisible"
      title="实网演练风险复盘总结"
      width="1300px"
      append-to-body
      custom-class="task-dialog dialog-custom spec spec2 import-task-title"
    >
      <iframe :src="iframeSrc" frameborder="0" style="width: 100%; height: 580px; overflow-y: auto;"></iframe>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch  } from "vue";
import { useRoute } from "vue-router";
import chartBox from "@c/chartBox";
import ActTable from "@c/ActTable";
import ActTabs from "@c/ActTabs";
import Pie from "@c/echarts/Pie/NewPie16.vue";
import Line from "@c/echarts/Line/lineArea16/index.vue";
import RectangleNationalSymbolBar from "@/components/echarts/bar/RectangleNationalSymbolBar/index16.vue";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
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
  status,
  companyInfo,
  totalList,
  pieData,
  radarOption,
  radarData,
  overviewText,
  dynamicAlarmList,
  attackTotalList,
  lineOpts,
  vulnerabilityInfo,
  columns,
  iframeSrc,
  btnShow,
  tabsList,
  activeTab,
  changeTab,
  attackRankData,
  selectedIp,
  ipData,
  ipList,
  handleClick,
  toggle,
  screenType,
} = useDataFun();
const dialogVisible = ref(false);

function toggleImg() {
  dialogVisible.value = true;
}
</script>

<style lang="scss" scoped>
@import "./index16.scss";
</style>
<style lang="scss">
.spec2{
  .el-dialog__header{
    text-align: center;
  }
}
</style>
