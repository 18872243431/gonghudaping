<template>
  <div class="full">
    <v-chart
      class="chart china-carousel"
      ref="mapChartRef"
      :option="option"
      :autoresize="true"
      @click="handleClick"
    ></v-chart>
    <div
      v-if="dialogVisible"
      class="province-dialog"
      :style="dialogStyle"
      @mouseenter="pauseCarousel"
      @mouseleave="resumeCarousel"
    >
      <div class="dialog-content">
        <div class="title">{{ currentProvinceInfo.name }}</div>
        <div class="content">
          <div
            v-for="(item, i) in currentProvinceInfo.warningList?.slice(0, 3)"
            :key="i"
          >
            <span>
              监测发现：{{ item.time }}遭受来自<span style="color: #ffb215">{{
                item.companyName
              }}</span
              >的{{ item.eventType }}攻击</span
            >
          </div>
        </div>
        <span class="close-button" @click="dialogVisible = false"
          ><el-icon><Close /></el-icon
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount, onUnmounted, nextTick } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts";
import { MapChart } from "echarts/charts";
import VChart from "vue-echarts";
import China from "/public/map/json/china.json";
import ChinaContour from "/public/map/json/china-contour.json";
import seriesOption from "../../config/seriesOption";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import ChinaCity from "/public/map/coords/ChinaCity.js";
import { CubeLeft, CubeRight, CubeTop } from "./cube";
import { Close } from "@element-plus/icons-vue";

use([CanvasRenderer, MapChart]);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      map: [
        {
          name: "四川",
          value: 100,
        },
        {
          name: "湖北",
          value: 400,
        },
        { name: "广东", value: 700 },
      ],
      lines: [],
    }),
  },
  option: {
    type: Object,
    default: () => {},
  },
  name: {
    type: String,
  },
  baseOption: {
    type: Object,
    default: () => ({
      roam: false,
      zoom: 1.24,
      top: 70,
      center: [115.97, 29.71],
    }),
  },
});
const emits = defineEmits(["mapClick"]);

const currentIndex = ref(0);
const currentData = computed(() => {
  return props.data.map[currentIndex.value];
});

const option = computed(() => {
  const baseOption = props.baseOption;
  let shallowMap = [];
  for (let i = 0; i < 14; i++) {
    shallowMap.push({
      show: true,
      map: "ChinaContour",
      zlevel: 2,
      ...baseOption,
      top: baseOption.top + i,
      itemStyle: {
        areaColor: "transparent",
        borderColor: "rgba(19, 150, 249, 1)",
      },
      emphasis: {
        itemStyle: {
          areaColor: "transparent",
          borderColor: "rgba(19, 150, 249, 1)",
        },
        label: {
          show: false,
        },
      },
    });
  }
  return {
    visualMap: [
      {
        show: false,
        type: "piecewise",
        orient: "vertical",
        left: 0,
        bottom: 250,
        min: 0,
        max: 1200,
        itemWidth: 14,
        itemHeight: 14,
        zlevel: 9,
        pieces: [
          {
            min: 0,
            max: 200,
            color: "rgba(77, 213, 255, 1)",
          },
          {
            min: 200,
            max: 500,
            color: "rgba(255, 189, 67, 1)",
          },
          {
            min: 500,
            color: "rgba(255, 58, 47, 1)",
          },
        ],
        inverse: true,
        itemGap: 15,
        textStyle: {
          color: "#D1E8FF",
          fontFamily: "MicrosoftYaHei, MicrosoftYaHei-Regular",
          fontSize: 14,
        },
        itemSymbol: "circle",
        splitNumber: 4,
        seriesIndex: 1,
        ...props.option?.visualMap1,
      },
      {
        show: true,
        type: "continuous",
        orient: "horizontal",
        left: 0,
        bottom: 180,
        min: 0,
        max: 1200,
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
        text: [1200, 0],
        seriesIndex: 0,
        ...props.option?.visualMap2,
      },
    ],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(11,36,57,0.80)",
      borderColor: "#4dd5ff",
      textStyle: {
        color: "#E1EDFF",
        fontSize: 16,
      },
      ...props.option?.tooltip,
    },
    geo: [
      {
        type: "map",
        show: true,
        map: "China",
        nameMap: ChinaNameMap,
        ...baseOption,
        zlevel: 5,
        itemStyle: {
          areaColor: "rgba(77, 213, 255,0.8)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.70)",
          opacity: 1,
        },
        label: {
          show: true,
          color: "rgba(255,255,255,0.85)",
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "MicrosoftYaHei, MicrosoftYaHei-Regular",
        },
        emphasis: {
          label: {
            color: "rgba(242, 254, 255, 1)",
            fontSize: 18,
          },
          itemStyle: {
            areaColor: "#f3ac41",
            opacity: 0.6,
          },
        },
        regions: [
          {
            name: "南海诸岛",
            itemStyle: {
              areaColor: "rgba(77, 213, 255,0.1)",
            },
          },
          {
            name: "河北",
            label: {
              show: true,
              offset: [-5, 20],
            },
          },
          {
            name: "天津",
            label: {
              show: true,
              offset: [20, -10],
            },
          },
          {
            name: "北京",
            label: {
              show: true,
              offset: [-20, -10],
            },
          },
          {
            name: "上海",
            label: {
              show: true,
              offset: [0, -10],
            },
          },
          {
            name: "甘肃",
            label: {
              show: true,
              offset: [30, -10],
            },
          },
          {
            name: "澳门",
            label: {
              show: false,
              offset: [-10, 0],
            },
          },
          {
            name: "香港",
            label: {
              show: false,
              offset: [20, 0],
            },
          },
        ],
      },
      {
        type: "map",
        show: true,
        map: "ChinaContour",
        ...baseOption,
        zlevel: 4,
        itemStyle: {
          borderWidth: 2,
          areaColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.70)",
          shadowBlur: 10,
          shadowColor: "rgba(109, 241, 255, 0.5)",
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            areaColor: "transparent",
            borderColor: "rgba(255, 255, 255, 0.70)",
          },
          label: {
            show: false,
          },
        },
      },
      ...shallowMap,
      {
        type: "map",
        show: true,
        map: "ChinaContour",
        ...baseOption,
        top: baseOption.top + 15,
        zlevel: 0,
        itemStyle: {
          areaColor: "rgba(19, 150, 249, 0.05)",
          borderWidth: 3,
          borderColor: "rgba(109, 241, 255, 0.4)",
          opacity: 1,
          shadowBlur: 50,
          shadowColor: "rgba(19, 150, 249, 1)",
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: "rgba(19, 150, 249, 0.05)",
            borderWidth: 2,
            borderColor: "rgba(109, 241, 255, 0.4)",
            opacity: 1,
            shadowBlur: 50,
            shadowColor: "rgba(19, 150, 249, 1)",
          },
        },
      },
    ],
    series: createSeries(),
  };
});

