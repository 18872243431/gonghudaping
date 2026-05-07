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
        legend: ["流量", "URL", "IP", "域名"],
        category: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        values: [
          [234, 210, 330, 382, 140, 225, 360, 123, 346, 222, 344, 222],
          [123, 346, 222, 344, 222, 111, 222, 123, 356, 222, 344, 222],
          [123, 346, 222, 344, 222, 111, 222, 366, 111, 222, 344, 222],
          [123, 346, 222, 344, 222, 123, 346, 222, 344, 222, 222, 123],
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
    (props.option && props.option.color) ?? [
      "#A284FF",
      "#37FFB6",
      "#FFEF4A",
      "#2BFDFC",
      "#1859e9",
      "#d77434",
      "#c83371",
      "#7302eb",
      "#0011dd",
      "#8068b0",
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
      fontSize: 16,
      fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
    },
    symbolSize: props.symbolSize,
    data: item,
    markPoint: {
      symbol: "pin",
      symbolSize: 40,
      label: {
        show: true,
        fontSize: 14,
        color: "#ddd",
      },
      data: [
        { type: "max", name: "最大值" },
        // { type: 'min', name: '最小值' }
      ],
    },
  }));
});

const option = computed(() => {
  // console.error('legend:::', JSON.stringify({
  //     ...legend,
  //     icon: 'circle',
  //     itemWidth: 12,
  //     itemHeight: 12,
  //     ...props.option?.legend,
  //     data: props.data.legend,
  //     show: true
  //   }, null, 2))
  return {
    color: colors.value,
    grid: { ...grid, ...props.option?.grid },
    legend: {
      ...legend,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      ...props.option?.legend,
      data: props.data.legend,
      show: true,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: {
      ...yAxis,
      ...props.option?.yAxis,
      name: "",
      nameTextStyle: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        fontWeight: 400,
      },
      axisLabel: {
        show: true,
        color: "#ffffff",
        fontSize: 16,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        fontWeight: 400,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#ffffff",
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#ffffff",
        },
      },
    },
    xAxis: {
      ...xAxis,
      ...props.option?.xAxis,
      data: props.data.category,
      axisLabel: {
        ...props.option?.xAxis?.axisLabel,
        show: true,
        color: "#ffffff",
        fontSize: 16,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        fontWeight: 400,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#ffffff",
        },
      },
      axisTick: {
        show: false,
      },
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
