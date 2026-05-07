/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-21 11:44:25
 * @LastEditTime: 2023-01-06 13:41:33
 * @Description:
 */
import {
  computed,
  onMounted,
  onBeforeMount,
  ref,
  reactive,
  nextTick,
  onBeforeUnmount,
} from "vue"
import worldMap from "/public/map/json/chinaWorld.json"
import chinaContourMap from "/public/map/json/china-contour.json"
import * as echarts from "echarts"
import { use } from "echarts/core"
import config from "../../config"
import { getEnCountry, getCnCountry, getCoord2 } from "@/libs/worldsForMap"
import { getNationalPng, getCountryImg } from "@/libs/country"
import { useTimeoutFn, useDebounceFn } from "@vueuse/core"
import ChinaCity from "/public/map/coords/ChinaCity"
import ChinaNameMap from "/public/map/coords/ChinaNameMap"
import WorldCountry from "/public/map/coords/WorldCountry1"
import { formatNum } from "@/libs/util"

const { tooltip } = config
const baseOption = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  boundingCoords: [
    [-25, -90],
    [335, 90],
  ],
  center: [156.168, -8],
  roam: true,
  zoom: 0.71,
  aspectScale: 0.75,
}
const seriesOption = {
  effectScatter: {
    type: "effectScatter",
    coordinateSystem: "geo",
    geoIndex: 0,
    showEffectOn: "render",
    rippleEffect: {
      number: 3, // 波纹的数量。
      period: 5, // 动画的周期，秒数。
      scale: 3, // 动画中波纹的最大缩放比例。
      brushType: "stroke",
    },
    itemStyle: {
      color: "#FFEF4A",
    },
    emphasis: {
      label: {
        show: false,
        scale: true
      },
    },
    label: {
      show: false,
      position: "right", //显示位置
      offset: [5, 0], //偏移设置
      formatter: function (params) {
        let name = getNationalPng(getCnCountry(params.data.name))
        if (name) {
          return (
            "{value|" +
            getCnCountry(params.data.name) +
            "}"
          )
        } else {
          return "{value|" + params.data.name + "}"
        }
      },
      fontSize: 13,
      rich: {
        value: {
          lineHeight: 15,
          color: "#fff",
          fontFamily: "DS-Digital",
          backgroundColor: "#2558ab",
          borderColor: "#9ccbf3",
          borderWidth: 1,
          shadowColor: "rgba(7,41,92,0.65)",
          shadowOffsetY: 4,
          shadowOffsetX: 0,
          shadowBlur: 2,
          padding: [4, 4],
        },
        ...getCountryImg(),
      },
    },
    zlevel: 4,
    tooltip: {
      show: true,
      formatter: function (params) {
        const data = params.data.value[3]
        if (data.type === "start") {
          return `<div style="font-size:14px;">
          <p>跨境用户所在地：<span style="color:#3AFFED">${data.name}</span></p>
          <p>通信行为：<span style="color:#1ECEFF">${formatNum(
            Number(data.value)
          )}</span></p>
          </div>
          `
        }
        if (data.type === "end") {
          return `<div style="font-size:14px;">
          <p>跨境行为目的地：<span style="color:#FFC62A">${data.name}</span></p>
          <p>通信行为：<span style="color:#1ECEFF">${formatNum(
            Number(data.value)
          )}</span></p>
          </div>
          `
        }
      },
    },
    data: [],
  },
  lines: {
    type: "lines",
    coordinateSystem: "geo",
    geoIndex: 0,
    zlevel: 3,
    effect: {
      show: true,
      symbol: "arrow",
      period: 10,
      // trailLength: 0,
      color: "#FFf",
      symbolSize: 5,
    },
    label: {
      show: false,
    },
    emphasis: {
      label: {
        show: true,
      },
    },
    lineStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: "rgba(255,198,42,0.5) ", // 0% 处的颜色
          },
          {
            offset: 1,
            color: "rgba(255,58,47,0.4)", // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      width: 1,
      type: "solid",
      curveness: 0.5,
    },
    tooltip: {
      show: true,
      formatter: function (params) {
        const data = params.data.data
        return `<div style="font-size:14px;">
          <p>用户所在地：<span style="color:#3AFFED">${data.source}</span></p>
          <p>访问目的地：<span style="color:#FFC62A">${data.target}</span></p>
          <p>访问次数：<span style="color:#1ECEFF">${formatNum(
          Number(data.value)
        )}</span></p>
          </div>
          `
      },
    },
    data: [],
  },
}

