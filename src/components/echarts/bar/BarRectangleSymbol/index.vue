<template>
  <v-chart
    class="chart"
    ref="barRectangleSymbolChart"
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
import { getNationalPng, getCountryImg } from "@/libs/country";
import { inside } from "@antv/x6/lib/registry/port-label-layout/inout";
const imgPath = require("@/assets/img/echarts/bar/barSymbol.png");

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
]);

const { grid, legend, tooltip } = config;

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  showNational: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [
      {
        name: "系列一",
        list: [
          { label: "贵阳电子科技有限公司", value: 700 },
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
      fontSize: 16,
      formatter: (value, index) => {
        let arr = [];
        if (value.indexOf("-") !== -1) {
          arr = value.split("-");
        }
        const brief = getNationalPng(arr[0]);
        if (!brief) {
          if (index === 0) {
            return `{Num1|${index + 1}} {title|${value}}`;
          } else {
            return `{Num2|${index + 1}} {title|${value}}`;
          }
        } else {
          if (index === 0) {
            return `{Num1|${index + 1}} {${brief}|}{title|${arr[1]}}`;
          } else {
            return `{Num2|${index + 1}} {${brief}|}{title|${arr[1]}}`;
          }
        }
      },
      rich: {
        Num1: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          width: 16,
          height: 16,
          padding: [2, 2],
          align: "center",
          backgroundColor: "#FDAC41",
          borderColor: "#fdac42",
          borderWidth: 1,
          borderRadius: 10,
          margin: [0, 5, 0, 0],
        },
        Num2: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          width: 16,
          height: 16,
          padding: [2, 2],
          align: "center",
          backgroundColor: "rgba(0,240,255,0.10)",
          borderColor: "#13C2FF",
          borderWidth: 1,
          borderRadius: 10,
          margin: [0, 5, 0, 0],
        },
        title: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          padding: [0, 0, 0, 5],
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
      padding: [0, 0, 10, 0],
      align: "left",
      verticalAlign: "bottom",
      formatter: function (value, index) {
        if (index === 0) {
          return `{Num1|${index + 1}}{title|${value}}`;
        } else if (index === 1) {
          return `{Num2|${index + 1}}{title|${value}}`;
        } else if (index === 1) {
          return `{Num3|${index + 1}}{title|${value}}`;
        } else {
          return `{Num4|${index + 1}}{title|${value}}`;
        }
      },
      rich: {
        Num1: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          width: 16,
          height: 16,
          padding: [2, 2],
          align: "center",
          backgroundColor: "#ff3a2f",
          borderColor: "#ff3a2f",
          borderWidth: 1,
          // borderRadius: 10,
        },
        Num2: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          width: 16,
          height: 16,
          padding: [2, 2],
          align: "center",
          backgroundColor: "#f3c73a",
          borderColor: "#f3c73a",
          borderWidth: 1,
          // borderRadius: 10,
        },
        Num3: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          width: 16,
          height: 16,
          padding: [4, 4],
          align: "center",
          backgroundColor: "#1999f9",
          borderColor: "#1999f9",
          borderWidth: 1,
          // borderRadius: 10,
        },
        Num4: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          width: 16,
          height: 16,
          padding: [4, 4],
          align: "center",
          backgroundColor: "transparent",
          borderColor: "#062f4e",
          borderWidth: 1,
        },
        title: {
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          padding: [0, 0, 0, 10],
        },
      },
    };
  }
});

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
        triggerEvent: true,
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
          ...axisLabel.value,
          interval: 0,
          padding: [0, 0, 10, 0],
        },
      },
      // {
      //   show: true,
      //   inverse: true,
      //   data: yAxisData.value,
      //   axisLine: {
      //     show: false,
      //   },
      //   splitLine: {
      //     show: false,
      //   },
      //   axisTick: {
      //     show: false,
      //   },
      //   axisLabel: {
      //     margin: -20,
      //     interval: 0,
      //     padding: [0, 0, 10, 0],
      //     color: "#ffffff",
      //     fontWeight: 400,
      //     fontSize: 16,
      //     fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
      //     align: "right",
      //     verticalAlign: "bottom",
      //     formatter: function (value) {
      //       return thousands(value)
      //     }
      //   },
      // },
    ],
    series: [
      {
        type: "bar",
        name: props.data[0].name,
        showBackground: false,
        yAxisIndex: 0,
        backgroundStyle: {
          color: "#142945",
        },
        data: getSeriesData(),
        barWidth: 6,
        z: 2,
      },
      {
        type: "bar",
        barGap: "-150%",
        //  barCategoryGap:'-100%',
        data: props.data[0].list.map(() =>
          Math.max(...props.data[0].list.map((item) => item.value))
        ),
        barWidth: 12,
        itemStyle: {
          color: "none",
          borderColor: "rgba(64, 245, 245, 0.5)",
        },
        tooltip: {
          show: false,
        },
        label: {
          show: true,
          position: ["99%", -20],
          color: "#ffee74",
          fontWeight: 400,
          fontSize: 16,
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          align: "right",
          width: 130,
          formatter: function (params) {
            console.log(params.name);
            return thousands(
              props.data[0].list.find((item) => item.label === params.name)
                .value
            );
          },
        },
        z: 0,
      },
      {
        name: "",
        type: "pictorialBar",
        symbol: `image://${imgPath}`,
        symbolPosition: "end",
        symbolSize: [4, 8],
        symbolOffset: ["50%", "-10%"],
        data: props.data[0].list.map(() =>
          Math.max(...props.data[0].list.map((item) => item.value))
        ),
        tooltip: {
          show: false,
        },
      },
      {
        name: "",
        type: "pictorialBar",
        symbol: `image://${imgPath}`,
        symbolPosition: "start",
        symbolSize: [4, 8],
        symbolOffset: ["-100%", "-30%"],
        data: props.data[0].list.map(() =>
          Math.max(...props.data[0].list.map((item) => item.value))
        ),
        tooltip: {
          show: false,
        },
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
