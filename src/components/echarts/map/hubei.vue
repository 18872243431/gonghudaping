<template>
  <v-chart class="chart" ref="mapChart" :option="option" :autoresize="true" @georoam="handleGeoroam"
    @mouseover="mapMouseover" @click="mapClick" @legendselectchanged="legendselectchanged" />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { MapChart } from 'echarts/charts'
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import "echarts-gl" //3D地图插件
import { TooltipComponent } from 'echarts/components'
import { useTimeoutFn, useDebounceFn } from "@vueuse/core";
import {
  nextTick,
  ref,
  computed,
  onBeforeMount,
  reactive,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import hubei from '/public/map/json/湖北省.json'
import config from '../config'
import seriesOption from '../config/seriesOption'

use([CanvasRenderer, MapChart, TooltipComponent])

const { visualMap, legend, tooltip } = config
const mapChart = ref(null)
const baseOption = {
  zoom: 1,
  roam: true,
}
const props = defineProps({
  option: { type: Object, default: () => ({}) },
  scatter: {
    type: Object,
    default: () => ({}),
  },
  effectScatter: {
    type: Object,
    default: () => ({}),
  },
  map: {
    type: Object,
    default: () => ({}),
  },
  lines: {
    type: Object,
    default: () => ({}),
  },
})
const emits = defineEmits(['mapClick', 'mapMouseover', 'legendselectchanged'])
// const series = computed(() => {
//     let list = []
//     const types = ['map', 'scatter', 'effectScatter', 'lines']
//     types.forEach((item) => {
//         if (Array.isArray(props[item]) && props[item].length > 0) {
//             props[item].forEach((itm) => {
//                 list.push({ ...seriesOption[item], ...itm })
//             })
//         } else {
//             if (props[item]?.data?.length > 0) {
//                 list.push({ ...seriesOption[item], ...props[item] })
//             }
//         }
//     })
//     return list
// })

let fullImage = new Image();
fullImage.setAttribute("crossOrigin", "anonymous");



async function createBg(chart, ininOption) {
  let img = new Image();
  img.src =
    "https://img02.mockplus.cn/idoc/image/2021-12-27/d113c0e0-66b1-11ec-8639-07842039f7f6.jpg";
  img.crossOrigin = "anonymous";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fullImage.src = canvas.toDataURL("image/png", 2);
  };
}



