<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PictorialBarChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";

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
    default: () => [],
  },
  rotate: {
    type: Number,
    default: -18,
  },
});

const option = computed(() => {
  const valueList = props.data.map((item) => item.value);
  const nameList = props.data.map((item) => item.name);
  return {
    tooltip: {
      show: true,
      backgroundColor: "rgba(11,36,57,0.80)",
      borderColor: "#4dd5ff",
      textStyle: {
        color: "#E1EDFF",
        fontSize: 16,
      },
      formatter: (params) => {
        return `${params.name}：${params.value}`;
      },
    },
    grid: {
      left: 50,
      right: 20,
      top: 20,
      bottom: 40,
    },
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
      data: nameList,
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        align: "center",
        color: "#ffffff",
        rotate: props.rotate,
        margin: 20,
        width: 100,
        overflow: 'truncate',
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        formatter: (value) => {
          if (value < 10000) {
            return value;
          }
          return `${value / 10000}万`;
        },
      },
      splitLine: {
        lineStyle: {
          color: "#144388",
          type: 3,
          dashOffset: 3,
        },
      },
    },
    series: [
      {
        z: 2,
        name: "value",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#20F4FF", // 0% 处的颜色
            },
            {
              offset: 0.5,
              color: "#01B29D", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(19,194,255,0)", // 100% 处的颜色
            },
          ]),
        },
        label: {
          show: true,
          position: "top",
          color: "#ffffff",
        },
        data: valueList,
      },
      {
        name: "柱顶部",
        type: "pictorialBar",
        symbol: "rect",
        symbolSize: [10, 2],
        z: 12,
        itemStyle: {
          color: "#fff",
        },
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        symbolPosition: "end",
        data: valueList,
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
