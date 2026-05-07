<template>
  <v-chart class="chart"
           ref="batteryBar"
           :option="option"
           :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PictorialBarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import config from '../../config'

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent
])

const props = defineProps({
  option: {
    type: Object,
    default: () => {}
  },
  data: {
    type: Array,
    default: () => []
  },
  name: {
    type: String,
    default: ''
  }
})

const { tooltip, grid } = config

const option = computed(() => {
  const nameList = props.data.map((item) => item.name)
  const valueList = props.data.map((item) => item.value * 1)
  let maxnum = Math.max.apply(null, valueList) || 0
  return {
    grid: {
      top: 20,
      left: 50,
      right: 40,
      ...grid,
      ...props.option?.grid
    },
    tooltip,
    xAxis: {
      type: 'value',
      scale: true,
      position: 'top',
      boundaryGap: false,
      splitNumber: 2,
      min: 0,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        margin: 6,
        textStyle: {
          color: "#ffffff"
        }
      }
    },
    yAxis: {
      type: 'category',
      nameGap: 16,
      inverse: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#2e425f',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        overflow: 'truncate',
        ellipsis: '..',
        width: 50,
        interval: 0,
        textStyle: {
          color: "#ffffff"
        },
        formatter: function (value, index) {
          if (index === 0) {
            return `{top|${value}}`
          }
          return value
        },
        rich: {
          top: {
            color: '#F3AC41'
          }
        }
      },
      data: nameList
    },
    series: [
      {
        type: 'bar',
        name: props.name,
        stack: 'total',
        barMaxWidth: 10,
        data: valueList.map((item, index) => {
          return {
            value: item,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color:
                    index !== 0 ? 'rgba(0,240,255,0)' : 'rgba(255,214,119,0)'
                },
                {
                  offset: 1,
                  color: index !== 0 ? '#13C2FF' : '#F3AC41'
                }
              ])
            }
          }
        })
      },
      {
        type: 'bar',
        name: '',
        stack: 'total',
        barMaxWidth: 10,
        color: '#fff',
        data: valueList.map((item, index) => maxnum * 0.02),
        tooltip: {
          show: false
        }
      }
      // {
      //   name: '',
      //   type: 'pictorialBar',
      //   symbolPosition: 'end',
      //   symbol: 'rect',
      //   z: 11,
      //   symbolSize: [2, 8],
      //   symbolOffset: ["100%", "0%"],
      //   data: valueList,
      //   itemStyle: {
      //     color: '#fff',
      //   },
      //   tooltip: {
      //     show: false,
      //   },
      // },
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
