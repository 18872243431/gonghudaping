<template>
  <v-chart
    class="chart"
    ref="mapChart"
    :option="option"
    :autoresize="true"
    @georoam="handleGeoroam"
  />
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { ref, computed, onBeforeMount, reactive, onMounted } from "vue";
import ChinaMap from "/public/map/json/china.json";
import ChinaContourMap from "/public/map/json/china-contour.json";
import config from "../config";
import { CubeLeft, CubeRight, CubeTop } from "./cube";
import { getVisualMax } from "@/libs/util";
import {
  provinceNameMap,
  convertDataPlace,
  convertData2,
  convertCityData2,
} from "@/libs/coords";
import seriesOption from "./seriesOption.js";
const { visualMap } = config;

use([CanvasRenderer, MapChart]);

echarts.graphic.registerShape("MapCubeLeft", CubeLeft);
echarts.graphic.registerShape("MapCubeRight", CubeRight);
echarts.graphic.registerShape("MapCubeTop", CubeTop);

const props = defineProps({
  scatter: {
    type: Object,
    default: () => ({}),
  },
  mapData: {
    type: Object,
    default: () => ({
      name: "地图",
      data: [
        {
          name: "湖南",
          value: 1745,
        },
        {
          name: "北京",
          value: 2745,
        },
        {
          name: "吉林",
          value: 3745,
        },
        {
          name: "江西",
          value: 1245,
        },
        {
          name: "广西",
          value: 1599,
        },
        {
          name: "新疆",
          value: 1145,
        },
      ],
    }),
  },
  effectScatter: {
    type: Object,
    default: () => ({
      type: "effectScatter",
      data: [
        {
          name: "湖南",
          value: 1745,
        },
        {
          name: "北京",
          value: 2745,
        },
        {
          name: "吉林",
          value: 3745,
        },
        {
          name: "江西",
          value: 1245,
        },
        {
          name: "广西",
          value: 1599,
        },
        {
          name: "新疆",
          value: 1145,
        },
      ],
    }),
  },
  lines: {
    type: Object,
    default: () => ({}),
  },
  cubeList: {
    type: Array,
    default: () => [
      {
        name: "湖南",
        value: 1745,
      },
      {
        name: "北京",
        value: 2745,
      },
      {
        name: "吉林",
        value: 3745,
      },
      {
        name: "江西",
        value: 1245,
      },
      {
        name: "广西",
        value: 1599,
      },
      {
        name: "新疆",
        value: 1145,
      },
    ],
  },
});

const mapChart = ref(null);
const baseOption = {
  // zoom: 1.2,
  roam: true,
};
const series = computed(() => {
  let list = [];
  if (props.mapData.name) {
    list.push({
      ...seriesOption.map,
      ...props.mapData,
      itemStyle: {
        normal: {
          color: 'rgba(25,125,167,1)'
        }
      }
    });
  }
  if (props.effectScatter.type) {
    list.push({
      type: "effectScatter",
      name: "数据总量",
      coordinateSystem: "geo",
      symbolSize: [12, 6],
      showEffectOn: "render",
      rippleEffect: {
        brushType: "stroke",
      },
      itemStyle: {
        color: "#FFC3A9",
      },
      zlevel: 3,
      tooltip: {
        show: true,
        backgroundColor: "rgba(0, 0, 0, 0.64)",
        borderColor: "#35C0FF",
        textStyle: {
          color: "#ffffff",
        },
        formatter: (params) => {
          return `${params.value[3]}：${params.value[2]}`;
        },
      },
      ...props.effectScatter,
      data: convertDataPlace([
        ...props.effectScatter.data,
        { name: "贵州", value: 0 },
      ]),
    });
  }
  if (props.lines.type) {
    list.push({
      ...seriesOption.lines,
      ...props.lines,
      data: convertData2(props.lines.data),
    });
  }
  if (props.cubeList.length > 0) {
    list.push({
      type: "custom",
      zlevel: 2,
      coordinateSystem: "geo",
      geoIndex: 0,
      renderItem: function (params, api) {
        const height = props.cubeList[params.dataIndex].value / 1000;
        return renderItem(
          params,
          api,
          {
            left: ["#FFB71F", "rgba(252,203,96,0.2)"],
            right: ["#FFB71F", "rgba(252,203,96,0.2)"],
            top: "#F19635",
          },
          { width: 12, height: 8 },
          height * 5
        );
      },
      tooltip: {
        show: true,
        backgroundColor: "rgba(0, 0, 0, 0.44)",
        borderColor: "#35C0FF",
        textStyle: {
          color: "#ffffff",
        },
        formatter: ({ data }) => {
          if (!data?.name) return "";
          return `${data.name}：${data.value[2]}`;
        },
      },
      data: convertCityData2(props.cubeList),
      // [
      //   {
      //     name: '遵义',
      //     value: [106.937265, 27.906626, 10],
      //   },
      //   {
      //     name: '毕节',
      //     value: [105.78501, 27.301693, 10],
      //   },
      // ],
    });
  }
  console.log("list", list);
  return list;
});

