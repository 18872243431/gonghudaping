<template>
  <v-chart class="chart"
           ref="barDoubleYChart"
           :option="option"
           :autoresize="true"
           @click="handClick" />
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
        name: '系列一',
        list: [
          { label: '车联网', value: 650 },
          { label: '公共服务', value: 601 },
          { label: '智慧家居', value: 403 },
          { label: '智慧农业', value: 266 },
          { label: '智慧工业', value: 366 }
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
const yAxisData = computed(() => {
  return props.data[0].list.map((item) => item.value)
})
console.log(yAxisData.value, 'yAxisData.value==')
const yData1 = computed(() => {
  return Array(yAxisData.value.length).fill(Math.max(...yAxisData.value))
})
console.log(yData1.value, 'yData1.value==')

const color1 = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 1,
  y2: 0,
  colorStops: [
    {
      offset: 0,
      color: '#1B3255' // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: '#0F82A7' // 50% 处的颜色
    },
    {
      offset: 1,
      color: '#11BDF8' // 100% 处的颜色
    }
  ],
  global: false // 缺省为 false
}
const color2 = {
  type: 'linear',
  x: 0,
  y: 0,
  x2: 1,
  y2: 0,
  colorStops: [
    {
      offset: 0,
      color: '#1B3255' // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: '#7E8CA1' // 50% 处的颜色
    },
    {
      offset: 1,
      color: '#FFFFFF' // 100% 处的颜色
    }
  ],
  global: false // 缺省为 false
}
function getSeriesData() {
  let arr = []
  props.data[0].list.map((item, index) => {
    if (index === 0) {
      arr.push({
        ...item,
        itemStyle: {
          color: color1
        }
      })
    } else {
      arr.push({
        ...item,
        itemStyle: {
          color: color2
        }
      })
    }
  })
  return arr
}

const option = computed(() => {
  return {
    grid: { ...grid, top: 20, bottom: 0, ...props.option?.grid },
    legend: {
      show: false,
      ...legend,
      ...props.option?.legend,
      data: legendData.value
    },
    tooltip: {
      ...tooltip,
      formatter: function (params) {
        return `${params[0].name}<br />访问量：${params[0].value.toLocaleString(
          'en-US'
        )}`
      }
    },
    xAxis: {
      show: true,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(20,67,136,1)',
          width: 2
        }
      },
      axisLabel: {
        color: "#ffffff",
        fontWeight: 400,
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
      },
      ...props.option?.xAxis
    },
    yAxis: [
      {
        show: true,
        type: 'category',
        inverse: true,
        data: categories.value,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 12,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
        }
      },
      {
        show: true,
        type: 'category',
        inverse: true,
        data: yAxisData.value,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        nameTextStyle: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 14,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
        },
        nameLocation: 'start',
        axisLabel: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 14,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          formatter: (params) => {
            return Number(params).toLocaleString('en-US')
          }
        }
      }
    ],
    series: [
      {
        type: 'bar',
        zlevel: 2,
        yAxisIndex: 0,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(208,222,238,0.07)',
          borderColor: 'rgba(208,222,238,0.07)',
          borderWidth: 12
        },
        data: getSeriesData(),
        barWidth: 6
      }
    ]
  }
})

const emits = defineEmits('handleClick')
function handClick(params) {
  emits('handleClick', params)
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
