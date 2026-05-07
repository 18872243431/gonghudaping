<template>
  <div class="total-two">
    <div class="two-box">
      <div class="two-box-left">
        <img :src="require(`@/assets/img/total/iconbg.png`)" class="xicon" />
        <span class="xtitle">{{ data.label1 }}</span>
      </div>
      <div class="two-box-right">
        <span class="xvalue1">{{ data.value1 }}</span>
        <span
          class="icon iconfont icon-shangsheng"
          v-if="data.status1 === 'up'"
        />
        <span class="icon iconfont icon-xiajiang1" v-else />
      </div>
    </div>
    <div class="two-box">
      <div class="two-box-left">
        <img :src="require(`@/assets/img/total/iconbg.png`)" class="xicon" />
        <span class="xtitle">{{ data.label2 }}</span>
      </div>
      <div class="two-box-right">
        <span class="xvalue2">{{ data.value2 }}</span>
        <span
          class="icon iconfont icon-shangsheng"
          v-if="data.status2 === 'up'"
        />
        <span class="icon iconfont icon-xiajiang1" v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {
        label1: "环比增长",
        value1: "0%",
        status1: "up",
        label2: "同比下降",
        value2: "0%",
        status2: "down",
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.total-two {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 30px 10px 20px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.5;
    background: url("~assets/img/total/two-totalbg.png") no-repeat center center /
      100% 100%;
  }
  .two-box {
    flex: 1;
    display: flex;
    &-left {
      flex: 3;
      margin-right: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .xicon {
        width: 26px;
        height: 30px;
      }
      .xtitle {
        font-weight: bold;
        font-size: 18px;
        color: #ffffff;
        letter-spacing: 2px;
      }
    }
    &-right {
      flex: 4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .xvalue1 {
        font-weight: bold;
        font-size: 26px;
        color: #ffbd43;
        letter-spacing: 3px;
      }
      .xvalue2 {
        font-weight: bold;
        font-size: 26px;
        color: rgba(75, 210, 253, 1);
        letter-spacing: 3px;
      }
      .icon-shangsheng {
        font-size: 20px;
        color: rgba(0, 255, 167, 1);
      }
      .icon-xiajiang1 {
        font-size: 20px;
        color: rgba(255, 58, 47, 1);
      }
    }
  }
}
</style>
