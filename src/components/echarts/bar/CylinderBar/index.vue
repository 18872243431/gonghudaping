<template>
  <v-chart class="chart" ref="cylinderBar" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PictorialBarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  AxisPointerComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'
import config from '../../config'

use([
  CanvasRenderer,
  BarChart,
  LegendComponent,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
  AxisPointerComponent
])

const { grid, legend, tooltip, xAxis, yAxis } = config

const props = defineProps({
  option: {
    type: Object,
    default: {
      yAxis: {
        name: '',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      xAxis: {
        axisLabel: {
          color: "#ffffff",
          margin: 20,
        },
        axisLine: {
          show: false
        }
      },
      legend: {
        right: '2%',
        textStyle: {
          color: "#ffffff"
        }
      }
    }
  },
  data: {
    type: Object,
    default: {
        x: ['广东丰田', '阿里云', '京东方科', '新华人寿', '北京亚鸿'],
        y: [91, 87, 79, 61, 43],
        bar: [70, 55, 41, 28, 13],
        names: ['遭受攻击次数', '遭受攻击成功次数']
    }
  }
})

const option = computed(() => {
  return {
    grid: { ...grid, ...props.option?.grid },
    legend: {...legend, ...props.option?.legend, data: props.data.names},
    tooltip: { ...tooltip, ...props.option?.tooltip },
    yAxis: { ...yAxis, ...props.option?.yAxis },
    xAxis: { ...xAxis, ...props.option?.xAxis, data: props.data.x},
    series: [{
      name: props.data.names[0],
      type: 'pictorialBar',
      silent: true,
      symbolSize: [25, 10],
      symbolOffset: [0, -6],
      symbolPosition: 'end',
      z: 12,
      label: {
        show: true,
        position: 'top',
        fontSize: 14,
        color: "#ffffff"
      },
      color: '#035EA3',
      data: props.data.y     
    }, {
      name: '',
      type: 'pictorialBar',
      silent: true,
      symbolSize: [25, 10],
      symbolOffset: [0, 7],
      z: 12,
      color: '#5BFCF4',
      tooltip: {
        show: false
      },
      data: props.data.y     
    }, {
      name: '',
      type: 'pictorialBar',
      silent: true,
      symbolSize: [50, 15],
      symbolOffset: [0, 12],
      z: 10,
      itemStyle: {
        color: 'transparent',
        borderColor: '#5BFCF4',
        borderType: 'solid',
        borderWidth: 8
      },
      tooltip: {
        show: false
      },
      data: props.data.y   
    }, {
      name: '',
      type: 'pictorialBar',
      silent: true,
      symbolSize: [60, 20],
      symbolOffset: [0, 18],
      z: 10,
      itemStyle: {
        color: 'transparent',
        borderColor: 'rgba(91,252,244,0.5)',
        borderType: 'solid',
        borderWidth: 5
      },
      tooltip: {
        show: false
      },
      data: props.data.y,
    }, {
      name: '',
      type: 'bar',
      barWidth: '25',
      barGap: '10%', // Make series be overlap
      barCateGoryGap: '10%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
          {
            offset: 0,
            color: 'rgba(19, 150, 249, 0.4)'
          },
          {
            offset: 1,
            color: 'rgba(91,252,244,0.2)'
          }
        ]),
        opacity: 0.8
      },
      tooltip: {
        show: false
      },
      data: props.data.y,
    }, {
          name: '',
          type: 'bar',
          barWidth: 25,
          z: 12,
          barGap: '-100%',
          itemStyle: {
            //lenged文本
            opacity: 0.7,
            color: function (params) {
              return new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                        offset: 0,
                        color: '#D8C302', // 0% 处的颜色
                    },
                    {
                        offset: 1,
                        color: '#FF3A2F', // 100% 处的颜色
                    }
                  ],
                  false
              )
            }
          },
          tooltip: {
            show: false
          },
          data: props.data.bar,
    }, {
        name: props.data.names[1],
        type: 'pictorialBar',
        silent: true,
        symbolSize: [25, 10],
        symbolOffset: [0, -6],
        symbolPosition: 'end',
        z: 15,
        color: '#FFEA2F',
        label: {
          show: true,
          position: 'top',
          fontSize: 14,
          color: "#ffffff"
        },        
        data: props.data.bar
    },
    {
        name: '',
        type: 'pictorialBar',
        silent: true,
        symbolSize: [25, 10],
        symbolOffset: [0, 7],
        z: 12,
        color: '#DD9004',
        tooltip: {
          show: false
        },
        data: props.data.bar
      }
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