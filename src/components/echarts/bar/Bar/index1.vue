<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../../config";

use([
  CanvasRenderer,
  BarChart,
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
    default: {},
  },
  data: {
    type: Array,
    default: () => [
      { label: "类型1", value: 700 },
      { label: "类型2", value: 601 },
      { label: "类型3", value: 403 },
      { label: "类型4", value: 266 },
      { label: "类型5", value: 366 },
    ],
  },
});
const categories = computed(() => {
  return props.data.map((item) => item.label);
});
const yAxisData = computed(() => {
  return props.data.map((item) => item.value);
});

const color1 = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: "#20F4FF", // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: "#01B29D", // 0% 处的颜色
    },
    {
      offset: 1,
      color: "rgba(19,194,255,0)", // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
};
function getSeriesData() {
  let arr = [];
  props.data.map((item, index) => {
    arr.push({
      ...item,
      itemStyle: {
        color: color1,
      },
    });
  });
  return arr;
}

const option = computed(() => {
  return {
    grid: { ...grid, ...props.option?.grid },
    legend: {
      show: false,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    xAxis: {
      type: "category",
      show: true,
      axisLabel: {
        color: "#ffffff",
        fontSize: 12,
        interval: 0,
        width: 60,
        overflow: "truncate",
      },
      axisLine: {
        lineStyle: {
          color: "#144B9D",
        },
      },
      axisTick: {
        show: false,
      },
      data: categories.value,
    },
    yAxis: [
      {
        type: "value",
        name: "",
        axisLabel: {
          color: "#ffffff",
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#0F3165",
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        z: 2,
        type: "bar",
        name: "value",
        data: getSeriesData(),
        barWidth: 10,
      },
      {
        name: '柱顶部',
        type: 'pictorialBar',
        symbolSize: [10, 4],
        symbol: 'rect',
        symbolOffset: [0, -2],
        z: 12,
        itemStyle: {
          color: '#14CFFF',
        },
        label: {
          show: false,
        },
        symbolPosition: 'end',
        tooltip: {
          show: false,
        },
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
