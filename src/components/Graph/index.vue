<template>
  <div class="graph-container">
    <div class="system-box">
      <img class="icon" src="@/assets/img/graph/system-img.png" alt="" />
      <p class="title">{{ systemName }}</p>
      <img
        class="bottom"
        src="@/assets/img/graph/system-bottom-img.png"
        alt=""
      />
    </div>
    <div class="lines">
      <div class="line-left"></div>
      <div class="line-center"></div>
      <div class="line-right"></div>
    </div>
    <div class="operators">
      <el-popover
        v-for="item in operatorList"
        :key="item.name"
        :width="180"
        trigger="hover"
        placement="bottom"
      >
        <template #reference>
          <div class="operator" @click="handleClick(item)">
            <div class="operator-icon">
              <img
                :src="require(`@/assets/img/graph/${item.value}-icon.png`)"
                alt=""
              />
            </div>
            <div class="operator-name">{{ item.name }}</div>
          </div>
        </template>
        <Detail :list="item.list"></Detail>
      </el-popover>
    </div>
    <div class="big-bottom"></div>
    <el-dialog v-model="dialogVisible" title="" width="740px">
      <Operator :item="activeItem" :cityList="cityList"></Operator>
    </el-dialog>
  </div>
</template>

<script setup>
import Detail from './dialog/Detail'
import Operator from './dialog/Operator.vue'
import { usehook } from './hooks/use'
const {
  systemName,
  dialogVisible,
  activeItem,
  operatorList,
  cityList,
  handleClick,
} = usehook()
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
