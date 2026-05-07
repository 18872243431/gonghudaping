<!--
 * @Descripttion: 
 * @Author: voanit
 * @Date: 2024-03-13 10:18:06
 * @LastEditors: ACT-TELECOM\chengxiaomeng chengxiaomeng@act-telecom.com
 * @LastEditTime: 2024-05-28 17:49:47
-->
<template>
  <v-chart class="battery-chart"
           :option="option"
           :autoresize="true" />
</template>
<script setup>
import VChart from 'vue-echarts'
import { computed } from 'vue'
import 'echarts'

const props = defineProps({
  option: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {
      return { name: '中国', value: 282 }
    },
  },
  max: {
    type: Number,
    default: 500,
  },
  serial: {
    type: Number,
    default: 1,
  },
  rightNumShow: {
    type: Boolean,
    default: true,
  },
})

const option = computed(() => {
  return {
    grid: { left: 110, right: 10, top: 10, bottom: 0, containLabel: true },
    tooltip: {
      show: false,
      trigger: 'axis',
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          interval: 0,
          inside: false,
          padding: [0, 100, 0, 0],
          align: 'right',
          color: "rgba(255,255,255,1)",
          fontSize: 23,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          formatter: (value) => {
            if(value ==1){
              return `{Num1|${value}}`
            }else if(value==2){
              return `{Num2|${value}}`
            }else if(value==3){
              return `{Num3|${value}}`
            }else if(value==4){
              return `{Num4|${value}}`
            }else{
              return `{Num5|${value}}`
            }
          },
          rich: {
            Num1: {
              // color: "#ffffff",
              // fontSize: 16,
              // fontWeight: 400,
              // fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              // width: 22,
              // height: 25,
              // align: "center",
              // padding: [3, 0, 0, 0],
              // borderWidth: 1,
              // borderRadius: 3,
              width: 40,
              height: 30,
              align: "center",
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar2/1.png'),
                repeat: 'no-repeat',
              }
            },
            Num2: {
              width: 40,
              height: 30,
              align: "center",
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar2/2.png'),
                repeat: 'no-repeat',
              }
            },
            Num3: {
              width: 40,
              height: 30,
              align: "center",
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar2/3.png'),
                repeat: 'no-repeat',
              }
            },
            Num4: {
              width: 40,
              height: 30,
              align: "center",
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar2/4.png'),
                repeat: 'no-repeat',
              }
            },
            Num5: {
              width: 40,
              height: 30,
              align: "center",
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar2/5.png'),
                repeat: 'no-repeat',
              }
            },
         },
        },
        data: [props.serial],
      },
      {
        type: 'category',
        inverse: true,
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: props.rightNumShow,
          interval: 0,
          margin: 0,
          // inside: false,
          // align: 'left',
          // verticalAlign: 'bottom',
          lineHeight: 35,
          fontSize: 24,
          fontStyle: 'bold',
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          color: 'rgba(255,255,255,1)',
          formatter: function (value) {
            return thousands(value)
          }
        },
        data: [props.data.value],
      },
    ],
    xAxis: { show: false, type: 'value' },
    series: [
      {
        type: 'bar',
        barWidth: 15,
        showBackground: false,
        itemStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#0a57b3',
              },
              {
                offset: 1,
                color: '#24ebef',
              },
            ],
          },
        },
        label: {
          show: true,
          fontSize: 23,
          fontStyle: 'normal',
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          color: 'rgba(255,255,255,1)',
          position: 'left',
          offset: [-5, 0],
          width: 100,
          overflow: 'truncate',
          formatter: (params) => {
            return params.data.name
          },
        },
        data: [
          {
            ...props.data,
          },
          {
            name: '',
            value: props.max,
            itemStyle: {
              color: 'transparent',
            },
          },
        ],
        z: 1,
      },
      {
        type: 'pictorialBar',
        barWidth: 18,
        symbol: 'rect',
        symbolMargin: 5, //间隙
        symbolSize: [3, 15],
        symbolOffset: [-4, '0%'], //向左偏移9
        symbolClip: true, //裁剪掉左侧多余部分
        symbolRepeat: true,
        itemStyle: {
          color: '#0a459d',
        },
        data: [
          {
            ...props.data,
          },
          {
            name: '',
            value: props.max,
            itemStyle: {
              color: 'transparent',
            },
          },
        ],
        z: 2,
      },
      
    ],
  }
})
function thousands(num) {
  let str = num.toString()
  const reg =
    str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
</script>
<style lang="scss" scoped>
.battery-chart {
  width: 100%;
  height: 100%;
}
</style>