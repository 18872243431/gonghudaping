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
import config from '../../config'

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
])

const { tooltip } = config

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      legend: [],
      xAxisName: [],
      data: [[], []],
    }),
  },
  rotate: {
    type: Number,
    default: 0,
  },
  option: {
    type: Object,
    default: {},
  },
  isOneBgColor: {
    type: Boolean,
    default: false,
  },
})

const grid = {
  left: 50,
  right: 40,
  top: 30,
  bottom: 50,
}

const nameList = computed(() => props.data.xAxisName)
const maxData = computed(() => {
  let data1 = props.data.data[0] || []
  let data2 = props.data.data[1] || []
  let arr = []
  for (let i = 0; i < data1.length; i++) {
    let num = data1[i] + data2[i]
    arr.push(num)
  }
  return arr
})

const option = computed(() => {
  return {
    tooltip: {
      ...tooltip,
      ...props.option?.tooltip,
      axisPointer: {
        type: 'none',
      },
    },
    grid: { ...grid, ...props.option?.grid },
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
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        rotate: props.rotate,
        interval: 0,
        // margin: 10,
        // width: 100,
        align: 'center',
        overflow: 'truncate',
        padding: [0, 0, 0, 0],
        rich: {
          value: {
            width: 100,
            textAlign: 'center',
            fontSize: 10,
            lineHeight: 20,
            color: "#ffffff",
            // padding: [0,0,0,-10]
            // rotate: 30
          },
        },
      },

      data: nameList.value,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
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
    legend: {
      // ...legend,
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      left: 60,
      top: -5,
      textStyle: {
        color: '#FFFFFF',
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        fontSize: 14,
      },
      pageTextStyle: {
        color: "#ffffff",
      },
      ...props.option?.legend,
      data: props.data.legend,
    },
    series: [
      {
        z: 12,
        name: props.data.legend[0] || '受控终端数量',
        type: 'bar',
        barMaxWidth: 'auto',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(253,172,66,0)',
            },
            {
              offset: 1,
              color: 'rgba(253,172,66,1)',
            },
          ]),
        },
        data: props.data.data[0],
      },
      {
        z: 12,
        name: props.data.legend[1] || '受控终端数量' || '被攻击终端数量',
        type: 'bar',
        barMaxWidth: 'auto',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(32,129,255,0)',
            },
            {
              offset: 1,
              color: 'rgba(32,129,255,1)',
            },
          ]),
        },
        data: props.data.data[1],
      },
      {
        name: props.data.legend[0],
        type: 'pictorialBar',
        symbolSize: [10, 2],
        symbol: 'rect',
        symbolOffset: [-6, 0],
        z: 12,
        label: {
          show: false,
        },
        symbolPosition: 'end',
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: 'rgba(253,172,66,1)',
        },
        data: props.data.data[0],
      },
      {
        name: props.data.legend[1],
        type: 'pictorialBar',
        symbolSize: [10, 2],
        symbol: 'rect',
        symbolOffset: [6, 0],
        z: 12,
        label: {
          show: false,
        },
        symbolPosition: 'end',
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: 'rgba(32,129,255,1)',
        },
        data: props.data.data[1],
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
  