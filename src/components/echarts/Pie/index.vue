<!--
 * @Author: xuyong
 * @LastEditors: cxm
 * @Date: 2021-11-22 15:58:11
 * @Description: 环形图
-->
<template>
  <v-chart class="chart" ref="pineChart" :option="option" :autoresize="true" />
</template>

<script setup>
import * as echarts from "echarts"
import VChart from "vue-echarts"
import config from "../config"
import { computed, defineProps, onMounted ,ref} from 'vue'
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'
const pineChart = ref(null)

const props = defineProps({
  option: {
    type: Object,
    default: () => {
      return {
        grid: null,
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
            fontSize: 18
          },
          formatter: `{b}<br />{c}({d}%)`
        },
        color: ['#ff4242', '#ffbd43','#6FFF9A',  '#19dcff', '#4DD5FF', '#4DBEFF', '#2081A7', '#4868FE', '#584FFF', '#8D48C7'],
        legend: {
          orient: "vertical",
          right: "right",
          top: "center",
          textStyle: {
            color: "#ffffff",
          },
        },
        radius1: ["56%", "65%"],
        center:['50%', '50%'],
        positionXY:[122,24]
      }
    }
  },
  data: {
    type: Array,
    default: () => [
      {
        name: "个人",
        value: 320,
      },
      {
        name: "社会团体",
        value: 540,
      },
      {
        name: "政府机关",
        value: 780,
      },
    ],
  },
  type: {
    type: String,
    default: 'outside'
  },
  carouselTime: {
    type: Number,
    default: 1
  },
  needCarousel: {
    type: Boolean,
    default: true
  },
})

const { grid, legend, tooltip } = config

const legendData = computed(() => {
  return props.data.map((item) => item.name)
});

const series = computed(() => {
  const sum = props.data.reduce((per, cur) => per + cur.value, 0)
  let pieData1 = [],
    selected = false
  props.data.map((item, i) => {
    if (i === 0) selected = true
    pieData1.push({
      ...item,
      selected,
      itemStyle: {
        borderRadius: 0
      }
    })
  })
  return [{
      type: "pie",
      radius: props.option.radius1,
      center: props.option.center,
      // label: {
      //   show: false,
      //   position: "outside",
      //   color: "#ffffff",
      //   fontSize: 18,
      //   lineHeight: 18,
      //   formatter: `{b}\n {c}({d}%)`
      // },
      selectedMode: 'single',
      select: {
        label: {
          show: true,
          color: "#ffffff",
          lineHeight: 20,
          formatter: function (params) {
            if (params.data.name !== '' && params.data.selected) {
              let flag = ((params.data.value / sum) * 100).toFixed(2) === '0.00' && params.data.value > 0 ? '<0.01' : ((params.data.value / sum) * 100).toFixed(2)
              return (
                params.data.name +
                '\n' +
                params.data.value +
                `(${flag}%)`
              )
            }
          }
        }
      },
      label: {
            show: false,
            color: "#ffffff",
            position: 'center',
            formatter: '{label|{b}}\n{value|{c}}',
            rich: {
              label: {
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 14,
                    padding:[0,0,30,0]
                },
              value: {
                    align: 'center',
                    verticalAlign: 'middle',
                    fontSize: 30,
                },
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '12',
                },
            },
        },
      labelLine: {
        lineStyle: {
          color: "#ffffff"
        }
      },
      data: props.data
    }]
})

const option = computed(() => {
  return {
    color: props.option?.color,
    grid: { ...grid, ...props.option.grid },
    legend: {
      ...legend,
      show:true,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 12,
      // formatter: function (name) {
      //   const item = props.data.find((v) => v.name === name);
      //   return name + " " + item.value;
      // },
      ...props.option.legend,
      data: legendData.value,
      // type: 'scroll',
      animation: true,
    },
    tooltip: { ...tooltip, ...props.option?.tooltip },
    series: series.value,
    backgroundColor: {
      type: 'pattern',
      image: require('@/assets/img/pieBg.png'),
      repeat: 'no-repeat',
      left: 'center',
      top: 'center',
      // x: props.option.positionXY[0],
      // y:  props.option.positionXY[1],
    },
  }
})

function carousel() {
  if (!props.needCarousel) return
  if (props.data.length === 0) return
  let i = 0,
    length = props.data.length
  useIntervalFn(function () {
    i++
    if (i == length) {
      i = 0
    }
    if (!pineChart.value) return
    pineChart.value.dispatchAction({
      type: 'select',
      seriesIndex: 0,
      dataIndex: i === 0 ? length - 1 : i - 1
    })
    pineChart.value.dispatchAction({
      type: 'unselect',
      seriesIndex: 0,
      dataIndex: i === length ? 0 : i
    })
    pineChart.value.dispatchAction({
      type: 'selectchanged',
      fromAction: 'select',
      selected: {
        seriesIndex: 0,
        dataIndex: i === 0 ? length - 1 : i - 1
      }
    })
    pineChart.value.dispatchAction({
      type: 'selectchanged',
      fromAction: 'unselect',
      selected: {
        seriesIndex: 0,
        dataIndex: i === length ? 0 : i
      }
    })
  }, props.carouselTime * 1000)
}

onMounted(() => {
  useTimeoutFn(() => {
    carousel()
  }, 2000)
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
