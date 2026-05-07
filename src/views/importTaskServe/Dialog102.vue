<template>
  <div class="dialog102">
    <!-- 顶部卡片：任务概要 + 演练时间 + 监测范围 -->
    <div class="card combined-card">
      <div class="subtitle">{{ data?.detail?.title1 || "任务概要" }}</div>
      <div class="value desc-text">
        {{ data?.detail?.summary || "" }}
      </div>
      
      <div class="row">
        <div class="col">
          <div class="subtitle">{{ data?.detail?.title2 || "演练起止时间" }}</div>
          <div class="value">{{ data?.detail?.timeRange || "" }}</div>
        </div>
        <div class="col">
          <div class="subtitle">{{ data?.detail?.title3 || "监测对象范围" }}</div>
          <div class="value">{{ data?.detail?.monitorScope || "" }}</div>
        </div>
      </div>
    </div>

    <!-- 中部卡片：典型风险行为及影响分析 -->
    <div class="card risk-card">
      <div class="title">
        <span class="icon-swords">⚔️</span> {{ data?.detail?.title4 || "典型风险行为及影响分析" }}
      </div>
      <div class="risk-list">
        <!-- 风险项 -->
        <div class="risk-item" v-for="risk in data?.detail?.riskBehaviors" :key="risk.name">
          <div class="item-header">
            <span class="item-name">{{ risk.name }}</span>
            <span class="tag-high" v-if="risk.label">
              <span class="tag-high__icon">!</span>
              <span class="tag-high__text">{{ risk.label }}</span>
            </span>
            <span class="item-count" v-if="risk.count !== null">{{ risk.count }} <span class="unit">次</span></span>
          </div>
          <div class="item-detail">
            <div class="detail-row">
              <span class="icon-finger">👉</span> {{ risk.description }}
            </div>
            <div class="detail-row">
              <span class="icon-finger">👉</span> <span class="green-text">{{ risk.result }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部总结：保障任务总结 -->
    <div class="summary">
      <div class="summary-title">🛡️ {{ data?.detail?.title5 || "保障任务总结" }}</div>
      <div class="summary-text" v-html="data?.detail?.taskSummary || ''">
      </div>
      <!-- {{ data?.detail?.taskSummary || "" }} -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.dialog102 { 
  /* padding: 16px;  */
  color: #fff; 
}

/* 通用卡片样式 */
.card {
  background: rgba(3, 33, 56, 0.55);
  border: 1px solid rgba(36,153,243,0.30);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 16px;
}

/* 顶部综合卡片 */
.combined-card .subtitle { font-size: 14px; color: #94c7e8; margin-bottom: 6px; }
.combined-card .value { font-size: 16px; color: #ffffff; }
.combined-card .desc-text { font-size: 16px; line-height: 1.8; color: #ffffff; margin-bottom: 4px; }
.combined-card .row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 24px;
  margin-top: 12px;
  padding: 12px 0;
}

/* 中部风险卡片 */
.risk-card .title {
  font-size: 16px;
  color: #24daff;
  margin-bottom: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-swords { color: #ffcc00; font-size: 20px; }

.risk-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.risk-item {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 16px;
}

.item-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
}

.item-name { font-size: 16px; color: #fff; font-weight: 500; margin-right: 10px; }
.tag-high {
  background: transparent;
  border: 1px solid #ff5858;
  color: #ffffff;
  font-size: 12px;
  padding: 2px 10px 2px 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 18px;
  font-weight: 600;
}

.tag-high__icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff5858;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  flex: 0 0 14px;
}

.tag-high__text {
  color: #ff5858;
  line-height: 16px;
}

.item-count {
  margin-left: auto;
  font-size: 20px;
  font-weight: bold;
  color: #24daff;
  background: rgba(36, 218, 255, 0.15);
  border: 1px solid rgba(36, 218, 255, 0.4);
  padding: 2px 10px;
  border-radius: 4px;
}
.item-count .unit { font-size: 14px; font-weight: normal; margin-left: 2px; }
.item-count.blue { color: #24daff; } /* 默认蓝色 */
/* 左侧第一个如果是特殊色可单独覆盖，这里示例保持一致或微调 */

.item-detail { font-size: 14px; color: #94c7e8; line-height: 1.8; }
.detail-row { display: flex; align-items: flex-start; margin-bottom: 4px; }
.icon-finger { margin-right: 6px; color: #ffcc00; }
.green-text { color: #00ff88; }

/* 底部总结 - 复用 Dialog101 样式 */
.summary {
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
.red-text { color: #ff5858; font-weight: 600; margin: 0 4px; }
.green-text { color: #00ff88; font-weight: 600; }
</style>
