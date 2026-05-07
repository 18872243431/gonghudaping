<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-21 11:42:17
 * @LastEditTime: 2021-12-22 17:34:39
 * @Description: 
-->
<template>
  <v-chart
    class="chart"
    ref="mapChart"
    :option="option"
    :autoresize="true"
    @click="handleClick"
  />
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
  VisualMapComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { useCreateWorld } from "./hooks/useCreateWorld";
import { ref, computed } from "vue";

use([
  CanvasRenderer,
  MapChart,
  LinesChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
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
  map: {
    type: Object,
    default: () => [],
  },
  visualMap: {
    type: Object,
    default: {
      max: 100,
      min: 0,
    },
  },
});

const emits = defineEmits(["click"]);

const { option, mapChart } = useCreateWorld(props, emits);

function handleClick(params) {
  // console.log(params);
  emits("click", params);
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
