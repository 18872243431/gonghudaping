export default {
  zlevel: 4,
  axisType: 'time',
  left: '8%',
  right: '72%',
  top: '33%',
  autoPlay: false,
  lineStyle: {
    color: 'rgba(14,106,175,0.60)',
    width: 6,
  },
  itemStyle: {
    color: '#046A8D',
    shadowColor: 'rgba(77,213,255,0.19)',
  },
  label: {
    position: 'bottom',
    color: '#C7DDFF',
    formatter: '{yyyy}-{MM}-{dd}',
  },
  checkpointStyle: {
    symbolSize: 14,
    color: '#A3E6FD',
    shadowBlur: 7,
    borderWidth: 1,
    borderColor: '#04C1F8',
    shadowColor: '#179FFB',
  },
  controlStyle: {
    position: 'right',
    color: 'rgba(8,176,246,0.61)',
    borderColor: 'rgba(8,176,246,0.39)',
  },
  progress: {
    lineStyle: {
      width: 4,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#1396f9', // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#00ffec', // 100% 处的颜色
          },
        ],
        global: false,
      },
    },
    itemStyle: {
      color: '#04C1F8',
      shadowBlur: 5,
      shadowColor: '#04C1F8',
    },
  },
  data: [],
}
