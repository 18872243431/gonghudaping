<template>
  <v-chart
    class="chart"
    ref="barChart"
    @click="handClick"
    :option="option"
    :autoresize="true"
  />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PictorialBarChart } from "echarts/charts";
import {
  TooltipComponent,
  DataZoomComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../../config";

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
]);

const { dataZoom, tooltip } = config;

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { name: "石油", value: 1342 },
      { name: "钢铁", value: 1242 },
      { name: "天然气", value: 942 },
      { name: "煤炭", value: 842 },
      { name: "橡胶", value: 642 },
    ],
  },
  dataZoom: { type: Object, default: () => {} },
  rotate: {
    type: Number,
    default: 0,
  },
  option: {
    type: Object,
    default: {},
  },
  isOneBgColor: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  labelWidth: {
    type: Number,
    default: 80,
  },
});

const grid = {
  left: 90,
  right: 20,
  top: 30,
  bottom: 50,
};

const valueList = computed(() =>
  props.data.map((item) => {
    return {
      value: item.value,
      ...item,
    };
  })
);
const nameList = computed(() => props.data.map((item) => item.name));
const maxValue = Math.max.apply(null, valueList.value);
const totalList = computed(() =>
  new Array(valueList.value.length).fill(maxValue * 1.1)
);

function getData() {
  const arr = valueList.value.map((item, index) => {
    return {
      value: item.value,
      ...item,
      itemStyle: {
        color: props.isOneBgColor
          ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgba(19,194,255,0)",
              },
              {
                offset: 1,
                color: "#13c2ff",
              },
            ])
          : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color:
                  index === 0 ? "rgba(248,160,56,0)" : "rgba(19,194,255,0)",
              },
              {
                offset: 1,
                color: index === 0 ? "#f8a038" : "#13c2ff",
              },
            ]),
      },
    };
  });

  return arr;
}

const option = computed(() => {
  return {
    tooltip: {
      ...tooltip,
      ...props.option?.tooltip,
      axisPointer: {
        type: "none",
      },
    },
    grid: { ...grid, ...props.option?.grid },
    dataZoom: { ...dataZoom, ...props.dataZoom },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#144B9D",
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      data: nameList.value,
      axisLabel: {
        fontSize: 18,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        align: "center",
        rotate: props.rotate,
        interval: 0,
        margin: 20,
        width: props.labelWidth,
        overflow: "truncate",
      },
      ...props.option?.xAxis,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 18,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        formatter: (value) => {
          return `${numberFormat(value, 0)}`;
        },
      },
      splitLine: {
        lineStyle: {
          color: "#144388",
          type: 3,
          dashOffset: 3,
        },
      },
      minInterval: 1,
      data: valueList.value,
    },
    series: [
      {
        z: 12,
        type: "pictorialBar",
        name: props.name || "",
        symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
        barMaxWidth: "auto",
        barWidth: 100,
        label: {
          show: true,
          position: "top",
          color: "#ffffff",
          fontSize: 18,
          formatter: ({ value }) => {
            return `${numberFormat(value, 2)}`;
          },
        },
        data: getData(),
      },
      {
        z: 1,
        name: "背景",
        type: "bar",
        barMaxWidth: "auto",
        barWidth: 120,
        barGap: "-200%",
        data: totalList.value,
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: " rgba(208,222,238,0.07)",
        },
        data: valueList.value,
      },
    ],
  };
});

function numberFormat(value, precision = 0) {
  let param = {};
  let k = 10000;
  let sizes = ["", "万", "亿", "万亿"];
  let i;
  if (value < k) {
    param.value = value;
    param.unit = "";
  } else {
    i = Math.floor(Math.log(value) / Math.log(k));
    param.value = (value / Math.pow(k, i)).toFixed(precision);
    param.unit = sizes[i];
  }
  return param.value + param.unit;
}

const emits = defineEmits(["handClick"]);

function handClick(params) {
  emits("handClick", params);
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
