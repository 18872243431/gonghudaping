<template>
  <v-chart class="chart" ref="lineChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed, ref } from "vue";
import config from "../../config";

use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
]);

const { dataZoom, grid, legend, tooltip, xAxis, yAxis } = config;

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {
      return {
        legend: ["挖矿程序", "僵尸网络", "加密流量事件", "隐秘隧道事件"],
        category: ["1月", "2月", "3月", "4月", "5月"],
        values: [
          [10, 20, 30, 42, 21],
          [13, 27, 23, 33, 16],
          [15, 24, 21, 51, 19],
          [23, 37, 43, 13, 26],
          [26, 15, 35, 41, 33],
        ],
      };
    },
  },
  areaFlag: {
    type: Boolean,
    default: true,
  },
  symbolSize: {
    type: Number,
    default: 8,
  },
});

const lineChart = ref(null);

const colors = computed(
  () =>
    props.option?.color ?? [
      "rgba(0, 255, 255, 1)",
      "rgba(32, 160, 255, 1)",
      "rgba(0, 50, 150, 1)",
      "rgba(115, 2, 235, 1)",
      "rgba(0, 17, 221, 1)",
      "rgba(128, 104, 176, 1)",
      "rgba(255, 58, 47, 1)",
      "rgba(191, 174, 34, 1)",
      "rgba(58, 137, 81, 1)",
    ]
);
const areaColors = computed(
  () =>
    props.option?.areaColors ?? [
      "rgba(0, 255, 255, 0)",
      "rgba(32, 160, 255, 0)",
      "rgba(0, 50, 150, 0)",
      "rgba(115, 2, 235, 0)",
      "rgba(0, 17, 221, 0)",
      "rgba(128, 104, 176, 0)",
      "rgba(255, 58, 47, 0)",
      "rgba(191, 174, 34, 0)",
      "rgba(58, 137, 81, 0)",
    ]
);

const series = computed(() => {
  return props.data.values.map((item, index) => ({
    type: "line",
    name: props.data.legend[index],
    smooth: true,
    itemStyle: {
      color: colors.value[index],
      width: 3,
    },
    label: {
      show: false,
      color: "#ffffff",
      fontSize: 20,
      fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
    },
    areaStyle: props.areaFlag
      ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colors.value[index],
            },
            {
              offset: 1,
              color: areaColors.value[index],
            },
          ]),
        }
      : null,
    showSymbol: false,
    symbolSize: props.symbolSize,
    data: item,
  }));
});

const option = computed(() => {
  return {
    color: colors.value,
    grid: { ...grid, ...props.option?.grid },
    legend: {
      ...legend,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: "#ffffff",
        fontSize: 20,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      },
      ...props.option?.legend,
      data: props.data.legend,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: {
      ...yAxis,
      axisLabel: {
        color: "#ffffff",
        fontSize: 20,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      },
      ...props.option?.yAxis,
    },
    xAxis: {
      ...xAxis,
      axisLabel: {
        color: "#ffffff",
        fontSize: 20,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      },
      ...props.option?.xAxis,
      data: props.data.category,
    },
    dataZoom: { ...dataZoom, ...props.option?.dataZoom },
    series: series.value,
  };
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
