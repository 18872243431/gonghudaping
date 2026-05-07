<template>
  <div class="ScreenAdapter" :style="style">
    <slot />
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps({
  width: {
    type: String,
    default: "1920", // 设计稿大小
  },
  height: {
    type: String,
    default: "1080",
  },
});

const style = reactive({
  width: props.width + "px",
  height: props.height + "px",
  transform: "scale(1) translate(-50%, -50%)",
});
onMounted(() => {
  setScale();
  window.onresize = useDebounceFn(() => {
    setScale();
  }, 1000);
});

// 获取放大缩小比例
function getScale() {
  const w = window.innerWidth / props.width;
  const h = window.innerHeight / props.height;
  return [w, h];
}

// 设置比例
function setScale() {
  style.transform =
    "scale(" + getScale()[0] + "," + getScale()[1] + ") translate(-50%, -50%)";
}
</script>
<style lang="scss" scoped>
.ScreenAdapter {
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transition: 0.3s;
}
</style>
