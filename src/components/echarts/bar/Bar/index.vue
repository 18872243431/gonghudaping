<template>
  <v-chart class="chart"
           ref="barChart"
           :option="option"
           :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import config from '../../config'

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent
])

const { dataZoom, grid, legend, tooltip, xAxis, yAxis } = config

const props = defineProps({
  option: {
    type: Object,
    default: {}
  },
  data: {
    type: Array,
    default: () => [
      {
        name: '类型1',
        list: [
          { label: '01-01', value: 0 },
          { label: '01-02', value: 0 }
        ]
      },
      {
        name: '类型2',
        list: [
          { label: '01-01', value: 0 },
          { label: '01-02', value: 0 }
        ]
      }
    ]
  }
})

const legendData = computed(() => {
  return props.data.map((item) => item.name)
})

const categories = computed(() => {
  return props.data[0].list.map((item) => item.label)
})

const option = computed(() => {
  const color = props.option?.color ?? [
    {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#62FBFF' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#3DDDFF' // 100% 处的颜色
        }
      ],
      global: false // 缺省为 false
    },
    '#2748EE'
  ]
  return {
    color,
    grid: { ...grid, ...props.option?.grid },
    legend: {
      ...legend,
      ...props.option?.legend,
      data: legendData.value
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: { ...yAxis, ...props.option?.yAxis },
    xAxis: { ...xAxis, ...props.option?.xAxis, data: categories.value },
    dataZoom: { ...dataZoom, ...props.option?.dataZoom },
    series: []
  }
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
