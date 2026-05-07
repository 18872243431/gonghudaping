<template>
  <div class="chart-box">
    <div ref="chartTitleRef" class="chart-title" v-if="showTitle">
      <img ref="iconRef" :src="imgSrc" alt="" class="icon-img" />
      <span ref="titleRef" class="title">{{ title }}</span>
      <template v-if="showLine">
        <span class="line" v-for="i in lineNum" :key="i"></span>
        <div class="linebox">
          <div class="innerline"></div>
        </div>
      </template>
    </div>
    <div class="chart-wrapper">
      <slot name="chart"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

/* eslint-disable */
const props = defineProps({
  title: {
    type: String,
    default: "图表标题",
  },
  lineNum: {
    type: Number,
    default: 4,
  },
  showLine: {
    type: Boolean,
    default: true,
  },
});

const chartTitleRef = ref(null);
const iconRef = ref(null);
const titleRef = ref(null);
const lineWidth = ref("0px");

const imgSrc = ref(require("@/assets/img/chartBox/icon.png"));

const showTitle = computed(() => {
  return props.title ? true : false;
});

function computeLineWidth() {
  const chartTitleWidth = chartTitleRef.value.offsetWidth;
  const iconWidth = iconRef.value.offsetWidth;
  const titleWidth = titleRef.value.offsetWidth;
  lineWidth.value = `${
    chartTitleWidth - iconWidth - titleWidth - (2 + 7) * props.lineNum
  }px`;
}

onMounted(() => {
  computeLineWidth();
});
</script>

<style lang="scss" scoped>
.chart-box {
  --line-width: v-bind(lineWidth);
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  .chart-title {
    height: 42px;
    width: 100%;
    display: flex;
    .icon-img {
      width: 39px;
      height: 42px;
    }
    .title {
      margin-top: 8px;
      margin-left: -10px;
      font-weight: 700;
      font-family: sans-serif;
      font-size: 25px;
      color: transparent;
      letter-spacing: 2px;
      background-image: linear-gradient(
        rgb(255, 255, 255),
        rgb(210, 244, 252),
        rgb(89, 181, 218)
      );
      background-clip: text; // 裁剪背景到文字区域
      -webkit-background-clip: text; // 兼容 WebKit 浏览
      margin-right: 10px;
    }
    .line {
      display: inline-block;
      margin-top: 17px;
      width: 2px;
      height: 16px;
      background: #4dd5ff;
      margin-right: 5px;
    }
    .linebox {
      position: relative;
      display: flex;
      width: var(--line-width);
      margin-top: 20px;
      height: 10px;
      border-left: 2px solid #4dd5ff;
      border-right: 2px solid rgba(46, 196, 255, 0.2);
      justify-content: center;
      align-items: center;
      .innerline {
        position: relative;
        width: 100%;
        height: 2px;
        background: linear-gradient(
          315deg,
          rgba(46, 196, 255, 0.2) 0%,
          rgba(77, 213, 255, 1) 100%
        );
      }
    }
  }
  .chart-wrapper {
    position: relative;
    height: calc(100% - 52px);
    padding: 10px 10px;
    box-sizing: border-box;
    margin-top: 10px;
    > div {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
