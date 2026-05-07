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
  nextTick
} from 'vue'
import worldMap from '/public/map/json/world.json'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import config from '../../config'
import { getEnCountry, getCnCountry, getCoord } from '@/libs/worldsForMap'
import { getNationalPng, getCountryImg } from '@/libs/country'
const { visualMap, tooltip } = config

const baseOption = {
  left: 0,
  top: 80,
  right: 0,
  bottom: 0,
  boundingCoords: [
    [-180, 90],
    [180, -90]
  ],
  center: [10.168, -17.989],
  roam: true,
  zoom: 0.9
}
const seriesOption = {
  map: {
    type: "map",
    geoIndex: 0,
    map: "china",
    zlevel: 4,
    label: {
      show: false,
    },
    data: [],
  }
}

let fullImage = new Image()

function createBg (chart, ininOption) {
  let img = new Image()
  img.src = require('/public/map/img/2k_earth.jpg')
  // img.src = 'https://img02.mockplus.cn/idoc/image/2021-12-24/4a82c250-64be-11ec-b42f-c5c17ba47dad.jpg'
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = ininOption.width
  canvas.height = ininOption.height
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    fullImage.src = canvas.toDataURL('image/png', 2)
  }
}

export function useCreateWorld (props, emits) {
  const mapChart = ref(null)
  const initOption = reactive({
    width: 1418,
    height: 638
  })
  let mapData = ref([])
  const series = computed(() => {
    let list = []
    if (props['map']?.data?.length > 0) {
      let arr = []
      props['map'].data.forEach((item, index) => {
        if (getEnCountry(item.name)) {
          mapData.value.push({
            ...item,
            name: getEnCountry(item.name),
            value: item.value
          })
        } else {
          arr.push({
            en: '',
            cn: item.name,
            cp: []
          })
          // console.log('国家名称没对应上', item.name)
        }
      })
      console.log(JSON.stringify(arr))
      list.push({ ...seriesOption['map'], ...props['map'], data: [...mapData.value] })
    }
    return list
  })


  const option = computed(() => {
    return {
      visualMap: {
        ...visualMap,
        ...props.option?.visualMap,
      },
      tooltip: {
        ...tooltip,
        trigger: 'item',
        ...props.option?.tooltip,
      },
      geo: [
        {
          show: true,
          map: 'world',
          ...baseOption,
          zlevel: 3,
          itemStyle: {
            areaColor: 'rgba(77, 213, 255, 0.3)',
            borderWidth: 1,
            borderColor: 'rgba(58, 161, 196)'
          },
          label: {
            show: false,
            color: '#fff',
            padding: [0, 0, 5, 0],
            formatter: (params) => {
              const value = mapData.value.find(item => item.name == params.name)
              if (!value) return getCnCountry(params.name)
              return getCnCountry(params.name)
            },
            position: 'middle',
          },
          emphasis: {
            label: {
              show: true,
            }
          },
          // label: {
          //   show: false
          // },
          // emphasis: {
          //   label: {
          //     show: false
          //   },
          //   itemStyle: {
          //     opacity: 1
          //   }
          // }
        },
        {
          show: true,
          map: 'world',
          ...baseOption,
          roam: false,
          zlevel: 1,
          itemStyle: {
            areaColor: {
              image: fullImage,
              repeat: 'no-repeat'
            },
            borderWidth: 0,
            opacity: 1
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            },
            itemStyle: {
              areaColor: {
                image: fullImage,
                repeat: 'no-repeat'
              },
              borderWidth: 0,
              opacity: 1
            }
          },
          regions: [
            {
              name: 'China'
            }
          ]
        }
      ],
      series: [...series.value]
    }
  })

  onBeforeMount(() => {
    echarts.registerMap('world', worldMap)
  })

  onMounted(() => {
    nextTick(() => {
      initOption.width = mapChart.value.$el.offsetWidth
      initOption.height = mapChart.value.$el.offsetHeight
      if (mapChart.value) createBg(mapChart.value, initOption)
    })
  })

  function handleGeoroam (params) {
    let option = mapChart.value.getOption()
    if (params.zoom) {
      option.geo.forEach(item => {
        item.zoom = option.geo[0].zoom
        item.center = option.geo[0].center
      })
    } else {
      option.geo.forEach(item => {
        item.center = option.geo[0].center
      })
    }
    mapChart.value.setOption(option)
  }

  return {
    option,
    mapChart,
    initOption,
    handleGeoroam
  }
}
