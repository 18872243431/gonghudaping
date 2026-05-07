<template>
  <div class="img-china-map" :style="containerStyle">
    <svg class="clip-defs" v-if="showClipDefs">
      <defs>
        <clipPath :id="clipPathId" clipPathUnits="objectBoundingBox">
          <path v-for="(d, i) in clipPathList" :key="i" :d="d" />
        </clipPath>
      </defs>
    </svg>
    <img v-if="showBaseImage" src="./China1.png" :style="baseImageStyle" />
    <v-chart
      class="chart"
      v-if="isMapReady"
      ref="mapChart"
      :option="option"
      :autoresize="true"
      :style="mapLayerStyle"
    ></v-chart>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  MapChart,
  CustomChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
} from "echarts/charts";
import VChart from "vue-echarts";
import * as echarts from "echarts";
import ChinaMap from "/public/map/json/china.json";
import ChinaContour from "/public/map/json/china-contour.json";
import seriesOption from "../../config/seriesOption";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";
import { CubeLeft, CubeRight, CubeTop } from "./cube";

const NANSHA_SHIFT_LON = -2.5;
const NANSHA_SHIFT_LAT = -1;

const cubeVisible = ref(true);

use([
  CanvasRenderer,
  MapChart,
  CustomChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
]);

const props = defineProps({
  option: {
    type: Object,
    default: () => ({
    }),
  },
  data: {
    type: Object,
    default: () => ({
      map: [
        // { name: "北京市", value: 920 },
      ],
      cube: [
        // { name: "北京市", value: 2100 },
      ],
      lines: [
        // { from: "广东省", to: "河南省", value: 14 },
      ],
    }),
  },
  showCube: {
    type: Boolean,
    default: false,
  },
  name1: {
    type: String,
    default: "",
  },
  name2: {
    type: String,
    default: "",
  },
  style: {
    type: Object,
    default: () => ({}),
  },
  showClipDefs: {
    type: Boolean,
    default: false,
  },
  mapAspectRatio: {
    type: [String, Number],
    default: "700 / 685",
  },
  mapWidthScale: {
    type: Number,
    default: 1,
  },
  mapHeight: {
    type: String,
    default: "100%",
  },
});
const containerStyle = computed(() => props.style || {});
const showClipDefs = computed(() => props.showClipDefs !== false);
const mapLayerStyle = computed(() => ({
  width: "auto",
  height: props.mapHeight || "100%",
  aspectRatio:
    typeof props.mapAspectRatio === "number"
      ? `${props.mapAspectRatio}`
      : props.mapAspectRatio,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: `translateX(-50%) translateY(-50%) scaleX(${
    props.mapWidthScale || 1
  })`,
  transformOrigin: "center center",
}));
const baseImageStyle = computed(() => {
  if (!showClipDefs.value) return mapLayerStyle.value;
  return {
    ...mapLayerStyle.value,
    clipPath: `url(#${clipPathId})`,
    WebkitClipPath: `url(#${clipPathId})`,
  };
});

function shiftCoordinates(coords, lonOffset, latOffset) {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    return [coords[0] + lonOffset, coords[1] + latOffset];
  }
  return coords.map((item) => shiftCoordinates(item, lonOffset, latOffset));
}

function createShiftedMapData(source) {
  const copied = JSON.parse(JSON.stringify(source));
  copied.features = (copied.features || []).map((feature) => {
    const regionName = feature?.properties?.name;
    if (regionName === "南海诸岛") {
      feature.geometry.coordinates = shiftCoordinates(
        feature.geometry.coordinates,
        NANSHA_SHIFT_LON,
        NANSHA_SHIFT_LAT,
      );
      if (Array.isArray(feature.properties?.center)) {
        feature.properties.center = [
          feature.properties.center[0] + NANSHA_SHIFT_LON,
          feature.properties.center[1] + NANSHA_SHIFT_LAT,
        ];
      }
      if (Array.isArray(feature.properties?.centroid)) {
        feature.properties.centroid = [
          feature.properties.centroid[0] + NANSHA_SHIFT_LON,
          feature.properties.centroid[1] + NANSHA_SHIFT_LAT,
        ];
      }
    }
    return feature;
  });
  return copied;
}

const shiftedChinaMap = createShiftedMapData(ChinaMap);
const shiftedChinaContour = createShiftedMapData(ChinaContour);

