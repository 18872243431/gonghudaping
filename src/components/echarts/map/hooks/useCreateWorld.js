/*
 * @Author: cxm
 * @LastEditors: 最后编辑者
 * @Date: 2021-12-21 11:44:25
 * @LastEditTime: 2026-03-10 18:33:41
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
import worldMap from "/public/map/json/world.json";
import countryArr from "/public/map/country.js";
import * as echarts from "echarts";
import { getEnCountry, getCnCountry, getCoord } from "@/libs/worldsForMap";
import { getNationalPng, getCountryImg } from "@/libs/country";

const imgPath1 = require("@/assets/img/2.png");
const baseOption = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  boundingCoords: [
    [-180, 90],
    [180, -90],
  ],
  center: [10.168, -17.989],
  roam: false,
  zoom: 0.75,
  aspectScale: 0.75,
};
const seriesOption = {
  effectScatter: {
    type: "effectScatter",
    coordinateSystem: "geo",
    geoIndex: 0,
    // symbol: `image://${imgPath1}`,
    symbolSize: [12, 6],
    showEffectOn: "render",
    rippleEffect: {
      brushType: "stroke",
    },
    itemStyle: {
      color: "#FFF",
    },
    emphasis: { scale: true },
    label: {
      show: true,
      position: "right", //显示位置
      offset: [5, 0], //偏移设置
      formatter: function (params) {
        let name = getNationalPng(getCnCountry(params.data.name));
        return (
          "{" +
          name +
          "| }" +
          "  " +
          "{value|" +
          getCnCountry(params.data.name) +
          "}"
        );
      },
      fontSize: 13,
      rich: {
        value: {
          lineHeight: 15,
          fontSize: 16,
          color: "#FFF",
        },
        ...getCountryImg(),
      },
    },
    zlevel: 11,
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
      color: "#feec87",
      symbolSize: 5,
    },
    label: {
      show: false,
      color: "#fff",
      padding: [0, 0, 5, 0],
      formatter: ({ data }) => {
        return (
          getCnCountry(data.fromName) +
          "->" +
          getCnCountry(data.toName) +
          ":" +
          data.value.toLocaleString("en-US")
        );
      },
      position: "middle",
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
            color: "#ff1919", // 0% 处的颜色
          },
          {
            offset: 1,
            color: "#ffea2f", // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
      width: 1,
      type: "solid",
      curveness: 0.3,
    },
    zlevel: 4,
    data: [],
  },
};

const tooltip = {
  backgroundColor: "rgba(11,36,57,0.80)",
  borderColor: "#4dd5ff",
  textStyle: {
    color: "#E1EDFF",
    fontSize: 18,
  },
  trigger: "item",
};

export function useCreateWorld(props, emits) {
  const mapChart = ref(null);
  const nameMap = createNameMap();
  const series = computed(() => {
    let list = [],
      lines = [],
      effectScatter = [];
    if (props.map?.length > 0) {
      list.push({
        type: "map",
        geoIndex: 0,
        map: "world",
        nameMap,
        zlevel: 10,
        label: {
          show: false,
        },
        data: props.map,
      });
    }
    if (props["lines"]?.data?.length > 0) {
      props["lines"].data.forEach((item, index) => {
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
          });
          effectScatter.push({
            name: dataItem[0].name,
            value: [...fromCoord],
          });
          effectScatter.push({
            name: dataItem[1].name,
            value: toCoord.concat(dataItem[1].value),
          });
        }
      });
      list.push({
        ...seriesOption["lines"],
        tooltip: { show: false },
        data: [...lines],
      });
      effectScatter = Array.from(new Set(effectScatter));
      effectScatter.forEach((item) => {
        if (item.name === "China") {
          item["symbolSize"] = 10;
        }
      });
      list.push({
        ...seriesOption["effectScatter"],
        tooltip: { show: false },
        data: [...effectScatter],
      });
    }
    // console.log(list, "list");
    return list;
  });
  const option = computed(() => {
    return {
      visualMap: {
        show: true,
        type: "continuous",
        orient: "horizontal",
        left: 300,
        top: 500,
        zlevel: 9,
        inverse: false,
        itemWidth: 10,
        itemHeight: 94,
        textStyle: {
          color: "#D1E8FF",
          fontFamily: "MicrosoftYaHei, MicrosoftYaHei-Regular",
          fontSize: 16,
        },
        inRange: {
          color: ["rgba(255, 189, 67, 0.8)", "rgba(255,58,47,0.7)"],
        },
        ...props.visualMap,
        text: [props.visualMap.max, props.visualMap.min],
        seriesIndex: 0,
      },
      tooltip: {
        ...tooltip,
        trigger: "item",
        show: true,
        formatter: ({ name, value }) => {
          if (value) {
            return `<p style="font-size:16px">被攻击总次数</p><p style="font-size:16px">${name} : ${value}</p>`;
          }
        },
      },
      geo: [
        {
          show: true,
          map: "world",
          ...baseOption,
          nameMap,
          zlevel: 2,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#D1E7EE",
            areaColor: "rgba(83,173,255,0.5)",
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
          select: {
            label: {
              show: false,
            },
            itemStyle: {
              opacity: 1,
            },
          },
          regions: [
            {
              name: "中国",
              itemStyle: {
                // areaColor: "#0589ff",
                borderWidth: 3,
                borderColor: "#00ffeb",
                // shadowBlur: 20,
                // shadowColor: "#00ffeb",
              },
            },
          ],
        },
        {
          show: true,
          map: "world",
          ...baseOption,
          zlevel: 1,
          itemStyle: {
            areaColor: "transparent",
            borderWidth: 1,
            shadowColor: "rgba(65, 214, 255,0.8)",
            shadowOffsetY: 1,
            shadowBlur: 1,
          },
          label: {
            show: false,
          },
          tooltip: {
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

  function createNameMap() {
    let obj = {};
    countryArr.forEach((item) => {
      obj[item.en] = item.cn;
    });
    return obj;
  }

  return {
    option,
    mapChart,
  };
}
