import {
  computed,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  reactive,
  nextTick,
} from "vue";
import worldMap from "/public/map/json/world.json";
import chinaMap from "/public/map/json/china-nanhai.json";
import chinaContourMap from "/public/map/json/china-contour.json";
import * as echarts from "echarts";
import { use } from "echarts/core";
import { TimelineComponent, LegendComponent } from "echarts/components";
import config from "../../config";
import seriesOption from "../seriesOption";
import { useTimeoutFn, useDebounceFn } from "@vueuse/core";

use([TimelineComponent, LegendComponent]);

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
  center: [201.97, -8.71],
  roam: true,
  zoom: 1.2,
};
let fullImage = new Image();
fullImage.setAttribute("crossOrigin", "anonymous");

async function createBg(chart, ininOption) {
  let img = new Image();
  img.src =
    "https://img02.mockplus.cn/idoc/image/2021-12-27/d113c0e0-66b1-11ec-8639-07842039f7f6.jpg";
  img.crossOrigin = "anonymous";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = ininOption.width;
  canvas.height = ininOption.height;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fullImage.src = canvas.toDataURL("image/png", 2);
  };
}

export function useCreateMap(props, emits) {
  const mapChart = ref(null);
  const initOption = reactive({
    width: 1960 * 2,
    height: 1080 * 2,
  });
  const series = computed(() => {
    let list = [];
    const types = ["map", "scatter", "effectScatter", "lines"];
    types.forEach((item) => {
      if (Array.isArray(props[item]) && props[item].length > 0) {
        props[item].forEach((itm) => {
          list.push({ ...seriesOption[item], ...itm });
        });
      } else {
        if (props[item]?.data?.length > 0) {
          list.push({ ...seriesOption[item], ...props[item] });
        }
      }
    });
    return list;
  });

  const option = computed(() => {
    const center = [201.97 - props.translateX, -8.71 + props.translateY];
    const zoom = props.zoom;
    let shallowMap = [];
    for (let i = 0; i < 6; i++) {
      shallowMap.push({
        show: true,
        map: "chinaContour",
        zlevel: 2,
        ...{
          ...baseOption,
          center,
          zoom,
        },
        itemStyle: {
          areaColor: "transparent",
          borderWidth: 2,
          borderColor: "#094C80",
          shadowColor: "#094C80",
          shadowOffsetY: 4 * i,
          shadowOffsetX: 0,
          shadowBlur: 2,
        },
        emphasis: {
          itemStyle: {
            areaColor: "transparent",
            borderWidth: 2,
            borderColor: "#094C80",
            shadowColor: "#094C80",
            shadowOffsetY: 4 * i,
            shadowOffsetX: 0,
            shadowBlur: 2,
          },
          label: {
            show: false,
          },
        },
      });
    }
    //提示信息文字或图片
    let graphicData = [];
    if (props.tips.length > 0) {
      graphicData = props.tips.map((item) => {
        if (item.type === "text") {
          return {
            type: "text",
            zlevel: 9,
            style: {
              ...item,
              fill: "#C7DDFF",
              font: '14px "MicrosoftYaHei"',
            },
          };
        }
        if (item.type === "image") {
          return {
            type: "image",
            zlevel: 9,
            style: {
              image: item.url,
              ...item,
            },
          };
        }
      });
    }
    return {
      visualMap: {
        ...visualMap,
        ...props.option?.visualMap,
      },
      graphic: graphicData,
      legend: {
        ...legend,
        ...props.option?.legend,
      },
      tooltip: {
        ...tooltip,
        trigger: "item",
        show: false,
        ...props.option?.tooltip,
      },
      geo: [
        {
          type: "map",
          show: true,
          map: "china",
          ...{
            ...baseOption,
            center,
            zoom,
          },
          zlevel: 4,
          itemStyle: {
            // areaColor: "#1e8afa",
            areaColor: "transparent",
            borderWidth: 1,
            borderColor: "#fff",
            opacity: 0.6,
          },
          label: {
            show: true,
            color: "#d0deee",
            shadowColor: "rgba(0,0,0,0.05)",
            shadowBlur: 12,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
          },
          emphasis: {
            label: {
              show: true,
              color: "#d0deee",
            },
            itemStyle: {
              areaColor: "#f3ac41",
              opacity: 0.6,
            },
          },
          regions: [
            {
              name: "南海诸岛",
              value: 0,
              itemStyle: {
                opacity: 0,
                label: {
                  show: false,
                },
              },
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
                itemStyle: {
                  opacity: 0,
                  label: {
                    show: false,
                  },
                },
              },
            },
          ],
        },
        {
          show: true,
          map: "chinaContour",
          zlevel: 3,
          ...{
            ...baseOption,
            center,
            zoom,
          },
          itemStyle: {
            areaColor: {
              image: fullImage,
              repeat: "no-repeat",
            },
            borderWidth: 4,
            borderColor: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0.2,
                  color: "#4dd5ff", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#ecffff", // 100% 处的颜色
                },
              ],
            },
          },
          emphasis: {
            itemStyle: {
              areaColor: {
                image: fullImage,
                repeat: "no-repeat",
              },
              borderWidth: 3,
              borderColor: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#4dd5ff", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#ecffff", // 100% 处的颜色
                  },
                ],
              },
            },
            label: {
              show: false,
            },
          },
        },
        ...shallowMap,
        {
          show: true,
          map: "world",
          ...{
            ...baseOption,
            center,
            zoom,
          },
          roam: false,
          zlevel: 1,
          itemStyle: {
            areaColor: "rgba(16, 146, 70,0.03)",
            borderWidth: 2,
            borderColor: "rgba(19, 45, 125,1)",
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
              areaColor: "rgba(16, 146, 70,0.03)",
              borderWidth: 2,
              borderColor: "rgba(19, 45, 125,1)",
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
      series: [
        ...series.value,
        {
          type: "scatter",
          name: "钓鱼岛和赤尾屿",
          coordinateSystem: "geo",
          symbolSize: 0,
          label: {
            show: true,
            formatter: "{b}",
            color: "#f8ffff",
          },
          data: [
            {
              name: "钓鱼岛",
              value: [123.47396850585938, 25.746714028822527, 0],
            },
            {
              name: "赤尾屿",
              value: [124.55803155899046, 25.922443871982992, 0],
            },
          ],
        },
      ],
    };
  });

  onBeforeMount(() => {
    echarts.registerMap("world", worldMap);
    echarts.registerMap("china", chinaMap);
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
    console.log("mounted", option);
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

  function handleResize() {
    nextTick(() => {
      if (!mapChart.value?.$el) return;
      initOption.width = mapChart.value?.$el.offsetWidth * 2;
      initOption.height = mapChart.value?.$el.offsetHeight * 2;
      createBg(mapChart.value, initOption);
      useTimeoutFn(() => {
        mapChart.value.setOption(option.value);
      }, 1000);
    });
  }

  function mapClick(params) {
    emits("mapClick", params);
  }
  
  function mapDblclick(params) {
    emits("mapDblclick", params);
  }

  function mapMouseover(params) {
    emits("mapMouseover", params);
  }

  function mapMouseout(params) {
    emits("mapMouseout", params);
  }

  return {
    initOption,
    option,
    handleGeoroam,
    mapChart,
    handleResize,
    mapClick,
    mapMouseover,
    mapMouseout,
    mapDblclick
  };
}
