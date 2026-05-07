<template>
  <div class="new-pie" :style="{ '--legend-font-size': legendFontSize + 'px' }">
    <div class="chart">
      <v-chart
        class="chart"
        ref="pieChartRef"
        :option="option"
        :autoresize="true"
      />
    </div>
    <div class="legend">
      <div class="legend-box">
        <div class="legend-item" v-for="(item, index) in data" :key="index">
          <div class="icon-box" :style="{ borderColor: innerColors[index] }">
            <div
              class="icon-dot"
              :style="{ backgroundColor: innerColors[index] }"
            ></div>
          </div>
          <div class="content">
            <p>{{ item.name }}</p>
            <p>
              <span style="color: #ffd259"
                >{{
                  item.value > 9999
                    ? (item.value / 10000).toFixed(1) + "万"
                    : item.value
                }}{{ unit }}</span
              >
              <span style="margin-left: 12px; color: #5df5ff"
                >({{ ((item.value * 100) / total).toFixed(1) }}%)</span
              >
            </p>
          </div>
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
import { useIntervalFn, useTimeoutFn } from "@vueuse/core";
const pieChartRef = ref(null);

const props = defineProps({
  option: {
    type: Object,
    default: () => {
      return {
        innerRaduis: ["70%", "90%"],
        outerRaduis: ["89%", "100%"],
        lineRaduis: ["65%", "66%"],
        shadowRadius: "61%",
        colors: [
          "rgba(255, 66, 66, 1)",
          "rgba(255, 128, 53, 1)",
          "rgba(141, 72, 199, 1)",
          "rgba(88, 79, 255, 1)",
          "rgba(255, 189, 67, 1)",
          "rgba(25, 220, 255, 1)",
          "rgba(255, 103, 135, 1)",
          "rgba(103, 182, 255, 1)",
          "rgba(103, 255, 236, 1)",
          "rgba(255, 219, 103, 1)",
          "rgba(66, 181, 216, 1)",
          "rgba(191, 174, 34, 1)",
          "rgba(58, 137, 81, 1)",
          "rgba(255, 58, 47, 1)",
          "rgba(124, 89, 233, 1)",
          "rgba(215, 116, 52, 1)",
          "rgba(200, 51, 113, 1)",
          "rgba(115, 2, 235, 1)",
          "rgba(128, 104, 176, 1)",
          "rgba(255, 244, 92, 1)",
          "rgba(130, 132, 255, 1)",
          "rgba(0, 212, 135, 1)",
          "rgba(255, 45, 21, 1)",
          "rgba(255, 128, 53, 1)",
        ],
      };
    },
  },
  needCarousel: {
    type: Boolean,
    default: true,
  },
  carouselTime: {
    type: Number,
    default: 2,
  },
  chartName: {
    type: String,
    default: "网络攻击告警类型分布",
  },
  data: {
    type: Array,
    default: () => [
      // {
      //   name: "漏洞利用",
      //   value: 320,
      // },
      // {
      //   name: "蠕虫病毒",
      //   value: 240,
      // },
      // {
      //   name: "DDoS攻击",
      //   value: 149,
      // },
      // {
      //   name: "暴力破解",
      //   value: 220,
      // },
      // {
      //   name: "木马病毒",
      //   value: 170,
      // },
      // {
      //   name: "XSS攻击",
      //   value: 159,
      // },
      // {
      //   name: "类别1",
      //   value: 149,
      // },
      // {
      //   name: "类别2",
      //   value: 220,
      // },
      // {
      //   name: "类别3",
      //   value: 170,
      // },
      // {
      //   name: "类别4",
      //   value: 159,
      // },
    ],
  },
  unit: {
    type: String,
    default: "",
  },
  legendFontSize: {
    type: Number,
    default: 20,
  },
});

const total = computed(() => {
  return props.data.reduce((acc, cur) => acc + cur.value, 0);
});

