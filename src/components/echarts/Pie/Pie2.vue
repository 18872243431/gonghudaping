<template>
  <v-chart
    class="chart"
    ref="pieChart"
    :option="option"
    :autoresize="true"
    :loading="loading"
    :loading-options="loadingConfig"
  />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { computed, ref } from 'vue'
import config from '../config'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const { legend, tooltip, loadingConfig } = config

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Object,
    default: () => ({
      number: 424,
      percent: 34
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const pieChart = ref(null)
const option = computed(() => {
  return {
    tooltip: { 
      show: false,
    },
    legend: {
      show: false,
    },
    title: [
      {
        text: `数量${props.data.number}`,
        x: 'center',
        top: '55%',
        textStyle: {
          color: "#ffffff",
          fontSize: 14,
          fontWeight: '400',
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
        },
      },
      {
        text: `${props.data.percent}%`,
        x: 'center',
        top: '30%',
        textStyle: {
          fontSize: '24',
          color: '#4EF4FF',
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          fontWeight: '700',
        },
      },
    ],
    polar: {
      radius: ['65%', '74%'],
      center: ['50%', '50%'],
    },
    angleAxis: {
      max: 100,
      show: false,
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
          show: false,
      },
      axisLine: {
          show: false,
      },
      axisTick: {
          show: false,
      },
    },
    series: [
      {
        name: '',
        z: 2,
        type: 'bar',
        roundCap: true,
        barWidth: 30,
        data: [props.data.percent],
        coordinateSystem: 'polar',
        itemStyle: {
          color: '#1abbfd',
        },
      },
      {
        name: '',
        type: 'pie',
        startAngle: 80,
        radius: ['50%', '78%'],
        center: ['50%', '50%'],
        itemStyle: {
          color: '#092763'
        },
        emphasis: {
          scale: false
        },
        z: 1,
        data: [100],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