// 数据转换函数：将完整地名转换为简化地名
function transformDataForMap(data) {
  return data.map((item) => ({
    ...item,
    name: ChinaNameMap[item.name] || item.name,
  }));
}

const provinceCoords = ref({});
const isMapReady = ref(false);
const showBaseImage = computed(() => props.option?.showBaseImage !== false);
const clipPathId = `china-map-clip-${Math.random().toString(36).slice(2, 10)}`;

const bounds = [
  [74.1, 53.1], // [西经, 北纬]
  [134.5, 3.9], // [东经, 南纬]
];

function projectPoint(point) {
  return [
    (point[0] / 180) * Math.PI * 6378137,
    -Math.log(Math.tan(Math.PI / 4 + ((point[1] / 180) * Math.PI) / 2)) *
      6378137,
  ];
}

const projectedBounds = (() => {
  const leftTop = projectPoint(bounds[0]);
  const rightBottom = projectPoint(bounds[1]);
  return {
    minX: leftTop[0],
    maxX: rightBottom[0],
    minY: leftTop[1],
    maxY: rightBottom[1],
  };
})();

function createGeoLayers() {
  const geoBase = {
    show: true,
    map: "china",
    nameMap: ChinaNameMap,
    roam: false,
    projection: {
      project: (point) => [
        (point[0] / 180) * Math.PI * 6378137,
        -Math.log(Math.tan(Math.PI / 4 + ((point[1] / 180) * Math.PI) / 2)) *
          6378137,
      ],
      unproject: (point) => [
        ((point[0] / 6378137) * 180) / Math.PI,
        ((2 * Math.atan(Math.exp(-point[1] / 6378137)) - Math.PI / 2) * 180) /
          Math.PI,
      ],
    },
    boundingCoords: bounds,
    layoutSize: "100%",
  };
  const shadowGeoBase = {
    ...geoBase,
    map: "chinaContour",
  };
  const mainGeo = {
    ...geoBase,
    layoutCenter: ["50%", "50%"],
    zlevel: 1,
    itemStyle: {
      areaColor: "rgba(77, 213, 255, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,1)",
    },
    label: {
      show: true,
      color: props.option?.label?.color || "#ffffff",
      fontSize: props.option?.label?.fontSize || 20,
      fontWeight: props.option?.label?.fontWeight || "normal",
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
          offset: [0, -5],
        },
      },
      {
        name: "辽宁",
        label: {
          show: true,
          offset: [10, -5],
        },
      },
      {
        name: "陕西",
        label: {
          show: true,
          offset: [-3, 18],
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
          offset: [55, 35],
        },
      },
      {
        name: "内蒙古",
        label: {
          show: true,
          offset: [30, 15],
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
  };
  if (props.option?.enableGeo25D === false) {
    return [mainGeo];
  }
  return [
    mainGeo,
    {
      ...shadowGeoBase,
      silent: true,
      layoutCenter: ["50%", "51.2%"],
      zlevel: 0,
      itemStyle: {
        areaColor: "rgba(31, 130, 188, 0.22)",
        borderWidth: 1,
        borderColor: "rgba(117, 228, 255, 0.65)",
        shadowBlur: 38,
        shadowColor: "rgba(90, 224, 255, 0.58)",
        shadowOffsetY: 8,
      },
      label: {
        show: false,
      },
      emphasis: {
        disabled: true,
      },
    },
    {
      ...shadowGeoBase,
      silent: true,
      layoutCenter: ["50%", "52%"],
      zlevel: 0,
      itemStyle: {
        areaColor: "rgba(13, 89, 141, 0.2)",
        borderWidth: 0,
        borderColor: "rgba(0, 0, 0, 0)",
        shadowBlur: 56,
        shadowColor: "rgba(34, 204, 255, 0.36)",
        shadowOffsetY: 14,
      },
      label: {
        show: false,
      },
      emphasis: {
        disabled: true,
      },
    },
  ];
}

function normalizePoint(point) {
  const [x, y] = projectPoint(point);
  const nx =
    (x - projectedBounds.minX) / (projectedBounds.maxX - projectedBounds.minX);
  const ny =
    (y - projectedBounds.minY) / (projectedBounds.maxY - projectedBounds.minY);
  return [Math.min(1, Math.max(0, nx)), Math.min(1, Math.max(0, ny))];
}

function ringToPath(ring) {
  if (!Array.isArray(ring) || ring.length < 3) return "";
  const [x0, y0] = normalizePoint(ring[0]);
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i < ring.length; i++) {
    const [x, y] = normalizePoint(ring[i]);
    d += ` L ${x} ${y}`;
  }
  d += " Z";
  return d;
}

