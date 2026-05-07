<template>
  <v-chart
    class="chart"
    ref="barChart"
    :option="option"
    :autoresize="true"
    @click="handleClick"
  />
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

const emit = defineEmits(["countryClick"]);

function handleClick(params) {
  if (!props.showNational) return;
  const label = params.name ?? params.value;
  if (params.componentType === "series" && params.seriesType === "bar") {
    emit("countryClick", label);
  } else if (params.componentType === "yAxis") {
    emit("countryClick", label);
  }
}

const axisLabel = computed(() => {
  if (props.showNational) {
    return {
      interval: 0,
      inside: true,
      margin: 0,
      color: ["#C7DDFF"],
      align: "left",
      verticalAlign: "bottom",
      lineHeight: 32,
      fontSize: 14,
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
          fontSize: 14,
          color: "#C7DDFF",
          padding: [0, 5, 0, 0],
        },
        value: {
          fontSize: 14,
          color: "#C7DDFF",
        },
        ...getCountryImg(),
      },
    };
  } else {
    return {
      interval: 0,
      inside: true,
      color: "#AEC8EB",
      margin: 0,
      lineHeight: 32,
      fontSize: 14,
      align: "left",
      verticalAlign: "bottom",
      formatter(value, ind) {
        return `{seq|${ind + 1}} {label|${value}}`;
      },
      rich: {
        seq: {
          fontSize: 14,
          color: "#C7DDFF",
          padding: [0, 5, 0, 0],
        },
        label: {
          fontSize: 14,
          color: "#C7DDFF",
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
      top: 10,
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
        triggerEvent: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          ...axisLabel.value,
        },
        data: categories.value,
      },
      {
        show: true,
        inverse: true,
        triggerEvent: true,
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
          color: "#D0DEEE",
          fontWeight: 400,
          fontSize: 14,
          fontFamily: "DIN, DIN-Bold",
          align: "right",
          verticalAlign: "bottom",
          formatter: function (val) {
            return Number(val).toLocaleString("en-US");
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
