<template>
  <v-chart class="chart" ref="barChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from "echarts/core";
import * as echarts from "echarts";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PictorialBarChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { computed } from "vue";
import config from "../../config";

use([
  CanvasRenderer,
  BarChart,
  PictorialBarChart,
  TooltipComponent,
  GridComponent,
]);

const { tooltip } = config;

const props = defineProps({
  data: {
    type: Array,
    default: () => ({
      legend: [],
      xAxisName: [],
      data: [[], []],
    }),
  },
  rotate: {
    type: Number,
    default: 0,
  },
  option: {
    type: Object,
    default: {},
  },
  isOneBgColor: {
    type: Boolean,
    default: false,
  },
});

const grid = {
  left: 50,
  right: 40,
  top: 30,
  bottom: 50,
};
let car = {
  长城汽车: "changchengqiche",
  长安: "changan",
  上汽集团: "shangqijituan",
  本田: "bentian",
  特斯拉: "tesila",
  小鹏: "xiaopeng",
  丰田: "fengtian",
  奥迪: "aodi",
  宝马: "baoma",
  北汽: "beiqi",
  奔驰: "benchi",
  比亚迪: "biyadi",
  别克: "bieke",
  大众: "dazhong",
  东风汽车: "dongfengqiche",
  福特: "fute",
  吉利: "jili",
  广汽: "guangqi",
  海马: "haima",
  江淮: "jianghuai",
  凯迪拉克: "kaidilake",
  林肯: "linken",
  奇瑞: "qirui",
  斑马智行: "banma",
  日产: "richan",
  威马: "weima",
  蔚来汽车: "weilaiqiche",
  宇通: "yutong",
  长安汽车: "changan",
  北京现代: "beijingxiandai",
  北汽: "beiqi",
  北汽福田: "beiqifutian",
  东风汽车: "dongfengqiche",
  东风日产: "dongfengrichan",
  飞凡: "feifan",
  广汽埃安: "guangqiaian",
  合创汽车: "hechuangqiche",
  合众: "hezhong",
  江铃汽车: "jianglingqiche",
  捷豹: "jiebao",
  捷尼赛思: "jienisaisi",
  极狐: "jihu",
  极氪: "jike",
  凯翼: "kaiyi",
  岚图: "lantu",
  领悅: "lingyue",
  三菱: "sanling",
  // 上汽汽车: 'shangqiqiche',
  上汽通用: "shangqitongyong",
  神龙汽车: "shenlongqiche",
  腾势: "tengshi",
  沃尔沃: "woerwo",
  五菱: "wuling",
  小电天体: "xiaodiantianti",
  一汽: "yiqi",
  云度: "yundu",
  浙江零跑: "zhejianglingpao",
  智己: "zhiji",
  智马达: "zhimada",
  阿维塔: "aweita",
};

const nameList = computed(() => props.data.xAxisName);
const maxData = computed(() => {
  let data1 = props.data.data[0] || [];
  let data2 = props.data.data[1] || [];
  let arr = [];
  for (let i = 0; i < data1.length; i++) {
    let num = data1[i] + data2[i];
    arr.push(num);
  }
  return arr;
});

const option = computed(() => {
  return {
    tooltip: {
      ...tooltip,
      ...props.option?.tooltip,
      axisPointer: {
        type: "none",
      },
    },
    grid: { ...grid, ...props.option?.grid },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#144B9D",
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        rotate: props.rotate,
        interval: 0,
        // margin: 10,
        // width: 100,
        align: "center",
        overflow: "truncate",
        padding: [0, 0, 0, 0],
        formatter: function (parmas) {
          return `{${car[parmas] || "NoImg"}|}\n{value|${parmas}}`;
        },
        rich: {
          value: {
            width: 100,
            textAlign: "center",
            fontSize: 10,
            lineHeight: 20,
            color: "#ffffff",
            // padding: [0,0,0,-10]
            // rotate: 30
          },
          ...getCountryImg(),
        },
      },

      data: nameList.value,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 14,
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        color: "#ffffff",
        formatter: (value) => {
          if (value < 10000) {
            return value;
          }
          return `${value / 10000}万`;
        },
      },
      splitLine: {
        lineStyle: {
          color: "#144388",
          type: 3,
          dashOffset: 3,
        },
      },
    },
    legend: {
      // ...legend,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      left: 60,
      top: -5,
      textStyle: {
        color: "#FFFFFF",
        fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif',
        fontSize: 14,
      },
      pageTextStyle: {
        color: "#ffffff",
      },
      ...props.option?.legend,
      data: props.data.legend,
    },
    series: [
      {
        z: 12,
        name: props.data.legend[0] || "受控终端数量",
        type: "bar",
        barMaxWidth: "auto",
        barWidth: 10,
        stack: "Ad",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(19,194,255,0)",
            },
            {
              offset: 1,
              color: "#13c2ff",
            },
          ]),
        },
        data: props.data.data[0],
      },
      {
        z: 12,
        name: props.data.legend[1] || "受控终端数量" || "被攻击终端数量",
        type: "bar",
        barMaxWidth: "auto",
        barWidth: 10,
        stack: "Ad",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(253,172,66,0)",
            },
            {
              offset: 1,
              color: "rgba(253,172,66,1)",
            },
          ]),
        },
        data: props.data.data[1],
      },
      {
        name: props.data.legend[0] || "受控终端数量",
        type: "pictorialBar",
        symbolSize: [10, 2],
        symbol: "rect",
        symbolOffset: [0, 0],
        z: 12,
        itemStyle: {
          color: "#14CFFF",
        },
        label: {
          show: false,
        },
        symbolPosition: "end",
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: "#13c2ff",
        },
        data: props.data.data[0],
      },
      {
        name: props.data.legend[1] || "受控终端数量" || "被攻击终端数量",
        type: "pictorialBar",
        symbolSize: [10, 2],
        symbol: "rect",
        symbolOffset: [0, 0],
        z: 12,
        itemStyle: {
          color: "#14CFFF",
        },
        label: {
          show: false,
        },
        symbolPosition: "end",
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: "rgba(243,172,65,1)",
        },
        data: maxData.value,
      },
      // {
      //   name: props.data.legend[0] || "受控终端数量",
      //   z: 1,
      //   name: "背景",
      //   type: "bar",
      //   barMaxWidth: "auto",
      //   barWidth: 30,
      //   barGap: "-200%",
      //   data: maxData.value,
      //   tooltip: {
      //     show: false,
      //   },
      //   itemStyle: {
      //     color: " rgba(208,222,238,0.07)",
      //   },
      // },
    ],
  };
});

function getCountryImg() {
  let json = {};
  props.data.xAxisName.forEach((item) => {
    let img = car[item] ? require(`/public/carNetwork/${car[item]}.png`) : "";
    if (!img) {
      json["NoImg"] = {
        align: "center",
        textAlign: "center",
        width: 20,
        height: 20,
        backgroundColor: "transparent",
      };
    } else {
      json[car[item]] = {
        align: "center",
        textAlign: "center",
        width: 20,
        height: 20,
        backgroundColor: {
          image: img,
        },
      };
    }
  });
  return json;
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