const clipPathList = computed(() => {
  const features = shiftedChinaMap?.features || [];
  const paths = [];
  features.forEach((feature) => {
    const geometry = feature?.geometry;
    if (!geometry || !geometry.coordinates) return;
    if (geometry.type === "Polygon") {
      geometry.coordinates.forEach((ring) => {
        const d = ringToPath(ring);
        if (d) paths.push(d);
      });
    }
    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((poly) => {
        poly.forEach((ring) => {
          const d = ringToPath(ring);
          if (d) paths.push(d);
        });
      });
    }
  });
  return paths;
});

// 仅从 visualMap 外部 option 中提取位置属性，避免 min/max/pieces 等数据相关属性覆盖内部计算值
function pickPositionOnly(obj) {
  if (!obj) return {};
  const result = {};
  ['left', 'right', 'top', 'bottom'].forEach(key => {
    if (obj[key] !== undefined) result[key] = obj[key];
  });
  return result;
}

const formatNum = (num) => {
  if (num == null) return num;
  const formatWithComma = (str) => {
    const parts = str.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  
  if (num >= 10000) {
    const val = (num / 10000).toFixed(2).replace(/\.?0+$/, "");
    return formatWithComma(val) + "万";
  } else if (num >= 1000) {
    return formatWithComma(num);
  }
  return num.toString();
};

const option = computed(() => {
  const mapData = transformDataForMap(props.data?.map || []);
  const cubeData = transformDataForMap(props.data?.cube || []);
  const lines = (props.data?.lines || []).map((line) => ({
    ...line,
    from: ChinaNameMap[line.from] || line.from,
    to: ChinaNameMap[line.to] || line.to,
  }));
  const visible = cubeVisible.value;
  const mapValues = mapData.map((item) => item.value);
  // 从大到小排序
  const sortedMapValues = [...mapValues].sort((a, b) => b - a);
  // 获取关键分段点的值 (第3, 6, 10名)
  const v3 = sortedMapValues[2] ?? 0;
  const v6 = sortedMapValues[5] ?? 0;
  const v10 = sortedMapValues[9] ?? 0;

  const mapMin = mapValues.length > 0 ? Math.min(...mapValues) : 0;
  const mapMax = mapValues.length > 0 ? Math.max(...mapValues) : 100;
  const cubeValues = cubeData.map((item) => item.value);
  const cubeMin = cubeValues.length > 0 ? Math.min(...cubeValues) : 200;
  const cubeMax = cubeValues.length > 0 ? Math.max(...cubeValues) : 2600;
  const cubeMiddle =
    cubeValues.length > 0 ? cubeMin + (cubeMax - cubeMin) * 0.6 : 1400;
  const option = {
    animation: true,
    legend: {
      show: true,
      data: [props.name1 || "地图数据", props.name2 || "企业数量"],
      selected: {
        [props.name2 || "企业数量"]: true
      },
      bottom: 10,
      textStyle: {
        color: "#ffffff",
        fontSize: 18,
      },
    },
    visualMap: [
      {
        show: props.showCube && cubeData.length > 0,
        type: "piecewise",
        orient: "vertical",
        left: 0,
        bottom: 250,
        min: props.option?.visualMap1?.min || cubeMin,
        max: props.option?.visualMap1?.max || cubeMax,
        itemWidth: 14,
        itemHeight: 14,
        zlevel: 9,
        pieces: [
          {
            min: props.option?.visualMap1?.min || cubeMin,
            max: (props.option?.visualMap1?.middle || cubeMiddle) - 1,
            color: "rgba(77, 213, 255, 0.6)",
            label: `${formatNum(Math.round((props.option?.visualMap1?.min || cubeMin)))} - ${formatNum(Math.round((props.option?.visualMap1?.middle || cubeMiddle) - 1))}`,
          },
          {
            min: props.option?.visualMap1?.middle || cubeMiddle,
            max: (props.option?.visualMap1?.max || cubeMax) - 1,
            color: "rgba(255, 210, 64, 0.6)",
            label: `${formatNum(Math.round((props.option?.visualMap1?.middle || cubeMiddle)))} - ${formatNum(Math.round((props.option?.visualMap1?.max || cubeMax) - 1))}`,
          },
          {
            min: props.option?.visualMap1?.max || cubeMax,
            color: "rgba(255, 77, 77, 0.6)",
            label: `>= ${formatNum(Math.round(props.option?.visualMap1?.max || cubeMax))}`,
          },
        ],
        inverse: true,
        itemGap: 15,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          fontSize: 20,
        },
        itemSymbol: "circle",
        seriesIndex: cubeData.length > 0 ? 1 : -1,
        ...pickPositionOnly(props.option?.visualMap1),
      },
      {
        show: true,
        type: "piecewise",
        orient: "vertical",
        left: 0,
        bottom: 180,
        min: props.option?.visualMap2?.min || mapMin,
        max: props.option?.visualMap2?.max || mapMax,
        zlevel: 9,
        inverse: false,
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 14,
        showLabel: true,
        align: "left",
        textGap: 10,
        formatter: function(value, value2) {
          if (value2 != null) {
            return formatNum(value) + " - " + formatNum(value2);
          }
          return formatNum(value);
        },
        textStyle: {
          color: "#ffffff",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          fontSize: 20,
        },
        pieces: props.option?.visualMap2?.pieces || [
          {
            min: v3,
            max: mapMax,
            color: "rgba(22, 85, 175, 0.95)",
            label: `${formatNum(Math.round(v3))} - ${formatNum(Math.round(mapMax))}`,
          },
          ...(sortedMapValues.length > 3
            ? [
                {
                  min: v6,
                  max: v3 - 0.01,
                  color: "rgba(28, 115, 195, 0.8)",
                  label: `${formatNum(Math.round(v6))} - ${formatNum(Math.round(v3))}`,
                },
              ]
            : []),
          ...(sortedMapValues.length > 6
            ? [
                {
                  min: v10,
                  max: v6 - 0.01,
                  color: "rgba(35, 140, 215, 0.65)",
                  label: `${formatNum(Math.round(v10))} - ${formatNum(Math.round(v6))}`,
                },
              ]
            : []),
          ...(sortedMapValues.length > 10
            ? [
                {
                  min: mapMin,
                  max: v10 - 0.01,
                  color: "rgba(180, 210, 240, 0.2)",
                  label: `< ${formatNum(Math.round(v10))}`,
                },
              ]
            : []),
        ],
        text: props.option?.visualMap2?.text || [],
        seriesIndex: 0,
        ...pickPositionOnly(props.option?.visualMap2),
      },
    ],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(11,36,57,0.80)",
      borderColor: "#4dd5ff",
      textStyle: {
        color: "#ffffff",
        fontSize: 20,
      },
      ...props.option?.tooltip,
    },
    geo: createGeoLayers(),
    series: createSeries(mapData, cubeData, lines),
    graphic: [
      {
        type: "text",
        left: (props.option?.visualMap2?.left || 0) + 10,
        top: (props.option?.visualMap2?.top || 180) - 30,
        style: {
          text: `${
            props.option?.visualMap2?.dimensionText || props.name1 || "区域数据"
          }`,
          fontSize: 20,
          fontWeight: "normal",
          fill: "#D1E8FF",
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        },
        z: 100,
      },
      ...(props.showCube
        ? [
            {
              type: "text",
              left: (props.option?.visualMap1?.left || 0) + 10,
              top: (props.option?.visualMap1?.top || 250) - 30,
              style: {
                text: props.name2 || "立方体数据",
                fontSize: 20,
                fontWeight: "normal",
                fill: "#D1E8FF",
                fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              },
              z: 100,
            },
          ]
        : []),
    ],
  };
  return option;
});

