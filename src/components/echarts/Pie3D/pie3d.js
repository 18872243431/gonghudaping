/***
 * 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
 * startRatio（浮点数）: 当前扇形起始比例，取值区间 [0, endRatio)
 * endRatio（浮点数）: 当前扇形结束比例，取值区间 (startRatio, 1]
 * isSelected（布尔值）:是否选中，效果参照二维饼图选中效果（单选）
 * isHovered（布尔值）: 是否放大，效果接近二维饼图高亮（放大）效果（未能实现阴影）
 * k（0~1之间的浮点数）：用于参数方程的一个参数，取值 0~1 之间，通过「内径/外径」的值换算而来。
 ***/

import { formatNum } from "@/libs/util";
export const getParametricEquation = (
  startRatio,
  endRatio,
  isSelected,
  isHovered,
  k
) => {
  // 计算
  let midRatio = (startRatio + endRatio) / 2;

  let startRadian = startRatio * Math.PI * 2;
  let endRadian = endRatio * Math.PI * 2;
  let midRadian = midRatio * Math.PI * 2;

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false;
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== "undefined" ? k : 1 / 3;

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1;

  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },

    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },

    x: function (u, v) {
      if (u < startRadian) {
        return (
          offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    },

    y: function (u, v) {
      if (u < startRadian) {
        return (
          offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      if (u > endRadian) {
        return (
          offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
        );
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    },

    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u);
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u);
      }
      return Math.sin(v) > 0 ? 1 : -1;
    },
  };
};

/***
 * 生成模拟 3D 饼图的配置项
 * pieData（object）：饼图数据
 * internalDiameterRatio（0~1之间的浮点数）：内径/外径的值（默认值 1/2），当该值等于 0 时，为普通饼图
 ***/
