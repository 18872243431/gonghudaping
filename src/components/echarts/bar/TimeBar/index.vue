<template>
  <v-chart class="chart"
           ref="barChart"
           :option="option"
           :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
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

const { grid, tooltip, xAxis, yAxis } = config

const props = defineProps({
  option: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: () => [
      // 默认数据与图片一致
      { label: '00:00', value: 1 },
      { label: '01:00', value: 1 },
      { label: '02:00', value: 17 },
      { label: '03:00', value: 23 },
      { label: '04:00', value: 27 },
      { label: '05:00', value: 19 },
      { label: '06:00', value: 11 },
      { label: '07:00', value: 2 },
      { label: '08:00', value: 1 },
      { label: '09:00', value: 1 },
      { label: '10:00', value: 1 },
      { label: '11:00', value: 2 },
      { label: '12:00', value: 6 },
      { label: '13:00', value: 7 },
      { label: '14:00', value: 6 },
      { label: '15:00', value: 7 },
      { label: '16:00', value: 3 },
      { label: '17:00', value: 7 },
      { label: '18:00', value: 1 },
      { label: '19:00', value: 1 },
      { label: '20:00', value: 3 },
      { label: '21:00', value: 1 },
      { label: '22:00', value: 1 },
      { label: '23:00', value: 3 },
    ]
  }
})

const categories = computed(() => {
  return props.data.map((item) => item.label)
})

const values = computed(() => {
  return props.data.map((item) => item.value)
})

// 获取最大值
const maxValue = computed(() => {
  if (props.data.length === 0) return 0
  return Math.max(...props.data.map(item => item.value))
})

const option = computed(() => {
  const data = props.data
  const maxVal = maxValue.value
  
  // 为每个柱子设置颜色
  const itemColors = data.map(item => {
    if (item.value === maxVal && maxVal > 0) {
      // 红色渐变 - 最大值
      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#FF6B6B' },
          { offset: 1, color: '#FF4444' }
        ]
      }
    } else {
      // 蓝色渐变 - 其他时段
      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#00D4FF' },
          { offset: 1, color: '#0099CC' }
        ]
      }
    }
  })

  return {
    grid: { 
      ...grid, 
      ...props.option?.grid,
      left: 50,
      right: 20,
      top: 40,
      bottom: 0
    },
    tooltip: { 
      ...tooltip, 
      ...props.option?.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: { 
      ...yAxis, 
      ...props.option?.yAxis,
      type: 'value',
      name: maxVal >= 10000 ? '单位:万' : '',
      nameTextStyle: {
        color: '#ffffff',
        fontSize: 20,
        align: 'right',
        padding: [0, 8, 0, 0]
      },
      axisLabel: {
        color: '#ffffff',
        fontSize: 20,
        formatter: (value) => {
          if (maxVal >= 10000) {
            return value / 10000
          }
          return value
        }
      },
      splitLine: {
        lineStyle: {
          color: "#ffffff",
          type: 'dashed'
        }
      }
    },
    xAxis: { 
      ...xAxis, 
      ...props.option?.xAxis, 
      type: 'category',
      data: categories.value,
      axisLabel: {
        color: '#ffffff',
        fontSize: 20,
        interval: 3, // 每4个显示一个标签
        formatter: function(value) {
          return value
        }
      },
      axisLine: {
        lineStyle: {
          color: "#ffffff"
        }
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        type: 'bar',
        data: values.value.map((value, index) => ({
          value: value,
          itemStyle: {
            color: itemColors[index],
            borderRadius: [2, 2, 0, 0]
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