import { nextTick, watch } from "vue";

onBeforeMount(() => {
  echarts.registerMap("china", shiftedChinaMap);
  echarts.registerMap("chinaContour", shiftedChinaContour);
  provinceCoords.value = getProvinceCoords(shiftedChinaMap);
  if (!window.__ChinaShapesRegistered__) {
    echarts.graphic.registerShape("MapCubeLeft", CubeLeft);
    echarts.graphic.registerShape("MapCubeRight", CubeRight);
    echarts.graphic.registerShape("MapCubeTop", CubeTop);
    window.__ChinaShapesRegistered__ = true;
  }
  isMapReady.value = true;
});

function setupChartEvents() {
  nextTick(() => {
    const chart = mapChart.value?.chart;
    if (chart) {
      chart.on('legendselectchanged', function(params) {
        if (props.name2 && params.selected.hasOwnProperty(props.name2)) {
          cubeVisible.value = params.selected[props.name2];
        }
      });
      chart.on('click', function(params) {
        if (params.componentType === 'visualMap') {
          cubeVisible.value = !cubeVisible.value;
        }
      });
    }
  });
}

watch(cubeVisible, function(newVal) {
  nextTick(() => {
    const chart = mapChart.value?.chart;
    if (chart) {
      chart.setOption({
        series: [{
          id: 'cubeSeries',
          data: newVal ? coordsFmt(transformDataForMap(props.data?.cube || [])) : []
        }]
      });
    }
  });
});

