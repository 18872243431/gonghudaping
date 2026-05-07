<template>
  <div class="total-one">
    <div class="left-box">
      <img
        :src="require(`@/assets/img/total/one-totalbg.png`)"
        class="bg-img"
      />
      <span class="icon iconfont icon-shougongji"></span>
    </div>
    <div class="right-box">
      <div class="rightcontainer">
        <div class="rc-top">
          <span class="txt">{{ data.label }}</span>
        </div>
        <div class="rc-bottom">
          <span class="num">
            {{ num }}
            <!-- <act-num :num="data.value" :thousandsFmt="true"></act-num> -->
          </span>
          <span class="unit">{{ data.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import ActNum from "@c/ActNum";
import { computed } from "vue";
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return { label: "网络攻击总数", value: 123879083, unit: "万次" };
    },
  },
});

const num = computed(() => {
  return props.data.value > 9999
    ? (props.data.value / 10000).toFixed(1) + "万"
    : props.data.value.toLocaleString();
});
</script>

<style lang="scss" scoped>
.total-one {
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  .left-box {
    position: relative;
    // flex: 1;
    width: 33.33%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg-img {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      animation: rotate 5s linear infinite;
      opacity: 0.7;
    }
    .icon-shougongji {
      z-index: 3;
      font-size: 32px;
      color: #fff;
      opacity: 0.7;
    }
  }
  .right-box {
    position: relative;
    // flex: 2;
    width: 66.66%;
    .rightcontainer {
      position: absolute;
      top: 0px;
      left: -15px;
      width: calc(100% + 15px);
      height: 100%;
      padding: 20px 0px 20px 40px;
      display: flex;
      flex-direction: column;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.5;
        background: url("~assets/img/total/onebg.png") no-repeat center center /
          100% 100%;
      }
      .rc-top {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .txt {
          font-size: 25px;
          color: #ffffff;
          letter-spacing: 2px;
        }
      }
      .rc-bottom {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .num {
          font-family: YouSheBiaoTiHei;
          font-size: 30px;
          color: transparent;
          letter-spacing: 1px;
          background-image: linear-gradient(
            rgb(255, 255, 255),
            rgb(255, 215, 0),
            rgb(250, 212, 0)
          );
          background-clip: text; // 裁剪背景到文字区域
          -webkit-background-clip: text; // 兼容 WebKit 浏览
        }
        .unit {
          font-weight: 400;
          font-size: 19px;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>
