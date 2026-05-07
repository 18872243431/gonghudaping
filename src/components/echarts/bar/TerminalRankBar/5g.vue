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
import config from "../../config";

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
]);

const { tooltip } = config;

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      legend: ["2G", "3G", "4G", "NB-IOT"],
      xAxisName: ["移动", "联通", "电信"],
      data: [
        [123, 121, 122],
        [213, 276, 266],
        [283, 356, 366],
        [432, 561, 564],
      ],
    }),
  },
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
    default: true,
  },
});

const grid = {
  left: 70,
  right: 40,
  top: 30,
  bottom: 50,
};

const nameList = computed(() => props.data.xAxisName);
const maxData = computed(() => {
  let data1 = props.data.data[0] || [];
  let data2 = props.data.data[1] || [];
  let arr = [];
  for (let i = 0; i < data1.length; i++) {
    let num = data1[i] + data2[i];
    arr.push(num);
  }
  return arr;
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

const seriesList = computed(() => {
  let arr = [];
  // let colors = ['#6666CC', '#F3AC41', '#3DE6FF', '#13C2FF', '#FE645E']
  let colors = ["#038AE6", "#14CFFF", "#F3B810", "#447BFF"];
  props.data.data.forEach((d, i) => {
    arr.push({
      z: 12,
      name: props.data.legend[i],
      type: "bar",
      barMaxWidth: "auto",
      barWidth: 10,
      stack: "Ad",
      itemStyle: {
        color: colors[i],
      },
      data: props.data.data[i],
    });
  });
  return arr;
});

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
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        rotate: props.rotate,
        interval: 0,
        align: "center",
        overflow: "truncate",
        padding: [0, 0, 0, 0],
      },
      data: nameList.value,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        formatter: (value) => {
          return `${numberFormat(value, 1)}`;
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
    legend: {
      // ...legend,
      icon: "rounRect",
      itemWidth: 8,
      itemHeight: 2,
      left: 60,
      top: -5,
      textStyle: {
        color: "#FFFFFF",
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        fontSize: 14,
      },
      pageTextStyle: {
        color: "#ffffff",
      },
      ...props.option?.legend,
      data: props.data.legend,
    },
    series: seriesList.value,
  };
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
