<template>
  <v-chart
    class="chart"
    ref="mapChart"
    :option="option"
    :autoresize="true"
    @click="handleClick"
  ></v-chart>
</template>

<script setup>
import { computed, ref, onBeforeMount } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts";
import { MapChart } from "echarts/charts";
import VChart from "vue-echarts";
import seriesOption from "../../config/seriesOption";
import ChinaCity from "/public/map/coords/ChinaCity.js";
import { CubeLeft, CubeRight, CubeTop } from "./cube";
import provinceBaseOption from "./baseOption";

use([CanvasRenderer, MapChart]);

const props = defineProps({
  provinceName: {
    type: String,
    default: "北京市",
  },
  data: {
    type: Object,
    default: () => ({
      map: [],
      lines: [],
    }),
  },
  baseOption: {
    type: Object,
    default: () => ({}),
  },
  option: {
    type: Object,
    default: () => ({}),
  },
  name: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["click"]);
const provinceCoords = ref([]);

const option = computed(() => {
  const baseOption = {
    roam: false,
    ...provinceBaseOption[props.provinceName],
    ...props.baseOption,
  };
  let shallowMap = [];
  for (let i = 0; i < 14; i++) {
    shallowMap.push({
      show: true,
      map: "ProvinceContour",
      zlevel: 2,
      ...baseOption,
      top: baseOption.top + i,
      itemStyle: {
        areaColor: "transparent",
        borderColor: "rgba(19, 150, 249, 1)",
      },
      emphasis: {
        itemStyle: {
          areaColor: "transparent",
          borderColor: "rgba(19, 150, 249, 1)",
        },
        label: {
          show: false,
        },
      },
    });
  }
  return {
    visualMap: [
      // {
      //   show: false,
      //   type: "piecewise",
      //   orient: "vertical",
      //   left: 0,
      //   bottom: 250,
      //   min: 0,
      //   max: 1200,
      //   itemWidth: 14,
      //   itemHeight: 14,
      //   zlevel: 9,
      //   pieces: [
      //     {
      //       min: 0,
      //       max: 200,
      //       color: "rgba(77, 213, 255, 1)",
      //     },
      //     {
      //       min: 200,
      //       max: 500,
      //       color: "rgba(255, 189, 67, 1)",
      //     },
      //     {
      //       min: 500,
      //       color: "rgba(255, 58, 47, 1)",
      //     },
      //   ],
      //   inverse: true,
      //   itemGap: 15,
      //   textStyle: {
      //     color: "#D1E8FF",
      //     fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      //     fontSize: 18,
      //   },
      //   itemSymbol: "circle",
      //   splitNumber: 4,
      //   seriesIndex: 1,
      //   ...props.option?.visualMap1,
      // },
      {
        show: true,
        type: "continuous",
        orient: "horizontal",
        left: 0,
        bottom: 180,
        min: 0,
        max: 1200,
        zlevel: 9,
        inverse: false,
        itemWidth: 10,
        itemHeight: 94,
        textStyle: {
          color: "#D1E8FF",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          fontSize: 18,
        },
        inRange: {
          color: ["#FFBD43", "#F78038", "#FF4242"],
        },
        text: [1200, 0],
        seriesIndex: 0,
        ...props.option?.visualMap2,
      },
    ],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(11,36,57,0.80)",
      borderColor: "#4dd5ff",
      textStyle: {
        color: "#E1EDFF",
        fontSize: 18,
      },
      ...props.option?.tooltip,
    },
    geo: [
      {
        type: "map",
        show: true,
        map: "Province",
        zlevel: 5,
        ...baseOption,
        itemStyle: {
          areaColor: "rgba(77, 213, 255,0.2)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.70)",
          opacity: 1,
        },
        label: {
          show: true,
          color: "rgba(242, 254, 255, 1)",
          fontSize: 18,
        },
        emphasis: {
          label: {
            color: "rgba(242, 254, 255, 1)",
            fontSize: 18,
          },
          itemStyle: {
            areaColor: "#f3ac41",
            opacity: 0.6,
          },
        },
      },
      {
        type: "map",
        show: true,
        map: "ProvinceContour",
        ...baseOption,
        zlevel: 4,
        itemStyle: {
          borderWidth: 2,
          areaColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.70)",
          shadowBlur: 10,
          shadowColor: "rgba(109, 241, 255, 0.5)",
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            areaColor: "transparent",
            borderColor: "rgba(255, 255, 255, 0.70)",
          },
          label: {
            show: false,
          },
          label: {
            show: false,
          },
        },
      },
      ...shallowMap,
      {
        type: "map",
        show: true,
        map: "ProvinceContour",
        ...baseOption,
        top: baseOption.top + 15,
        zlevel: 0,
        itemStyle: {
          areaColor: "rgba(19, 150, 249, 0.45)",
          borderWidth: 3,
          borderColor: "rgba(109, 241, 255, 0.35)",
          opacity: 1,
          shadowBlur: 50,
          shadowColor: "rgba(19, 150, 249, 1)",
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "rgba(19, 150, 249, 0.45)",
            borderWidth: 2,
            borderColor: "rgba(109, 241, 255, 0.7)",
            opacity: 1,
            shadowBlur: 50,
            shadowColor: "rgba(19, 150, 249, 1)",
          },
        },
      },
    ],
    series: createSeries(),
  };
});

