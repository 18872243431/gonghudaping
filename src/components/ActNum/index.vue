<template>
  <span :style="{ textDecoration: allowClick ? 'underline' : '' }"
    >{{ showNum }}
  </span>
</template>

<script setup>
import { ref, toRefs, computed, watch } from "vue";
import { useTransition, TransitionPresets } from "@vueuse/core";

const props = defineProps({
  num: {
    type: Number,
    default: 0,
  },
  thousandsFmt: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 2500,
  },
  allowClick: {
    type: Boolean,
    default: false,
  },
});

const count = ref(0);
const { num, thousandsFmt, duration } = toRefs(props);

const showNum = computed(() => {
  // const value = thousandsFmt.value
  //   ? thousands(Math.round(output.value))
  //   : Math.round(output.value)
  const value = thousandsFmt.value
    ? thousands(output.value.toFixed(0))
    : output.value.toFixed(0);
  return value;
});

const output = useTransition(count, {
  duration: duration.value,
  transition: TransitionPresets.easeOutExpo,
});

function thousands(num) {
  let str = num.toString();
  const reg =
    str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, "$1,");
}
watch(
  () => props.num,
  (value) => {
    count.value = value;
  },
  { immediate: true }
);
</script>
