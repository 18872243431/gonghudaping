<template>
  <v-chart class="chart" ref="pieChart" :option="option" :autoresize="true" />
</template>

<script setup>
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { computed, defineProps, ref } from "vue";

const pieChart = ref(null);

const props = defineProps({
  // 百分比值
  percentage: {
    type: Number,
    default: 75,
  },
  // 标题文本
  title: {
    type: String,
    default: "已完成",
  },
  // 主色调渐变
  primaryColor: {
    type: Array,
    default: () => ["#16CEB9", "#6648FF"],
  },
  // 背景色
  backgroundColor: {
    type: String,
    default: "#111",
  },
  // 进度条宽度
  barWidth: {
    type: Number,
    default: 30,
  },
  // 进度条半径
  radius: {
    type: Array,
    default: () => ["70%", "80%"],
  },
});

const option = computed(() => {
  return {
    title: [
      {
        text: props.title,
        x: "center",
        top: "55%",
        textStyle: {
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "100",
        },
      },
      {
        text: `${props.percentage}`,
        x: "center",
        y: "center",
        textStyle: {
          fontSize: 32,
          color: "#FFBD43",
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          fontWeight: 600,
        },
      },
    ],
    polar: {
      radius: props.radius,
      center: ["50%", "50%"],
    },
    angleAxis: {
      max: 100,
      show: false,
    },
    radiusAxis: {
      type: "category",
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "",
        type: "bar",
        roundCap: true,
        barWidth: props.barWidth,
        data: [props.percentage],
        coordinateSystem: "polar",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: props.primaryColor[0],
              },
              {
                offset: 1,
                color: props.primaryColor[1],
              },
            ]),
          },
        },
      },
      {
        name: "",
        type: "pie",
        startAngle: 80,
        radius: ["90%"],
        hoverAnimation: false,
        center: ["50%", "50%"],
        itemStyle: {
          color: "rgba(66, 66, 66, .1)",
          borderWidth: 1,
          borderColor: "#5269EE",
        },
        data: [100],
      },
      {
        name: "",
        type: "pie",
        startAngle: 80,
        radius: ["60%"],
        hoverAnimation: false,
        center: ["50%", "50%"],
        itemStyle: {
          color: "rgba(66, 66, 66, .1)",
          borderWidth: 1,
          borderColor: "#5269EE",
        },
        data: [100],
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
