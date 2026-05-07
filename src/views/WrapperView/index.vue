<template>
  <router-view v-slot="{ Component }">
    <transition name="el-zoom-in-center">
      <div class="wrapper">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>