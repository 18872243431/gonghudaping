<template>
  <div class="detail">
    <p class="title">{{ dateStr }}上报情况</p>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.label">
        <span class="label">{{ item.label }}：</span>
        <span class="value">{{ item.value }}</span>
        <span class="unit">{{ item.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
const dateStr = getYesterdayDate()
function getYesterdayDate() {
  var date = new Date()
  date.setDate(date.getDate() - 1)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 // 月份从0开始
  var day = date.getDate()
  var formattedMonth = month < 10 ? '0' + month : month
  var formattedDay = day < 10 ? '0' + day : day
  return year + '年' + formattedMonth + '月' + formattedDay + '日'
}
</script>

<style lang="scss" scoped>
.detail {
  min-height: 156px;
  .title {
    height: 13px;
    font-size: 13px;
    font-family: "SourceHanSansCN-Regular", "PingFangSC-Regular","Microsoft YaHei", sans-serif;
    font-weight: 500;
    text-align: center;
    color: #ecffff;
    line-height: 13px;
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
    padding: 13px;
  }
  .list {
    margin-top: 8px;
    .item {
      height: 20px;
      position: relative;
      margin-bottom: 3px;
      padding-left: 33px;
      line-height: 20px;
      &:before {
        width: 8px;
        height: 8px;
        position: absolute;
        content: '';
        top: 5px;
        left: 20px;
        background: url(~assets/img/graph/circle.png) no-repeat center / 100%
          100%;
      }
      &::after {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
          263deg,
          rgba(46, 170, 234, 0) 2%,
          #2eaaea 89%
        );
        opacity: 0.15;
      }
      .label {
        color: #d0deee;
        text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
      }
      .value {
        color: #fdac42;
      }
      .unit {
        color: #d0deee;
      }
    }
  }
}
</style>
