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
  console.log("props.data", props.data);
  // const valueList = props.data.map((item) => item.value)
  let valueList = [];
  props.data.forEach((it) => {
    // let num = it.value * 1 + it.value1 * 1 + it.value2 * 1;
    let num = it.value
    valueList.push(num);
  });
  console.log("numList", valueList);
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
        console.log("params", params);
        let data = props.data;
        let index = params.dataIndex;
        return (
          `${params.name}` +
          `<br />` +
          // "恶意IP数量:" +
          // `${data[index].value1}` +
          // `<br />` +
          // "恶意域名数量:" +
          // `${data[index].value2}` +
          // `<br />` +
          "恶意样本数量:" +
          `${data[index].value}`
        );
      },
    },
    grid: {
      left: 50,
      right: 20,
      top: 20,
      bottom: 50,
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
        rotate: props.rotate,
        margin: 20,
        width: 100,
        overflow: 'truncate',
        color: "#ffffff",
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
              color: "rgba(19,194,255,0)",
            },
            {
              offset: 1,
              color: "#13c2ff",
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
          color: "#14CFFF",
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
