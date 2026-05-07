<!--
 * @Author: wangmeng
 * @Date: 2026-02-05 17:59:06
 * @LastEditors: 最后编辑者
 * @LastEditTime: 2026-02-10 11:45:08
 * @Description: 
-->
<template>
  <div class="dialog103">
    <!-- 顶部信息卡片 -->
    <div class="header-card">
      <div class="meta-row">
        <div class="meta-item"><span class="label">{{ data?.detail?.additionalInfo?.title1 || "涉及单位" }}：</span><span class="value">{{ metaUnit }}</span></div>
        <div class="meta-item"><span class="label">{{ data?.detail?.additionalInfo?.title2 || "涉及系统" }}：</span><span class="value">{{ metaSystem }}</span></div>
        <div class="meta-item"><span class="label">{{ data?.detail?.additionalInfo?.title3 || "事件时间" }}：</span><span class="value">{{ metaDate }}</span></div>
        <div class="flex-spacer"></div>
        <div class="status-container">
          <span class="status-pill">已通报处置</span>
        </div>
      </div>
      <div class="meta-row" style="margin-top: 12px;">
        <div class="meta-item"><span class="label">{{ data?.detail?.additionalInfo?.title4 || "事件性质" }}：</span><span class="value warn">{{ metaNature }}</span></div>
      </div>
    </div>

    <!-- 中部三列布局 -->
    <div class="section-grid">
      <!-- 监测发现 -->
      <div class="box discovery">
        <div class="box-title">{{ data?.detail?.title5 || "监测发现" }}</div>
        <div class="text">{{ data?.detail?.monitoringFinding || "" }}</div>
        <div class="stat-list">
          <div class="stat">
            <div class="label">异常频率</div>
            <div class="stat-value warn">{{ data?.detail?.abnormalFrequency || "" }}</div>
          </div>
          <div class="stat">
            <div class="label">行为特征</div>
            <div class="stat-value blue">{{ data?.detail?.behaviorFeature || "" }}</div>
          </div>
          <div class="stat">
            <div class="label">持续时间</div>
            <div class="stat-value">{{ data?.detail?.duration || "" }}</div>
          </div>
        </div>
      </div>

      <!-- 事件研判 -->
      <div class="box judgement">
        <div class="box-title warn">{{ data?.detail?.title6 || "事件研判" }}</div>
        <div class="judgement-card">
          <div class="text">{{ data?.detail?.eventJudgement || "" }}</div>
        </div>
      </div>

      <!-- 通报预警 -->
      <div class="box warning">
        <div class="box-title green">{{ data?.detail?.title7 || "通报预警" }}</div>
        <div class="timeline">
          <div class="timeline-item" v-for="(item, index) in data?.detail?.notificationTimeline" :key="index">
            <span class="dot"></span>
            <div class="content">
              <div class="date">{{ item.date }}</div>
              <div class="desc">{{ item.action }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部总结 -->
    <div class="summary">
      <div class="summary-title">🛡️ {{ data?.detail?.title8 || "保障任务总结" }}</div>
      <div class="summary-text" v-html="data?.detail?.taskSummary || ''">
      </div>
      <!-- {{ data?.detail?.taskSummary || "" }} -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Object, default: () => ({}) }
})
const metaUnit = computed(() => props.data?.detail?.additionalInfo?.involvedUnit || props.data?.metaUnit || "人民日报社新媒体中心")
const metaSystem = computed(() => props.data?.detail?.additionalInfo?.involvedSystem || props.data?.metaSystem || "人民日报视频中文客户端")
const metaDate = computed(() => props.data?.detail?.additionalInfo?.eventTime || props.data?.metaDate || "2025-03-04")
const metaNature = computed(() => props.data?.detail?.additionalInfo?.eventNature || props.data?.metaNature || "对外异常漏洞扫描行为")
</script>

<style scoped>
.dialog103 { 
  /* padding: 16px;  */
  color: #ffffff;
}

/* 顶部信息卡片 */
.header-card {
  background: rgba(3, 33, 56, 0.55);
  border: 1px solid rgba(36,153,243,0.30);
  border-radius: 10px;
  padding: 10px 24px;
}
.meta-row { display: flex; align-items: center; gap: 32px; }
.meta-item { display: flex; align-items: center; gap: 8px; }
.label { color: #87a7ff; font-size: 15px; }
.value { font-size: 16px; color: #ffffff; }
.value.warn { color: #ffcc66; }
.flex-spacer { flex: 1; }
.status-container { display: flex; justify-content: flex-end; }
.status-pill {
  background: rgba(0, 100, 50, 0.4);
  border: 1px solid #00ff88;
  color: #00ff88;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
}

/* 中部三列布局 */
.section-grid { 
  display: grid; grid-template-columns: 1fr 1fr 1fr; 
  gap: 16px; 
  margin-top: 6px;
 }
.box {
  background: rgba(3, 33, 56, 0.55);
  border: 1px solid rgba(36,153,243,0.30);
  border-radius: 10px;
  padding: 20px;
  min-height: 280px;
}
.box-title {
  font-size: 16px;
  font-weight: 600;
  color: #24daff;
  margin-bottom: 16px;
  text-align: center;
  &.warn{
    color: #ffcc66;
  }
  &.green{
    color: #00ff88;
  }
}
.text { font-size: 15px; line-height: 1.8; color: #cfe6ff; text-align: justify; }

/* 监测发现 - 统计列表 */
.stat-list { margin-top: 20px; display: grid; gap: 12px; }
.stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 12px;
  border-radius: 6px;
}
.stat .label { color: #94c7e8; font-size: 14px; }
.stat-value { font-size: 14px; color: #fff; }
.stat-value.warn { color: #ffcc66; }
.stat-value.blue { color: #24daff; }

/* 事件研判 - 卡片 */
.judgement-card {
  border: 1px solid #ffcc66;
  background: rgba(255,153,102,0.08);
  border-radius: 8px;
  padding: 16px;
  height: calc(100% - 44px);
}
.underline { text-decoration: underline; font-weight: 600; }

/* 通报预警 - 时间轴 */
.timeline { display: flex; flex-direction: column; gap: 16px; padding-left: 8px; }
.timeline-item { display: flex; gap: 12px; position: relative; }
.timeline-item:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 10px;
  bottom: -20px;
  width: 1px;
  border-left: 1px dashed rgba(0, 255, 136, 0.3);
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 6px rgba(0,255,136,0.6);
  margin-top: 6px;
  flex-shrink: 0;
}
.date { color: #00ff88; font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.desc { color: #cfe6ff; font-size: 13px; line-height: 1.5; }

/* 底部总结 - 复用 Dialog101/102 样式 */
.summary {
  margin-top:6px;
  position: relative;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 200, 0, 0.35);
  border-radius: 10px;
  padding: 18px 16px;
  border-left: 6px solid #00ff88;
}
.summary-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; color: #00ff88; font-weight: 600; margin-bottom: 8px;
}

.summary-text { font-size: 16px; line-height: 1.9; color: #cfe6ff; }
.highlight { color: #ff5858; font-weight: 600; margin: 0 4px; }
.green { color: #00ff88; font-weight: 600; }
</style>
