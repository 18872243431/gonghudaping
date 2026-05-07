<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
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
import { computed, ref } from 'vue'
import { getNationalPng, getCountryImg } from '@/libs/country'
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

const { tooltip } = config

const props = defineProps({
  option: {
    type: Object,
    default: {},
  },
  data: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'primary',
  },
  max: {
    type: Number,
    default: 100,
  },
})

const barChart = ref(null)
const valueList = computed(() => {
  return props.data.map((item) => item.value)
})
const labelList = computed(() => {
  return props.data.map((item) => item.label).reverse()
})
const tooltipColor = {
  warning: {
    border: 'rgba(198,193,3,0.75)',
    boxShadow: 'rgba(255,235,0,0.49)',
    color: '#FFEA2F',
  },
}
const barColor = {
  primary: {
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
  warning: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0.7,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(255,234,47,0)', // 0% 处的颜色
      },
      {
        offset: 1,
        color: '#FFEA2F', // 100% 处的颜色
      },
    ],
    global: false, // 缺省为 false
  },
  error: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0.7,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: 'rgba(255,30,16,0)', // 0% 处的颜色
      },
      {
        offset: 1,
        color: '#FD1919', // 100% 处的颜色
      },
    ],
    global: false, // 缺省为 false
  },
}

const option = computed(() => {
  return {
    grid: {
      left: 10,
      right: 70,
      bottom: 10,
      top: 30,
    },
    tooltip: {
      show: props.type === 'warning',
      trigger: 'item',
      padding: 0,
      backgroundColor: 'rgba(255,255,255,0)',
      borderWidth: 0,
      position: 'inside',
      formatter: () => {
        return `<div style="
        width: 185px;
        height: 40px;
        background: rgba(41,37,0,0.11);
        border: 1px solid ${tooltipColor[props.type].border};
        border-radius: 4px;
        box-shadow: 0px 0px 13px 0px ${
          tooltipColor[props.type].boxShadow
        } inset; 
        color:${tooltipColor[props.type].color};
        font-size: 14px;
        font-family: "SourceHanSansCN-Regular", "PingFangSC-Regular","Microsoft YaHei", sans-serif;
        text-align:center;
        line-height: 40px;">
        朝阳机房
         </div>`
      },
    },
    xAxis: {
      type: 'value',
      max: props.max,
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
          fontSize: 14,
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
          color: ['#C7DDFF'],
          align: 'left',
          verticalAlign: 'bottom',
          lineHeight: 32,
          fontSize: 14,
          formatter: (value) => {
            let list = value.split(' ')
            const brief = getNationalPng(list[1])
            if (!brief) {
              return value
            } else {
              return `{seq|${list[0]}} {${brief}|} {value|${list[1]}}`
            }
          },
          rich: {
            seq: {
              fontSize: 14,
              color: "#ffffff",
            },
            value: {
              fontSize: 14,
              color: "#ffffff",
            },
            ...getCountryImg(),
          },
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
          color: barColor[props.type],
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
          backgroundColor: {
            image: require(`@/assets/img/echarts/bar-${props.type}-icon.png`),
          },
          width: 9,
          height: 10,
          position: 'right',
          offset: [-6, 0],
        },
        showBackground: false,
        silent: true,
        barWidth: 6,
        barGap: '-100%',
        data: valueList.value,
      },
    ],
  }
})

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