const option = computed(() => {
  const numList = props.mapData.data.map((item) => item.value).sort((a,b) => {
    return a - b
  });
  console.log("numList", numList);
  // let maxNum = getVisualMax(Math.max.apply(null, numList));
  const maxNum = numList[numList.length - 1 ]
  return {
    tooltip: {
      show: false,
    },
    geo: [
      {
        type: "map",
        show: true,
        map: "China",
        ...baseOption,
        zlevel: 2,
        nameMap: {
          ...provinceNameMap,
        },
        itemStyle: {
          areaColor: "#065eaf",
          borderWidth: 2,
          // borderColor: "rgba(255,255,255,0.3)",
          borderColor: 'rgba(64,200,240,1)',
          opacity: 0.8,
        },
        label: {
          show: true,
          color: "rgba(255,255,255,1)",
          fontSize: 18,
        },
        emphasis: {
          itemStyle: {
            areaColor: "#2DA7FF",
            borderWidth: 2,
            borderColor: "#ffffff",
            opacity: 1,
            shadowColor: "rgba(255,255,255,1)",
            shadowOffsetX: 0,
            shadowOffsetY: 5,
            shadowBlur: 8,
            areaColor: "#065eaf",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.3)",
            opacity: 0.8,
          },
          label: {
            show: true,
            color: "rgba(255,255,255,1)",
            fontSize: 18,
          },
        },
      },
      {
        show: true,
        map: "ChinaContour",
        ...baseOption,
        zlevel: 1,
        itemStyle: {
          areaColor: "transparent",
          borderWidth: 4,
          borderColor: "#ffffff",
          opacity: 1,
          shadowColor: "rgba(37,117,255,1)",
          shadowOffsetX: 0,
          shadowOffsetY: 5,
          shadowBlur: 4,
        },
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            areaColor: "transparent",
            borderWidth: 3,
            borderColor: "#ffffff",
            opacity: 1,
            shadowColor: "rgba(37,117,255,1)",
            shadowOffsetX: 0,
            shadowOffsetY: 5,
            shadowBlur: 4,
          },
          label: {
            show: false,
          },
          label: {
            show: false,
          },
        },
      },
    ],
    visualMap: {
      ...visualMap,
      max: maxNum,
      min: 0,
      left: 20,
      bottom: 20,
    },
    series: series.value,
  };
});

function renderItem(params, api, styleColor, cubeOption, value) {
  const location = api.coord([api.value(0), api.value(1)]);
  return {
    type: "group",
    children: [
      {
        type: "MapCubeLeft",
        shape: {
          api,
          x: location[0],
          y: location[1],
          cubeOption,
          value,
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
        type: "MapCubeRight",
        shape: {
          api,
          x: location[0],
          y: location[1],
          cubeOption,
          value,
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
        type: "MapCubeTop",
        shape: {
          api,
          x: location[0],
          y: location[1],
          cubeOption,
          value,
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

onBeforeMount(() => {
  echarts.registerMap("China", ChinaMap);
  echarts.registerMap("ChinaContour", ChinaContourMap);
});

function handleGeoroam(params) {
  let option = mapChart.value.getOption();
  if (params.zoom != null && params.zoom != undefined) {
    option.geo.forEach((item) => {
      item.zoom = option.geo[0].zoom;
      item.center = option.geo[0].center;
    });
  } else {
    option.geo.forEach((item) => {
      item.center = option.geo[0].center;
    });
  }
  mapChart.value.setOption(option);
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
