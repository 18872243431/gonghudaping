<template>
  <div class="enterpriseRisk">
    <div class="left">
      <div class="left1">
        <chart-box title="企业基础信息">
          <template v-slot:chart>
            <div class="left1-l">
              <div class="header">
                <div class="name" :title="companyName">
                  {{ companyName }}
                </div>
                <!-- <div class="flag">{{ flag }}</div> -->
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
      <div class="warning-content">
        <vue3ScrollSeamless
          class="list"
          :dataList="warningList"
          v-if="warningList.length > 0"
          :classOptions="{ limitMoveNum: 4, step: 0.28, hoverStop: true, openWatch: true, waitTime: 300 }"
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
      <div class="warn-tips" @click="getWarningTips" v-if="warnTipsShow" role="button" tabindex="0">
        <img :src="require('./imgs16/bg12.png')" alt="" @click.stop="closeWarningTips">
        {{ warnTips }}
      </div>
      <div class="card-list">
        <div class="card-item" v-for="item in attackTotalList" :key="item.name">
          <div class="header">
            <div class="title">
              <div class="name">{{ item.name }}数量</div>
              <div class="value">
                {{ item.value }}<span class="unit">{{ item.unit }}</span>
              </div>
            </div>
            <div class="ratio">
              <div class="ratio-item">
                <span class="label"
                  >环比{{
                    item.ratio1.indexOf("-") > -1 ? "下降" : "上升"
                  }}</span
                >
                <span class="value">
                  <span
                    class="num"
                    :class="
                      item.ratio1.indexOf('-') > -1 ? 'num-down' : 'num-up'
                    "
                    >{{ item.ratio1.replace(/^[-+]/, "") }}</span
                  >
                  <span
                    class="arrow"
                    :class="
                      item.ratio1.indexOf('-') > -1 ? 'arrow-down' : 'arrow-up'
                    "
                    >{{ item.ratio1.indexOf("-") > -1 ? "↓" : "↑" }}</span
                  >
                </span>
              </div>
              <div class="ratio-item">
                <span class="label"
                  >同比{{
                    item.ratio2.indexOf("-") > -1 ? "下降" : "上升"
                  }}</span
                >
                <span class="value">
                  <span
                    class="num"
                    :class="
                      item.ratio2.indexOf('-') > -1 ? 'num-down' : 'num-up'
                    "
                    >{{ item.ratio2.replace(/^[-+]/, "") }}</span
                  >
                  <span
                    class="arrow"
                    :class="
                      item.ratio2.indexOf('-') > -1 ? 'arrow-down' : 'arrow-up'
                    "
                    >{{ item.ratio2.indexOf("-") > -1 ? "↓" : "↑" }}</span
                  >
                </span>
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
            <div class="alarm-list" :class="{ 'is-loading': alarmLoading, 'is-revealing': alarmRevealing, 'is-inserting': isInserting }">
              <div class="alarm-loading-overlay" v-if="alarmLoading">
                <div class="alarm-loading-spinner"></div>
                <div class="alarm-loading-text">加载中...</div>
              </div>
              <div
                :class="[
                  'alarm-item',
                  `alarm-item-${item.level}`,
                  item._isEntering ? 'is-entering' : '',
                  item._isInserted ? 'is-inserted' : '',
                  item._isFading ? 'is-fading' : '',
                ]"
                v-for="(item, i) in displayedAlarmList"
                :key="item.id"
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
      <Notification :data="activeAlarm" @close="dialogVisible = false"></Notification>
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
      <NotificationTip :data="warnTipDetailInfo" @close="closeTipDialog"></NotificationTip>
    </el-dialog>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import Pie from "@c/echarts/Pie/NewPie16.vue";
import Line from "@c/echarts/Line/lineArea16/index.vue";
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
  dialogVisible,
  handleClick,
  activeAlarm,
  warningList,
  investigating,
  warnTipsShow,
  closeWarningTips,
  tipDialogVisible,
  getWarningTips,
  warnTipDetailInfo,
  closeTipDialog,
  alarmLoading,
  alarmRevealing,
  displayedAlarmList,
  isInserting,
  warnTips
} = useData();

</script>

<style lang="scss" scoped>
@import "./index16.scss";
.ratio-item .value {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ratio-item .value .num {
  display: inline-block;
  min-width: 56px;
  text-align: right;
}
.num-up {
  color: #ffbd43;
}
.num-down {
  color: #4bd2fd;
}
.arrow-up {
  color: #ff4d4f;
}
.arrow-down {
  color: #52c41a;
}
.alarm-list {
  position: relative;
}
@keyframes textPulse {
  0% {
    opacity: 0.7;
    text-shadow: 0 0 6px rgba(255, 189, 67, 0.4);
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 12px rgba(255, 189, 67, 0.9);
  }
  100% {
    opacity: 0.7;
    text-shadow: 0 0 6px rgba(255, 189, 67, 0.4);
  }
}
.right1-title.is-loading,
.right1-sub.is-loading {
  animation: textPulse 1.1s ease-in-out infinite;
}
@keyframes slide-in-right {
  from {
    transform: translateX(140px);
    opacity: 0.2;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.alarm-item.is-entering {
  animation: slide-in-right 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
