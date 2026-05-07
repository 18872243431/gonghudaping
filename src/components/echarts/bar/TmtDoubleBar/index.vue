<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PictorialBarChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import config from '../../config'
use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  typeList: {
    type: Array,
    default: () => ['遭受攻击次数', '遭受攻击成功次数'],
  },
})

const { legend } = config

const option = computed(() => {
  const valueList1 = props.data.map((item) => item.value1)
  const valueList2 = props.data.map((item) => item.value2)
  const nameList = props.data.map((item) => item.name)
  const maxValue = Math.max.apply(null, valueList1)
  const totalList = new Array(valueList1.length).fill(maxValue * 1.1)
  const legendList = props.typeList
  return {
    legend: {
      ...legend,
      data: [...legendList],
      textStyle: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
      },
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(11,36,57,0.80)',
      borderColor: '#4dd5ff',
      textStyle: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
      },
    },
    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 30,
    },
    xAxis: [
      {
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
          fontSize: 20,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          align: 'center',
          color: "#ffffff",
          interval: 0,
          margin: 10,
          width: 65,
          overflow: 'truncate',
        },
      },
      {
        type: 'category',
        data: nameList,
        axisLine: { show: false },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        boundaryGap: true,
      },
    ],
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 20,
        fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        formatter: (value) => {
          if (value < 10000) {
            return value
          }
          return `${value / 10000}万`
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
    series: [
      {
        z: 2,
        name: legendList[0],
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(253,172,66,0)',
            },
            {
              offset: 1,
              color: '#FDAC42',
            },
          ]),
        },
        data: valueList1,
      },
      {
        z: 2,
        name: legendList[1],
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
        data: valueList2,
      },
      {
        name: legendList[0],
        type: 'pictorialBar',
        symbolSize: [10, 4],
        symbol: 'rect',
        barWidth: 10,
        barGap: '0%',
        z: 12,
        itemStyle: {
          color: '#FDAC42',
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
        name: legendList[1],
        type: 'pictorialBar',
        symbol: 'rect',
        symbolSize: [10, 4],
        barWidth: 10,
        barGap: '12%',
        z: 12,
        itemStyle: {
          color: '#14CFFF',
        },
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        symbolPosition: 'end',
        data: valueList2,
      },
      {
        z: 1,
        name: '背景',
        type: 'bar',
        barWidth: 40,
        barGap: '-60%',
        data: totalList,
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: ' rgba(208,222,238,0.07)',
        },
        xAxisIndex: 1,
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
