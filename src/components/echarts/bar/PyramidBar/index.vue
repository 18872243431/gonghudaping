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
      { name: '文件上传', value: 650 },
      { name: '带口令', value: 601 },
      { name: '拒绝服务', value: 403 },
      { name: '类目四', value: 366 },
      { name: '类目五', value: 266 },
    ],
  },
})

const categories = computed(() => {
  return props.data.map((item) => item.name)
})

const colorList = [
  { start: 'rgba(255, 84, 31, 0)', end: 'rgba(255, 84, 31, 0.3)' }, // 第一个颜色
  { start: 'rgba(255, 170, 49, 0)', end: 'rgba(255, 170, 49, 0.3)' }, // 第二个颜色
  { start: 'rgba(77, 255, 148, 0)', end: 'rgba(77, 255, 148, 0.3)' }, // 第三个颜色
  { start: 'rgba(80, 186, 226, 0)', end: 'rgba(80, 186, 226, 0.3)' }, // 第四个颜色
  { start: 'rgba(82, 98, 253, 0)', end: 'rgba(82, 98, 253, 0.3)' }, // 第五个颜色
]

const option = computed(() => {
  return {
    grid: { ...grid, ...props.option?.grid },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: { ...yAxis, ...props.option?.yAxis },
    xAxis: { ...xAxis, ...props.option?.xAxis, data: categories.value  },
    series: [{
      name: 'hill',
      type: 'pictorialBar',
      barCategoryGap: '-170%',
      symbolClip: true,
      // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
      emphasis: {
        itemStyle: {
          opacity: 1
        }
      },
      itemStyle: {
        borderWidth: 4,
        borderColor: 'rgba(21, 201, 255, 1)',
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
                offset: 0,
                color: 'rgba(0, 134, 255, 0)',
            },
            {
                offset: 1,
                color: 'rgba(70, 192, 255, 1)',
            },
          ],
          global: false, //  缺省为  false
        }
          // function (params) {
          //   return {
          //     type: 'linear',
          //     x: 0,
          //     y: 0,
          //     x2: 1,
          //     y2: 0,
          //     colorStops: [
          //       {
          //           offset: 0,
          //           // color: colorList[params.dataIndex].start,
          //       },
          //       {
          //           offset: 1,
          //           // color: colorList[params.dataIndex].end,
          //       },
          //     ],
          //     global: false, //  缺省为  false
          //   }
          // },
      },
      label: {
         show: false,
         position: 'top',
         textStyle: {
            color: '#fff',
            fontSize: 16
         },
         formatter: function (params) {
            return params.value + '个'
         },

      },
      data: props.data,
      z: 10
   },
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