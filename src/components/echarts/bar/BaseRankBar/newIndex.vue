<template>
  <v-chart class="chart" ref="batteryBar" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PictorialBarChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../../config";

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
]);

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
  name: {
    type: String,
    default: "",
  },
});

const { tooltip } = config;

const option = computed(() => {
  const nameList = props.data.map((item) => item.name);
  const valueList = props.data.map((item) => item.value);
  console.log("nameList", nameList);
  console.log("valueList", valueList);
  return {
    grid: {
      top: 40,
      left: 80,
      right: 20,
      bottom: 10,
    },
    tooltip: {
      ...tooltip,
      formatter: (param) => {
        const { seriesName, name, value } = param[0];
        return `<p style="font-size:16px;">${name}</p><p style="font-size:16px;"><span>${seriesName}</span><span style="margin-left:15px">${value.toLocaleString(
          "en-US"
        )}</span></p>`;
      },
    },
    xAxis: {
      show: true,
      type: "value",
      // scale: true,
      position: "top",
      boundaryGap: false,
      splitNumber: 1,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 6,
        textStyle: {
          color: "#ffffff",
        },
        formatter: (value) => {
          return `${numberFormat(value)}`;
        },
      },
    },
    yAxis: {
      type: "category",
      nameGap: 16,
      inverse: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#2e425f",
          width: 2,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: "#ffffff",
        },
        formatter: function (value, index) {
          if (index === 0) {
            return `{top|${value}}`;
          }
          return value;
        },
        rich: {
          top: {
            color: "#F3AC41",
          },
        },
      },
      data: nameList,
    },
    series: [
      {
        type: "bar",
        name: props.name,
        barMaxWidth: 10,
        data: valueList.map((item, index) => {
          return {
            value: item,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color:
                    index !== 0 ? "rgba(0,240,255,0)" : "rgba(255,214,119,0)",
                },
                {
                  offset: 1,
                  color: index !== 0 ? "#13C2FF" : "#F3AC41",
                },
              ]),
            },
          };
        }),
      },
      {
        name: "",
        type: "pictorialBar",
        symbolPosition: "end",
        symbol: "rect",
        z: 11,
        symbolSize: [4, 10],
        data: valueList,
        itemStyle: {
          color: "#fff",
        },
        tooltip: {
          show: false,
        },
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
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
