<template>
  <v-chart
    class="rank-chart"
    ref="barChart"
    :option="option"
    :autoresize="true"
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
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed, ref, onMounted, onBeforeUnmount, reactive } from "vue";
import config from "../../config";
import { fontSize, getMaxValueByKey, insertSeparator } from "@/libs/util";

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
]);

const { tooltip } = config;

const props = defineProps({
  option: {
    type: Object,
    default: {},
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const barChart = ref(null);
const valueList = computed(() => {
  return props.data.map((item) => item.value);
});
const labelList = computed(() => {
  return props.data
    .map((item, index) => `${index + 1}. ${item.label}`)
    .reverse();
});

const grid = {
  left: 20,
  right: 80,
  bottom: 0,
  top: 20,
};

const max = computed(() => {
  const valueList = props.data.map((item) => item.value);
  return Math.max.apply(null, valueList);
});

const rightWidth = computed(() => {
  const maxValue = getMaxValueByKey(props.data, "value");
  if (!maxValue) return 0;
  const length = insertSeparator(maxValue).length;
  const width = length * 12;
  return width > 50 ? width : 50;
});

const option = computed(() => {
  return {
    grid: { ...grid, right: rightWidth.value, ...props.option?.grid },
    xAxis: {
      type: "value",
      max: max.value,
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
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
          show: false,
        },
      },
      {
        type: "category",
        inverse: true,
        axisTick: "none",
        axisLine: "none",
        show: true,
        axisLabel: {
          color: "#ffffff",
          fontSize: 18,
          margin: 10,
        },
        data: valueList.value.map((item) => thousands(item)),
      },
      {
        //名称
        type: "category",
        offset: -5,
        position: "left",
        padding: [0, 10, 0, 0],
        axisLine: {
          show: false,
        },
        inverse: false,
        axisTick: {
          show: false,
        },
        axisLabel: {
          // interval: 0,
          color: ["#C7DDFF"],
          // align: 'left',
          // verticalAlign: 'bottom',
          lineHeight: 32,
          fontSize: 18,
        },
        data: props.data.map((it) => it.label),
      },
    ],
    series: [
      {
        zlevel: 1,
        type: "bar",
        barWidth: 6,
        data: valueList.value,
        align: "center",
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0.7,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgba(16,171,244,0)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#10B0FF", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      {
        type: "bar",
        barWidth: 6,
        barGap: "-100%",
        data: Array(props.data.length).fill(max.value),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0.7,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255,255,255,0)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(11,36,57,0.60)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          borderRadius: [0, 20, 20, 0],
        },
      },
      {
        zlevel: 3,
        type: "bar",
        itemStyle: {
          color: "rgba(0,0,0,0)",
          opacity: 1,
          borderRadius: [0, 20, 20, 0],
        },
        label: {
          show: true,
          formatter: "",
          backgroundColor: "#CAF9FF",
          width: 8,
          height: 8,
          position: "right",
          offset: [-12, 0],
          borderWidth: 6,
          borderColor: "rgba(19,150,249,0.2)",
          borderRadius: 4,
          shadowColor: "rgba(116,201,255,0.5)",
          shadowBlur: 8,
        },
        showBackground: false,
        silent: true,
        barWidth: 6,
        barGap: "-100%",
        data: valueList.value,
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
.rank-chart {
  width: 100%;
  height: 100%;
}
</style>
