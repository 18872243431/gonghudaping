<template>
  <v-chart
    class="chart"
    ref="pieChart"
    :option="option"
    :autoresize="true"
    :loading="loading"
    :loading-options="loadingConfig"
  />
</template>

<script setup>
import { use } from 'echarts/core'
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { computed, ref } from 'vue'
import config from '../config'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const { legend, tooltip, loadingConfig } = config

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const pieChart = ref(null)

const legendData = computed(() => {
  return props.data.map((item) => item.name)
})
const sumValue = computed(() => {
  let list = props.data.map((item) => item.value)
  return list.reduce((total, item) => item + total, 0)
})

const series = computed(() => {
  let list = []
  const data = props.data
  for (let i = 0; i < data.length; i++) {
    const distance = 100 / data.length
    let obj = {
      name: '',
      type: 'pie',
      clockwise: false, //顺时加载
      radius: [93 - i * distance + '%', 83 - i * distance + '%'],
      center: ['30%', '50%'],
      label: {
        show: false,
      },
      itemStyle: {
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        borderWidth: 5,
      },
      emphasis: {
        scale: false,
      },
      data: [
        {
          value: data[i].value,
          name: data[i].name,
          tooltip: {
            show: true,
            formatter: '{b}：{c}（{d}%）',
          },
        },
        {
          value: sumValue.value - data[i].value,
          name: '',
          itemStyle: {
            color: 'rgb(43, 98, 131,0.5)',
            borderWidth: 0,
          },
          tooltip: {
            show: false,
          },
          emphasis: { scale: false },
        },
      ],
    }
    list.push(obj)
  }
  return list
})

const option = computed(() => {
  return {
    tooltip: { ...tooltip, ...props.option?.tooltip },
    color: props.option?.color,
    legend: {
      ...legend,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      ...props.option?.legend,
      data: legendData.value,
      formatter: function(name) {
        const data = props.data.find((item) => item.name === name)
        if (data) {
          return `${name}（${((data.value / sumValue.value) * 100).toFixed(
            2
          )}%）`
        }
        return name
      },
      textStyle: {
        fontSize: 18,
        lineHeight: 14,
        color: '#fff',
        overflow: 'break',
      },
    },
    series: series.value,
  }
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
