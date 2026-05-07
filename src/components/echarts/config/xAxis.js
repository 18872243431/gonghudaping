/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2022-09-27 10:29:48
 * @LastEditTime: 2022-09-28 10:49:09
 */
export default {
  type: "category",
  axisLabel: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: '"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'
  },
  axisLine: {
    show: true,
    lineStyle: {
      color: "rgba(19,150,249,0.2)",
      type: "dashed",
    },
  },
  axisTick: {
    show: true,
    alignWithLabel: true,
    lineStyle: {
      width: 1,
      color: "rgba(19,150,249,0.2)",
      type: "dashed",
    },
  },
  boundaryGap: true,
  splitLine: {
    lineStyle: {
      color: "rgba(19,150,249,0.2)",
      type: "dashed",
    },
  },
  data: ["单位1", "单位2"],
};
