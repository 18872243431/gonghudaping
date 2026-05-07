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
          { label: '可编辑逻辑控制器', company: '西门子', ip: '111.223.21.12', value: 650 },
          { label: 'DTU数据中心', company: '宏达', ip: '111.223.21.12', value: 601 },
          { label: '可编辑逻辑控制器', company: '摩莎', ip: '111.223.21.12', value: 403 },
          { label: '可编辑逻辑控制器', company: '施耐德', ip: '111.223.21.12', value: 366 },
          { label: 'DTU数据中心', company: '霍尼韦尔', ip: '111.223.21.12', value: 266 },
        ],
      },
    ],
  },
})

const legendData = computed(() => {
  return props.data.map((item) => item.name)
})

const categories = computed(() => {
  return props.data[0].list.map((item) => item.label + '-' + item.company + '-' + item.ip)
})
const yAxisData = computed(() => {
  return props.data[0].list.map((item) => item.value)
})
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
      color: 'rgba(255, 189, 67, 0)', // 0% 处的颜色
    },
    {
      offset: 1,
      color: 'rgba(255, 189, 67, 1)', // 100% 处的颜色
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
      color: 'rgba(25, 220, 255, 0)', // 0% 处的颜色
    },
    {
      offset: 1,
      color: 'rgba(25, 220, 255, 1)', // 100% 处的颜色
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
          color: 'rgba(19, 150, 249, 0.20)',
          width: 2
        }
      },
      axisLabel: {
        color: "#ffffff",
        fontWeight: 400,
        fontSize: 16,
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
          fontSize: 16,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          formatter: function (val, ind) {
            const value = val.split('-')
            if(ind == 0) {
              return `{label|${value[0]}-${value[1]}}{ip1|(${value[2]})}`;
            } else {
              return `{label|${value[0]}-${value[1]}}{ip2|(${value[2]})}`;
            }
          },
          rich: {
            label: {
                color: 'rgba(255, 255, 255, 1)',
            },
            ip1: {
               color: 'rgba(255, 189, 67, 1)'
            },
            ip2: {
               color: 'rgba(75, 210, 253, 1)'
            },
          }
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
        // name: `单位:${props.data[0].name}`,
        // nameTextStyle: {
        //   color: "#ffffff",
        //   fontWeight: 400,
        //   fontSize: 14,
        //   fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        // },
        // nameLocation: 'start',
        axisLabel: {
          color: "#ffffff",
          fontWeight: 400,
          fontSize: 16,
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
          color: 'rgba(208,222,238,0)',
          borderColor: 'rgba(208,222,238,0.07)',
          borderWidth: 10
        },
        data: getSeriesData(),
        barWidth: 10
      },
      {
        name: '',
        type: 'pictorialBar',
        symbolPosition: 'end',
        symbol: 'rect',
        z: 11,
        symbolOffset: [14, 0],
        symbolSize: [8, 10],
        data: props.data[0].list,
        itemStyle: {
          color: '#fff',
        },
        tooltip: {
          show: false,
        },
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