function generateColorArray(data, colors) {
  const dataLength = data.length;
  const colorsLength = colors.length;
  let newColors = [];
  if (dataLength <= colorsLength) {
    // 如果 data 数组的长度小于或等于 colors 数组的长度，直接取前 dataLength 个颜色
    newColors = colors.slice(0, dataLength);
  } else {
    // 如果 data 数组的长度大于 colors 数组的长度，重复 colors 数组直到满足 data 数组的长度
    for (let i = 0; i < dataLength; i++) {
      newColors.push(colors[i % colorsLength]);
    }
  }
  return newColors;
}

function updateColorAlpha(colors, alpha) {
  return colors.map((color) => {
    // 使用正则表达式提取 RGB 值
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
    if (rgbaMatch) {
      const r = rgbaMatch[1];
      const g = rgbaMatch[2];
      const b = rgbaMatch[3];
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color; // 如果格式不匹配，返回原始颜色
  });
}

const innerColors = computed(() => {
  return generateColorArray(props.data, props.option.colors);
});

const outerColors = computed(() => {
  return updateColorAlpha(innerColors.value, 0.4);
});

const option = computed(() => {
  const opts = {
    ...props.option,
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(11,36,57,0.80)",
      borderColor: "#4dd5ff",
      textStyle: {
        color: "#ffffff",
        fontSize: 20,
      },
    },
    series: [
      {
        name: props.chartName,
        z: 20,
        type: "pie",
        radius: props.option.innerRaduis,
        avoidLabelOverlap: false,
        percentPrecision: 1,
        itemStyle: {
          color: function (colors) {
            return innerColors.value[colors.dataIndex];
          },
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        data: props.data.map((item, index) => {
          return {
            label: {
              show: index === 0 ? true : false,
              position: "center",
              formatter: (params) => {
                return `{num|${formatNumber(params.value)}(${
                  params.percent
                }%)}\n{text|${params.name}}`;
              },
              rich: {
                num: {
                  fontSize: 20,
                  align: "center",
                  fontFamily: '"YouSheBiaoTiHei", sans-serif',
                  textShadowColor: "rgba(0,0,0,0.2)",
                  textShadowBlur: 6,
                  color: "#ffffff",
                  padding: [0, 0, 10, 0],
                },
                text: {
                  fontSize: 20,
                  color: "#ffffff",
                  align: "center",
                  padding: [10, 30, 10, 30],
                  backgroundColor: new echarts.graphic.LinearGradient(
                    1,
                    0,
                    0,
                    0,
                    [
                      {
                        offset: 0,
                        color: "rgba(73,159,185,0)",
                      },
                      {
                        offset: 0.23,
                        color: "rgba(73,159,185,0.3)",
                      },
                      {
                        offset: 0.5,
                        color: "rgba(73,159,185,0.6)",
                      },
                      {
                        offset: 0.77,
                        color: "rgba(73,159,185,0.3)",
                      },
                      {
                        offset: 1,
                        color: "rgba(73,159,185,0)",
                      },
                    ]
                  ),
                },
              },
            },
            ...item,
          };
        }),
      },
      // {
      //   name: "outerpie",
      //   type: "pie",
      //   radius: props.option.outerRaduis,
      //   avoidLabelOverlap: false,
      //   tooltip: {
      //     show: false,
      //   },
      //   emphasis: {
      //     disabled: true,
      //   },
      //   label: {
      //     show: false,
      //   },
      //   labelLine: {
      //     show: false,
      //   },
      //   itemStyle: {
      //     color: function (colors) {
      //       return outerColors.value[colors.dataIndex];
      //     },
      //   },
      //   data: props.data,
      // },
      // {
      //   type: "pie",
      //   name: "内层细圆环",
      //   radius: props.option.lineRaduis,
      //   hoverAnimation: true,
      //   startAngle: 0,
      //   clockWise: false,
      //   itemStyle: {
      //     color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      //       {
      //         offset: 0,
      //         color: "rgba(73,159,185,0.45)",
      //       },
      //       {
      //         offset: 1,
      //         color: "rgba(73,159,185,0.8)",
      //       },
      //     ]),
      //   },
      //   label: {
      //     show: false,
      //   },
      //   data: [100],
      // },
      {
        name: "阴影圆",
        type: "pie",
        startAngle: 0,
        radius: props.data.shadowRadius,
        clockWise: false,
        hoverAnimation: false,
        center: ["50%", "50%"],
        itemStyle: {
          normal: {
            labelLine: {
              show: false,
            },
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              {
                offset: 1,
                color: "rgba(129, 197, 200, 0.3)",
              },
              {
                offset: 0,
                color: "rgba(129, 197, 200, 0.1)",
              },
            ]),
            shadowBlur: 10,
          },
        },
        data: [
          {
            value: 100,
          },
        ],
      },
    ],
  };
  return opts;
});

