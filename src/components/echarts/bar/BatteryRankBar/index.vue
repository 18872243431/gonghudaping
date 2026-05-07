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
const imgPath = require("@/assets/img/echarts/bar/barSymbol.png");

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
          formatter: (value) => {
            if(value ==1){
              return `{Num1|${value}}`
            }else if(value==2){
              return `{Num2|${value}}`
            }else if(value==3){
              return `{Num3|${value}}`
            }else{
              return `{Num4|${value}}`

            }
          },
          rich: {
            Num1: {
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 22,
              height: 25,
              align: "center",
              padding: [3, 0, 0, 0],
              borderWidth: 1,
              borderRadius: 3,
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar/1.png'),
                repeat: 'no-repeat',
              }
            },
            Num2: {
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 22,
              height: 25,
              align: "center",
              // backgroundColor: "#e9c039",
              // borderColor: "#e9c039",
              borderWidth: 1,
              borderRadius: 3,
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar/2.png'),
                repeat: 'no-repeat',
              }
            },
            Num3: {
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 22,
              height: 25,
              align: "center",
              // backgroundColor: "rgba(0,240,255,0.10)",
              // borderColor: "#13C2FF",
              borderWidth: 1,
              borderRadius: 3,
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar/3.png'),
                repeat: 'no-repeat',
              }
            },
            Num4: {
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 400,
              fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
              width: 22,
              height: 25,
              align: "center",
              // backgroundColor: "rgba(0,240,255,0.10)",
              // borderColor: "#13C2FF",
              borderWidth: 1,
              borderRadius: 3,
              backgroundColor:{
                type: 'pattern',
                image: require('@/assets/img/echarts/bar/4.png'),
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
          fontSize: 16,
          fontStyle: 'bold',
          fontFamily: '"DIN", "SourceHanSansSC", sans-serif',
          color: '#00D3DB',
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
        barWidth: 6,
        showBackground: true,
        backgroundStyle: {
          color: "#142945",
        },
        itemStyle: getItemStyle(),
        label: {
          show: true,
          fontSize: 16,
          fontStyle: 'normal',
          fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
          color: "#ffffff",
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
        name: "",
        type: "pictorialBar",
        symbol: `image://${imgPath}`,
        symbolPosition: "end",
        symbolSize: [6, 12],
        symbolOffset: ["55%", "0%"],
        data: [
          {
            ...props.data,
          },
        ],
        tooltip: {
          show: false,
        },
      },
    ],
  }
})
function getItemStyle() {
  let obj = {}
  if(props.serial==1){
    obj={
      color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#1B3255',
                  },
                  {
                    offset: 1,
                    color: '#E24A3B',
                  },
                ],
      },
    }
  }
  else if(props.serial==2){
    obj={
      color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#1B3255',
                  },
                  {
                    offset: 1,
                    color: '#C9B217',
                  },
                ],
      },
    }
  }
  else if(props.serial==3){
    obj={
      color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#1B3255',
                  },
                  {
                    offset: 1,
                    color: '#3877F2',
                  },
                ],
      },
    }
  }else{
    obj={
      color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#1B3255',
                  },
                  {
                    offset: 1,
                    color: '#3BB3FE',
                  },
                ],
      },
    }
  }
  return obj
}

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
  height: 65px;
}
</style>