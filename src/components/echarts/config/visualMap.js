/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-17 15:18:59
 * @LastEditTime: 2021-12-24 11:28:37
 * @Description:
 */
import { insertSeparator } from "@/libs/util";

export default {
  show: true,
  type: "continuous",
  orient: "horizontal",
  min: 0,
  max: 20000,
  text: [0, 20000],
  left: 0,
  bottom: 20,
  itemWidth: 20,
  itemHeight: 200,
  color: ["#09A0D8", "#008BE3", "#016CD2", "#1058BC", "#093878"],

  // show: true,
  // type: "piecewise",
  // orient: "vertical",
  // left: 0,
  // bottom: 0,
  // min: 0,
  // max: 4000,
  // itemWidth: 20,
  // itemHeight: 20,
  // color: ["#CC0033", "#FF6600", "#FFCC33", "#FFFF99"],
  zlevel: 9,
  inverse: false,
  // itemGap: 5,
  textStyle: {
    color: "#C7DDFF",
    fontFamily: "MicrosoftYaHei, MicrosoftYaHei-Regular",
    fontSize: 12,
  },
  // itemSymbol: "rect",
  // splitNumber: 4,
  seriesIndex: 0,
  // formatter: function (value, value2) {
  //   return `${insertSeparator(parseInt(value)) || 0}~${insertSeparator(
  //     parseInt(value2)
  //   )}`;
  // },
};
