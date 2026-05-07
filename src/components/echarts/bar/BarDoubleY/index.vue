<template>
  <v-chart class="chart" ref="barDoubleYChart" :option="option" :autoresize="true" />
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
  DataZoomComponent,
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
  DataZoomComponent,
])

const { dataZoom, grid, legend, tooltip, xAxis, yAxis } = config

const props = defineProps({
  option: {
    type: Object,
    default: {},
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
          { label: '智慧工业', value: 366 },
        ],
      },
    ],
  },
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
      color: '#1B3255', // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: '#0F82A7', // 50% 处的颜色
    },
    {
      offset: 1,
      color: '#11BDF8', // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
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
      color: '#1B3255', // 0% 处的颜色
    },
    {
      offset: 0.5,
      color: '#7E8CA1', // 50% 处的颜色
    },
    {
      offset: 1,
      color: '#FFFFFF', // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
}
function getSeriesData() {
  let arr = []
  props.data[0].list.map((item, index) => {
    if (index === 0) {
      arr.push({
        ...item,
        itemStyle: {
          color: color1
        },
      })
    } else {
      arr.push({
        ...item,
        itemStyle: {
          color: color2
        },
      })
    }
  })
  return arr
}

const option = computed(() => {
  return {
    grid: { ...grid, ...props.option?.grid },
    legend: {
      show: false,
      ...legend,
      ...props.option?.legend,
      data: legendData.value,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
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
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
      },
    },
    yAxis: [
      {
        show: true,
        type: 'category',
        inverse: true,
        data: categories.value,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 12,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
      },
      {
        show: true,
        type: 'category',
        inverse: true,
        data: yAxisData.value,
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        name: `单位:${props.data[0].name}`,
        nameTextStyle: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 14,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
        nameLocation: 'start',
        axisLabel: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 14,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
      },
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
      },
      // {
      //   name: '',
      //   type: 'bar',
      //   zlevel: 1,
      //   itemStyle: {
      //     color: 'rgba(208,222,238,0.07)'
      //   },
      //   barGap: '-175%',
      //   barWidth: 16,
      //   data: yData1.value
      // }
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
