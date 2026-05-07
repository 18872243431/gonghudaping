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
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import { computed, defineProps, onMounted, ref } from 'vue'
import config from '../config'
import { insertSeparator, formatNum } from "@/libs/util";
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'
const pineChart = ref(null)
const props = defineProps({
    option: {
        type: Object,
        default: () => { }
    },
    data: {
        type: Array,
        default: () => [
            {
                name: '个人',
                value: 320
            },
            {
                name: '社会团体',
                value: 540
            },
            {
                name: '政府机关',
                value: 780
            }
        ]
    },
    type: {
        type: String,
        default: 'none'
    },
    needCarousel: {
        type: Boolean,
        default: true
    },
    carouselTime: {
        type: Number,
        default: 1
    },
    pieCenter: {
        type: Array,
        default: () => ['30%', '55%']
    }
})

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

const { grid, legend, tooltip } = config

const legendData = computed(() => {
    return props.data.map((item) => item.name)
})

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
    return [
        {
            name: '',
            type: 'pie',
            roundCap: true,
            radius: ['55%', '70%'],
            center: props.pieCenter,
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
                                formatNum(params.data.value) +
                                `(${flag}%)`
                            )
                        }
                    }
                }
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false
                }
            },
            labelLine: {
                show: false
            },
            data: pieData1
        },
        {
            type: 'pie',
            center: props.pieCenter,
            radius: [0, '45.6%'],
            selectedMode: false,
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            emptyCircleStyle: {
                color: 'rgba(75, 126, 203,.1)'
            },
            silent: true
        }
    ]
})

const option = computed(() => {
    return {
        color: props.option?.color ?? defaultOptions.color,
        grid: { ...grid, ...props.option?.grid },
        legend: {
            ...defaultOptions.legend,
            show: true,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 18,
            type: 'scroll',
            width: 150,
            animation: true,
            selectedMode: false,
            formatter: function (name) {
                let total = 0
                for (let i = 0, l = props.data.length; i < l; i++) {
                    total += props.data[i].value
                }
                const item = props.data.find((v) => v.name === name)
                let flag = ((item.value / total) * 100).toFixed(2) === '0.00' && item.value > 0 ? '<0.01' : ((item.value / total) * 100).toFixed(2)
                const str = formatNum(item.value)
                return `{wid|${name}}`  + `{point|${str}}` + `{fl|(${flag}%)}`
            },
            right: '2%',
            top: 10,
            textStyle: {
                lineHeight: 16,
                overflow: 'breakAll',
                rich: {
                    wid: {
                        width: 80,
                        color: "#ffffff",
                    },
                    point: {
                        color: '#3de6ff'
                    },
                    fl: {
                        color: "#ffffff",
                    }
                }
            },

            ...props.option?.legend,
            data: legendData.value,
        },
        tooltip: {
            ...defaultOptions.tooltip,
            ...props.option?.tooltip,
        },
        series: series.value
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
  