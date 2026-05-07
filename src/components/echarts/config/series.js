import * as echarts from 'echarts'
export default {
  name: '数量',
  type: 'bar',
  barWidth: 30,
  itemStyle: {
    color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
      { offset: 0, color: '#02809A' },
      { offset: 1, color: '#03333F' },
    ]),
    borderColor: '#00F0FF',
    borderWidth: 1,
    borderRadius: 0,
  },
  data: [10, 20],
}
