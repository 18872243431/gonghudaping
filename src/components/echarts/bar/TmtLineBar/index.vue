<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PictorialBarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
])

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  lineMinValue: {
    type: Number,
    default: 0,
  },
})

const option = computed(() => {
  const valueList1 = props.data.map((item) => item.value1)
  const valueList2 = props.data.map((item) => item.value2)
  const nameList = props.data.map((item) => item.name)
  return {
    tooltip: {
      show: true,
      backgroundColor: 'rgba(11,36,57,0.80)',
      borderColor: '#4dd5ff',
      textStyle: {
        color: '#E1EDFF',
        fontSize: 16,
      },
      trigger: 'axis',
      formatter: (params) => {
        return `${params[0].axisValue}<br />${
          params[0].seriesName
        }：${numberFormat(params[0].value, 2)}<br />${
          params[1].seriesName
        }：${numberFormat(params[1].value, 2)}`
      },
    },
    grid: {
      left: 80,
      right: 80,
      top: 20,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#144B9D',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      data: nameList,
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        align: 'center',
        color: "#ffffff",
      },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 14,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          color: "#ffffff",
          formatter: (value) => {
            return `${numberFormat(value,2)}`
          },
        },
        splitLine: {
          lineStyle: {
            color: '#144388',
            type: 3,
            dashOffset: 3,
          },
        },
      },
      {
        type: 'value',
        axisLabel: {
          fontSize: 14,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          color: "#ffffff",
          formatter: (value) => {
            return `${numberFormat(value,2)}`
          },
        },
        min: props.lineMinValue,
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        z: 2,
        name: '累计终端数量',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(19,194,255,0)',
            },
            {
              offset: 1,
              color: '#13c2ff',
            },
          ]),
        },
        label: {
          show: true,
          position: 'top',
          color: "#ffffff",
          formatter: ({ value }) => {
            return `${numberFormat(value,2)}`
          },
        },
        data: valueList1,
      },
      {
        name: '柱顶部',
        type: 'pictorialBar',
        symbol: 'rect',
        symbolSize: [10, 2],
        z: 12,
        itemStyle: {
          color: '#ffffff',
        },
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        symbolPosition: 'end',
        data: valueList1,
      },
      {
        name: '终端增长数量',
        type: 'line',
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: {
          color: '#37F6F6',
        },
        data: valueList2,
      },
    ],
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
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
