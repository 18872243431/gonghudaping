<template>
  <v-chart
    class="chart"
    ref="barRectangleSymbolChart"
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
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../../config";
import { getNationalPng, getCountryImg } from "@/libs/country";
const imgPath = require("./barSymbol.png");

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
  colors: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "系列",
  },
  data: {
    type: Array,
    default: () => [
      { name: "中国-贵阳电子科技有限公司", value: 700 },
      { name: "日本-贵阳电子科技有限公司", value: 601 },
      { name: "美国-贵阳电子科技有限公司", value: 403 },
      { name: "英国-贵阳电子科技有限公司", value: 366 },
      { name: "俄罗斯-贵阳电子科技有限公司", value: 266 },
    ],
  },
});

const emits = defineEmits(["click"]);

const color1 = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 1,
  y2: 0,
  colorStops: [
    {
      offset: 0,
      color: "rgba(147,142,85,0.1)",
    },
    {
      offset: 0.5,
      color: props.colors ? props.colors : "#937C55", // 0% 处的颜色
    },
    {
      offset: 1,
      color: props.colors ? props.colors : "#F3AC41", // 100% 处的颜色
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
      color: "rgba(27,50,85,0.1)", // 0% 处的颜色
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
function getSeriesData() {
  let arr = [];
  props.data.map((item, index) => {
    arr.push({
      ...item,
      itemStyle: {
        color: index === 0 ? color1 : color2,
      },
    });
  });
  return arr;
}

const axisLabel = computed(() => {
  return {
    interval: 0,
    inside: true,
    margin: 0,
    color: ["#C7DDFF"],
    align: "left",
    verticalAlign: "bottom",
    lineHeight: 32,
    fontSize: 14,
    formatter: (value, index) => {
      let arr = [];
      if (value.indexOf("-") !== -1) {
        arr = value.split("-");
      }
      const brief = getNationalPng(arr[0]);
      if (!brief) {
        if (index === 0) {
          return `{Num1|${index + 1}}`;
        } else {
          return `{Num2|${index + 1}}`;
        }
      } else {
        if (index === 0) {
          return `{Num1|${index + 1}} {${brief}|}`;
        } else {
          return `{Num2|${index + 1}} {${brief}|}`;
        }
      }
    },
    rich: {
      Num1: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 400,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        width: 22,
        height: 23,
        align: "center",
        backgroundColor: "#FDAC41",
        borderColor: "#fdac42",
        borderWidth: 1,
        borderRadius: 10,
        margin: [0, 5, 0, 0],
      },
      Num2: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 400,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        width: 22,
        height: 23,
        align: "center",
        backgroundColor: "rgba(0,240,255,0.10)",
        borderColor: "#13C2FF",
        borderWidth: 1,
        borderRadius: 10,
        margin: [0, 5, 0, 0],
      },
      ...getCountryImg(),
    },
  };
});

const barLabelOpt = computed(() => {
  return {
    label: {
      show: true,
      color: "#fff",
      offset: [42, -15],
      lineHeight: 32,
      fontSize: 18,
      overflow: "truncate",
      width: 300,
      formatter: function (params) {
        let arr = [];
        if (params.name.indexOf("-") !== -1) {
          arr = params.name.split("-");
          return arr[1];
        }
        return params.name;
      },
    },
    labelLayout(params) {
      return {
        x: params.rect.x + 55,
        y: params.rect.y - params.rect.height * 1.8,
        verticalAlign: "middle",
        align: "left",
      };
    },
  };
});

const option = computed(() => {
  const categories = props.data.map((item) => item.name);
  const yAxisData = props.data.map((item) => item.value);
  return {
    grid: { ...grid, top: 10, bottom: -10, right: 10, ...props.option?.grid },
    legend: {
      show: false,
      ...legend,
      ...props.option?.legend,
      data: [props.name],
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    xAxis: {
      show: false,
    },
    yAxis: [
      {
        show: true,
        inverse: true,
        data: categories,
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
          ...axisLabel.value,
        },
      },
      {
        show: true,
        inverse: true,
        data: yAxisData,
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
          color: "#fff",
          fontWeight: 400,
          fontSize: 20,
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          align: "right",
          verticalAlign: "bottom",
          formatter: function (val) {
            return Number(val).toLocaleString("en-US");
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        name: props.name,
        showBackground: true,
        backgroundStyle: {
          color: "rgba(208,222,238,0.07)",
        },
        yAxisIndex: 0,
        data: getSeriesData(),
        barWidth: 8,
        ...barLabelOpt.value,
      },
      {
        name: "",
        type: "pictorialBar",
        symbol: `image://${imgPath}`,
        symbolPosition: "end",
        symbolSize: [8, 8],
        symbolOffset: ["55%", "0%"],
        data: getSeriesData(),
        tooltip: {
          show: false,
        },
      },
    ],
  };
});

function handleClick(params) {
  emits("click", params);
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 110%;
}
</style>
