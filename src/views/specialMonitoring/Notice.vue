<template>
  <div class="notice-item">
    <div class="time">· {{ data.timestamp }}</div>
    <div class="info" v-if="data.type == 1">
      <span style="margin-right: 14px">监测发现</span>
      <span style="margin-right: 14px">{{ data.attackedCorpName }}</span>
      <span style="color: rgba(255, 189, 67, 1); margin-right: 14px">{{
        data.attackedIp
      }}</span
      ><span>遭受（</span
      ><span style="color: rgba(255, 189, 67, 1); margin-right: 4px">{{
        data.attackIp
      }}</span>
      <span v-flag="{ hiddenText: true }">{{ data.attackCountry }}</span>
      <span>）的{{ data.eventTypeName }}</span>
    </div>
    <div class="info" v-if="data.type == 2">
      <span style="margin-right: 14px">监测发现</span>
      <span style="margin-right: 14px">{{ data.attackedCorpName }}</span>
      <span style="margin-right: 14px; color: rgba(255, 189, 67, 1)">{{
        data.attackedIp
      }}</span>
      <span>连接至（</span>
      <span style="color: rgba(255, 189, 67, 1); margin-right: 4px">{{
        data.attackIp
      }}</span>
      <span v-flag="{ hiddenText: true }">{{ data.attackCountry }}</span>
      <span style="margin-right: 14px">
        ），涉及{{ data.eventTypeName }}，存在数据泄露/远控风险
      </span>
    </div>
    <div class="info" v-if="data.type == 3">
      <span style="margin-right: 14px">监测发现</span>
      <span style="margin-right: 14px">{{ data.attackCorpName }}</span>
      <span style="margin-right: 14px; color: rgba(255, 189, 67, 1)"
        >{{ data.attackIp }}
      </span>
      <span>对（</span>
      <span style="color: rgba(255, 189, 67, 1); margin-right: 4px">{{
        data.attackedIp
      }}</span>
      <span v-flag="{ hiddenText: true }">{{ data.attackedCountry }}</span>
      <span style="margin-right: 14px">）实施{{ data.eventTypeName }}</span>
    </div>
    <div class="info" v-if="data.type == 4">
      <span style="margin-right: 14px">监测发现</span>
      <span style="margin-right: 14px">{{ data.attackedCorpName }}</span>
      <span style="margin-right: 14px; color: rgba(255, 189, 67, 1)">{{
        data.attackedIp
      }}</span>
      <span style="margin-right: 14px">感染{{ data.eventTypeName }} </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
.notice-item {
  display: flex;
  .time {
    color: rgba(75, 210, 253, 1);
    width: 200px;
    font-size: 20px;
  }
  .info {
    width: 850px;
    font-family: SourceHanSansSC, SourceHanSansSC;
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    line-height: 28px;
    text-align: left;
    font-style: normal;
    text-transform: lowercase;
    padding-left: 27px;
  }
}
</style>