function createSeries() {
  const data = props.data?.map || [];
  const list = [];
  list.push({
    ...seriesOption.map,
    name: props.name,
    zlevel: 5,
    data,
  });
  // list.push({
  //   type: "custom",
  //   zlevel: 5,
  //   coordinateSystem: "geo",
  //   geoIndex: 0,
  //   renderItem: function (params, api) {
  //     const value = props.data.map[params.dataIndex].value;
  //     const color =
  //       value >= 501
  //         ? "255,58,47"
  //         : value > 200 && value <= 500
  //         ? "255, 189, 67"
  //         : "77, 213, 255";
  //     const height = 18;
  //     return renderItem(
  //       params,
  //       api,
  //       {
  //         left: [`rgba(${color},1)`, `rgba(${color},0.1)`],
  //         right: [`rgba(${color},1)`, `rgba(${color},0.1)`],
  //         top: "#fff",
  //       },
  //       { width: 12, height: 8 },
  //       height * 3
  //     );
  //   },
  //   data: coordsFmt(data),
  // });
  list.push({
    ...seriesOption.effectScatter,
    zlevel: 5,
    itemStyle: {
      color: "#fff",
      borderColor: "#fff",
      borderWidth: 1,
    },
    symbolSize: [20, 10],
    data: coordsFmt(data),
  });
  return list;
}

function handleClick(params) {
  emits("click", params);
}

function getProvinceCoords(data) {
  const features = data.features;
  const obj = {};
  features.forEach((feature) => {
    obj[feature.properties.name] = feature.properties.center;
  });
  return obj;
}

function coordsFmt(arr) {
  if (!Array.isArray(arr)) return [];
  const filterArr = arr.filter((item) => provinceCoords.value[item.name]);
  const list = filterArr.map((item) => {
    return {
      name: item.name,
      value: [...provinceCoords.value[item.name], item.value],
    };
  });
  return list;
}

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
              color: "rgba(255,255,255, 0)",
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
              color: "rgba(255,255,255, 0)",
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
          fill: "rgba(255, 255, 255, 0.8)",
          shadowBlur: 5,
          stroke: "rgba(255,255,255,0.4)",
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
    ],
  };
}

onBeforeMount(() => {
  echarts.graphic.registerShape("MapCubeLeft", CubeLeft);
  echarts.graphic.registerShape("MapCubeRight", CubeRight);
  echarts.graphic.registerShape("MapCubeTop", CubeTop);
  const provinceMap = require(`/public/map/json/provinces/${props.provinceName}.json`);
  const provinceContour = require(`/public/map/json/provinceContours/${props.provinceName}.json`);
  provinceCoords.value = getProvinceCoords(provinceMap);
  echarts.registerMap("Province", provinceMap);
  echarts.registerMap("ProvinceContour", provinceContour);
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
