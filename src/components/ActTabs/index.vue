<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-17 17:43:40
 * @LastEditTime: 2021-12-17 18:07:24
 * @Description: 
-->
<template>
  <ul class="tabs-list" :style="{ top: top, right: right }">
    <li
      :class="{ active: active === tab.value }"
      v-for="tab in tabsList"
      :key="tab.label"
      @click="click(tab)"
    >
      {{ tab.label }}
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  top: {
    type: String,
    default: "-28px",
  },
  right: {
    type: String,
    default: "0px",
  },
  active: {
    type: String,
    default: "day",
  },
  tabsList: {
    type: Array,
    default: () => {
      return [
        { label: "日", value: "day" },
        { label: "周", value: "week" },
        { label: "月", value: "month" },
      ];
    },
  },
});
const emit = defineEmits(["change-tab"]);
function click(tab) {
  emit("change-tab", tab.value);
}
</script>

<style lang="scss">
.tabs-list {
  position: absolute;
  display: flex;
  z-index: 999;
  li {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    padding: 3px vw(14);
    margin-right: 5px;
    cursor: pointer;
    border: 1px solid rgba(102, 215, 255, 0.3);
    border-radius: 15px;
    // border-image: linear-gradient(60deg, rgba(0, 34, 50, 0), rgba(102, 215, 255, 0.3), rgba(0, 34, 50, 0)) 1 1;
    box-shadow: 0px 0px 7px 0px rgba(58, 189, 250, 0.3) inset;
    &:hover,
    &.active {
      color: #fff;
      box-shadow: 0px 0px 8px 0px #3fc3ff inset;
      border: 1px solid rgba(255, 255, 255, 0.6);
      // border-image: linear-gradient(60deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1 1;
    }
  }
}
</style>
