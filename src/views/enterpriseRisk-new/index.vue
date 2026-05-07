<template>
  <div class="enterpriseRisk">
    <!-- <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs> -->
    <!-- <div class="page-type" @click="toggle">
      <span style="margin-right: 5px"
        >{{ screenType == 1 ? "网络" : "数据" }}安全风险视角</span
      >
      <span class="iconfont icon-yqfqiehuan"></span>
    </div> -->
    <div class="left">
      <div class="left1">
        <div class="left1-l">
          <div class="header">
            <div class="name" :title="companyName">
              {{ companyName }}
            </div>
            <div class="flag">{{ flag }}</div>
          </div>
          <!-- <div class="status">
            <span class="text">{{ status }}</span>
          </div> -->
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
      <!-- <div class="bg"></div> -->
      <div class="tips">
        <span class="label">安全态势</span>
        <p class="content">
          {{ overviewText }}
        </p>
      </div>
      <div class="enterprise-bg"></div>
      <div class="warning-content">
      <vue3ScrollSeamless
          class="list"
          :dataList="warningList"
          v-if="warningList.length > 0"
          :classOptions="{ limitMoveNum: 4, step: 0.16 }"
        >
          <div class="warning-item" v-for="(item, i) in warningList" :key="i">
            {{ item.startTime }} 监测发现企业IP：<span class="attacked-ip">{{
              item.attackedIp
            }}</span
            >存在<span class="category">{{ item.category }}</span
            >事件，攻击IP：<span class="attack-ip">{{ item.attackIp }}。</span>
          </div>
        </vue3ScrollSeamless>
      </div>
      <div class="warn-tips" @click="getWarningTips" v-if="warnTipsShow">
        <img :src="require('./imgs16/bg12.png')" alt=""  @click.stop="closeWarningTips">
        预警反馈：风险已处置
      </div>
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
          <div class="title">{{ item.name }}趋势</div>
          <div class="line-container">
            <Line :option="lineOpts" :data="item.lineData"></Line>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right1" @click="startInvestigation">
        <div class="right1-title" :class="{ 'is-loading': investigating }">
          智能研判中
        </div>
        <div class="right1-sub" :class="{ 'is-loading': investigating }">
          数据处理中
        </div>
        <div class="right1-status">进行中</div>
      </div>
      <div class="right2">
        <chart-box title="实时研判结果">
          <template v-slot:chart>
            <div class="alarm-list" :class="{ 'is-loading': alarmLoading, 'is-revealing': alarmRevealing }">
              <div class="alarm-loading-overlay" v-if="alarmLoading">
                <div class="alarm-loading-spinner"></div>
                <div class="alarm-loading-text">加载中...</div>
              </div>
              <div
                :class="[
                  'alarm-item',
                  `alarm-item-${item.level}`,
                  item._isEntering ? 'is-entering' : '',
                ]"
                v-for="(item, i) in dynamicAlarmList"
                :key="item.attackedIp + '_' + item.startTime + '_' + i"
                @click="handleClick(item)"
              >
                <div class="alarm-header">
                  <span class="alarm-header-name"
                    >{{ item.damageLevel }}威胁</span
                  >
                  <span class="alarm-header-tag">{{ item.eventType }}</span>
                </div>
                <div class="alarm-content">
                  <div class="item">
                    <span class="label">研判日期：</span>
                    <span class="value"
                      >
                      {{ currentData }} 
                      </span
                    >
                  </div>
                  <div class="item">
                    <span class="label">被攻击IP：</span>
                    <span class="value">{{ item.attackedIp }}</span>
                  </div>
                  <div class="item">
                    <span class="label">攻击次数：</span>
                    <span class="value">{{ item.attackNum }}次</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title=""
      width="1472px"
      append-to=".ScreenAdapter"
      destroy-on-close
      custom-class="dialog-custom"
    >
      <Notification :data="activeAlarm"></Notification>
    </el-dialog>
     <el-dialog
      v-model="tipDialogVisible"
      title=""
      width="1472px"
      append-to=".ScreenAdapter"
      destroy-on-close
      custom-class="dialog-custom"
      @close="closeTipDialog"
    >
      <NotificationTip :data="warnTipDetailInfo"></NotificationTip>
    </el-dialog>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import Pie from "@c/echarts/Pie/NewPie";
import Radar from "@c/echarts/Radar";
import Line from "@c/echarts/Line/lineArea/index.vue";
import { useData } from "./hooks/useData";
import Notification from "./Notification.vue";
import NotificationTip from "./NotificationTip.vue";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import { dateFormat } from  "@/libs/util";
const currentData = dateFormat(new Date(),"YYYY-MM-dd");
function formatNumber(num) {
  if (num == null || num === "") return "";
  num = Number(num);
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return num.toLocaleString();
}

const {
  flag,
  status,
  companyName,
  companyInfo,
  pieData,
  overviewText,
  attackTotalList,
  lineOpts,
  dynamicAlarmList,
  dialogVisible,
  handleClick,
  activeAlarm,
  warningList,
  startInvestigation,
  investigating,
  vulnerabilityInfo,
  totalList,
  radarOption,
  radarData,
  warnTipsShow,
  closeWarningTips,
  tipDialogVisible,
  getWarningTips,
  warnTipDetailInfo,
  closeTipDialog,
  alarmLoading,
  alarmRevealing
} = useData();
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
