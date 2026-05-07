<template>
  <v-chart class="chart" ref="barChart" @click="handClick" :option="option" :autoresize="true" />
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

const { tooltip } = config

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  rotate: {
    type: Number,
    default: 20
  },
  option: {
    type: Object,
    default: {}
  },
  isOneBgColor: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  }
})

const grid = {
  left: 80,
  right: 40,
  top: 20,
  bottom: 50
}

const valueList = computed(() => props.data.map((item) => item.value))
const nameList = computed(() => props.data.map((item) => item.name))
const maxValue = Math.max.apply(null, valueList.value)
const totalList = computed(() =>
  new Array(valueList.value.length).fill(maxValue * 1.1)
)

function getData() {
  let arr = []
  if (props.isOneBgColor) {
    arr = valueList.value.map((item, index) => {
      return {
        value: item,
        data: props.data[index],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(19,194,255,0)'
            },
            {
              offset: 1,
              color: '#13c2ff'
            }
          ])
        }
      }
    })
  } else {
    arr = valueList.value.map((item, index) => {
      return {
        value: item,
        data: props.data[index],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: index !== 0 ? 'rgba(19,194,255,0)' : 'rgba(253,172,66,0)'
            },
            {
              offset: 1,
              color: index !== 0 ? '#13c2ff' : '#FDAC42'
            }
          ])
        }
      }
    })
  }

  return arr
}

function getSymbolData() {
  if (props.isOneBgColor) {
    return valueList.value.map((item, index) => {
      return {
        value: item,
        itemStyle: {
          color: '#13c2ff'
        }
      }
    })
  } else {
    return valueList.value.map((item, index) => {
      return {
        value: item,
        itemStyle: {
          color: index !== 0 ? '#13c2ff' : '#FDAC42'
        }
      }
    })
  }
}

const option = computed(() => {
  return {
    tooltip: {
      ...tooltip,
      ...props.option?.tooltip,
      axisPointer: {
        type: 'none'
      }
    },
    grid: { ...grid, ...props.option?.grid },
    xAxis: {
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#144B9D',
          width: 1
        }
      },
      axisTick: {
        show: false
      },
      data: nameList.value,
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        align: 'center',
        rotate: props.rotate,
        interval: 0,
        margin: 20,
        width: 80,
        overflow: 'truncate'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        formatter: (value) => {
          return `${numberFormat(value, 1)}`
        }
      },
      splitLine: {
        lineStyle: {
          color: '#144388',
          type: 3,
          dashOffset: 3
        }
      },
      data: valueList.value
    },
    series: [
      {
        z: 12,
        type: 'bar',
        name: props.name || '',
        barMaxWidth: 'auto',
        barWidth: 10,
        label: {
          show: true,
          position: 'top',
          color: "#ffffff",
          formatter: ({ value }) => {
            return `${numberFormat(value, 1)}`
          }
        },
        data: getData()
      },
      {
        name: '柱顶部',
        type: 'pictorialBar',
        symbolSize: [10, 2],
        symbol: 'rect',
        symbolOffset: [0, 0],
        z: 12,
        itemStyle: {
          color: '#FDAC42'
        },
        label: {
          show: false
        },
        symbolPosition: 'end',
        tooltip: {
          show: false
        },
        data: getSymbolData()
      }
      // {
      //   z: 1,
      //   name: '背景',
      //   type: 'bar',
      //   barMaxWidth: 'auto',
      //   barWidth: 30,
      //   barGap: '-200%',
      //   data: totalList.value,
      //   tooltip: {
      //     show: false
      //   },
      //   itemStyle: {
      //     color: ' rgba(208,222,238,0.07)'
      //   }
      // }
    ]
  }
})

function numberFormat(value, precision = 0) {
  let param = {}
  let k = 10000
  let sizes = ['', '万', '亿', '万亿']
  let i
  if (value < k) {
    param.value = value
    param.unit = ''
  } else {
    i = Math.floor(Math.log(value) / Math.log(k))
    param.value = (value / Math.pow(k, i)).toFixed(precision)
    param.unit = sizes[i]
  }
  return param.value + param.unit
}

const emits = defineEmits(['handClick'])

function handClick(params) {
  emits('handClick', params)
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
