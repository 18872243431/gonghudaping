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
} from "vue";
import worldMap from "/public/map/json/chinaWorld.json";
import chinaContourMap from "/public/map/json/china-contour.json";
import * as echarts from "echarts";
import { use } from "echarts/core";
import config from "../../config";
import { getEnCountry, getCnCountry, getCoord2 } from "@/libs/worldsForMap";
import { getNationalPng, getCountryImg } from "@/libs/country";
import { useTimeoutFn, useDebounceFn } from "@vueuse/core";
const imgPath1 = require("@/assets/img/2.png")

const baseOption = {
  // left: 0,
  // top: 0,
  // right: 0,
  // bottom: 0,
  // boundingCoords: [
  //   [-180, 90],
  //   [180, -90]
  // ],
  // center: [10.168, -17.989],
  // roam: true,
  // zoom: 0.7,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  boundingCoords: [
    [-25, -90],
    [335, 90],
  ],
  center: [156.168, -28],
  roam: true,
  zoom: 0.71,
  aspectScale: 0.75,
};
const seriesOption = {
  effectScatter: {
    type: 'effectScatter',
    coordinateSystem: 'geo',
    geoIndex: 0,
    symbol: `image://${imgPath1}`,
    symbolSize: 15,
    showEffectOn: 'render',
    rippleEffect: {
      brushType: 'stroke'
    },
    itemStyle: {
      color: '#FF3A2F'
    },
    emphasis: { scale: true },
    label: {
      show: true,
      position: 'right', //显示位置
      offset: [5, 0], //偏移设置
      formatter: function (params) {
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
    zlevel: 3,
    data: []
  },
  lines: {
    type: 'lines',
    coordinateSystem: 'geo',
    geoIndex: 0,
    zlevel: 4,
    effect: {
      show: true,
      symbol: 'arrow',
      // period: 5,
      // trailLength: 0,
      color: '#feec87',
      symbolSize: 5
    },
    label: {
      show: false,
      color: '#fff',
      padding: [0, 0, 5, 0],
      formatter: ({ data }) => {
        return getCnCountry(data.fromName) + '->' + getCnCountry(data.toName) + ':' + data.value.toLocaleString('en-US')
      },
      position: 'middle',
    },
    emphasis: {
      label: {
        show: true,
      }
    },
    lineStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#1fa0ac ' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#e1ce57' // 100% 处的颜色
          }
        ],
        global: false // 缺省为 false
      },
      width: 1,
      type: 'solid',
      curveness: 0.5
    },
    zlevel: 4,
    data: []
  }
};

let fullImage = new Image();

function createBg (chart, ininOption) {
  let img = new Image()
  img.src = require('/public/map/img/1.png')
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

export function useCreateWorld(props, emits) {
  const mapChart = ref(null);
  const initOption = reactive({
    width: 1418,
    height: 638,
  });
  const series = computed(() => {
    let list = [],
      lines = [],
      effectScatter = [];
    if (props["lines"]?.data?.length > 0) {
      props["lines"].data.forEach((item, index) => {
        let dataItem = item;
        dataItem[0].name = getEnCountry(dataItem[0].name);
        dataItem[1].name = getEnCountry(dataItem[1].name);
        var fromCoord = getCoord2(dataItem[0].name);
        var toCoord = getCoord2(dataItem[1].name);
        if (fromCoord && toCoord) {
          lines.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord],
            value: dataItem[1].value,
          });
          effectScatter.push({
            name: dataItem[0].name,
            value: fromCoord,
          });
          effectScatter.push({
            name: dataItem[1].name,
            value: toCoord.concat(dataItem[1].value),
          });
        }
      });
      // lines = lines.filter((it) => {
      //   return it.fromName && it.fromName.length > 0;
      // });
      list.push({ ...seriesOption["lines"], data: [...lines] });
      effectScatter = Array.from(new Set(effectScatter));
      effectScatter.forEach((item) => {
        if (item.name === "China") {
          item["symbolSize"] = 10;
        }
      });
      console.log('effectScatter', effectScatter)
      list.push({ ...seriesOption["effectScatter"], data: [...effectScatter] });
    }
    return list;
  });
  const option = computed(() => {
    return {
      geo: [
        {
          show: true,
          map: 'world',
          ...baseOption,
          zlevel: 3,
          itemStyle: {
            // areaColor: 'rgba(77, 213, 255, 0.3)',
            areaColor: 'transparent',
            borderWidth: 1,
            // borderColor: 'rgba(58, 161, 196)'
            borderColor: '#1a69d3'
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            },
            itemStyle: {
              opacity: 1
            }
          },
          regions: [
            {
              name: "中国",
            },
          ],
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
              name: 'China',
              itemStyle: {
                areaColor: "#0589ff",
                borderWidth: 1.5,
                borderColor: "#00ffeb",
                shadowBlur: 10,
                shadowColor: "#00ffeb",
              },
            }
          ]
        }
      ],
      series: [...series.value]
    };
  });

  onBeforeMount(() => {
    echarts.registerMap("world", worldMap);
    echarts.registerMap("chinaContour", chinaContourMap);
  });

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

  onBeforeUnmount(() => {
    window.removeEventListener(
      "resize",
      useDebounceFn(() => {
        handleResize();
      }, 500),
      false
    );
  });

  onMounted(() => {
    nextTick(() => {
      if (!mapChart.value?.$el) return;
      initOption.width = mapChart.value?.$el.offsetWidth;
      initOption.height = mapChart.value?.$el.offsetHeight;
      createBg(mapChart.value, initOption);
      useTimeoutFn(() => {
        mapChart.value.setOption(option.value);
      }, 1000);
    });
  });

  function handleResize() {
    nextTick(() => {
      if (!mapChart.value?.$el) return;
      initOption.width = mapChart.value?.$el.offsetWidth;
      initOption.height = mapChart.value?.$el.offsetHeight;
      createBg(mapChart.value, initOption);
      useTimeoutFn(() => {
        mapChart.value.setOption(option.value);
      }, 1000);
    });
  }

  function handleGeoroam(params) {
    let option = mapChart.value.getOption();
    if (params.zoom) {
      option.geo.forEach((item) => {
        item.zoom = option.geo[0].zoom;
        item.center = option.geo[0].center;
      });
    } else {
      option.geo.forEach((item) => {
        item.center = option.geo[0].center;
      });
    }
    mapChart.value.setOption(option);
  }

  return {
    option,
    mapChart,
    initOption,
    handleGeoroam,
  };
}
