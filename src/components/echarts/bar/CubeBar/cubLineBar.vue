<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
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
import { CubeLeft, CubeRight, CubeTop } from "./cube";

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
echarts.graphic.registerShape("CubeLeft", CubeLeft);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  cubeOption: {
    type: Object,
    default: () => {
      return {
        width: 24,
        height: 6,
        space: 6,
      };
    },
  },
  single: {
    type: Number,
    default: 2,
  },
  data: {
    type: Array,
    default: () => [
      {
        name: "类型1",
        list: [
          { label: "01-01", value: 10 },
          { label: "01-02", value: 20 },
          { label: "01-02", value: 30 },
          { label: "01-02", value: 40 },
          { label: "01-02", value: 50 },
        ],
      },
      {
        name: "类型2",
        list: [
          { label: "01-01", value: 5 },
          { label: "01-02", value: 6 },
          { label: "01-02", value: 7 },
          { label: "01-02", value: 8 },
          { label: "01-02", value: 9 },
          { label: "01-02", value: 12 },
        ],
      },
      {
        name: "类型3",
        list: [
          { label: "01-01", value: 20 },
          { label: "01-02", value: 25 },
          { label: "01-02", value: 15 },
          { label: "01-02", value: 10 },
          { label: "01-02", value: 30 },
          { label: "01-02", value: 15 },
        ],
      },
    ],
  },
  gradColor: {
    type: Object,
    default: () => ({
      left: ["rgba(46,196,255,1)", "rgba(0,194,255,0.01)"],
      right: ["rgba(46,196,255,1)", "rgba(0,194,255,0.01)"],
      top: "#BFCDFF",
    }),
  },
});

const legendData = computed(() => {
  return props.data.map((item) => item.name);
});

const categories = computed(() => {
  return props.data[0].list.map((item) => item.label);
});

const YaxisLabel = computed(() => {
  const ylabel = function (value) {
    console.log("name-===-----", value);
    return "xx";
  };
  return ylabel;
});

const option = computed(() => {
  const color = props.option?.color ?? [
    {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: "#62FBFF", // 0% 处的颜色
        },
        {
          offset: 1,
          color: "#3DDDFF", // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    "#2748EE",
  ];
  let series = [
    {
      type: "custom",
      name: props.data[0].name,
      zlevel: 2,
      renderItem: function (params, api) {
        return renderItem(
          params,
          api,
          props.single === 1 ? 0 : 1,
          // {
          //   left: ['#2c45ff', 'rgba(0,194,255,0.01)'],
          //   right: ['#2c45ff', 'rgba(0,194,255,0.01)'],
          //   top: '#BFCDFF',
          // },
          props.gradColor,
          props.cubeOption
        );
      },
      data: props.data[0].list.map((item) => item.value),
    },
    {
      name: props.data[1].name,
      type: "line",
      show: props.lineShow,
      zlevel: 4,
      lineStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#F77D00",
            },
            {
              offset: 1,
              color: "#FDE43B",
            },
          ],
          globalCoord: false,
        },
      },
      data: props.data[1].list.map((item) => item.value),
    },
    {
      name: props.data[2].name,
      type: "line",
      show: props.lineShow,
      zlevel: 5,
      lineStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "#E94DFF",
            },
            {
              offset: 1,
              color: "#E94DFF",
            },
          ],
          globalCoord: false,
        },
      },
      data: props.data[2].list.map((item) => item.value),
    },
  ];
  return {
    color,
    grid: { ...grid, ...props.option?.grid },
    legend: {
      // show: false,
      ...legend,
      ...props.option?.legend,
      data: legendData.value,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: {
      ...yAxis,
      ...props.option?.yAxis,
      // axisLabel: {
      //   formatter: YaxisLabel,
      // },
    },
    xAxis: { ...xAxis, ...props.option?.xAxis, data: categories.value },
    dataZoom: { ...dataZoom, ...props.option?.dataZoom },
    series,
  };
});

function renderItem(params, api, index, styleColor, cubeOption) {
  const location = api.coord([api.value(0), api.value(1)]);
  return {
    type: "group",
    children: [
      {
        type: "CubeLeft",
        shape: {
          api,
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
          index,
          cubeOption,
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0.2,
              color: styleColor.left[0], // 顶部
            },
            {
              offset: 1,
              color: styleColor.right[1], // 底部
            },
          ]),
          shadowBlur: 5,
          stroke: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0.2,
              color: "#ffffff",
            },
            {
              offset: 1,
              color: "rgba(0, 0, 0, 0)",
            },
          ]),
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
      {
        type: "CubeRight",
        shape: {
          api,
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
          index,
          cubeOption,
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0.2,
              color: styleColor.left[0], // 顶部
            },
            {
              offset: 1,
              color: styleColor.right[1], // 底部
            },
          ]),
          shadowBlur: 5,
          stroke: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0.2,
              color: "#ffffff",
            },
            {
              offset: 1,
              color: "rgba(0, 0, 0, 0)",
            },
          ]),
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
      {
        type: "CubeTop",
        shape: {
          api,
          x: location[0],
          y: location[1],
          xAxisPoint: api.coord([api.value(0), 0]),
          index,
          cubeOption,
        },
        style: {
          fill: styleColor,
          shadowBlur: 5,
          stroke: "rgba(255,255,255,0.4)",
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
    ],
  };
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
