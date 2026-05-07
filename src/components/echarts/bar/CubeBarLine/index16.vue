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
  dataZoom: { type: Object, default: () => {} },
  bottom: { type: Number, default: 10 },
  cubeOption: {
    type: Object,
    default: () => {
      return { width: 16, height: 6, space: 6 };
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
          { label: "11", value: 10 },
          { label: "12", value: 28 },
        ],
      },
      {
        name: "类型2",
        list: [
          { label: "21", value: 15 },
          { label: "22", value: 30 },
        ],
      },
      {
        name: "类型3",
        list: [
          { label: "41", value: 12 },
          { label: "42", value: 23 },
        ],
      },
    ],
  },
  lineShow: {
    type: Boolean,
    default: true,
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
          color: "rgba(46,196,255,1)", // 0% 处的颜色
        },
        {
          offset: 1,
          color: "rgba(63,164,255,0)", // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: "rgba(44,69,255,1)", // 0% 处的颜色
        },
        {
          offset: 1,
          color: "rgba(0,194,255,0)", // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    "rgba(244,225,124,1)",
  ];

  let series = [];
  props.data.forEach((item, i) => {
    if (i == 0) {
      series.push({
        type: "custom",
        name: item.name,
        zlevel: 2,
        renderItem: function (params, api) {
          return renderItem(
            params,
            api,
            props.single === 0 ? 0 : -1,
            {
              left: ["rgba(46,196,255,1)", "rgba(63,164,255,0)"],
              right: ["rgba(46,196,255,1)", "rgba(63,164,255,0)"],
              top: "rgba(196,249,255,1)",
            },
            props.cubeOption
          );
        },
        data: item.list.map((item) => item.value),
      });
    }
    if (i == 1) {
      series.push({
        type: "custom",
        name: item.name,
        zlevel: 2,
        renderItem: function (params, api) {
          return renderItem(
            params,
            api,
            props.single === 1 ? 0 : 1,
            {
              left: ["rgba(44,69,255,1)", "rgba(0,194,255,0)"],
              right: ["rgba(44,69,255,1)", "rgba(0,194,255,0)"],
              top: "rgba(196,249,255,1)",
            },
            props.cubeOption
          );
        },
        data: item.list.map((item) => item.value),
      });
    }
  });

  if (props.single !== 2) {
    series = [series[props.single]];
  }
  if (props.lineShow) {
    series.push({
      name: props.data[props.data.length - 1].name,
      type: "line",
      show: props.lineShow,
      zlevel: 4,
      yAxisIndex: 1,
      itemStyle: {
        color: "rgba(244,225,124,1)",
      },
      lineStyle: {
        color: "rgba(240,222,121,1)",
      },
      data: props.data[props.data.length - 1].list.map((item) => item.value),
    });
  }
  return {
    color,
    grid: { ...grid, ...props.option?.grid, bottom: props.bottom },
    legend: {
      ...legend,
      ...props.option?.legend,
      textStyle: {
        color: "#FFFFFF",
        fontSize: 14,
      },
      data: legendData.value,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: [
      {
        ...yAxis,
        axisLabel: {
          color: "#ffffff",
          fontSize: 14,
        },
        ...props.option?.yAxis[0],
      },
      {
        ...yAxis,
        axisLabel: {
          color: "#ffffff",
          fontSize: 14,
        },
        ...props.option?.yAxis[1],
      },
    ],
    xAxis: {
      ...xAxis,
      ...props.option?.xAxis,
      axisLabel: {
        color: "#ffffff",
        fontSize: 14,
      },
      data: categories.value,
    },
    dataZoom: { ...dataZoom, ...props.dataZoom },
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
              color: "rgba(255,255,255,0.4)",
            },
            {
              offset: 1,
              color: "rgba(0, 0, 0, 0)",
            },
          ]),
          shadowColor: "rgba(106,201,255,1)",
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
              color: "rgba(255,255,255,0.4)",
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
