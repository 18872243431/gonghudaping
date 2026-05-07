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
import config from "../../../config";
import worldMap from "/public/map/json/world.json";
import * as echarts from "echarts";
import { getEnCountry, getCnCountry, getCoord } from "@/libs/worldsForMap";
import { getNationalPng, getCountryImg } from "@/libs/country";

const { visualMap, tooltip } = config;

const mapSeries = {
  type: "map",
  geoIndex: 0,
  map: "world",
  zlevel: 9,
  label: {
    show: true,
  },
  data: [],
};

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
  zoom: 0.55,
};
const seriesOption = {
  effectScatter: {
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
    data: [],
  },
  lines: {
    type: "lines",
    coordinateSystem: "geo",
    geoIndex: 0,
    zlevel: 4,
    effect: {
      show: true,
      symbol: "arrow",
      // period: 5,
      // trailLength: 0,
      color: "#FF3A2F",
      symbolSize: 5,
    },
    label: {
      show: false,
      color: "#fff",
      padding: [0, 0, 5, 0],
      formatter: ({ data, dataIndex }) => {
        let value = dataIndex < 3 ? "top3" : "other";
        return (
          "{" +
          value +
          "|" +
          (getCnCountry(data.fromName) +
            "->" +
            getCnCountry(data.toName) +
            ":" +
            data.value.toLocaleString("en-US")) +
          "}"
        );
      },
      position: "middle",
      rich: {
        top3: {
          fontSize: 16,
          color: "#FFEA2F",
        },
      },
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
            color: "#FFEA2F ", // 0% 处的颜色
          },
          {
            offset: 1,
            color: "#FF1919", // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      width: 1,
      curveness: 0.5,
      opacity: 0.05,
    },
    data: [],
  },
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
  const mapChart = ref(null);
  const initOption = reactive({
    width: 1418,
    height: 638,
  });
  const series = computed(() => {
    let list = [],
      lines = [],
      effectScatter = [];
      console.log("props[]",props["lines"])
    if (props["lines"].length > 0) {
      props["lines"].forEach((item, index) => {
        let dataItem = item;
        dataItem[0].name = getEnCountry(dataItem[0].name);
        dataItem[1].name = getEnCountry(dataItem[1].name);
        var fromCoord = getCoord(dataItem[0].name);
        var toCoord = getCoord(dataItem[1].name);
        if (fromCoord && toCoord) {
          lines.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord],
            value: dataItem[1].value,
            lineStyle: {
              opacity: index < 10 ? 0.6 : 0.1,
              width: index < 10 ? 1 : 0.6,
              color: "#FFEA2F",
            },
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
      list.push({ ...seriesOption["lines"], data: [...lines] });
      effectScatter = Array.from(new Set(effectScatter));
      effectScatter.forEach((item) => {
        if (item.name === "China") {
          item["symbolSize"] = 10;
        }
      });
      list.push({ ...seriesOption["effectScatter"], data: [...effectScatter] });
    }
    if (props.option.data?.length > 0) {
      props.option.data.forEach(d => {
        effectScatter.push({
          name: d.name,
          value: getCoord(d.name),
          symbolSize: 12
        });
      })
      effectScatter = Array.from(new Set(effectScatter));
      list.push({ ...mapSeries, data: props.option.data });
      list.push({ ...seriesOption["effectScatter"], data: [...effectScatter] });
    }
    console.log(list, "====list===");
    return list;
  });
  const option = computed(() => {
    return {
      visualMap: {
        ...visualMap,
        ...props.option?.visualMap,
      },
      tooltip: {
        ...tooltip,
        trigger: "item",
        show: false,
        ...props.option?.tooltip,
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
      series: [...series.value],
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