function carousel() {
  if (!props.needCarousel) return;

  let currIndex = 0,
    len = props.data.length;

  useIntervalFn(function () {
    currIndex++;
    if (currIndex === len) {
      currIndex = 0;
    }
    if (!pieChartRef.value) return;
    // pieChartRef.value.dispatchAction({
    //   type: "hideTip",
    //   seriesIndex: 0,
    //   dataIndex: currIndex === 0 ? len - 1 : currIndex - 1,
    // });
    // pieChartRef.value.dispatchAction({
    //   type: "showTip",
    //   seriesIndex: 0,
    //   dataIndex: currIndex === len ? 0 : currIndex,
    // });
    // 确保索引正确
    const prevIndex = currIndex === 0 ? len - 1 : currIndex - 1;
    const currentIndex = currIndex >= len ? 0 : currIndex;

    // 先取消上一个高亮
    pieChartRef.value.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: prevIndex,
    });

    // 更新标签显示状态
    option.value.series[0].data.forEach((d, i) => {
      d.label = d.label || {};
      if (i === currentIndex) {
        d.label.show = true;
      } else {
        d.label.show = false;
      }
    });

    // 应用更新后的配置
    pieChartRef.value.setOption(option.value, true);

    // 高亮当前项
    setTimeout(() => {
      pieChartRef.value.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
    }, 50);
  }, props.carouselTime * 1000);
}

function formatNumber(value) {
  const num = Number(value);
  if (isNaN(num)) return;

  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  } else {
    return num.toLocaleString();
  }
}

onMounted(() => {
  useTimeoutFn(() => {
    carousel();
  }, 1000);
});
</script>

<style lang="scss" scoped>
.new-pie {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  .chart {
    width: 60%;
  }
  .legend {
    position: absolute;
    width: 60%;
    height: 100%;
    right: 0px;
    overflow-y: auto;
    .legend-box {
      position: absolute;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      .legend-item {
        padding-left: 15px;
        display: flex;
        position: relative;
        width: 100%;
        border: 1px solid;
        border-image: linear-gradient(
            214deg,
            rgba(23, 198, 241, 0),
            rgba(23, 198, 241, 0.1),
            rgba(23, 198, 241, 0.4)
          )
          1 1;
        background: linear-gradient(
          354deg,
          rgba(60, 163, 190, 0) 0%,
          rgba(60, 163, 190, 0.1) 37%,
          rgba(60, 163, 190, 0.2) 100%
        );
        min-height: 36px;
        height: auto;
        margin-bottom: 10px;
        align-items: center;
        &:last-child {
          margin-bottom: 0;
        }
        .icon-box {
          width: 16px;
          height: 16px;
          border-radius: 1px;
          border-width: 1px;
          border-style: solid;
          margin-right: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-dot {
            width: 10px;
            height: 10px;
            border-radius: 1px;
          }
        }
        .content > p {
          color: #fff;
          font-size: var(--legend-font-size);
        }
      }
    }
  }
}
</style>
