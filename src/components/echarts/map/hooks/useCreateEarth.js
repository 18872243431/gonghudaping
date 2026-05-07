// import earthBg from '/public/map/img/earth_map.jpg'
import earthBg from '/public/map/img/earth_2k.jpg'
// import earthHightBg from '/public/map/img/earth-bg.jpg'
import earthHightBg from '/public/map/img/2k_earth.jpg'
import { computed, toRefs, ref, onBeforeMount, onMounted } from 'vue'
import * as echarts from 'echarts'
import worldMap from '/public/map/json/world.json'
import chinaMap from '/public/map/json/china.json'
import chinaContourMap from '/public/map/json/china-contour.json'
import { getEnCountry, getCnCountry, getCoord } from '@/libs/worldsForMap'
import { getNationalPng, getCountryImg } from '@/libs/country'

// const earthBg = require('@/assets/img/map/earth_2k.jpg')
// const earthHightBg = require('@/assets/img/map/2k_earth.jpg')

export function useCreateEarth(props) {
  // const { linesData } = toRefs(props)
  const earthChart = ref(null)
  const option3d = computed(() => {
    let lines = [], effectScatter = []
    props['linesData'].forEach((item, index) => {
      let dataItem = item
      dataItem[0].name = getEnCountry(dataItem[0].name)
      dataItem[1].name = getEnCountry(dataItem[1].name)
      var fromCoord = getCoord(dataItem[0].name)
      var toCoord = getCoord(dataItem[1].name)
      if (fromCoord && toCoord) {
        lines.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord],
          value: dataItem[1].value
        })
        effectScatter.push({
          name: dataItem[0].name,
          value: fromCoord
        })
        effectScatter.push({
          name: dataItem[1].name,
          value: toCoord.concat(dataItem[1].value)
        })
      }
    })
    effectScatter = Array.from(new Set(effectScatter))
    return {
      globe: {
        globeRadius: 100,
        globeOuterRadius: 100,
        environment: 'none',
        baseTexture: earthBg,
        heightTexture: earthHightBg,
        shading: 'color',
        left: '-5%',
        // shading: 'lambert',
        // shading: 'realistic',
        displacementScale: 0,
        // light: {
        //   main: {
        //     color: '#067AE5',
        //     intensity: 30,
        //     shadowQuality: 'high',
        //     shadow: true,
        //     alpha: 40,
        //     beta: -30,
        //   },
        //   ambient: {
        //     intensity: 20.6,
        //     color: '#7CCFFF',
        //   },
        // },
        viewControl: {
          alpha: 30,
          beta: 160,
          autoRotate: true,
          autoRotateAfterStill: 10,
          distance: 240,
          autoRotateSpeed: 5,
          zoomSensitivity: 1,
          rotateSensitivity: 10,
          panSensitivity: 10
        },
        postEffect: {
          enable: true,
          SSAO: {
            radius: 1,
            intensity: 1,
            enable: true
          }
        },
        layers: [
          {
            type: 'blend',
            texture: createTexture(),
            blendTo: 'emission',
            intensity: 1
          }
        ]
      },
      series: [
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          blendMode: 'light',
          // symbol:
          //   'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#FF3A2F'
          },
          emphasis: {
            label: {
              show: false
            }
          },
          label: {
            show: true,
            position: 'right', //显示位置
            offset: [5, 0], //偏移设置
            formatter: function(params) {
              let name = getNationalPng(getCnCountry(params.data.name))
              return (
                '{' +
                name +
                '| }' +
                '  ' +
                '{value|' +
                getCnCountry(params.data.name) +
                '}'
              )
              // return  "{value|" + params.data.value[2] + getCnCountry(params.data.name) + "}" + "  "  + "{" + name + "| }"
            },
            fontSize: 13,
            rich: {
              value: {
                lineHeight: 15,
                color: '#F8FFFF'
              },
              ...getCountryImg()
            }
          },
          data: effectScatter
        },
        {
          name: 'lines3D',
          type: 'lines3D',
          coordinateSystem: 'globe',
          effect: {
            show: true,
            period: 2,
            trailWidth: 2,
            trailLength: 0.15,
            trailOpacity: 0.5,
            trailColor: '#FFE938'
          },
          blendMode: 'lighter',
          lineStyle: {
            width: 1,
            color: '#FF3A2F',
            type: 'dashed',
            opacity: 1
          },
          
          data: lines,
          silent: false
        }
      ]
    }
  })

  function createTexture() {
    const canvas = document.createElement(`canvas`)
    const chart = echarts.init(canvas, null, {
      width: 4096,
      height: 2048
    })
    chart.setOption({
      backgroundColor: 'rgba(0,0,0,0)',
      geo: [
        {
          show: true,
          map: 'world',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          boundingCoords: [
            // 定位左上角经纬度
            [-180, 90],
            // 定位右下角经纬度
            [180, -90]
          ],
          zlevel: 1,
          roam: false,
          itemStyle: {
            areaColor: 'rgba(0,0,0,0)',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0)',
            opacity: 1
          },
          regions: [
            {
              name: 'China',
              itemStyle: {
                borderWidth: 4,
                borderColor: 'rgba(27,130,183,1)'
              }
            }
          ]
        },
        {
          type: 'map',
          map: 'china',
          zlevel: 10,
          roam: false,
          itemStyle: {
            areaColor: 'rgba(27,130,183,1)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,1)',
            opacity: 1
          },
          regions: [
            {
              // 特殊处理 海南岛缩略图 单层展示
              name: '南海诸岛',
              value: 0,
              itemStyle: {
                opacity: 0,
                label: {
                  show: false
                }
              },
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            }
          ],
          label: {
            show: true,
            color: '#ffffff'
          },
          emphasis: {
            label: {
              show: true
            }
          },
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          boundingCoords: [
            // 定位左上角经纬度
            [-180, 90],
            // 定位右下角经纬度
            [180, -90]
          ],
          zlevel: 2
        }
      ]
    })
    return chart
  }

  onBeforeMount(() => {
    echarts.registerMap('world', worldMap)
    echarts.registerMap('china', chinaMap)
    echarts.registerMap('chinaContour', chinaContourMap)
  })

  return {
    earthChart,
    option: option3d
  }
}
