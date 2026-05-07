<template>
  <div class="top-bar">
    <div class="bar-container" v-for="(item, index) in list" :key="index">
      <bar :data="[item]" :type="item.type" :max="max"></bar>
    </div>
  </div>
</template>

<script setup>
import Bar from './bar.vue'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const list = computed(() => {
  return props.data.map((item, index) => ({
    ...item,
    label: `${index + 1}. ${item.label}`,
  }))
})
const max = computed(() => {
  const valueList = props.data.map((item) => item.value)
  return Math.max.apply(null, valueList)
})
</script>

<style lang="scss" scoped>
.top-bar {
  width: 100%;
  height: 100%;
  min-height: 240px;
  border-top: 1px solid #0b2439;
  border-bottom: 1px solid #0b2439;
  .bar-container {
    width: 100%;
    height: 20%;
    border-bottom: 1px dashed rgba(14, 106, 175, 0.6);
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