function createSeries() {
  const list = [];
  list.push({
    ...seriesOption.map,
    name: "",
    zlevel: 5,
    name: props.name,
    nameMap: ChinaNameMap,
    data: props.data.map,
  });
  return list;
}

function handleClick(params) {
  // console.log(params.data);
  if (params.data) showProvinceInfo(params.data);
  // emits("mapClick", params);
}

// 控制弹出框显示
const dialogVisible = ref(false);
const currentProvinceInfo = ref({});
const dialogStyle = ref({});
const mapChartRef = ref(null);

// 显示弹出框
const showProvinceInfo = async (data) => {
  await nextTick(); // 确保DOM更新
  currentProvinceInfo.value = data;
  const chartInstance = mapChartRef.value.chart;
  if (chartInstance) {
    const geo = chartInstance.getModel().getComponent("geo").coordinateSystem;
    let p = ChinaCity[currentProvinceInfo.value.name];
    const point = geo.dataToPoint(p);
    dialogStyle.value = {
      position: "absolute",
      left: `${point[0] - 10}px`, // 稍微偏移一点
      top: `${point[1] - 250}px`, // 稍微偏移一点
    };
    dialogVisible.value = true;
  } else {
    console.error("ECharts instance not found");
  }
};

// 定时器ID
let timerId = null;

// 开始轮播
const startCarousel = () => {
  // timerId = setInterval(() => {
  //   currentIndex.value = (currentIndex.value + 1) % props.data.map.length;
  //   showProvinceInfo(); // 每次切换时显示弹出框
  // }, 3000); // 每3秒切换一次
};

// 停止轮播
const stopCarousel = () => {
  // clearInterval(timerId);
};

// 暂停轮播
const pauseCarousel = () => {
  // clearInterval(timerId);
};

// 继续轮播
const resumeCarousel = () => {
  // startCarousel();
};

onBeforeMount(() => {
  echarts.graphic.registerShape("MapCubeLeft", CubeLeft);
  echarts.graphic.registerShape("MapCubeRight", CubeRight);
  echarts.graphic.registerShape("MapCubeTop", CubeTop);
  echarts.registerMap("China", China);
  echarts.registerMap("ChinaContour", ChinaContour);
  // startCarousel();
});

onUnmounted(() => {
  // stopCarousel();
});
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
.province-dialog {
  position: absolute;
  padding: 20px;
  border-radius: 5px;
  z-index: 1000;
  width: 369px;
  height: 300px;
  background: url("./imgs/warning.png") no-repeat center / 100% 100%;

  .dialog-content {
    padding-top: 85px;
    padding-left: 50px;
    overflow: hidden;
    position: relative;
    .title {
      font-size: 24px;
      color: #fff;
      line-height: 30px;
    }
    .content {
      height: 150px;
      overflow-y: auto;
      font-size: 20px;
      line-height: 24px;
      color: #fff;
      text-shadow: rgba(0, 20, 58, 0.5) 0px 5px 5px;
    }

    .close-button {
      position: absolute;
      top: -14px;
      right: 22px;
      font-size: 28px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