export const getPie3D = (pieData, internalDiameterRatio, conf) => {
  let series = [];
  let sumValue = 0;
  let startValue = 0;
  let endValue = 0;
  let legendData = [];
  const colors = ["#F3AC41", "#3DE6FF", "#1B83FF", "#00E29E", "#EA5B3F"];

  let k =
    typeof internalDiameterRatio !== "undefined"
      ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
      : 1 / 3;

  // 新增标签 series @20210613
  let labelSeries = {
    id: "labelSeries",
    type: "bar3D",
    barSize: [0.1, 0.1],
    data: [],
    label: {
      show: true,
      // position: 'outside',
      formatter: function (params) {
        return `${params.name}:${formatNum(params.value[3])}`;
      },
      textStyle: {
        color: "#fff",
      },
    },
  };

  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value;
    let seriesItem = {
      name:
        typeof pieData[i].name === "undefined" ? `series${i}` : pieData[i].name,
      type: "surface",
      parametric: true,
      wireframe: {
        show: false,
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
      itemStyle: {
        color: colors[i],
      },
    };

    if (typeof pieData[i].itemStyle != "undefined") {
      let itemStyle = {};

      typeof pieData[i].itemStyle.color != "undefined"
        ? (itemStyle.color = pieData[i].itemStyle.color)
        : null;
      typeof pieData[i].itemStyle.opacity != "undefined"
        ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
        : null;

      seriesItem.itemStyle = itemStyle;
    }
    series.push(seriesItem);
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value;

    series[i].pieData.startRatio = startValue / sumValue;
    series[i].pieData.endRatio = endValue / sumValue;
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false,
      false,
      k
    );

    startValue = endValue;

    legendData.push(series[i].name);

    // 判断增加 label 效果 @20210613
    if (pieData[i].label && pieData[i].label.show) {
      let labelRadian =
        (series[i].pieData.startRatio + series[i].pieData.endRatio) * Math.PI;
      labelSeries.data.push({
        name: series[i].name,
        value: [
          Math.cos(labelRadian),
          Math.sin(labelRadian),
          1.2,
          series[i].pieData.value,
        ],
        itemStyle: {
          opacity: 1,
        },
      });
    }
  }

  // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
  series.push({
    name: "mouseoutSeries",
    type: "surface",
    parametric: true,
    wireframe: {
      show: false,
    },
    itemStyle: {
      opacity: 0,
    },
    parametricEquation: {
      u: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20,
      },
      v: {
        min: 0,
        max: Math.PI,
        step: Math.PI / 20,
      },
      x: function (u, v) {
        return Math.sin(v) * Math.sin(u) + Math.sin(u);
      },
      y: function (u, v) {
        return Math.sin(v) * Math.cos(u) + Math.cos(u);
      },
      z: function (u, v) {
        return Math.cos(v) > 0 ? 0.1 : -0.1;
      },
    },
  });

  // 将 labelSeries 添加进去 @20210613
  series.push(labelSeries);

  let legendObj = { top: 0 };

  if (conf.legendPos === "top") {
    legendObj = { top: 0 };
  } else if (conf.legendPos === "bottom") {
    legendObj = { bottom: 0 };
  }

  const legendDataList = series.filter((item, index) => {
    return index < series.length - 2;
  });

  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  let option = {
    legend: {
      data: legendData,
      type: "scroll",
      orient: "horizontal",
      selectedMode: false,
      left: "center",
      ...legendObj,
      itemGap: 5,
      textStyle: {
        color: "#A1E2FF",
      },
      pageTextStyle: {
        color: "#A1E2FF",
      },
      pageIconColor: {
        color: "#A1E2FF",
      },
      show: conf.legendShow,
      icon: "circle",
      formatter: function (name) {
        if (conf.legendRateShow) {
          const target = legendDataList.find((item) => item.name === name);
          const total = legendDataList.reduce(
            (total, item) => total + item.pieData.value,
            0
          );
          if (target) {
            const rate = (target.pieData.value * 100) / total;
            return `${name}：${rate.toFixed(2)}%`;
          }
        }
        return name;
      },
    },
    labelLine: {
      show: true,
      lineStyle: {
        color: "#7BC0CB",
      },
    },
    label: {
      show: true,
      position: "outside",
      tooltip: true,
      rich: {
        b: {
          color: "#7BC0CB",
          fontSize: 12,
          lineHeight: 20,
        },
        c: {
          fontSize: 12,
        },
      },
      // formatter: `{b|{b} \n}{c|{c}}({d}%)}`,
      formatter: function (params) {
        if (conf.labelFormatter) {
          return `${params.name}\n${params.value}${conf.labelFormatter}`;
        }
        return `${params.name}\n${
          params.value > 0 ? formatNum(params.value) : 0
        }${conf.labUnit}(${
          params.percent > 0.01 || params.value === 0 ? params.percent : "0.01"
        }%)`;
      },
    },
    tooltip: {
      formatter: (params) => {
        if (
          params.seriesName !== "mouseoutSeries" &&
          params.seriesName !== "pie2d"
        ) {
          let num = option.series[params.seriesIndex].pieData.value || 0;
          let bfb = (
            (option.series[params.seriesIndex].pieData.endRatio -
              option.series[params.seriesIndex].pieData.startRatio) *
            100
          ).toFixed(2);
          return (
            `${params.seriesName}<br/>` +
            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
            `${conf.orderTip}${num.toLocaleString("en-US")}(${
              isNaN(bfb) ? 0 : bfb
            }%)`
          );
        }
      },
      backgroundColor: "rgba(50,50,50,0.7)",
      textStyle: {
        color: "#fff",
      },
    },
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: -1,
      max: 1,
    },
    grid3D: {
      show: false,
      boxHeight: 10,
      // bottom: '50%',
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 45, //角度
        distance: 200, //调整视角到主体的距离，类似调整zoom
        rotateSensitivity: 0, //设置为0无法旋转
        zoomSensitivity: 0, //设置为0无法缩放
        panSensitivity: 0, //设置为0无法平移
        autoRotate: false, //自动旋转
      },
    },
    series: series,
  };

  option.series.push({
    name: "pie2d",
    type: "pie",
    label: {
      show: conf.labelShow,
      position: "outside",
      color: "#fff",
    },
    labelLine: {
      show: conf.labelLineShow,
      length: conf.labelLine.length,
      length2: conf.labelLine.length2,
      // length2: 15,
      // length: 20,
      // length2: 30,
    },
    title: {
      text: "20%",
      top: "10%",
      bottom: "10%",
    },
    startAngle: -20, //起始角度，支持范围[0, 360]。
    clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    radius: ["48%", "48%"],
    center: ["50%", "50%"],
    data: pieData,
    itemStyle: {
      opacity: 1,
      color: "transparent",
    },
    emphasis: {
      disabled: true,
    },
  });

  return option;
};
