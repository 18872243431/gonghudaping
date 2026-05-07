<template>
  <v-chart
    class="chart"
    ref="liquidfillChart"
    :option="option"
    :autoresize="true"
  />
</template>

<script setup>
import "echarts-liquidfill";
import "echarts";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../config";

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Array,
    default: () => [{ name: "完成率", value: 0.6 }],
  },
  fontSize: {
    type: Number,
    default: 24,
  },
});

const option = computed(() => {
  const { title } = config;
  const { name, value } = props.data[0];
  const series = props.option?.series || {};
  const colors = [
    "#1578D2",
    "#0DB6FF",
    "#FCB323",
    "#02C569",
    "#FF579F",
    "#FFEA2F",
    "#1396F9",
    "#F25858",
  ];
  const color = props.option?.series?.colors ?? [...colors];
  const data = color.map((item) => {
    return value;
  });
  const backgroundColors = props.option?.series?.backgroundColors ?? [
    ...colors,
  ];
  const colorStops = backgroundColors.map((item, i) => {
    return {
      offset:
        i == backgroundColors.length - 1
          ? 1
          : (1 / backgroundColors.length).toFixed(2) * (i + 1).toFixed(2),
      color: item,
    };
  });
  return {
    title: {
      ...title,
      ...props.option?.title,
      text: name,
    },
    series: [
      {
        type: "liquidFill",
        shape: "circle",
        radius: `${series.radius}%`,
        center: ["50%", "50%"],
        data: data,
        color,
        outline: {
          ...series?.outline,
          show: series?.outline?.show,
          itemStyle: {
            borderDistance: series?.outline?.borderDistance,
            borderWidth: series?.outline?.borderWidth,
            borderColor: series?.outline?.borderColor,
          },
        },
        backgroundStyle: {
          color: {
            type: "linear",
            x: 1,
            y: 0,
            x2: 0.5,
            y2: 1,
            colorStops,
            globalCoord: false,
          },
        },
        label: {
          ...props.option?.series?.label,
          fontSize: props.fontSize,
        },
      },
    ],
  };
});
</script>