onMounted(() => {
  setupChartEvents();
});

function createSeries(mapData, cubeData, lines) {
  const list = [];
  list.push({
    ...seriesOption.map,
    id: "mapSeries",
    name: props.name1 || "地图数据",
    zlevel: 5,
    nameMap: ChinaNameMap,
    data: mapData,
    silent: false,
  });
  if (!props.showCube) {
    list.push({
      type: "map",
      id: "mapEmptySeries",
      zlevel: 5,
      coordinateSystem: "geo",
      geoIndex: 0,
      silent: true,
      data: [],
    });
  }
  if (props.showCube && cubeData.length > 0) {
    const cubeValues = cubeData.map((item) => item.value);
    const cubeMin = cubeValues.length > 0 ? Math.min(...cubeValues) : 200;
    const cubeMax = cubeValues.length > 0 ? Math.max(...cubeValues) : 2600;
    const cubeMiddle =
      cubeValues.length > 0 ? cubeMin + (cubeMax - cubeMin) * 0.6 : 1400;
    const min1 = props.option?.visualMap1?.min || cubeMin;
    const middle1 = props.option?.visualMap1?.middle || cubeMiddle;
    const max1 = props.option?.visualMap1?.max || cubeMax;
    list.push({
      id: "cubeSeries",
      type: "custom",
      zlevel: 5,
      coordinateSystem: "geo",
      geoIndex: 0,
      name: props.name2 || "企业数量",
      renderItem: function (params, api) {
        const value = cubeData[params.dataIndex].value;
        let color;
        if (value >= max1) {
          color = "255, 77, 77";
        } else if (value >= middle1) {
          color = "255, 210, 64";
        } else if (value >= min1) {
          color = "77, 213, 255";
        } else {
          color = "150, 150, 150";
        }
        const height = 18;
        return renderItem(
          params,
          api,
          {
            left: [`rgba(${color},1)`, `rgba(${color},0.1)`],
            right: [`rgba(${color},1)`, `rgba(${color},0.1)`],
            top: "#fff",
          },
          { width: 12, height: 8 },
          height * 3,
        );
      },
      data: cubeVisible.value ? coordsFmt(cubeData) : [],
      silent: false,
      tooltip: {
        formatter: (params) => {
          return `${props.name2 || "企业数量"} <br/>${params.name} ${
            params.value[2]
          }`;
        },
      },
    });
  }
  if (lines.length > 0) {
    // 解析飞线坐标：支持数组格式（经纬度）和字符串格式（省份名称）
    function parseLineCoords(lineData) {
      const from = Array.isArray(lineData.from) ? lineData.from : (provinceCoords.value[lineData.from] || [0, 0]);
      const to = Array.isArray(lineData.to) ? lineData.to : (provinceCoords.value[lineData.to] || [0, 0]);
      return { from, to };
    }
    
    // 创建唯一key用于去重
    function createKey(name, coords) {
      if (Array.isArray(name)) {
        return `coord_${name[0]}_${name[1]}`;
      }
      return name;
    }
    
    list.push({
      ...seriesOption.lines,
      id: "linesSeries",
      zlevel: 7,
      silent: true,
      data: lines.map((line) => {
        const { from, to } = parseLineCoords(line);
        return {
          coords: [from, to],
          value: line.value || 0,
          name: `${line.fromName || line.from} -> ${line.toName || line.to}`,
        };
      }),
    });
    const scatterData = [];
    const effectScatterData = [];
    const processedCities = new Set();
    lines.forEach((line) => {
      const { from: fromCoords, to: toCoords } = parseLineCoords(line);
      const fromKey = createKey(line.from, fromCoords);
      const toKey = createKey(line.to, toCoords);
      
      if (fromCoords && !processedCities.has(fromKey)) {
        processedCities.add(fromKey);
        scatterData.push({
          name: line.fromName || "境外攻击源",
          value: fromCoords,
          itemStyle: { color: "#FF0000" },
          symbolSize: 15,
        });
        effectScatterData.push({
          name: line.fromName || "境外攻击源",
          value: fromCoords,
          itemStyle: { color: "#FFEF4A" },
          symbolSize: 12,
        });
      }
      if (toCoords && !processedCities.has(toKey)) {
        processedCities.add(toKey);
        scatterData.push({
          name: line.toName || line.to,
          value: toCoords,
          itemStyle: { color: "#FFFFFF" },
          symbolSize: 8,
        });
        effectScatterData.push({
          name: line.toName || line.to,
          value: toCoords,
          itemStyle: { color: "#FFEF4A" },
          symbolSize: 8,
        });
      }
    });
    if (scatterData.length) {
      list.push({
        ...seriesOption.scatter,
        id: "scatterSeries",
        progressive: 2000,
        silent: true,
        data: scatterData,
      });
    }
    if (effectScatterData.length) {
      list.push({
        ...seriesOption.effectScatter,
        id: "effectScatterSeries",
        showEffectOn: "render",
        data: effectScatterData,
      });
    }
  }
  return list;
}