const option = computed(() => {
  let imgSrc = require("/public/map/img/earth_2k.jpg");
  return {
    visualMap: {
      ...visualMap,
      ...props.option?.visualMap,
    },
    legend: {
      selectedMode: true,
      ...legend,
      ...props.option?.legend,
    },
    tooltip: {
      ...tooltip,
      trigger: 'item',
      show: false,
      ...props.option?.tooltip,
    },
    // geo3D: {
    //     map: "hubei",
    //     roam: true,
    //     viewControl: {
    //         autoRotate: false,
    //         autoRotateAfterStill: 2,
    //         distance: 120,
    //         minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
    //         maxAlpha: 90, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
    //         minBeta: -360, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
    //         maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
    //         animation: false, // 是否开启动画。[ default: true ]
    //         animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
    //         animationEasingUpdate: "cubicInOut" // 过渡动画的缓动效果。[ default: cubicInOut ]
    //     },
    //     regionHeight: 2,
    //     itemStyle: {
    //         color: "skyblue",
    //         opacity: 0.8,
    //         borderWidth: 0.4,
    //         borderColor: "red"
    //         // areaColor: '#fff'
    //     },
    //     emphasis: {
    //         disabled: true, //是否可以被选中
    //         label: {
    //             //移入时的高亮文本
    //             show: true,
    //             color: "#333", //显示字体颜色变淡
    //             fontSize: 18 //显示字体变大
    //         },
    //         itemStyle: {
    //             color: "#ff7aff" //显示移入的区块变粉色
    //         }
    //     },
    //     label: {
    //         show: true,
    //         position: "top",
    //         color: "#111", //地图初始化区域字体颜色
    //         fontSize: 14,
    //         lineHeight: 16,
    //         textStyle: {
    //             color: "#fff", //地图初始化区域字体颜色
    //             fontSize: 12,
    //             opacity: 1,
    //             backgroundColor: "rgba(0,23,11,0)",
    //         },
    //     },
    //     shading: "lambert",
    //     light: {
    //         //光照阴影
    //         main: {
    //             // color: "#fff", //光照颜色
    //             intensity: 1, //光照强度
    //             //shadowQuality: 'high', //阴影亮度
    //             shadow: true, //是否显示阴影
    //             shadowQuality: "medium", //阴影质量 ultra //阴影亮度
    //             alpha: 55,
    //             beta: 22
    //         },
    //         ambient: {
    //             intensity: 0.7
    //         }
    //     }
    // },
    series: [
      {
        type: 'map3D',
        map: 'hubei',
        coordinateSystem: 'geo3D',
        shading: 'lambert',
        barSize: 10,
        minHeight: 1,
        itemStyle: {
          color: '#5E5FFF',
        },
        emphasis: {
          label: { show: true },
        },
        regionHeight: 1,
        itemStyle: {
          color: "skyblue",
          opacity: 0.8,
          borderWidth: 0.4,
          borderColor: "red",
          areaColor: {
            image: fullImage,
            repeat: "no-repeat",
          },
        },
        emphasis: {
          disabled: true, //是否可以被选中
          label: {
            //移入时的高亮文本
            show: true,
            color: "#333", //显示字体颜色变淡
            fontSize: 18 //显示字体变大
          },
          itemStyle: {
            color: "#ff7aff" //显示移入的区块变粉色
          }
        },
        label: {
          show: true,
          position: "top",
          color: "#111", //地图初始化区域字体颜色
          fontSize: 14,
          lineHeight: 16,
          textStyle: {
            color: "#111", //地图初始化区域字体颜色
            fontSize: 12,
            opacity: 1,
            backgroundColor: "rgba(0,23,11,0)",
          },
        },
        shading: "lambert",
        light: {
          //光照阴影
          main: {
            // color: "#fff", //光照颜色
            intensity: 1, //光照强度
            //shadowQuality: 'high', //阴影亮度
            shadow: true, //是否显示阴影
            shadowQuality: "medium", //阴影质量 ultra //阴影亮度
            alpha: 55,
            beta: 22
          },
          ambient: {
            intensity: 0.7
          }
        },
        material: {
          mainTexture: 'public/map/img/earth_2k.jpg', // 主要纹理图片路径
          // mainTexture: imgSrc, // 主要纹理图片路径
          alpha: 1, // alpha值，控制透明度，取值范围[0,1]
          beta: 0 // beta值，控制纹理偏移，取值范围[0,1]
        },
        data: []
      }
    ],
  }
})

function handleGeoroam(params) {
  let option = mapChart.value.getOption()
  if (params.zoom) {
    option.geo.forEach((item) => {
      item.zoom = option.geo[0].zoom
      item.center = option.geo[0].center
    })
  } else {
    option.geo.forEach((item) => {
      item.center = option.geo[0].center
    })
  }
  mapChart.value.setOption(option)
}

function handleResize() {
  nextTick(() => {
    if (!mapChart.value?.$el) return;
    createBg(mapChart.value);
    useTimeoutFn(() => {
      mapChart.value.setOption(option.value);
    }, 1000);
  });
}

function mapClick(params) {
  emits('mapClick', params)
}

function mapMouseover(params) {
  emits('mapMouseover', params)
}

function legendselectchanged(params) {
  emits('legendselectchanged', params.selected)
}

onBeforeMount(() => {
  echarts.registerMap('hubei', hubei)

})
onMounted(() => {
  handleResize();
  window.addEventListener(
    "resize",
    useDebounceFn(() => {
      handleResize();
    }, 500),
    false
  );
});

</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
  //   background: url(~assets/img/map-bg.png) no-repeat center / 100% 100%;
}
</style>
