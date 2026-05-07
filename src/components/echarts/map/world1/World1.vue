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
    :init-options="initOption"
    :autoresize="true"
    @georoam="handleGeoroam"
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
]);

const props = defineProps({
  geo: { type: Array, default: () => [] },
  lines: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits([]);

const { option, mapChart, initOption, handleGeoroam } = useCreateWorld(
  props,
  emits
);
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
