<!--
 * @Author: xuyong 
 * @LastEditors: cxm
 * @Date: 2021-11-22 15:58:11
 * @Description: 环形图
-->
<template>
  <v-chart
    class="chart"
    ref="pineChart"
    :option="option"
    :autoresize="true"
    :loading="loading"
    :loading-options="loadingConfig"
  />
</template>

<script setup>
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import { computed, defineProps, onMounted, ref } from 'vue'
import config from '../config'
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'

const { grid, loadingConfig } = config
const pineChart = ref(null)

const defaultOptions = {
  color: [
    '#42b5d8',
    '#bfae22',
    '#3a8951',
    '#ff3a2f',
    '#1859e9',
    '#d77434',
    '#c83371',
    '#7302eb',
    '#0011dd',
    '#8068b0',
  ],
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(11, 36, 57, 0.8)',
    shadowBlur: 7,
    shadowColor: 'rgba(0, 96, 255, 0.5)',
    borderRadius: 4,
    borderColor: '#4DD5FF',
    textStyle: {
      color: '#D7DDFF',
      fontSize: 18,
    },
    position: 'right',
    formatter: `{b}<br />{c}({d}%)`,
    zlevel: 10,
  },
  legend: {
    show: true,
    orient: 'vertical',
    left: '2%',
    top: 'center',
    type: 'scroll',
    textStyle: {
      color: "#ffffff",
      fontSize: 18,
    },
    icon: 'circle',
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 12,
    animation: true,
    pageTextStyle: {
      color: "#ffffff",
    },
    data: [],
  },
  radius1: ['30%', '50%'],
  radius2: ['65%', '75%'],
  radius3: ['0%', '18%'],
}

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Array,
    default: () => [
      {
        name: '个人',
        value: 320,
      },
      {
        name: '社会团体',
        value: 540,
      },
      {
        name: '政府机关',
        value: 780,
      },
    ],
  },
  type: {
    type: String,
    default: 'outside',
  },
  needCarousel: {
    type: Boolean,
    default: true,
  },
  carouselTime: {
    type: Number,
    default: 1.5,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  legendShow: {
    type: Boolean,
    default: false,
  },
})

