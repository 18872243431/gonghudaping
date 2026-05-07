<template>
  <v-chart class="chart" :option="option" :autoresize="true" />
</template>

<script setup>
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { computed, defineProps } from "vue";

const props = defineProps({
  percentage: {
    type: Number,
    default: 30,
  },
  title: {
    type: String,
    default: "异常占比",
  },
});

const option = computed(() => {
  const value = Math.max(0, Math.min(100, Number(props.percentage) || 0));

  return {
    backgroundColor: "transparent",
    title: [
      {
        text: props.title,
        left: "center",
        top: "35%",
        textStyle: {
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: 20,
          fontWeight: 400,
        },
      },
      {
        text: `${value}%`,
        left: "center",
        top: "52%",
        textStyle: {
          fontSize: 24,
          color: "#00f0ff",
          fontWeight: "bold",
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
        },
      },
    ],
    polar: {
       radius: ["80%", "92%"],
      center: ["50%", "50%"],
    },
    angleAxis: {
      max: 100,
      startAngle: 90,
      clockwise: true,
      show: false,
    },
    radiusAxis: {
      type: "category",
      show: false,
    },
    series: [
      // 背景圆环 (使用 pie 确保 100% 稳定渲染，解决 gauge 在 360 度时不显示的 bug)
      {
        type: "pie",
        radius: ["80%", "92%"],
        center: ["50%", "50%"],
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          {
            value: 100,
            itemStyle: {
              color: "rgba(0, 240, 255, 0.15)", // 明显的深色背景
            },
          },
        ],
        z: 1,
        animation: false,
      },
      // 进度条 (使用 polar bar 支持圆角，并且从顶部 90 度顺时针开始)
      {
        type: "bar",
        data: [value],
        coordinateSystem: "polar",
        roundCap: true,
        itemStyle: {
          color: "#00f0ff",
          shadowColor: "rgba(0, 240, 255, 0.9)",
          shadowBlur: 15,
        },
        z: 2,
        silent: true,
      },
    ],
  };
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
