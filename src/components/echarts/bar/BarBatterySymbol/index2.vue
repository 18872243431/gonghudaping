<template>
  <v-chart
    class="chart"
    ref="barNumSymbolChart"
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
import { computed } from "vue";
import config from "../../config";
const imgPath1 = require("@/assets/img/echarts/bar/barWhiteSymbol.png");
const imgPath2 = require("@/assets/img/echarts/bar/barIntervalSymbol.png");

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
      {
        name: "系列一",
        list: [
          { label: "贵阳电子科技有限公司", value: 650 },
          { label: "贵阳电子科技有限公司", value: 601 },
          { label: "贵阳电子科技有限公司", value: 403 },
          { label: "贵阳电子科技有限公司", value: 266 },
          { label: "贵阳电子科技有限公司", value: 366 },
        ],
      },
    ],
  },
});

const legendData = computed(() => {
  return props.data.map((item) => item.name);
});

const categories = computed(() => {
  return props.data[0].list.map((item) => item.label);
});
const yAxisData = computed(() => {
  return props.data[0].list.map((item) => item.value);
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
      color: "#937C55", // 0% 处的颜色
    },
    {
      offset: 1,
      color: "#F3AC41", // 100% 处的颜色
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
  props.data[0].list.map((item, index) => {
    if (index === 0) {
      arr.push({
        ...item,
        itemStyle: {
          color: color1,
        },
      });
    } else {
      arr.push({
        ...item,
        itemStyle: {
          color: color2,
        },
      });
    }
  });
  return arr;
}

const option = computed(() => {
  return {
    grid: { ...grid, ...props.option?.grid },
    legend: {
      show: false,
      ...legend,
      ...props.option?.legend,
      data: legendData.value,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    xAxis: {
      show: false,
    },
    yAxis: [
      {
        show: true,
        inverse: true,
        data: categories.value,
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
          color: "#AEC8EB",
          margin: 0,
          padding: [0, 0, 10, 0],
          align: "left",
          verticalAlign: "bottom",
          formatter: function (value, index) {
            if (index === 0) {
              return `{Num1|${index + 1}}{title|${value}}`;
            } else {
              return `{Num2|${index + 1}}{title|${value}}`;
            }
          },
          rich: {
            Num1: {
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 16,
              height: 18,
              align: "center",
              backgroundColor: "#FDAC41",
              borderColor: "#fdac42",
              borderWidth: 1,
              borderRadius: 10,
            },
            Num2: {
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 16,
              height: 18,
              align: "center",
              backgroundColor: "rgba(0,240,255,0.10)",
              borderColor: "#13C2FF",
              borderWidth: 1,
              borderRadius: 10,
            },
            title: {
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              padding: [0, 0, 0, 10],
            },
          },
        },
      },
      {
        show: true,
        inverse: true,
        data: yAxisData.value,
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
          formatter: function (val) {
            return Number(val).toLocaleString("en-US");
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        name: props.data[0].name,
        showBackground: true,
        backgroundStyle: {
          color: "#142945",
        },
        yAxisIndex: 0,
        data: getSeriesData(),
        barWidth: 6,
      },
      {
        name: "",
        type: "pictorialBar",
        symbolPosition: "end",
        symbol: `image://${imgPath1}`,
        symbolSize: [12, 8],
        symbolOffset: ["60%", "0%"],
        zlevel: 10,
        data: getSeriesData(),
        tooltip: {
          show: false,
        },
      },
      {
        name: "",
        type: "pictorialBar",
        symbolRepeat: "fixed",
        symbolMargin: -2,
        symbol: `image://${imgPath2}`,
        symbolClip: true,
        symbolSize: [12, 8],
        symbolPosition: "start",
        symbolOffset: [0, 0],
        data: props.data[0].list,
        zlevel: 3,
        animationEasing: "elasticOut",
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
