<template>
  <div class="monitor-wrapper">
    <div class="panel-header">
      <div class="chartTitle">网络攻击监测</div>
    </div>
    <div class="dashboard-panel-right">
      <div class="panel-content">
        <vue3-scroll-seamless
          :dataList="dataList"
          :classOptions="{ limitMoveNum: 2, step: 0.4, hoverStop: true, openWatch: true }"
          class="warning-scroll-container"
        >
        <div class="monitor-item" v-for="(item, index) in dataList" :key="index">
          <div class="row-top">
              <span class="company-name">监测发现 {{ item.companyName }}遭受</span>
              <span :class="['event-type', getEventTypeClass(item.eventType)]">
                {{ item.eventType }}
              </span>
              <span class="attack-count" :style="{ color: getCountColor(item.eventType) }">
                {{ formatNumber(item.count) }}<span class="count-unit">次</span>
              </span>
            </div>
        </div>
        </vue3-scroll-seamless>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { vue3ScrollSeamless } from 'vue3-scroll-seamless';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  }
});

function formatNumber(value) {
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString();
}

function getEventTypeClass(type) {
  if (type.includes('非法外联')) return 'type-danger';
  if (type.includes('暴力破解')) return 'type-warning';
  if (type.includes('Web攻击')) return 'type-info';
  return 'type-info';
}

function getCountColor(type) {
  if (type.includes('非法外联')) return '#ff5252';
  if (type.includes('暴力破解')) return '#ff9800';
  if (type.includes('Web攻击')) return '#00bfff';
  return '#00bfff';
}
</script>

<style lang="scss" scoped>
@import "@/assets/theme/style-vars.scss";

.monitor-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-panel-right {
  width: 100%;
  flex: 1;
  min-height: 0; /* 防止 flex 子项因内容撑开溢出 */
  height: calc(100% - 60px); /* 明确高度，避免被无缝滚动内容撑开 */
  background: linear-gradient(180deg, rgba(10, 24, 50, 0.4) 0%, rgba(20, 60, 120, 0.2) 100%);
  border: 2px solid rgba(0, 210, 255, 0.6);
  box-shadow: inset 0 0 15px rgba(0, 210, 255, 0.3), 0 0 10px rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  color: #fff;
  position: relative;
  font-family: var(--font-family-body);
}

/* 科技感边角装饰 */
.dashboard-panel-right::before,
.dashboard-panel-right::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid #00d2ff;
  z-index: 1;
}
.dashboard-panel-right::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}
.dashboard-panel-right::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* 面板标题 */
.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    width: 29px;
    height: 33px;
    background: url("../imgs/32/12.png") no-repeat center/ 100% 100%;
  }
}

/* 内容区 */
.panel-content {
  height: 100%; /* 使用 100% 占满内容区，box-sizing 已处理 padding */
  position: relative;
  overflow: hidden;
}

.warning-scroll-container {
  height: 100%;
  overflow: hidden;
  /* 开启硬件加速以平滑亚像素渲染抖动 */
  transform: translateZ(0);
  will-change: transform;
}

/* 监测项容器 */
.monitor-item {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
  transform: translateZ(0);
}

/* 第一行：企业名称（左） + 攻击次数（右） */
.row-top {
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  // margin-bottom: 0px;
}
.company-name {
  font-size: var(--font-body, 20px);
  color: #e0f7fa;
  font-weight: bold;
  font-family: var(--font-family-body);
}
.attack-count {
  font-size: 24px;
  font-family: var(--font-family-num);
  font-weight: bold;
  text-align: right;
  text-shadow: 0 0 5px rgba(255, 82, 82, 0.5);
  white-space: nowrap;
  flex-shrink: 0;
}
.count-unit {
  font-size: var(--font-small, 18px);
  color: #78909c;
  margin-left: 2px;
  font-weight: normal;
  font-family: var(--font-family-body);
}

/* 第二行：IP + 攻击类型（右） */
.row-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.ip-address {
  font-size: var(--font-body, 20px);
  color: #00bfff;
  font-family: var(--font-family-num);
  font-weight: bold;
}
.time-info {
  font-size: var(--font-body, 20px);
  color: #b0bec5;
  font-family: var(--font-family-num);
  white-space: nowrap;
}

.meta-right {
  text-align: right;
  flex-shrink: 0;
  margin-left: 10px;
}
.event-type {
  font-size: var(--font-small, 18px);
  padding: 2px 8px;
  border-radius: 2px;
  font-weight: bold;
  display: inline-block;
  font-family: var(--font-family-body);
  white-space: nowrap;
}

/* 针对不同类型的状态标签颜色 */
.type-danger {
  background: rgba(255, 82, 82, 0.15);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
}
.type-warning {
  background: rgba(255, 152, 0, 0.15);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #ff9800;
}
.type-info {
  background: rgba(0, 191, 255, 0.15);
  border: 1px solid rgba(0, 191, 255, 0.3);
  color: #00bfff;
}
</style>
