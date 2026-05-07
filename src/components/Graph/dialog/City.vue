<template>
  <div class="city-container">
    <div class="city">
      <div class="operator-icon">
        <img
          :src="require(`@/assets/img/graph/${item.operatorValue}-icon.png`)"
          alt=""
        />
      </div>
      <div class="city-name">{{ item.name }}</div>
    </div>
    <div class="lines">
      <div
        class="line-left"
        v-if="projectList.length === 3 || projectList.length === 2"
      ></div>
      <div
        class="line-center"
        v-if="projectList.length === 3 || projectList.length === 1"
      ></div>
      <div
        class="line-right"
        v-if="projectList.length === 3 || projectList.length === 2"
      ></div>
    </div>
    <div
      class="projects"
      :style="{
        justifyContent: projectList.length === 1 ? 'center' : 'space-between',
      }"
    >
      <el-popover
        v-for="project in projectList"
        :key="project.name"
        :width="180"
        trigger="hover"
        placement="top"
      >
        <template #reference>
          <div class="project">
            <div class="project-icon">
              <img
                :src="require(`@/assets/img/graph/${project.value}-icon.png`)"
                alt=""
              />
            </div>
            <p class="name">{{ project.name }}</p>
          </div>
        </template>
        <Detail></Detail>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Detail from "./Detail.vue";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      name: "",
      operatorValue: "",
    }),
  },
});

const projectList = ref([
  { name: "IDC业务", value: "idc" },
  { name: "僵木蠕业务", value: "woodenHorse" },
  { name: "恶意业务", value: "spite" },
]);
</script>

<style lang="scss" scoped>
.city-container {
  width: 100%;
  padding-bottom: 30px;
  .city {
    width: 132px;
    height: 79px;
    transform: scale(1.5);
    background: url(~assets/img/graph/city-active-img.png) no-repeat center /
      100% 100%;
    cursor: pointer;
    position: relative;
    margin: 0 auto;
    z-index: 999;
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
    .city-name {
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
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%) scale(0.8);
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
  .projects {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    width: 704px;
    height: 140px;
    margin-top: -32px;
    .project {
      width: 135px;
      height: 107px;
      background: url(~assets/img/graph/project-img.png) no-repeat center / 100%
        100%;
      cursor: pointer;
      position: relative;
      transition: all 0.1s;
      &:hover {
        background: url(~assets/img/graph/project-active-img.png) no-repeat
          center / 100% 100%;
        transform: scale(1.2);
        margin-top: 20px;
        .project-icon {
          top: 16px;
        }
      }
      .project-icon {
        position: absolute;
        width: 56px;
        height: 56px;
        top: 26px;
        left: 36px;
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
        bottom: -16px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
