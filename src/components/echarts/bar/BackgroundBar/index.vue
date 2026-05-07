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
} from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import { getNationalPng, getCountryImg } from "@/libs/country";
import config from "../../config";
import xAxis from "./xAxis";

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
]);

const { grid, legend, tooltip } = config;

const props = defineProps({
  option: {
    type: Object,
    default: {},
  },
  showNational: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [
      {
        name: "类型1",
        list: [
          { label: "美国", value: 100 },
          { label: "英国", value: 98 },
          { label: "日本", value: 92 },
          { label: "韩国", value: 90 },
          { label: "德国", value: 78 },
        ],
      },
    ],
  },
});

const axisLabel = computed(() => {
  if (props.showNational) {
    return {
      interval: 0,
      inside: true,
      margin: 0,
      color: "#ffffff",
      align: "left",
      verticalAlign: "bottom",
      lineHeight: 32,
      fontSize: 20,
      fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      formatter: (value, ind) => {
        // let list = value.split(' ')
        const brief = getNationalPng(value);
        if (!brief) {
          return value;
        } else {
          return `{seq|${ind + 1}} {${brief}|} {value|${value}}`;
        }
      },
      rich: {
        seq: {
          fontSize: 20,
          color: "#ffffff",
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          padding: [0, 5, 0, 0],
        },
        value: {
          fontSize: 20,
          color: "#ffffff",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
        ...getCountryImg(),
      },
    };
  } else {
    return {
      interval: 0,
      inside: true,
      color: "#ffffff",
      margin: 0,
      lineHeight: 34,
      fontSize: 20,
      fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      align: "left",
      verticalAlign: "bottom",
      formatter(value, ind) {
        return `{seq|${ind + 1}} {label|${value}}`;
      },
      rich: {
        seq: {
          fontSize: 20,
          color: "#ffffff",
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          padding: [0, 5, 0, 0],
        },
        label: {
          fontSize: 20,
          color: "#ffffff",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
      },
    };
  }
});
const legendData = computed(() => {
  return props.data.map((item) => item.name);
});

const categories = computed(() => {
  return props.data[0].list.map((item) => item.label);
});
const series = computed(() => {
  return props.data.map((item) => {
    const arr = item.list.sort(function (a, b) {
      return b.value - a.value;
    });
    let list = arr.map((item, i) => {
      if (i !== 0) {
        return {
          ...item,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(0,240,255,0.00)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#13c2ff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        };
      } else {
        return {
          ...item,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(248,160,56,0)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#f8a038", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        };
      }
    });
    return {
      name: item.name,
      type: "bar",
      barWidth: 10,
      showBackground: true,
      backgroundStyle: {
        color: "rgba(208,222,238,0.07)",
      },
      data: list,
    };
  });
});

const option = computed(() => {
  return {
    grid: {
      ...grid,
      left: 10,
      right: 10,
      top: 30,
      bottom: 5,
      ...props.option?.grid,
    },
    legend: {
      ...legend,
      ...props.option?.legend,
      show: false,
      data: legendData.value,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          ...axisLabel.value,
          ...(props.option?.yAxis && props.option.yAxis[0]?.axisLabel),
          rich: {
            ...axisLabel.value.rich,
            ...(props.option?.yAxis && props.option.yAxis[0]?.axisLabel?.rich),
          }
        },
        data: categories.value,
      },
      {
        show: true,
        inverse: true,
        data: props.data[0].list,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          margin: 0,
          interval: 0,
          inside: true,
          padding: [0, 0, 10, 0],
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 20,
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          align: "right",
          verticalAlign: "bottom",
          ...(props.option?.yAxis && props.option.yAxis[1]?.axisLabel),
          formatter: function (val) {
            const num = Number(val).toLocaleString("en-US");
            return props.unit ? `${num}${props.unit}` : num;
          },
        },
      },
    ],
    xAxis: {
      ...xAxis,
      ...props.option?.xAxis,
    },
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
