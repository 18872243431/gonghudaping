<template>
  <v-chart class="chart" ref="batteryBar" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PictorialBarChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  AxisPointerComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import config from '../../config'
import xAxis from './xAxis'
import yAxis from './yAxis'

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
  AxisPointerComponent,
])

const { grid, tooltip } = config

const props = defineProps({
  option: {
    type: Object,
    default: {
      yAxis: {
        axisLabel: {
          formatter(value, ind) {
            console.warn(arguments)
            return `{sort${ind < 3 ? ind : 'Default'}|${ind +
              1}} {label|${value}}`
          },
          rich: {
            label: {
              color: "#ffffff",
              fontSize: 14,
            },
            sort0: {
              color: "#ffffff",
              fontSize: 12,
              width: 14,
              height: 12,
              padding: [2, 0, 0, 0],
              textShadowColor: 'rgba(0,0,0,.4)',
              textShadowBlur: 2,
              textShadowOffsetX: -1,
              textShadowOffsetY: 1,
              shadowColor: 'rgba(255,102,31,.26)',
              verticalAlign: 'middle',
              shadowBlur: 8,
              shadowOffsetY: 4,
              align: 'center',
              backgroundColor: '#ff562e',
            },
            sort1: {
              color: "#ffffff",
              fontSize: 12,
              width: 14,
              height: 12,
              padding: [2, 0, 0, 0],
              textShadowColor: 'rgba(0,0,0,.4)',
              textShadowBlur: 2,
              textShadowOffsetX: -1,
              textShadowOffsetY: 1,
              shadowColor: 'rgba(255,171,41,.26)',
              verticalAlign: 'middle',
              shadowBlur: 8,
              shadowOffsetY: 4,
              align: 'center',
              backgroundColor: '#ff900e',
            },
            sort2: {
              color: "#ffffff",
              fontSize: 12,
              width: 14,
              height: 12,
              padding: [2, 0, 0, 0],
              textShadowColor: 'rgba(0,0,0,.4)',
              textShadowBlur: 2,
              textShadowOffsetX: -1,
              textShadowOffsetY: 1,
              shadowColor: 'rgba(11,175,237,.26)',
              verticalAlign: 'middle',
              shadowBlur: 8,
              shadowOffsetY: 4,
              align: 'center',
              backgroundColor: '#0599de',
            },
            sortDefault: {
              color: "#ffffff",
              fontSize: 12,
              width: 14,
              padding: [2, 0, 0, 0],
              height: 12,
              textShadowColor: 'rgba(0,0,0,.4)',
              textShadowBlur: 2,
              textShadowOffsetX: -1,
              textShadowOffsetY: 1,
              shadowColor: 'rgba(15,191,129,.26)',
              verticalAlign: 'middle',
              shadowBlur: 8,
              shadowOffsetY: 4,
              align: 'center',
              backgroundColor: '#0bbe63',
            },
          },
        },
      },
    },
  },
  data: {
    type: Object,
    default: {
      category: ['石油', '煤矿', '汽油', '电力', '交通'],
      value: [555, 444, 333, 222, 111],
    },
  },
})

const option = computed(() => {
  return {
    grid: { ...grid, ...props.option?.grid },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    xAxis: { ...xAxis, ...props.option?.xAxis },
    yAxis: [{ ...yAxis, ...props.option?.yAxis, data: props.data.category }],
    series: [
      {
        type: 'bar',
        barWidth: 14,
        legendHoverLink: false,
        symbolRepeat: true,
        silent: true,
        z: 1,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#00abee', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#62E6F6', // 100% 处的颜色
              },
            ],
          },
        },
        data: props.data.value,
      },
      {
        type: 'pictorialBar',
        animationDuration: 0,
        symbolRepeat: 'fixed',
        symbolMargin: '20%',
        symbol: 'rect',
        symbolSize: [6, 14],
        itemStyle: {
          color: '#12272A',
        },
        label: {
          show: true,
          position: 'right',
          offset: [0, 2],
          distance: 30,
          textStyle: {
            color: '#7AF8FF',
            fontSize: 14,
          },
        },
        z: 0,
        animationEasing: 'elasticOut',
        tooltip: {
          show: false,
        },
        data: props.data.value,
      },
      {
        type: 'pictorialBar',
        itemStyle: {
          color: '#000',
        },
        symbolRepeat: 'fixed',
        symbolMargin: 4,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [2, 14],
        symbolPosition: 'start',
        symbolOffset: [0, 0],
        z: 2,
        animationEasing: 'elasticOut',
        tooltip: {
          show: false,
        },
        data: props.data.value,
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
