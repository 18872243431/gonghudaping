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
    default: {},
  },
  cubeOption: {
    type: Object,
    default: {
      width: 24,
      height: 6,
      space: 6,
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
        name: "线上传播总量",
        list: [
          { label: "01-01", value: 10 },
          { label: "01-02", value: 20 },
          { label: "01-01", value: 10 },
          { label: "01-02", value: 20 },
        ],
      },
      {
        name: "线上传播存活量",
        list: [
          { label: "01-01", value: 5 },
          { label: "01-02", value: 6 },
          { label: "01-01", value: 5 },
          { label: "01-02", value: 6 },
        ],
      },
      {
        name: "线下传播总量",
        list: [
          { label: "01-01", value: 20 },
          { label: "01-02", value: 25 },
          { label: "01-01", value: 20 },
          { label: "01-02", value: 25 },
        ],
      },
      {
        name: "线下传播存活量",
        list: [
          { label: "01-01", value: 30 },
          { label: "01-02", value: 35 },
          { label: "01-01", value: 30 },
          { label: "01-02", value: 35 },
        ],
      },
    ],
  },
  lineShow: {
    type: Boolean,
    default: true,
  },
  gradColor: {
    type: Object,
    default: () => ({
      left: ["rgba(46,196,255,1)", "rgba(63,164,255,0)"],
      right: ["rgba(46,196,255,1)", "rgba(0,194,255,0.01)"],
      top: "#BFCDFF",
    }),
  },
  gradRightColor: {
    type: Object,
    default: () => ({
      left: ["rgba(46,114,255,1)", "rgba(63,88,255,0)"],
      right: ["rgba(46,114,255,1)", "rgba(63,88,255,0)"],
      top: "#BFCDFF",
    }),
  },
  gradthreeColor: {
    type: Object,
    default: () => ({
      left: ["rgba(41,235,217,1)", "rgba(63,255,188,0)"],
      right: ["rgba(41,235,217,1)", "rgba(63,255,188,0)"],
      top: "#BFCDFF",
    }),
  },
  gradFourColor: {
    type: Object,
    default: () => ({
      left: ["rgba(255,158,46,1)", "rgba(255,183,63,0)"],
      right: ["rgba(255,158,46,1)", "rgba(255,183,63,0)"],
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
        return renderItem(params, api, -4, props.gradColor, props.cubeOption);
      },
      data: props.data[0].list.map((item) => item.value),
    },
    {
      type: "custom",
      name: props.data[1].name,
      zlevel: 2,
      renderItem: function (params, api) {
        return renderItem(
          params,
          api,
          -2,
          props.gradRightColor,
          props.cubeOption
        );
      },
      data: props.data[1].list.map((item) => item.value),
    },
    {
      type: "custom",
      name: props.data[2].name,
      zlevel: 2,
      renderItem: function (params, api) {
        return renderItem(
          params,
          api,
          0,
          props.gradthreeColor,
          props.cubeOption
        );
      },
      data: props.data[2].list.map((item) => item.value),
    },
    {
      type: "custom",
      name: props.data[3].name,
      zlevel: 2,
      renderItem: function (params, api) {
        return renderItem(
          params,
          api,
          2,
          props.gradFourColor,
          props.cubeOption
        );
      },
      data: props.data[3].list.map((item) => item.value),
    },
  ];
  return {
    color,
    grid: { ...grid, ...props.option?.grid },
    legend: {
      ...legend,
      ...props.option?.legend,
      data: legendData.value,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: { ...yAxis, ...props.option?.yAxis },
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