const legendData = computed(() => {
  return props.data.map((item) => item.name)
})
const legendMate = computed(() => {
  let totals = props.data.reduce(function(pre, item) {
    return pre * 1 + item.value * 1
  }, 0)
  let formatters = function(name) {
    let num =
      props.data.filter((item) => {
        return item.name === name
      })[0]?.value || '0'

    let port = ((num / totals) * 100).toFixed(1)
    return `{a|${name}}` + `{b|${num}}` + `{c|${port}%}`
  }
  return formatters
})
const series = computed(() => {
  let angle = 0,
    pie = {}
  if (props.type === 'outside') {
    pie = {
      type: 'pie',
      radius: props.option?.radius1 ?? defaultOptions.radius1,
      center: props.option?.center ?? ['50%', '50%'],
      label: {
        show: true,
        position: 'outside',
        color: "#ffffff",
        fontSize: 16,
        formatter: ({ percent, name, value }) => {
          return `${name}\n ${numFmt(value)}(${percent}%)`
        },
      },
      labelLine: {
        lineStyle: {
          color: "#ffffff",
        },
      },
      data: props.data,
    }
  }
  if (props.type === 'none') {
    pie = {
      type: 'pie',
      radius: props.option?.radius1 ?? defaultOptions.radius1,
      center: props.option?.center ?? ['50%', '50%'],
      label: {
        show: false,
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2,
      },
      data: props.data,
    }
  }
  if (props.type === 'center') {
    pie = {
      type: 'pie',
      radius: props.option?.radius1 ?? defaultOptions.radius1,
      center: props.option?.center ?? ['50%', '50%'],
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 18,
          color: '#B3C2EC',
        },
      },
      data: props.data,
    }
  }
  console.error(pie, 'pie::::::::::::::')
  return [
    pie,
    {
      //外线1
      name: 'arcline',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function(params, api) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() * props.option?.outLine?.center[0] ?? 0.5,
            cy: api.getHeight() * props.option?.outLine?.center[1] ?? 0.5,
            r:
              (Math.min(api.getWidth(), api.getHeight()) / 2) *
                props.option?.outLine?.r[0] ?? 0.55,
            startAngle: ((0 + angle) * Math.PI) / 180,
            endAngle: ((90 + angle) * Math.PI) / 180,
          },
          style: {
            stroke: '#0B2439',
            fill: 'transparent',
            lineWidth: 1.5,
          },
          silent: true,
        }
      },
      data: [0],
    },
    {
      //外线2
      name: 'arcline',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function(params, api) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() * props.option?.outLine?.center[0] ?? 0.5,
            cy: api.getHeight() * props.option?.outLine?.center[1] ?? 0.5,
            r:
              (Math.min(api.getWidth(), api.getHeight()) / 2) *
                props.option?.outLine?.r[0] ?? 0.55,
            startAngle: ((180 + angle) * Math.PI) / 180,
            endAngle: ((270 + angle) * Math.PI) / 180,
          },
          style: {
            stroke: '#0B2439',
            fill: 'transparent',
            lineWidth: 1.5,
          },
          silent: true,
        }
      },
      data: [0],
    },
    {
      //外线3
      name: 'arcline',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function(params, api) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() * props.option?.outLine?.center[0] ?? 0.5,
            cy: api.getHeight() * props.option?.outLine?.center[1] ?? 0.5,
            r:
              (Math.min(api.getWidth(), api.getHeight()) / 2) *
                props.option?.outLine?.r[1] ?? 0.6,
            startAngle: ((270 - angle) * Math.PI) / 180,
            endAngle: ((40 - angle) * Math.PI) / 180,
          },
          style: {
            stroke: '#0B2439',
            fill: 'transparent',
            lineWidth: 1.5,
          },
          silent: true,
        }
      },
      data: [0],
    },
    {
      //外线4
      name: 'arcline',
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function(params, api) {
        return {
          type: 'arc',
          shape: {
            cx: api.getWidth() * props.option?.outLine?.center[0] ?? 0.5,
            cy: api.getHeight() * props.option?.outLine?.center[1] ?? 0.5,
            r:
              (Math.min(api.getWidth(), api.getHeight()) / 2) *
                props.option?.outLine?.r[1] ?? 0.6,
            startAngle: ((90 - angle) * Math.PI) / 180,
            endAngle: ((220 - angle) * Math.PI) / 180,
          },
          style: {
            stroke: '#0B2439',
            fill: 'transparent',
            lineWidth: 2,
          },
          silent: true,
        }
      },
      data: [0],
    },
    {
      type: 'pie', // 内边线
      radius: props.option?.radius3 ?? defaultOptions.radius3,
      center: props.option?.center ?? ['50%', '50%'],
      label: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      itemStyle: {
        color: 'rgba(11, 36, 57, 0.6)',
        borderColor: '#4DD5FF',
        borderWidth: 1,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 97, 193, 1)',
      },
      data: [1],
    },
  ]
})

const option = computed(() => {
  let obj = {
    color: props.option?.color ?? defaultOptions.color,
    grid: { ...grid, ...props.option?.grid },
    legend: {
      ...defaultOptions.legend,
      ...props.option?.legend,
      // show: props.type === 'outside' ? false : true,
      data: legendData.value,
    },
    tooltip: {
      ...defaultOptions.tooltip,
      ...props.option?.tooltip,
    },
    series: series.value,
  }
  if (props.legendShow) {
    obj.legend.formatter = legendMate.value
  }
  return obj
})

function carousel() {
  if (!props.needCarousel) return
  let i = 0,
    length = props.data.length
  useIntervalFn(function() {
    i++
    if (i == length) {
      i = 0
    }
    if (!pineChart.value) return
    pineChart.value.dispatchAction({
      type: 'hideTip',
      seriesIndex: 0,
      dataIndex: i === 0 ? length - 1 : i - 1,
    })
    pineChart.value.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: i === length ? 0 : i,
    })
    pineChart.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: i === 0 ? length - 1 : i - 1,
    })
    pineChart.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: i === length ? 0 : i,
    }) //设置默认选中高亮部分
  }, props.carouselTime * 1000)
}

function numFmt(num) {
  return (num + '').length > 5 ? Math.round(num / 10000) + '万' : num
}

onMounted(() => {
  useTimeoutFn(() => {
    carousel()
  }, 3000)
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
