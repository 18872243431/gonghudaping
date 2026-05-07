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
import China from "/public/map/json/china.json";
import ChinaContour from "/public/map/json/china-contour.json";
import seriesOption from "../../config/seriesOption";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import ChinaCity from "/public/map/coords/ChinaCity.js";
import { CubeLeft, CubeRight, CubeTop } from "./cube";

use([CanvasRenderer, MapChart]);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      map: [
        {
          name: "四川",
          value: 100,
        },
        {
          name: "湖北",
          value: 400,
        },
        { name: "广东", value: 700 },
      ],
      cube: [
        {
          name: "四川",
          value: 100,
        },
        {
          name: "湖北",
          value: 400,
        },
        { name: "广东", value: 700 },
      ],
      lines: [],
    }),
  },
  showCube: {
    type: Boolean,
    default: false,
  },
  option: {
    type: Object,
    default: () => {},
  },
  name: {
    type: String,
    default: "",
  },
  baseOption: {
    type: Object,
    default: () => ({
      roam: false,
      zoom: 1.24,
      top: 70,
      center: [115.97, 29.71],
    }),
  },
  name1: {
    type: String,
    default: "",
  },
  name2: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["mapClick"]);

const option = computed(() => {
  const baseOption = props.baseOption;
  let shallowMap = [];
  for (let i = 0; i < 14; i++) {
    shallowMap.push({
      show: true,
      map: "ChinaContour",
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
  const min1 = props.option?.visualMap1?.min || 2;
  const middle1 = props.option?.visualMap1?.middle || 5;
  const max1 = props.option?.visualMap1?.max || 10;
  const valuesMapAsc = (props.data?.map || [])
    .map((d) => d.value)
    .slice()
    .sort((a, b) => a - b);
  const nMap = valuesMapAsc.length;
  const top3MinMap = nMap > 0 ? valuesMapAsc[Math.max(0, nMap - 3)] : 0;
  const restMap = Math.max(0, nMap - 3);
  const lowSize =
    restMap > 0 ? Math.floor(restMap / 3) + (restMap % 3 > 0 ? 1 : 0) : 0;
  const midSize =
    restMap - lowSize > 0
      ? Math.floor((restMap - lowSize) / 2) +
        ((restMap - lowSize) % 2 > 0 ? 1 : 0)
      : 0;
  const lowUpperBound =
    lowSize > 0 ? valuesMapAsc[lowSize - 1] : Number.NEGATIVE_INFINITY;
  const midUpperBound =
    midSize > 0
      ? valuesMapAsc[lowSize + midSize - 1]
      : Number.NEGATIVE_INFINITY;
  return {
    visualMap: [
      {
        show: props.showCube,
        type: "piecewise",
        orient: "vertical",
        left: 0,
        bottom: 250,
        itemWidth: 14,
        itemHeight: 14,
        zlevel: 9,
        pieces: [
          {
            min: 0,
            max: min1,
            color: "rgba(77, 213, 255, 1)",
          },
          {
            min: middle1,
            max: max1 * 0.8,
            color: "rgba(255, 189, 67, 1)",
          },
          {
            min: max1 * 0.8,
            color: "rgba(255, 58, 47, 1)",
          },
        ],
        inverse: true,
        itemGap: 15,
        textStyle: {
          color: "#D1E8FF",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          fontSize: 16,
        },
        itemSymbol: "circle",
        splitNumber: 4,
        seriesIndex: 1,
        ...props.option?.visualMap1,
      },
      {
        show: true,
        type: "piecewise",
        orient: "vertical",
        left: 0,
        bottom: 180,
        zlevel: 9,
        inverse: false,
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          color: "#D1E8FF",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          fontSize: 16,
        },
        seriesIndex: 0,
        pieces: (() => {
          const low1 = "rgba(204, 153, 51, 0.8)";
          const low2 = "rgba(243, 172, 65, 0.8)";
          const mid = "rgba(230, 126, 34, 0.8)";
          const high = "rgba(192, 57, 43, 0.8)";
          if (nMap <= 3) {
            return [{ gte: top3MinMap, color: high }];
          }
          if (restMap === 1) {
            return [
              { lt: top3MinMap, color: mid },
              { gte: top3MinMap, color: high },
            ];
          }
          if (restMap === 2) {
            const lowBound = valuesMapAsc[0];
            return [
              { lte: lowBound, color: low1 },
              { gt: lowBound, lt: top3MinMap, color: mid },
              { gte: top3MinMap, color: high },
            ];
          }
          return [
            { lte: lowUpperBound, color: low1 },
            { gt: lowUpperBound, lte: midUpperBound, color: low2 },
            { gt: midUpperBound, lt: top3MinMap, color: mid },
            { gte: top3MinMap, color: high },
          ];
        })(),
        ...props.option?.visualMap2,
      },
    ],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(11,36,57,0.80)",
      borderColor: "#4dd5ff",
      textStyle: {
        color: "#E1EDFF",
        fontSize: 16,
      },
      ...props.option?.tooltip,
    },
    geo: [
      {
        type: "map",
        show: true,
        map: "China",
        nameMap: ChinaNameMap,
        ...baseOption,
        zlevel: 5,
        itemStyle: {
          areaColor: "rgba(77, 213, 255,0.8)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.70)",
          opacity: 1,
        },
        label: {
          show: true,
          color: "rgba(255,255,255,1)",
          fontSize: 18,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
        emphasis: {
          label: {
            color: "#fff",
            fontSize: 18,
          },
          itemStyle: {
            areaColor: "#f3ac41",
            opacity: 0.6,
          },
        },
        regions: [
          {
            name: "南海诸岛",
            itemStyle: {
              areaColor: "rgba(77, 213, 255,0.1)",
            },
            label: {
              show: true,
              offset: [90, 120],
            },
          },
          {
            name: "河北",
            label: {
              show: true,
              offset: [-5, 20],
            },
          },
          {
            name: "天津",
            label: {
              show: true,
              offset: [20, -10],
            },
          },
          {
            name: "北京",
            label: {
              show: true,
              offset: [0, -5],
            },
          },
          {
            name: "辽宁",
            label: {
              show: true,
              offset: [10, -5],
            },
          },
          {
            name: "陕西",
            label: {
              show: true,
              offset: [-3, 18],
            },
          },
          {
            name: "上海",
            label: {
              show: true,
              offset: [0, -10],
            },
          },
          {
            name: "甘肃",
            label: {
              show: true,
              offset: [65, 35],
            },
          },
          {
            name: "内蒙古",
            label: {
              show: true,
              offset: [30, 15],
            },
          },
          {
            name: "澳门",
            label: {
              show: false,
              offset: [-10, 0],
            },
          },
          {
            name: "香港",
            label: {
              show: false,
              offset: [20, 0],
            },
          },
        ],
      },
      {
        type: "map",
        show: true,
        map: "ChinaContour",
        ...baseOption,
        zlevel: 4,
        itemStyle: {
          borderWidth: 2,
          areaColor: "transparent",
          borderColor: "rgba(255, 255, 255, 1)",
          shadowBlur: 10,
          shadowColor: "rgba(109, 241, 255, 0.8)",
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
        map: "ChinaContour",
        ...baseOption,
        top: baseOption.top + 15,
        zlevel: 0,
        itemStyle: {
          areaColor: "rgba(19, 150, 249, 0.05)",
          borderWidth: 3,
          borderColor: "rgba(109, 241, 255, 0.4)",
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
            areaColor: "rgba(19, 150, 249, 0.05)",
            borderWidth: 2,
            borderColor: "rgba(109, 241, 255, 0.4)",
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
  const list = [];
  list.push({
    ...seriesOption.map,
    name: props.name1,
    zlevel: 5,
    nameMap: ChinaNameMap,
    data: props.data.map,
  });
  if (props.data?.cube?.length > 0) {
    const min1 = props.option.visualMap1.min || 0;
    const middle1 = props.option.visualMap1.middle || 5;
    const max1 = props.option.visualMap1.max * 0.8 || 10;
    list.push({
      type: "custom",
      zlevel: 5,
      coordinateSystem: "geo",
      geoIndex: 0,
      name: props.name2,
      renderItem: function (params, api) {
        const value = props.data.cube[params.dataIndex].value;
        const color =
          value > max1
            ? "255,58,47"
            : value > min1 && value <= middle1
            ? "255, 189, 67"
            : "77, 213, 255";
        const height = 18;
        return renderItem(
          params,
          api,
          {
            left: [`rgba(${color},1)`, `rgba(${color},0.1)`],
            right: [`rgba(${color},1)`, `rgba(${color},0.1)`],
            top: "#fff",
          },
          { width: 12, height: 8 },
          height * 3
        );
      },
      data: coordsFmt(props.data.cube),
      tooltip: {
        formatter: (params) => {
          return `${props.name2} <br/>${params.name} ${params.value[2]}`;
        },
      },
    });
    list.push({
      ...seriesOption.effectScatter,
      zlevel: 5,
      itemStyle: {
        color: "#fff",
        borderColor: "rgba(19, 150, 249, 1)",
        borderWidth: 1,
      },
      symbolSize: [16, 8],
      data: coordsFmt(props.data.cube),
      tooltip: {
        show: false,
      },
    });
  }
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

function coordsFmt(arr) {
  if (!Array.isArray(arr)) return [];
  const filterArr = arr.filter((item) => ChinaCity[item.name]);
  const list = filterArr.map((item) => {
    return {
      name: item.name,
      value: [...ChinaCity[item.name], item.value],
    };
  });
  return list;
}

function handleClick(params) {
  emits("mapClick", params);
}

onBeforeMount(() => {
  echarts.graphic.registerShape("MapCubeLeft", CubeLeft);
  echarts.graphic.registerShape("MapCubeRight", CubeRight);
  echarts.graphic.registerShape("MapCubeTop", CubeTop);
  echarts.registerMap("China", China);
  echarts.registerMap("ChinaContour", ChinaContour);
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
