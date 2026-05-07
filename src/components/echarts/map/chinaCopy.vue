<template>
  <div class="map-chart">
    <v-chart
      class="chart"
      ref="mapChart"
      :option="option"
      :autoresize="true"
      :init-options="initOption"
      @georoam="handleGeoroam"
      @timelinechanged="timelinechanged"
      @click="mapClick"
      @mouseover="mapMouseover"
    />
    <time-line></time-line>
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
  VisualMapComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { useCreateMap } from "./hooks/useCreateMap";
import { ref, computed, nextTick } from "vue";
import TimeLine from "../TimeLine/index.vue";

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
  translateX: {
    type: Number,
    default: 0,
  },
  translateY: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["setCurrentDate", "mapClick", "mapMouseover"]);
const timeline = ref(null);
const {
  initOption,
  option,
  timelinechanged,
  handleGeoroam,
  mapChart,
  mapClick,
  mapMouseover,
} = useCreateMap(props, emits);
</script>

<style lang="scss" scoped>
.map-chart {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .chart {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 0;
    bottom: 0;
  }
}
</style>
