<template>
    <v-chart class="chart" ref="ringChartRef" :option="ringOpt" :autoresize="true" />
    <v-chart class="chart" ref="gaugeChartRef" :option="option" :autoresize="true" />
</template>

<script setup>
/* eslint-disable */
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'

const ColorUtils = require('color');

const gaugeChartRef = ref(null);
const ringChartRef = ref(null);

function changeColor(color, alpha) {
    return ColorUtils(color).alpha(alpha).rgb().string();
}

const props = defineProps({
    option: {
        type: Object,
        default: () => {
            return {
                gaugeRadius: '80%',
                progressWidth: 16,
                axisTickLength: 6,
                axisTickWidth: 1,
                axisTickDistance: -22,
                innerLineRadius: ["51%", "52%"],
                innerCircleRadius: '48%',
                ringRadius: 0.9,
                ringShapeRadius: 3,
                fontSize: 18,
                fontColor: '#fff'
            }
        }
    },
    data: {
        type: Number,
        default: 68
    },
    color: {
        type: String,
        default: 'rgba(255, 58, 47, 1)'
    }
});
const angle = ref(0); //角度，用来做简单的动画效果的
//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
function getCirlPoint(x0, y0, r, angle) {
    let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
    let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
    return {
        x: x1,
        y: y1,
    };
}
const option = computed(() => {
    return  {
        series: [
            {
                type: 'gauge',
                startAngle: 270,
                endAngle: -90,
                radius: props.option.gaugeRadius,
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
                                    color: changeColor(props.color, 0.2),
                                },
                                {
                                    offset: 1,
                                    color: changeColor(props.color, 0.95),
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
                            [0, changeColor(props.color, 0.05)],
                            [1, changeColor(props.color, 0.2)]
                        ]
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 3,
                    length: props.option.axisTickLength,
                    lineStyle: {
                        color: changeColor(props.color, 0.75),
                        width: props.option.axisTickWidth,
                        type: "solid",
                    },
                    distance: props.option.axisTickDistance,
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
                    offsetCenter: ['0%', '0%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return '{value|' + value + '%}';
                    },
                    rich: {
                        value: {
                            fontSize: props.option.fontSize,
                            align: 'center',
                            fontFamily: '"YouSheBiaoTiHei", sans-serif',
                            textShadowColor: 'rgba(0,0,0,0.2)',
                            textShadowBlur: 6,
                            color: props.option.fontColor,
                        }
                    }
                },
                data: [
                    {
                        value: props.data
                    }
                ]
            },
            {
              type: "pie",
              name: "内层细圆环",
              radius: props.option.innerLineRadius,
              hoverAnimation: true,
              startAngle:0,
              clockWise: false,
              itemStyle: {
                color: changeColor(props.color, 0.7)
              },
              label: {
                show: false
              },
              data: [100]
            },
            {
              name: "",
              type: "pie",
              startAngle: 0,
              radius: props.option.innerCircleRadius,
              clockWise: false,
              hoverAnimation: false,
              center: ["50%", "50%"],
              itemStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                {
                    offset: 1,
                    color: changeColor(props.color, 0.2)
                },
                {
                    offset: 0,
                    color: changeColor(props.color, 0.05)
                }
                ]),
                shadowBlur: 10
              },
              data: [
                {
                  value: 100
                }
              ]
            },
        ]
    }
});

const ringOpt = computed(() => {
    return {
        series: [
            {
                name: 'ring5',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: (Math.min(api.getWidth(), api.getHeight()) / 2) * props.option.ringRadius,
                            startAngle: ((0 + angle.value) * Math.PI) / 180,
                            endAngle: ((90 + angle.value) * Math.PI) / 180,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7),
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: 'ring5', //        //colors[0]dot
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * props.option.ringRadius;
                    let point = getCirlPoint(x0, y0, r, 90 + angle.value);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: props.option.ringShapeRadius,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7),
                            fill: changeColor(props.color, 0.7),
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            // 蓝色
            {
                name: 'ring5',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: (Math.min(api.getWidth(), api.getHeight()) / 2) * props.option.ringRadius,
                            startAngle: ((180 + angle.value) * Math.PI) / 180,
                            endAngle: ((270 + angle.value) * Math.PI) / 180,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7),
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: 'ring5', // 蓝色
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * props.option.ringRadius;
                    let point = getCirlPoint(x0, y0, r, 180 + angle.value);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: props.option.ringShapeRadius,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7), //绿
                            fill: changeColor(props.color, 0.7),
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: 'ring5',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: (Math.min(api.getWidth(), api.getHeight()) / 2) * (props.option.ringRadius + 0.05),
                            startAngle: ((270 + -angle.value) * Math.PI) / 180,
                            endAngle: ((40 + -angle.value) * Math.PI) / 180,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7),
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            // 橘色
            {
                name: 'ring5',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: (Math.min(api.getWidth(), api.getHeight()) / 2) * (props.option.ringRadius + 0.05),
                            startAngle: ((90 + -angle.value) * Math.PI) / 180,
                            endAngle: ((220 + -angle.value) * Math.PI) / 180,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7),
                            fill: 'transparent',
                            lineWidth: 1.5,
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: 'ring5',
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * (props.option.ringRadius + 0.05);
                    let point = getCirlPoint(x0, y0, r, 90 + -angle.value);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: props.option.ringShapeRadius,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7), //粉
                            fill: changeColor(props.color, 0.7),
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
            {
                name: 'ring5', //绿点
                type: 'custom',
                coordinateSystem: 'none',
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * (props.option.ringRadius + 0.05);
                    let point = getCirlPoint(x0, y0, r, 270 + -angle.value);
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: props.option.ringShapeRadius,
                        },
                        style: {
                            stroke: changeColor(props.color, 0.7), //绿
                            fill: changeColor(props.color, 0.7),
                        },
                        silent: true,
                    };
                },
                data: [0],
            },
        ]
    }
});

let timerFn = null
function draw() {
    timerFn = useIntervalFn(function() {
        angle.value = angle.value + 3;
        ringChartRef.value.setOption(ringOpt.value, true);
    },100)
}

onMounted(() => {
    draw()
    useTimeoutFn(() => {
        draw()
    }, 500)
    console.error(gaugeChartRef.value.getWidth(), gaugeChartRef.value.getHeight())
    console.error(gaugeChartRef.value.getDom())
});

onUnmounted(() => {
    timerFn && timerFn.pause();
})
</script>

<style lang="scss" scoped>
.chart {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>