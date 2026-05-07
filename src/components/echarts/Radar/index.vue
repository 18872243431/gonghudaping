<template>
  <v-chart
    class="chart"
    ref="radarChartRef"
    :option="option"
    :autoresize="true"
  />
</template>

<script setup>
import { use } from "echarts/core";
import { RadarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../config";
use([
  CanvasRenderer,
  RadarChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Array,
    default: () => [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: "2020年",
      },
    ],
  },
});

const { grid, legend, tooltip } = config;
const fontColor = "rgba(255,255,255,1)";
const backgroundColor = "rgba(15,224,255,0)";
const borderColor = "rgba(255,255,255,0.6)";
const colors = [
  "#0BB3D3",
  "#0A94D4",
  "#FFEA2F",
  "#00CA78",
  "#6FCA57",
  "#BF9431",
  "#FF579F",
  "#F25858",
];

const option = computed(() => {
  const color = props.option?.colors ?? [...colors];
  return {
    legend: {
      ...legend,
      ...props.option?.legend,
    },
    grid: {
      ...grid,
      ...props.option?.grid,
    },
    tooltip: {
      ...tooltip,
      trigger: "item",
      ...props.option?.tooltip,
    },
    color,
    radar: {
      axisLine: {
        lineStyle: {
          color: fontColor,
        },
      },
      axisName: {
        fontSize: 18,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      splitArea: {
        areaStyle: {
          color: backgroundColor,
        },
      },
      ...props.option?.radar,
    },
    series: [
      {
        name: "",
        type: "radar",
        areaStyle: {
          opacity: 0.5,
        },
        symbolSize: 6,
        ...props.option?.series,
        data: props.data,
      },
    ],
  };
});

console.log(option.value, "============");
</script>