let fullImage = new Image()

function createBg (chart, ininOption) {
  let img = new Image()
  img.src = require("@/assets/img/echarts/map-texture.png")

  img.crossOrigin = "anonymous"
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = ininOption.width
  canvas.height = ininOption.height
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    fullImage.src = canvas.toDataURL("image/png", 2)
  }
}

export function useCreateWorld (props, emits) {
  const mapChart = ref(null)
  const initOption = reactive({
    width: 1418,
    height: 638,
  })
  const series = computed(() => {
    let list = [],
      lines = [],
      effectScatter = []
    if (props.startPoint) {
      props.startPoint.forEach((item) => {
        effectScatter.push({
          name: item.name,
          value: [...ChinaCity[ChinaNameMap[item.name]], item.value, item],
        })
      })
    }
    if (props.endPoint) {
      props.endPoint.forEach((item) => {
        if (WorldCountry[item.name]) {
          effectScatter.push({
            name: item.name,
            value: [...WorldCountry[item.name], item.value, item],
          })
        }
      })
    }
    if (props.lines) {
      props.lines.forEach((item) => {
        if (ChinaCity[ChinaNameMap[item.source]] && WorldCountry[item.target]) {
          lines.push({
            coords: [ChinaCity[ChinaNameMap[item.source]], WorldCountry[item.target]],
            value: item.value,
            data: item,
          })
        }
      })
    }
    if (effectScatter.length > 0) {
      list.push({
        ...seriesOption.effectScatter,
        data: effectScatter,
      })
    }
    if (lines.length > 0) {
      list.push({
        ...seriesOption.lines,
        data: lines,
      })
    }
    return list
  })
  const option = computed(() => {
    return {
      tooltip: {
        ...tooltip,
        trigger: "item",
        show: false,
      },
      geo: [
        {
          show: true,
          map: "world",
          ...baseOption,
          zlevel: 3,
          itemStyle: {
            areaColor: "#2558ab",
            borderWidth: 1,
            borderColor: "rgba(78,198,253,1)",
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            },
            itemStyle: {
              opacity: 1,
            },
          },
        },
      ],
      series: [...series.value],
    }
  })

  onBeforeMount(() => {
    echarts.registerMap("world", worldMap)
    echarts.registerMap("chinaContour", chinaContourMap)
  })

  onMounted(() => {
    handleResize()
    window.addEventListener(
      "resize",
      useDebounceFn(() => {
        handleResize()
      }, 500),
      false
    )
  })

  onBeforeUnmount(() => {
    window.removeEventListener(
      "resize",
      useDebounceFn(() => {
        handleResize()
      }, 500),
      false
    )
  })

  onMounted(() => {
    nextTick(() => {
      if (!mapChart.value?.$el) return
      initOption.width = mapChart.value?.$el.offsetWidth
      initOption.height = mapChart.value?.$el.offsetHeight
      createBg(mapChart.value, initOption)
      useTimeoutFn(() => {
        mapChart.value.setOption(option.value)
      }, 1000)
    })
  })

  function handleResize () {
    nextTick(() => {
      if (!mapChart.value?.$el) return
      initOption.width = mapChart.value?.$el.offsetWidth
      initOption.height = mapChart.value?.$el.offsetHeight
      createBg(mapChart.value, initOption)
      useTimeoutFn(() => {
        mapChart.value.setOption(option.value)
      }, 1000)
    })
  }

  function handleGeoroam (params) {
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

  return {
    option,
    mapChart,
    initOption,
    handleGeoroam,
  }
}
