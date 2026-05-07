/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-16 18:10:36
 * @LastEditTime: 2021-12-24 14:16:15
 * @Description:
 */
/**
 * 散点
 */
const scatter = {
  type: "scatter",
  coordinateSystem: "geo",
  geoIndex: 0,
  itemStyle: {
    color: "#FFFFFF",
  },
  zlevel: 4,
  data: [],
};

/**
 * 带有涟漪特效动画的散点
 */
const effectScatter = {
  type: "effectScatter",
  coordinateSystem: "geo",
  geoIndex: 0,
  showEffectOn: "render",
  rippleEffect: {
    brushType: "stroke",
    scale: 1.6,
  },
  itemStyle: {
    color: "#FFEF4A",
  },
  emphasis: { scale: true },
  zlevel: 4,
  data: [],
};

/**
 * 地图
 */
const map = {
  type: "map",
  geoIndex: 0,
  map: "china",
  zlevel: 4,
  label: {
    show: false,
  },
  data: [],
};

/**
 * 飞线
 */
const lines = {
  type: "lines",
  coordinateSystem: "geo",
  geoIndex: 0,
  zlevel: 4,
  effect: {
    show: true,
    period: 5,
    trailLength: 0.4,
    color: "#fff",
    symbolSize: 5,
  },
  lineStyle: {
    color: "#FFB800",
    width: 1,
    curveness: 0.5,
  },
  zlevel: 4,
  data: [],
};

export default {
  scatter,
  effectScatter,
  map,
  lines,
};
