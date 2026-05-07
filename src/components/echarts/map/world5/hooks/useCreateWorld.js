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
} from "vue";
import worldMap from "/public/map/json/world.json";
import * as echarts from "echarts";
import { use } from "echarts/core";
import config from "../../../config";
// import seriesOption from '../seriesOption'
import { getEnCountry, getCnCountry, getCoord } from "@/libs/worldsForMap";
import { getNationalPng, getCountryImg } from "@/libs/country";
const { visualMap, legend, tooltip } = config;

const baseOption = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  boundingCoords: [
    [-180, 90],
    [180, -90],
  ],
  center: [10.168, 25.989],
  roam: true,
  zoom: 0.7,
};
const seriesOption = {
  type: "map",
  geoIndex: 0,
  map: "world",
  mapType: 'world',
  zlevel: 4,
  label: {
    show: false,
  },
  data: [

  ],
};

let fullImage = new Image();

function createBg(chart, ininOption) {
  let img = new Image();
  img.src = require("/public/map/img/2k_earth.jpg");
  // img.src = 'https://img02.mockplus.cn/idoc/image/2021-12-24/4a82c250-64be-11ec-b42f-c5c17ba47dad.jpg'
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = ininOption.width;
  canvas.height = ininOption.height;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fullImage.src = canvas.toDataURL("image/png", 2);
  };
}

export function useCreateWorld(props, emits) {
  if (props.lines.length > 0) {
    seriesOption.data = props.lines
  }
  const mapChart = ref(null);
  const initOption = reactive({
    width: 1418,
    height: 638,
  });
  const option = computed(() => {
    let effectScatter = [];
    props["lines"].forEach(d => {
      effectScatter.push({
        name: d.name,
        value: getCoord(d.name),
        symbolSize: 12
      });
    })
    return {
      tooltip: {
        ...tooltip,
        trigger: "item",
        show: true,
        ...props.option?.tooltip,
      },
      visualMap: {
        ...visualMap,
        ...props.option?.visualMap,
      },
      geo: [
        {
          show: true,
          map: "world",
          ...baseOption,
          zlevel: 3,
          itemStyle: {
            areaColor: "rgba(77, 213, 255, 0.3)",
            borderWidth: 1,
            borderColor: "rgba(58, 161, 196)",
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
        {
          show: true,
          map: "world",
          ...baseOption,
          roam: false,
          zlevel: 1,
          itemStyle: {
            areaColor: {
              image: fullImage,
              repeat: "no-repeat",
            },
            borderWidth: 0,
            opacity: 1,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            },
            itemStyle: {
              areaColor: {
                image: fullImage,
                repeat: "no-repeat",
              },
              borderWidth: 0,
              opacity: 1,
            },
          },
          regions: [
            {
              name: "China",
            },
          ],
        },
      ],
      series: [seriesOption,{
        type: "effectScatter",
        coordinateSystem: "geo",
        geoIndex: 0,
        symbolSize: 5,
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        itemStyle: {
          color: "#00ad2F",
        },
        tooltip: {
          show: false
        },
        emphasis: { scale: true },
        label: {
          show: true,
          position: "right", //显示位置
          offset: [5, 0], //偏移设置
          formatter: function (params) {
            let name = getNationalPng(getCnCountry(params.data.name));
            if (!name) return "";
            let value = params.dataIndex < 20 ? "show" : "hidden";
            return (
              "{" +
              name +
              "| }" +
              "  " +
              "{" +
              value +
              "|" +
              getCnCountry(params.data.name) +
              "}"
            );
            // return  "{value|" + params.data.value[2] + getCnCountry(params.data.name) + "}" + "  "  + "{" + name + "| }"
          },
          fontSize: 13,
          rich: {
            show: {
              lineHeight: 15,
              color: "#F8FFFF",
            },
            hidden: {
              opacity: 0,
            },
            ...getCountryImg(),
          },
        },
        zlevel: 3,
        data: effectScatter,
      }],
    };
  });

  onBeforeMount(() => {
    echarts.registerMap("world", worldMap);
  });

  onMounted(() => {
    nextTick(() => {
      initOption.width = mapChart.value.$el.offsetWidth;
      initOption.height = mapChart.value.$el.offsetHeight;
      if (mapChart.value) createBg(mapChart.value, initOption);
    });
  });

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