function getProvinceCoords(data) {
  const features = data.features || [];
  const obj = {};
  features.forEach((feature) => {
    const props = feature.properties || {};
    const originalName = props.name;
    const center = props.center || props.cp;
    if (originalName && Array.isArray(center) && center.length === 2) {
      // 同时保存原始地名和简化地名的坐标映射，确保无论数据传哪种格式都能匹配到
      const simplifiedName = ChinaNameMap[originalName] || originalName;
      obj[originalName] = center;
      obj[simplifiedName] = center;
    }
  });
  return obj;
}

function coordsFmt(arr) {
  if (!Array.isArray(arr)) return [];
  const filterArr = arr.filter((item) => provinceCoords.value[item.name]);
  return filterArr.map((item) => ({
    name: item.name,
    value: [...provinceCoords.value[item.name], item.value],
  }));
}

function renderItem(params, api, styleColor, cubeOption, value) {
  const location = api.coord([api.value(0), api.value(1)]);
  return {
    type: "group",
    children: [
      {
        type: "MapCubeLeft",
        shape: {
          api,
          x: location[0],
          y: location[1],
          cubeOption,
          value,
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0.2, color: styleColor.left[0] },
            { offset: 1, color: styleColor.right[1] },
          ]),
          shadowBlur: 5,
          stroke: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0.2, color: "#ffffff" },
            { offset: 1, color: "rgba(255,255,255, 0)" },
          ]),
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
      {
        type: "MapCubeRight",
        shape: {
          api,
          x: location[0],
          y: location[1],
          cubeOption,
          value,
        },
        style: {
          fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0.2, color: styleColor.left[0] },
            { offset: 1, color: styleColor.right[1] },
          ]),
          shadowBlur: 5,
          stroke: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0.2, color: "#ffffff" },
            { offset: 1, color: "rgba(255,255,255, 0)" },
          ]),
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
      {
        type: "MapCubeTop",
        shape: {
          api,
          x: location[0],
          y: location[1],
          cubeOption,
          value,
        },
        style: {
          fill: "rgba(255, 255, 255, 0.8)",
          shadowBlur: 5,
          stroke: "rgba(255,255,255,0.4)",
          shadowColor: "rgba(255,255,255,0.6)",
        },
      },
    ],
  };
}
</script>

<style lang="scss" scoped>
.img-china-map {
  width: 100%;
  height: 100%;
  position: relative;
  // 确保容器居中对齐，与 echarts 的 layoutCenter 一致
  display: flex;
  justify-content: center;
  align-items: center;

  .clip-defs {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }
  img {
    // 强制图片的宽高比与导出设置（700x685）完全一致，并居中显示
    // width: auto;
     width: 100%;
    height: 100%;
    aspect-ratio: 700 / 685;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    object-fit: contain;
  }
  .chart {
    // 图表层也强制采用相同的宽高比，确保 GeoJSON 投影的边界和图片物理边界一致
    // width: auto;
    width: 100% !important;
    height: 100%;
    aspect-ratio: 700 / 685;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
