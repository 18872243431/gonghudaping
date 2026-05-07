<template>
    <div class="chart" ref="chartRef">
        <v-chart class="img-gauge" :style="{
            width: len,
            height: len,
            top: top,
            left: left,
        }" ref="gaugeChartRef" :option="option" :autoresize="true" />
        <div class="img-bg" :class="data.color"  :style="{
            width: len,
            height: len,
            top: top,
            left: left,
        }">
            <div class="txtbox">
                <div class="row1">
                    <span>{{ `NO.${data.order}`}}</span>
                </div>
                <div class="row2">
                    <act-num :num="data.value" :thousandsFmt="true"></act-num>
                </div>
                <div class="row3">
                    <span>{{ data.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
/* eslint-disable */
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { computed, ref, onMounted } from "vue";
import ActNum from '@c/ActNum';

const ColorUtils = require('color');

function changeColor(color, alpha) {
    return ColorUtils(color).alpha(alpha).rgb().string();
}

const gaugeChartRef = ref(null);
const chartRef = ref(null);

const props = defineProps({
    option: {
        type: Object,
        default: () => {
            return {
                radius: '57%',
                progressWidth: 16,
            }
        }
    },
    data: {
        type: Object,
        default: () => {
            return {
                progess: 68,
                label: '通用设备',
                value: 34564,
                order: 1,
                color: 'red'
            }
        }
    }
});

const colorMap = {
    red: 'rgba(255, 58, 47, 1)',
    blue: 'rgba(76,211,254,1.00)',
    green: 'rgba(75, 255, 221, 1)',
    yellow: 'rgba(255, 188, 66, 1)',
}

const option = computed(() => {
    return {
        series: [
            {
                type: 'gauge',
                startAngle: 270,
                endAngle: -90,
                radius: props.option.radius,
                center: ['50%', '50%'],
                min: 0,
                max: 100,
                splitNumber:12,
                progress: {
                    show: true,
                    roundCap: false,
                    width: props.option.progressWidth,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: changeColor(colorMap[props.data.color], 0.2),
                                },
                                {
                                    offset: 1,
                                    color: changeColor(colorMap[props.data.color], 0.95),
                                },
                            ])
                    }
                },
                axisLine: {
                    show: true,
                    roundCap: false,
                    lineStyle: {
                        width: props.option.progressWidth,
                        color: [
                            [0, changeColor(colorMap[props.data.color], 0.05)],
                            [1, changeColor(colorMap[props.data.color], 0.2)]
                        ]
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                title: {
                    show: false
                },
                pointer: {
                    show: false
                },
                detail: {
                    show: false
                },
                tooltip: {
                    show: true
                },
                data: [
                    {
                        value: props.data.progess
                    }
                ]
            }
        ]
    }
});

const len = ref('0px');
const top = ref('0px');
const left = ref('0px');
onMounted(() => {
    const w = chartRef.value.offsetWidth;
    const h = chartRef.value.offsetHeight;
    len.value = `${w > h? h : w}px`;
    console.error('w:', w, 'h:', h)
    if (w > h) {
        left.value = `${(w - h) / 2}px`;
        top.value = `0px`;
    } else {
        left.value = `0px`;
        top.value = `${(h - w) / 2}px`;
    }
});
</script>

<style lang="scss" scoped>
.chart {
    position: relative;
    width: 100%;
    height: 100%;
    .img-gauge {
        position: absolute;
    }
    .img-bg {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat; /* 不重复背景图 */
        background-position: center center; /* 背景图居中 */
        background-size: 100% 100%; /* 背景图铺满整个元素 */
        .txtbox {
            position: relative;
            width: 50%;
            height: 32%;
            display: flex;
            flex-direction: column;
            .row1 {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    font-size: 20px;
                    font-family: YouSheBiaoTiHei;
                    font-weight: 500;
                    color: transparent;
                    background-clip: text; // 裁剪背景到文字区域
                    -webkit-background-clip: text; // 兼容 WebKit 浏览
                }
            }
            .row2 {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    background: linear-gradient(180deg,#ffffff 19%, #ffb215 66%);
                    font-size: 20px;
                    font-weight: 600;
                    color: transparent;
                    line-height: 29px;
                    text-shadow: 0px 0px 28px 0px rgba(123,213,255,0.61);
                    background-clip: text; // 裁剪背景到文字区域
                    -webkit-background-clip: text; // 兼容 WebKit 浏览
                }
            }
            .row3 {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    font-size: 22px;
                    font-family: YouSheBiaoTiHei;
                    font-weight: 500;
                    text-align: center;
                    color: #ffffff;
                    text-shadow: 0px 2px 4px 0px rgba(0,0,0,0.50);
                }
            }
        }
    }
    .red {
        background-image: url("~assets/img/total/total-redbg1.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(254,14,14,1.00) 12%, rgba(255,184,184,0.99) 37%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
    .blue {
        background-image: url("~assets/img/total/total-bluebg1.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(14,145,254,1.00) 12%, rgba(184,225,255,0.99) 38%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
    .yellow {
        background-image: url("~assets/img/total/total-yellowbg1.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(254,182,14,1.00) 12%, rgba(255,230,184,0.99) 37%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
    .green {
        background-image: url("~assets/img/total/total-greenbg1.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(77, 255, 221, 1) 12%, rgba(184,255,184,0.99) 38%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
}
</style>