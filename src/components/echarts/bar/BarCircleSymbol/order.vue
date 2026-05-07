<template>
  <v-chart
    class="chart"
    ref="barCircleSymbolChart"
    :option="option"
    :autoresize="true"
    @click="handleClick"
  />
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
import { getNationalPng, getCountryImg } from '@/libs/country'
import config from '../../config'
const imgPath1 = require('@/assets/img/echarts/bar/yellowSymbol.png')
const imgPath2 = require('@/assets/img/echarts/bar/blueSymbol.png')

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

const emits = defineEmits(['click'])

const props = defineProps({
  option: {
    type: Object,
    default: {},
  },
  width: {
    default: 10000,
  },
  data: {
    type: Array,
    default: () => [
      {
        name: '系列一',
        list: [
          { label: '贵阳电子科技有限公司', value: 700 },
          { label: '贵阳电子科技有限公司', value: 601 },
          { label: '贵阳电子科技有限公司', value: 403 },
          { label: '贵阳电子科技有限公司', value: 266 },
          { label: '贵阳电子科技有限公司', value: 366 },
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
      color: '#937C55', // 0% 处的颜色
    },
    {
      offset: 1,
      color: '#F3AC41', // 100% 处的颜色
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
      color: '#0F82A7', // 50% 处的颜色
    },
    {
      offset: 1,
      color: '#11BDF8', // 100% 处的颜色
    },
  ],
  global: false, // 缺省为 false
}
function getSeriesData() {
  let arr = []
  props.data[0].list.map((item, index) => {
    // console.log('itrm',item)
    if (index === 0) {
      arr.push({
        ...item,
        itemStyle: {
          color: color1,
        },
        symbol: `image://${imgPath1}`,
      })
    } else {
      arr.push({
        ...item,
        itemStyle: {
          color: color2,
        },
        symbol: `image://${imgPath2}`,
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
      show: false,
    },
    yAxis: [
      {
        show: true,
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
        triggerEvent: true,
        axisLabel: {
          interval: 0,
          inside: true,
          color: '#AEC8EB',
          margin: 0,
          overflow: 'truncate',
          padding: [0, 0, 10, 0],
          align: 'left',
          verticalAlign: 'bottom',
          formatter: function (label, index) {
            const arr = label.split('-')
            const value = arr[0]
            const country = arr[1]
            const brief = getNationalPng(country)
            let str = value.substr(0, props.width)
            if (value.length > props.width) {
              str += '...'
            }
            if (!brief) {
              if (index === 0) {
                return `{Num1|${index + 1}}{title|${str}}`
              } else {
                return `{Num2|${index + 1}}{title|${str}}`
              }
            } else {
              if (index === 0) {
                return `{Num1|${index + 1}} {${brief}|}{title|${str}}`
              } else {
                return `{Num2|${index + 1}} {${brief}|}{title|${str}}`
              }
            }
          },
          rich: {
            Num1: {
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 16,
              height: 18,
              align: 'center',
              backgroundColor: '#FDAC41',
              borderColor: '#fdac42',
              borderWidth: 1,
              borderRadius: 10,
            },
            Num2: {
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 16,
              height: 18,
              align: 'center',
              backgroundColor: 'rgba(0,240,255,0.10)',
              borderColor: '#13C2FF',
              borderWidth: 1,
              borderRadius: 10,
            },
            title: {
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              padding: [0, 0, 0, 5],
            },
            ...getCountryImg(),
          },
        },
      },
      {
        show: true,
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
        axisLabel: {
          margin: 0,
          interval: 0,
          inside: true,
          padding: [0, 0, 10, 0],
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 14,
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          align: 'right',
          verticalAlign: 'bottom',
          formatter: (value) => {
            return thousands(value)
          },
        },
      },
    ],
    series: [
      {
        zlevel: 1,
        type: 'bar',
        name: props.data[0].name,
        showBackground: true,
        backgroundStyle: {
          color: '#142945',
        },
        yAxisIndex: 0,
        data: getSeriesData(),
        barWidth: 6,
      },
      {
        zlevel: 2,  
        name: '',
        type: 'pictorialBar',
        symbolPosition: 'end',
        symbolSize: [33, 33],
        symbolOffset: ['55%', '0%'],
        data: getSeriesData(),
        tooltip: {
          show: false,
        },
      },
    ],
  }
})

function handleClick(params) {
  console.log('params', params)
  emits('click', params)
}

function thousands(num) {
  let str = num.toString()
  const reg =
    str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
</script>
  
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
  