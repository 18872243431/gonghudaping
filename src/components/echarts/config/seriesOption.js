/**
 * 散点
 */
const scatter = {
  type: 'scatter',
  coordinateSystem: 'geo',
  geoIndex: 0,
  itemStyle: {
    color: '#FFFFFF',
  },
  zlevel: 4,
  data: [],
}

/**
 * 带有涟漪特效动画的散点
 */
const effectScatter = {
  type: 'effectScatter',
  coordinateSystem: 'geo',
  geoIndex: 0,
  showEffectOn: 'render',
  rippleEffect: {
    brushType: 'stroke',
  },
  itemStyle: {
    color: '#FFEF4A',
  },
  emphasis: { scale: true },
  zlevel: 4,
  data: [],
}

/**
 * 地图
 */
const map = {
  type: 'map',
  geoIndex: 0,
  map: 'china',
  zlevel: 4,
  label: {
    show: false,
  },
  data: [],
}

/**
 * 飞线
 */
const lines = {
  type: 'lines',
  coordinateSystem: 'geo',
  geoIndex: 0,
  zlevel: 4,
  effect: {
    show: true,
    period: 5,
    trailLength: 0.4,
    color: '#fff',
    symbolSize: 5,
    symbol: 'arrow',
  },
  lineStyle: {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 0.98,
      colorStops: [
        {
          offset: 0,
          color: '#ff1919', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#ffea2f', // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    width: 1,
    curveness: -0.5,
  },
  data: [],
}

export default {
  scatter,
  effectScatter,
  map,
  lines,
}
