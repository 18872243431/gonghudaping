<template>
  <div class="basicdata">
    <div class="left">
      <div class="left1 kpi-section">
        <div class="kpi-title">基础信息</div>
        <div class="kpi-grid">
          <div
            class="kpi-card"
            v-for="(item, i) in kpiList"
            :key="i"
            :class="'kpi-card' + (i + 1)"
          >
            <div class="kpi-icon-wrapper">
              <div class="kpi-icon"></div>
            </div>
            <div class="kpi-content">
              <div class="kpi-name">{{ item.name }}</div>
              <div class="kpi-value">
                {{ Number(item.value) > 9999 ? (Number(item.value) / 10000).toFixed(1) : Number(item.value).toLocaleString("en-US") }}<span class="unit">{{ Number(item.value) > 9999 ? '万条' : '条' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="left3">
        <div class="left3-r">
          <chart-box title="监测企业行业分布">
            <template v-slot:chart>
              <div style="position: absolute; right: 20px; top: -5px; color: #fff; font-size: var(--font-size-body); z-index: 2; font-family: var(--font-family-body);">监测企业数：家</div>
              <TerminalRankBar
                :data="pieData"
              ></TerminalRankBar>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="bg"></div>
      <div class="flow"></div>
      <div class="arrow" style="top: 262px; left: 834px"></div>
      <div class="arrow" style="top: 576px; left: 834px"></div>
    </div>
    <div class="right">
      <div class="right1 total-container">
        <div class="icon"></div>
        <div class="content">
          <span class="label">威胁情报</span>
          <span class="value">{{ total1 }}<span class="unit">条</span></span>
        </div>
      </div>
      <div class="right2">
        <div class="right-container" v-for="(item, i) in totalList5" :key="i">
          <div class="name">{{ item.name }}</div>
          <div class="list">
            <div class="item" v-for="(t, j) in item.list" :key="j">
              <span class="label">{{ t.name }}</span>
              <span class="value"
                >{{
                  t.value > 9999
                    ? (Number(t.value) / 10000).toFixed(1) + "万"
                    : t.value.toLocaleString("en-US")
                }}
                <span class="unit">个</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right3">
        <chart-box title="威胁情报共享">
          <template v-slot:chart>
            <div class="threat-share-content" ref="contentRef">
              <vue3-scroll-seamless
                class="scroll-wrap"
                :dataList="threatShareList"
                :classOptions="{ limitMoveNum: 3, step: 0.5 }"
                v-if="itemHeight > 0"
              >
                <div class="threat-list">
                  <div class="threat-item" v-for="(item, i) in threatShareList" :key="i" :style="{ minHeight: itemHeight + 'px', marginBottom: '20px' }">
                    <div class="threat-icon" :class="item.type"></div>
                    <div class="threat-info">
                      <div class="threat-title">{{ item.title }}</div>
                      <div class="threat-detail">{{ item.detail }}</div>
                    </div>
                  </div>
                </div>
              </vue3-scroll-seamless>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLeft, useRight } from "./hooks/useData";
import chartBox from "@c/chartBox";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index.vue";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import { ref, onMounted, nextTick, computed } from "vue";

const { kpiList, pieData } = useLeft();
const { total1, totalList5, threatShareList } = useRight();

// 监测行业分布柱状图：x轴间隔显示，最终只显示5个标签，文字不截断
// const industryBarXAxisOption = computed(() => {
//   const total = pieData.value.length || 10;
//   const showCount = 5;
//   // interval = Math.ceil(total/showCount) - 1，每隔N条显示一个标签
//   const interval = Math.max(0, Math.ceil(total / showCount) - 1);
//   return {
//     xAxis: {
//       axisLabel: {
//         interval,
//         overflow: 'none',
//         width: undefined,
//         fontSize: 20,
//         fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
//         color: "#ffffff",
//         align: "center",
//       },
//     },
//   };
// });

const contentRef = ref(null);
const itemHeight = ref(0);

onMounted(() => {
  nextTick(() => {
    if (contentRef.value) {
      // clientHeight包含上下15px的padding，需减去30px，再计算高度
      itemHeight.value = (contentRef.value.clientHeight - 30) / 3 - 20;
    }
  });
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
