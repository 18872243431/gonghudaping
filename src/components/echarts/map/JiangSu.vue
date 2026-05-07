<template>
  <v-chart
    class="chart"
    ref="mapChart"
    :option="option"
    :autoresize="true"
    @georoam="handleGeoroam"
    @mouseover="mapMouseover"
    @mouseout="mapMouseout"
    @click="mapClick"
    @legendselectchanged="legendselectchanged"
  />
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { MapChart } from "echarts/charts";
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { TooltipComponent } from "echarts/components";
import {
  ref,
  computed,
  onBeforeMount,
  reactive,
  onMounted,
  onBeforeUnmount,
} from "vue";
import jiangsuMap from "/public/map/json/provinces/江苏省.json";
import jiangsuContourMap from "/public/map/json/jiangsu-contour.json";
import config from "../config";
import seriesOption from "../config/seriesOption";

use([CanvasRenderer, MapChart, TooltipComponent]);

const { visualMap, legend, tooltip } = config;
const mapChart = ref(null);
const baseOption = computed(() => {
  return {
    zoom: props.option?.zoom || 1.12,
    roam: true,
    top: props.option?.top || 70,
  };
});
let max = ref(1000),
  min = ref(0);
const props = defineProps({
  option: { type: Object, default: () => ({}) },
  scatter: {
    type: Object,
    default: () => ({}),
  },
  effectScatter: {
    type: Object,
    default: () => ({}),
  },
  map: {
    type: Object,
    default: () => ({}),
  },
  lines: {
    type: Object,
    default: () => ({}),
  },
});
const emits = defineEmits([
  "mapClick",
  "mapMouseover",
  "mapMouseout",
  "legendselectchanged",
]);
const series = computed(() => {
  let list = [];
  const types = ["map", "scatter", "effectScatter", "lines"];
  types.forEach((item) => {
    if (Array.isArray(props[item]) && props[item].length > 0) {
      props[item].forEach((itm) => {
        // console.log("item----", itm);
        list.push({ ...seriesOption[item], ...itm });
      });
    } else {
      if (props[item]?.data?.length > 0) {
        list.push({ ...seriesOption[item], ...props[item] });
        if (item === "map") {
          max.value = Math.max(...props[item].data.map((item) => item.value));
          min.value = Math.min(...props[item].data.map((item) => item.value));
        }
      }
    }
  });
  return list;
});

const createShadow = () => {
  const list = [];
  for (let i = 0; i < 15; i++) {
    list.push({
      type: "map",
      show: true,
      map: "jiangsuContourMap",
      ...baseOption.value,
      zlevel: 1,
      top: baseOption.value.top + 1 + i,
      itemStyle: {
        areaColor: "transparent",
        borderWidth: 1,
        borderColor: "#4DA3FF",
        opacity: 0.6,
      },
      label: {
        show: false,
        color: "#F8FFFF",
        fontSize: 14,
      },
      emphasis: {
        label: {
          color: "#F8FFFF",
          fontSize: 14,
          show: false,
        },
        itemStyle: {
          areaColor: "#34c6ff",
          opacity: 0.6,
        },
      },
    });
  }
  return list;
};

const option = computed(() => {
  return {
    visualMap: {
      ...visualMap,
      ...props.option?.visualMap,
      max: max.value,
      min: 0,
      text: [max.value, 0],
    },
    legend: {
      selectedMode: true,
      ...legend,
      ...props.option?.legend,
    },
    tooltip: {
      ...tooltip,
      trigger: "item",
      show: false,
      ...props.option?.tooltip,
    },
    geo: [
      {
        type: "map",
        show: true,
        map: "jiangsu",
        ...baseOption.value,
        ...props.option?.geo,
        zlevel: 3,
        label: {
          show: true,
          color: "rgba(250, 254, 255, 0.90)",
          fontSize: 16,
        },
        itemStyle: {
          show: true,
          borderWidth: 1,
          opacity: 0.75,
          areaColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(34, 184, 255, 0.50)", // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "rgba(34, 184, 255, 0.8)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(34, 184, 255, 1)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          borderColor: "rgba(255, 255, 255, 0.60)",
        },
        emphasis: {
          label: {
            show: true,
            color: "#fff",
          },
          itemStyle: {
            show: true,
            areaColor: "rgba(255,234,47,0.5)",
            borderWidth: 2,
            borderColor: "#FFEA2F",
            opacity: 1,
            shadowColor: "#ffea2f;",
            shadowOffsetX: 0,
            shadowOffsetY: 5,
            shadowBlur: 8,
          },
        },
      },
      {
        type: "map",
        show: true,
        map: "jiangsuContourMap",
        ...baseOption.value,
        zlevel: 0,
        top: baseOption.value.top + 25,
        itemStyle: {
          areaColor: "rgba(4, 39, 89, 1)",
          borderWidth: 4,
          borderColor: "rgba(4, 39, 89, 1)",
          opacity: 1,
          shadowBlur: 100,
          shadowColor: "rgba(5, 92, 172, 1)",
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "rgba(4, 39, 89, 1)",
            borderWidth: 4,
            borderColor: "rgba(4, 39, 89, 1)",
            opacity: 1,
            shadowBlur: 100,
            shadowColor: "rgba(5, 92, 172, 1)",
          },
        },
      },
      ...createShadow(),
      {
        type: "map",
        show: true,
        map: "jiangsuContourMap",
        ...baseOption.value,
        zlevel: 2,
        itemStyle: {
          areaColor: "transparent",
          borderWidth: 3,
          borderColor: "#ffffff",
          opacity: 1,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "transparent",
            borderWidth: 3,
            borderColor: "#ffffff",
            opacity: 1,
          },
        },
      },
    ],
    series: [...series.value],
  };
});

function handleGeoroam(params) {
  let option = mapChart.value.getOption();
  if (params.zoom) {
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

function mapClick(params) {
  emits("mapClick", params);
}

function mapMouseover(params) {
  emits("mapMouseover", params);
}

function mapMouseout() {
  emits("mapMouseout");
}

function legendselectchanged(params) {
  emits("legendselectchanged", params.selected);
}

onBeforeMount(() => {
  echarts.registerMap("jiangsu", jiangsuMap);
  echarts.registerMap("jiangsuContourMap", jiangsuContourMap);
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
  // background: url(~assets/img/map-bg.png) no-repeat center / 100% 100%;
}
</style>
