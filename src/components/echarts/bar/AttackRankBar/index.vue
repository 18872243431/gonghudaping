<template>
  <v-chart class="chart" ref="barDoubleYChart" :option="option" :autoresize="true" />
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
]);

const { tooltip } = config;

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { name: '美国', value: 100 },
      { name: '英国', value: 98 },
      { name: '日本', value: 92 },
      { name: '韩国', value: 90 },
      { name: '德国', value: 78 },
    ],
  },
  option: {
    type: Object,
    default: {},
  },
  count: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    default: "",
  },
});

const color1 = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 1,
  y2: 0,
  colorStops: [
    {
      offset: 0,
      color: "#1B3255", // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: "#0F82A7", // 50% 处的颜色
    },
    {
      offset: 1,
      color: "#11BDF8", // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
};
const color2 = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 1,
  y2: 0,
  colorStops: [
    {
      offset: 0,
      color: "#1B3255", // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: "#7E8CA1", // 50% 处的颜色
    },
    {
      offset: 1,
      color: "#FFFFFF", // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
};

const option = computed(() => {
  const valueList = props.data.map((item) => item.value);
  const nameList = props.data.map((item) => item.name);
  return {
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
    },
    legend: {
      show: false,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    xAxis: {
      show: true,
      splitNumber: 2,
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "#144388",
          type: 3,
          dashOffset: 3,
        },
      },
    },
    yAxis: [
      {
        show: true,
        type: "category",
        inverse: true,
        data: nameList,
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
          interval: 0,
          inside: true,
          color: "#ffffff",
          margin: 0,
          padding: [0, 0, 10, 0],
          align: "left",
          verticalAlign: "bottom",
          formatter: (value, index) => {
            return `${index + 1}. ${value}`;
          },
        },
      },
      {
        show: true,
        inverse: true,
        data: valueList,
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
          fontSize: 14,
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          align: "right",
          verticalAlign: "bottom",
          formatter: (value) => {
            return thousands(value);
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        name: props.name,
        yAxisIndex: 0,
        showBackground: true,
        // backgroundStyle: {
        //   color: 'rgba(208,222,238,0.07)',
        //   borderColor: 'rgba(208,222,238,0.07)',
        //   borderWidth: 12,
        // },
        data: valueList.map((item, index) => {
          return {
            value: item,
            itemStyle: {
              color: index >= props.count ? color2 : color1,
            },
          };
        }),
        barWidth: 6,
      },
    ],
  };
});

function thousands(num) {
  let str = num.toString();
  const reg =
    str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, "$1,");
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
