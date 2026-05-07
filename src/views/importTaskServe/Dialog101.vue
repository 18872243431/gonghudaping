<template>
  <div class="dialog101">
    <div class="card combined-card">
      <div class="subtitle">{{ data?.detail?.title1 || "保障背景" }}</div>
      <div class="value">
        {{ data?.detail?.background || "" }}
      </div>
      <div class="row">
        <div class="col">
          <div class="subtitle">{{ data?.detail?.title2 || "保障周期" }}</div>
          <div class="value">{{ data?.detail?.cycle || "" }}</div>
        </div>
        <div class="col">
          <div class="subtitle">{{ data?.detail?.title3 || "保障范围" }}</div>
          <div class="value">{{ data?.detail?.scope || "" }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="title">{{ data?.detail?.title4 || "研判示例" }}</div>
      <act-table
        :showSeq="false"
        :columns="columns"
        :tableData="data?.detail?.judgementExamples || []"
        :needScroll="false"
        class="table16"
      >
        <template #conclusion="{ row }">
          <span :class="['result-tag', row.conclusion && row.conclusion.includes('正常') ? 'normal' : 'attack']">{{ row.conclusion }}</span>
        </template>
      </act-table>
    </div>

    <div class="summary">
      <div class="summary-title">🛡️ {{ data?.detail?.title5 || "任务保障总结" }}</div>
      <div class="summary-text" v-html="data?.detail?.summary || ''">
      </div>
      <!-- {{ data?.detail?.summary || "" }} -->
    </div>
  </div>
</template>

<script setup>
import ActTable from "@c/ActTable";
import { computed } from "vue";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const columns = computed(() => {
  const headers = props.data?.detail?.tableHeaders;
  if (headers && headers.length > 0) {
    return headers.map(item => ({
      label: item.title,
      prop: item.key,
      width: item.key === 'time' ? 220 : 240
    }));
  }
  // 默认兜底
  return [
    { label: "时间", prop: "time", width: 220 },
    { label: "风险来源", prop: "riskSource", width: 240 },
    { label: "行为特征", prop: "behavior", width: 240 },
    { label: "涉及对象", prop: "target", width: 240 },
    { label: "研判结论", prop: "conclusion", width: 240 },
  ];
});
</script>

<style scoped lang="scss">
.dialog101 {
  overflow-y: hidden;
   color: #fff; 
  }
.card { 
  background: rgba(3, 33, 56, 0.55); 
  border: 1px solid rgba(36,153,243,0.30); 
  border-radius: 10px; 
  padding: 10px;
  margin-bottom:6px; 
  }
.title { font-size: 16px; color: #24daff; margin-bottom: 8px; }
.text { font-size: 16px; line-height: 1.8; }
.desc { color: #cfe6ff; }
.combined-card .row { 
display: grid; grid-template-columns: 1fr 1fr; 
align-items: start; gap: 24px;
  //  margin-top: 12px; 
   padding: 12px 0; 
   }

.subtitle { font-size: 14px; color: #94c7e8; margin-bottom: 6px; }
.value { font-size: 16px; color: #ffffff; }
.summary { position: relative; background: rgba(0, 255, 136, 0.08); border: 1px solid rgba(0, 200, 0, 0.35); border-radius: 10px; padding: 18px 16px; border-left: 6px solid #00ff88; }
.summary-title { display: flex; align-items: center; gap: 8px; font-size: 16px; color: #00ff88; font-weight: 600; margin-bottom: 8px; }
.summary-text { font-size: 16px; line-height: 1.9; color: #cfe6ff; }
.emphasis-red { color: #ff5858; font-weight: 600; }
.emphasis-green { color: #00ff88; font-weight: 600; }
.result-tag { display: inline-block; padding: 4px 10px; border-radius: 14px; font-size: 14px; }
.result-tag.attack { background: rgba(0, 200, 0, 0.18); border: 1px solid rgba(0, 200, 0, 0.35); color: #00ff88; }
.result-tag.normal { background: rgba(0, 210, 255, 0.12); border: 1px solid rgba(0, 210, 255, 0.35); color: #24daff; }
</style>
<style lang="scss"> 
.el-table.table16 {
  width: 100% !important;
  --el-table-row-hover-bg-color: transparent !important;
  .el-table__body,.el-table__header{
    width: 100% !important;
  }
  
  /* 覆盖 tr 上的背景图片和颜色 */
  .el-table__body tr:hover,
  .el-table__body tr.hover-row {
    background: none !important;
    background-color: transparent !important;
  }

  /* 覆盖 td 上的背景色 */
  .el-table__body tr:hover > td.el-table__cell,
  .el-table__body tr.hover-row > td.el-table__cell {
    background: none !important;
    background-color: transparent !important;
  }
}
</style>
