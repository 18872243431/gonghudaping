<template>
  <div class="world-map">
    <img :src="require(`@/assets/img/world-map-bg.png`)" alt="" srcset="" />
    <v-chart
      class="chart"
      ref="mapChart"
      :option="option"
      :autoresize="true"
      @click="mapClick"
    />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { MapChart, LinesChart } from "echarts/charts";
import * as echarts from "echarts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { onBeforeMount, computed } from "vue";
import worldMap from "/public/map/json/world-china.json";
import { getEnCountry, getCnCountry, getCoord } from "@/libs/worldsForMap";
import { getProvinceCood } from "@/libs/coords";
import { getNationalPng, getCountryImg } from "@/libs/country";

use([
  CanvasRenderer,
  MapChart,
  LinesChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const props = defineProps({
  geo: { type: Array, default: () => [] },
  lines: {
    type: Object,
    default: () => ({
      data: [
        [{ name: "中国" }, { name: "美国", value: 92333 }],
        [{ name: "中国" }, { name: "英国", value: 84534 }],
        [{ name: "中国" }, { name: "德国", value: 83424 }],
        [{ name: "中国" }, { name: "以色列", value: 79357 }],
        [{ name: "中国" }, { name: "俄罗斯", value: 78279 }],
        [{ name: "中国" }, { name: "印度", value: 77883 }],
        [{ name: "中国" }, { name: "日本", value: 76493 }],
        [{ name: "中国" }, { name: "韩国", value: 75283 }],
        [{ name: "中国" }, { name: "巴西", value: 74326 }],
      ],
    }),
  },
});
const emits = defineEmits(["mapClick"]);
const imgPath1 = require("@/assets/img/2.png");
const seriesOption = {
  effectScatter: {
    type: "effectScatter",
    coordinateSystem: "geo",
    geoIndex: 0,
    symbol: `image://${imgPath1}`,
    symbolSize: 15,
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
    },
    itemStyle: {
      color: "#FF3A2F",
    },
    emphasis: { scale: true },
    label: {
      show: true,
      fontSize: 16,
      position: "right", //显示位置
      offset: [5, 0], //偏移设置
      formatter: function (params) {
        let name = getNationalPng(getCnCountry(params.data.name));
        return (
          "{" +
          name +
          "| }" +
          "  " +
          "{value|" +
          getCnCountry(params.data.name) +
          "}"
        );
        // return  "{value|" + params.data.value[2] + getCnCountry(params.data.name) + "}" + "  "  + "{" + name + "| }"
      },
      rich: {
        value: {
          lineHeight: 15,
          fontSize: 16,
          color: "#F8FFFF",
        },
        ...getCountryImg(),
      },
    },
    zlevel: 3,
    data: [],
  },
  lines: {
    type: "lines",
    coordinateSystem: "geo",
    geoIndex: 0,
    zlevel: 4,
    effect: {
      show: true,
      symbol: "arrow",
      // period: 5,
      // trailLength: 0,
      color: "#feec87",
      symbolSize: 5,
    },
    label: {
      show: false,
      color: "#fff",
      padding: [0, 0, 5, 0],
      fontSize: 14,
      formatter: ({ data }) => {
        return (
          getCnCountry(data.fromName) +
          "江苏--->" +
          getCnCountry(data.toName) +
          "：" +
          `{value|${data.value.toLocaleString("en-US")}}`
        );
      },
      rich: {
        value: {
          color: "#feec87",
          fontSize: 16,
        },
      },
      position: "middle",
    },
    emphasis: {
      label: {
        show: true,
      },
    },
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
            color: "#1fa0ac ", // 0% 处的颜色
          },
          {
            offset: 1,
            color: "#e1ce57", // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      width: 1,
      type: "solid",
      curveness: 0.5,
    },
    zlevel: 4,
    data: [],
  },
};

const series = computed(() => {
  let list = [],
    lines = [],
    effectScatter = [];
  if (props["lines"]?.data?.length > 0) {
    props["lines"].data.forEach((item, index) => {
      let dataItem = item;
      dataItem[0].name = getEnCountry(dataItem[0].name);
      dataItem[1].name = getEnCountry(dataItem[1].name);
      // var fromCoord = getProvinceCood(dataItem[0].name);
      var fromCoord = getCoord(dataItem[0].name);
      var toCoord = getCoord(dataItem[1].name);
      if (fromCoord && toCoord) {
        lines.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord],
          value: dataItem[1].value,
        });
        effectScatter.push({
          name: dataItem[0].name,
          value: fromCoord,
        });
        effectScatter.push({
          name: dataItem[1].name,
          value: toCoord.concat(dataItem[1].value),
        });
      }
    });
    list.push({ ...seriesOption["lines"], data: [...lines] });
    effectScatter = Array.from(new Set(effectScatter));
    effectScatter.forEach((item) => {
      if (item.name === "China") {
        item["symbolSize"] = 10;
      }
    });
    list.push({ ...seriesOption["effectScatter"], data: [...effectScatter] });
  }
  return list;
});

const option = computed(() => {
  return {
    geo: [
      {
        show: true,
        map: "world_with_jiangsu",
        zlevel: 1,
        left: -76,
        top: 25,
        right: -28,
        bottom: 72,
        roam: false,
        zoom: 0.95,
        itemStyle: {
          areaColor: "rgba(77, 213, 255, 0.1)",
          borderWidth: 1,
          borderColor: "rgba(58,149,253,0.6)",
          shadowBlur: 100,
          shadowColor: "rgba(65, 214, 255,1)",
          opacity: 0.5,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            opacity: 1,
          },
        },
        regions: [
          {
            name: "China",
            itemStyle: {
              areaColor: "rgba(5,137,255,0.4)",
              borderWidth: 2,
              borderColor: "#00ffeb",
              shadowBlur: 50,
              shadowColor: "#00ffeb",
              opacity: 0.5,
            },
          },
          {
            name: "江苏",
            itemStyle: {
              areaColor: "red",
              borderWidth: 2,
              borderColor: "red",
              shadowBlur: 50,
              shadowColor: "red",
              opacity: 1,
            },
          },
        ],
      },
    ],
    series: [...series.value],
  };
});

function mapClick(params) {
  emits("mapClick", params);
}

onBeforeMount(() => {
  // let jiangsuFeatures = chinaMap.features || [chinaMap]
  // console.log("🚀 ~ onBeforeMount ~ jiangsuFeatures:", jiangsuFeatures)
  // jiangsuFeatures.forEach(feature => {
  //   worldMap.features.push(feature);
  // })
  //   console.log("🚀 ~ onBeforeMount ~ worldMap:", worldMap)
  echarts.registerMap("world_with_jiangsu", worldMap);
});
</script>

<style lang="scss" scoped>
.world-map {
  width: 100%;
  height: 100%;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
