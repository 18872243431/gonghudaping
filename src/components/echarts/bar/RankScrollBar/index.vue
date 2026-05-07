<template>
  <div class="chart-view" ref="view">
    <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
  </div>
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
import { computed, ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import config from '../../config'
import { elTableScroll } from './scroll'
import { fontSize, getMaxValueByKey, insertSeparator } from '@/libs/util'

use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent,
  DataZoomComponent,
])

const { tooltip } = config

const props = defineProps({
  option: {
    type: Object,
    default: {},
  },
  data: {
    type: Array,
    default: () => [
      { label: '1号', value: 92 },
      { label: '2号', value: 83 },
      { label: '3号', value: 81 },
      { label: '4号', value: 75 },
      { label: '5号', value: 71 },
      { label: '6号', value: 62 },
      { label: '7号', value: 58 },
      { label: '8号', value: 52 },
      { label: '9号', value: 42 },
      { label: '10号', value: 23 },
    ],
  },
})

const barChart = ref(null)
const view = ref(null)
let scrollDom = null
const valueList = computed(() => {
  return props.data.map((item) => item.value)
})
const labelList = computed(() => {
  return props.data
    .map((item, index) => `NO${index + 1}. ${item.label}`)
    .reverse()
})

const max = computed(() => {
  const valueList = props.data.map((item) => item.value)
  return Math.max.apply(null, valueList)
})

const rightWidth = computed(() => {
  const maxValue = getMaxValueByKey(props.data, 'value')
  if (!maxValue) return 0
  const length = insertSeparator(maxValue).length
  const width = length * 12
  return width > 50 ? width : 50
})

const labelWidth = computed(() => {
  if (view.value) {
    return view.value.offsetWidth - rightWidth.value - 30
  }
  return 280
})

const option = computed(() => {
  return {
    tooltip: { ...tooltip, show: false, ...props.option?.tooltip },
    grid: {
      left: 20,
      right: 80,
      bottom: 20,
      top: 20,
      right: rightWidth.value,
    },
    xAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          color: "#ffffff",
          fontSize: 18,
          margin: 10,
        },
        data: valueList.value.map((item) => thousands(item)),
      },
      {
        //名称
        type: 'category',
        offset: -10,
        position: 'left',
        axisLine: {
          show: false,
        },
        inverse: false,
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: ['#fff'],
          align: 'left',
          verticalAlign: 'bottom',
          lineHeight: 32,
          fontSize: 18,
          width: labelWidth.value,
          overflow: 'truncate',
        },
        data: labelList.value,
      },
    ],
    series: [
      {
        zlevel: 1,
        type: 'bar',
        barWidth: 6,
        data: valueList.value,
        align: 'center',
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0.7,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(16,171,244,0)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#10B0FF', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      {
        type: 'bar',
        barWidth: 6,
        barGap: '-100%',
        data: Array(props.data.length).fill(max.value),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0.7,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255,255,255,0)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,.1)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          borderRadius: [0, 20, 20, 0],
        },
      },
      {
        zlevel: 3,
        type: 'bar',
        itemStyle: {
          color: 'rgba(0,0,0,0)',
          opacity: 1,
          borderRadius: [0, 20, 20, 0],
        },
        label: {
          show: true,
          formatter: '',
          backgroundColor: '#fff',
          width: 8,
          height: 8,
          position: 'right',
          offset: [-12, 0],
          borderWidth: 6,
          borderColor: 'rgba(255,255,255,0.2)',
          borderRadius: 4,
          shadowColor: 'rgba(255,255,255,0.5)',
          shadowBlur: 8,
        },
        showBackground: false,
        silent: true,
        barWidth: 6,
        barGap: '-100%',
        data: [...props.data],
      },
    ],
  }
})

onMounted(() => {
  scroll()
})

onBeforeUnmount(() => {
  scrollDom && scrollDom.stop()
  scrollDom = null
})

async function scroll() {
  scrollDom && scrollDom.stop()
  scrollDom = await elTableScroll(view.value, {
    step: 0.3,
    duration: 25,
    useType: 'step',
  })
}

function thousands(num) {
  let str = num.toString()
  const reg =
    str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
</script>

<style lang="scss" scoped>
.chart-view {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .chart {
    width: 100%;
    height: 240%;
  }
}
</style>
