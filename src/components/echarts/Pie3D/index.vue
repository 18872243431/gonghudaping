<template>
  <v-chart class="chart" ref="pie3DChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-gl'
import VChart from 'vue-echarts'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { computed, defineProps } from 'vue'
import { getPie3D, getParametricEquation } from './pie3d'

use([CanvasRenderer, TooltipComponent, PieChart, LegendComponent])

const props = defineProps({
  // chartData: {
  //   type: Array,
  //   default: () => [
  //     {
  //       name: '木马病毒',
  //       value: 98,
  //       itemStyle: {
  //         color: '#F3AC41',
  //       },
  //     },
  //     {
  //       name: '蠕虫病毒',
  //       value: 78,
  //       itemStyle: {
  //         color: '#3DE6FF',
  //       },
  //     },
  //     {
  //       name: '勒索病毒',
  //       value: 78,
  //       itemStyle: {
  //         color: '#1B83FF',
  //       },
  //     },
  //     {
  //       name: '其他病毒',
  //       value: 78,
  //       itemStyle: {
  //         color: '#00E29E',
  //       },
  //     },
  //   ],
  // },
  chartData: {
    type: Array,
    default: () => [] 
  },
  legendShow: {
    type: Boolean,
    default: true,
  },
  labelShow: {
    type: Boolean,
    default: true,
  },
  labelLineShow: {
    type: Boolean,
    default: true,
  },
  legendPos: {
    type: String,
    default: 'top',
  },
  legendRateShow: {
    type: Boolean,
    default: false,
  },
  labelFormatter: {
    type: String,
    default: '',
  },
  labelLine: {
    type: Object,
    default: () => ({
      length: 20,
      length2: 30,
    })
  },
  labUnit: {
    type: String,
    default: '',
  },
  orderTip: {
    type: String,
    default: '',
  }
})

const conf = computed(() => {
  return {
    legendShow: props.legendShow,
    legendPos: props.legendPos,
    labelShow: props.labelShow,
    labelLineShow: props.labelLineShow,
    legendRateShow: props.legendRateShow,
    labelFormatter: props.labelFormatter,
    labelLine:props.labelLine,
    labUnit: props.labUnit,
    orderTip: props.orderTip,
  }
})

const option = computed(() => {
  return getPie3D(props.chartData, 0.7, conf.value)
})
</script>

<style lang="scss" scoped>
.chart {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
