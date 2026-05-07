<template>
  <div class="operator-container">
    <div class="operator">
      <div class="operator-icon">
        <img
          :src="require(`@/assets/img/graph/${item.value}-icon.png`)"
          alt=""
        />
      </div>
      <div class="operator-name">{{ item.name }}</div>
    </div>
    <div class="lines">
      <div
        class="line-left"
        v-if="cityList.length === 3 || cityList.length === 2"
      ></div>
      <div
        class="line-center"
        v-if="cityList.length === 3 || cityList.length === 1"
      ></div>
      <div
        class="line-right"
        v-if="cityList.length === 3 || cityList.length === 2"
      ></div>
    </div>
    <div
      class="cities"
      :style="{
        justifyContent: cityList.length === 1 ? 'center' : 'space-between',
      }"
    >
      <el-popover
        v-for="city in cityList"
        :key="city.name"
        :width="180"
        trigger="hover"
        placement="top"
      >
        <template #reference>
          <div class="city" @click="handleClick(city)">
            <div class="operator-icon">
              <img
                :src="require(`@/assets/img/graph/${item.value}-icon.png`)"
                alt=""
              />
            </div>
            <p class="name">{{ city.name }}</p>
          </div>
        </template>
        <Detail :list="city.list"></Detail>
      </el-popover>
    </div>
    <el-dialog v-model="dialogVisible" title="" width="740px">
      <City :item="activeItem"></City>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Detail from './Detail.vue'
import City from './City.vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      value: '',
      name: '',
    }),
  },
  cityList: {
    type: Array,
    default: () => [],
  },
})

const dialogVisible = ref(false)

const activeItem = ref({})

function handleClick(city) {
  activeItem.value = { ...city, operatorValue: props.item.value }
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.operator-container {
  width: 100%;
  padding-bottom: 60px;
  .operator {
    width: 137px;
    height: 126px;
    margin: 0 auto;
    .operator-icon {
      transform: scale(0.9);
    }
    background: url(~assets/img/graph/operator-active-img.png) no-repeat center /
      100% 100%;
    position: relative;
    z-index: 99;
    .operator-icon {
      position: absolute;
      width: 76px;
      height: 68px;
      top: 0;
      left: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .operator-name {
      width: 65px;
      height: 23px;
      font-size: 16px;
      font-family: "SourceHanSansCN-Regular", "PingFangSC-Regular","Microsoft YaHei", sans-serif;
      font-weight: bold;
      text-align: center;
      color: #ecffff;
      line-height: 23px;
      letter-spacing: 0px;
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .lines {
    position: relative;
    height: 136px;
    margin-top: -10px;
    .line-left {
      width: 279px;
      height: 150px;
      background: url(~assets/img/graph/line-side.png) no-repeat center / 100%
        100%;
      position: absolute;
      top: 0;
      left: 48px;
    }
    .line-center {
      width: 32px;
      height: 150px;
      background: url(~assets/img/graph/line-center.png) no-repeat center / 100%
        100%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .line-right {
      width: 279px;
      height: 150px;
      background: url(~assets/img/graph/line-side.png) no-repeat center / 100%
        100%;
      position: absolute;
      top: 0;
      right: 48px;
      transform: rotateY(180deg);
    }
  }
  .cities {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    width: 704px;
    .city {
      width: 132px;
      height: 79px;
      background: url(~assets/img/graph/city-img.png) no-repeat center / 100%
        100%;
      cursor: pointer;
      position: relative;
      transition: all 0.1s;
      &:hover {
        background: url(~assets/img/graph/city-active-img.png) no-repeat center /
          100% 100%;
        transform: scale(1.2);
      }
      .operator-icon {
        position: absolute;
        width: 38px;
        height: 34px;
        top: 7px;
        left: 42px;
        img {
          width: 110%;
          height: 110%;
        }
      }
      .name {
        width: 100%;
        height: 23px;
        font-size: 16px;
        font-family: "SourceHanSansCN-Regular", "PingFangSC-Regular","Microsoft YaHei", sans-serif;
        font-weight: bold;
        text-align: center;
        color: #ecffff;
        line-height: 23px;
        letter-spacing: 0px;
        position: absolute;
        bottom: -26px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
