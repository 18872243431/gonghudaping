<template>
  <v-chart
    class="chart"
    ref="treeMapChart"
    :option="option"
    :autoresize="true"
  />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { TreemapChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";

use([
  CanvasRenderer,
  TreemapChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
]);
const imgPath1 = require("@/assets/img/dw.png");

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Array,
    default: () => [
      { name: "上海", value: 26 },
      { name: "广东", value: 24 },
      { name: "江苏", value: 20 },
      { name: "山东", value: 18 },
      { name: "北京", value: 16 },
      { name: "四川", value: 14 },
      { name: "浙江", value: 13 },
      { name: "重庆", value: 12 },
      { name: "福建", value: 10 },
      { name: "安徽", value: 9 },
    ],
  },
});

function getDataColor() {
  const colors = [
    "#012b57",
    "#002f53",
    "#073051",
    "#003248",
    "#00374f",
    "#002b34",
    "#003035",
    "#10363b",
    "#164045",
    "#164045",
  ];
  let arr = [];
  props.data.map((item, index) => {
    arr.push({
      ...item,
      itemStyle: {
        color: colors[index % colors.length],
      },
      // label: {
      //       rich: {
      //           img: {
      //               backgroundColor: {
      //                   image:`image://${imgPath1}`,
      //               },
      //               height: 85
      //           },
      //           height: 85
      //       },
      //   }
    });
  });
  return arr;
}
const option = computed(() => {
  return {
    tooltip: {
      show: true,
      trigger: "item",
      backgroundColor: "rgba(11, 36, 57, 0.8)",
      shadowBlur: 7,
      shadowColor: "rgba(0, 96, 255, 0.5)",
      borderRadius: 4,
      borderColor: "#4DD5FF",
      textStyle: {
        color: "#D7DDFF",
        fontSize: 18,
      },
      zlevel: 10,
    },
    series: [
      {
        type: "treemap",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        labelLayout: (params) => {
          return {
            x: params.rect.x,
            y: params.labelRect.y,
          };
        },
        label: {
          show: true,
          formatter: (params) => {
            const num = params.dataIndex < 3 ? 1 : params.dataIndex < 5 ? 2 : 3;
            return `{name${num}|${params.name}} \n \n{value${num}|${params.value}}`;
            // return `{img|}\n {name|${params.name}} \n{value|${params.value}}`;
          },
          rich: {
            img: {
              backgroundColor: {
                image: imgPath1,
              },
              width: 24,
              height: 24,
              align: "center",
              verticalAlign: "middle",
            },
            name1: {
              fontSize: 34,
              color: "#fff",
              align: "center",
            },
            value1: {
              // padding: [10, 0],
              fontSize: 42,
              fontWeight: "bold",
              fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
              color: "#ffee74",
              align: "center",
            },
            name2: {
              fontSize: 24,
              color: "#fff",
              align: "center",
            },
            value2: {
              // padding: [10, 0],
              fontSize: 32,
              fontWeight: "bold",
              fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
              color: "#ffee74",
              align: "center",
            },
            name3: {
              fontSize: 18,
              color: "#fff",
              align: "center",
            },
            value3: {
              // padding: [10, 0],
              fontSize: 24,
              fontWeight: "bold",
              fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
              color: "#ffee74",
              align: "center",
            },
          },
        },
        upperLabel: {
          show: false,
          height: 30,
        },
        breadcrumb: {
          show: false,
        },
        roam: false,
        nodeClick: false,
        itemStyle: {
          borderColor: "transparent",
          gapWidth: 5,
          borderRadius: 3,
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowBlur: 10,
        },
        data: getDataColor(),
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
