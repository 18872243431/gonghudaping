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
      @dblclick="mapDblclick"
      @mouseover="mapMouseover"
      @mouseout="mapMouseout"
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
  VisualMapComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { useCreateMap } from "./hooks/useCreateMap";
import { ref, computed, nextTick } from "vue";

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
  zoom: {
    type: Number,
    default: 1.2,
  },
  tips: {
    //补充文字和图片
    type: Array,
    default: [],
  },
});

const emits = defineEmits([
  "setCurrentDate",
  "mapClick",
  "mapMouseover",
  "mapMouseout",
  "mapDblclick",
]);
const timeline = ref(null);
const {
  initOption,
  option,
  timelinechanged,
  handleGeoroam,
  mapChart,
  mapClick,
  mapDblclick,
  mapMouseover,
  mapMouseout,
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
