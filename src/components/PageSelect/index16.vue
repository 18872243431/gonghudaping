<template>
  <div class="select-container">
    <div class="side-title">重点监测对象概述</div>
    <div class="title">{{ title }}</div>
    <div class="dropdown-container" v-if="specialList.length > 0">
      <el-dropdown trigger="hover">
        <el-icon style="font-size: var(--font-h2, 24px); color: #3fc3ff"
          ><CaretBottom
        /></el-icon>
        <template #dropdown>
          <el-dropdown-menu class="custom-dropdown-menu sm">
            <el-dropdown-item
              v-for="item in specialList"
              :key="item.label"
              @click.native="handleClick(item)"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <p class="introduction">
      {{ introduction }}
    </p>
  </div>
</template>

<script setup>
import { CaretBottom } from "@element-plus/icons-vue";
import { ref, onBeforeMount, computed } from "vue";
import { getSpecial } from "@/api/integratedCircuit";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps({
  title: "",
});
const emits = defineEmits(["click"]);
const store = useStore();

const specialList = ref([
  // {
  //   label: "集成电路产业链",
  //   value: "集成电路产业链",
  // },
  // {
  //   label: "基础软件和工业软件",
  //   value: "基础软件和工业软件",
  // },
  // {
  //   label: "集成电路制造",
  //   value: "集成电路制造",
  // },
  // {
  //   label: "汽车电子应用",
  //   value: "汽车电子应用",
  // },
  // {
  //   label: "光刻机技术",
  //   value: "光刻机技术",
  // },
  // {
  //   label: "第三代半导体",
  //   value: "第三代半导体",
  // },
  // {
  //   label: "芯片封装测试",
  //   value: "芯片封装测试",
  // },
  // {
  //   label: "EDA软件工具",
  //   value: "EDA软件工具",
  // },
  // {
  //   label: "晶圆制造工艺",
  //   value: "晶圆制造工艺",
  // },
  // {
  //   label: "半导体材料",
  //   value: "半导体材料",
  // },
  // {
  //   label: "通信芯片",
  //   value: "通信芯片",
  // },
  // {
  //   label: "人工智能芯片",
  //   value: "人工智能芯片",
  // },
  // {
  //   label: "存储芯片",
  //   value: "存储芯片",
  // },
  // {
  //   label: "功率半导体",
  //   value: "功率半导体",
  // },
  // {
  //   label: "传感器芯片",
  //   value: "传感器芯片",
  // },
  // {
  //   label: "射频芯片",
  //   value: "射频芯片",
  // },
  // {
  //   label: "模拟芯片",
  //   value: "模拟芯片",
  // },
  // {
  //   label: "数字芯片",
  //   value: "数字芯片",
  // },
  // {
  //   label: "混合信号芯片",
  //   value: "混合信号芯片",
  // },
  // {
  //   label: "专用集成电路",
  //   value: "专用集成电路",
  // },
  // {
  //   label: "系统级芯片",
  //   value: "系统级芯片",
  // },
]);

const introduction = computed(() => {
  const item = specialList.value.find((item) => item.label === props.title);
  if (item) {
    return item.industryInfo;
  }
  return "";
});
const router = useRouter();
async function getSpecialData() {
  const res = await getSpecial();
  if (res.code === 0) {
    specialList.value = res.data;
  }
}

function handleClick(item) {
  store.commit("page/setKeyword", item.label);
  router.push(item.linkUrl);
}

onBeforeMount(() => {
  getSpecialData();
});
</script>

<style lang="scss" scoped>
.select-container {
  position: relative;
  .side-title {
    width: 1075px;
    height: 52px;
    font-family: YouSheBiaoTiHei;
    font-size: 34px;
    color: #ffffff;
    line-height: 52px;
    padding-left: 70px;
    position: relative;
    &::before {
      content: "";
      background: url(~assets/img/specialMonitoring/left-title.png) no-repeat
        center / 100% 100%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.5;
    }
  }
  .introduction {
    font-size: 20px;
    font-family: sans-serif;
    line-height: 40px;
    letter-spacing: 2px;
    color: rgb(165, 222, 245);
    text-shadow: rgba(0, 20, 58, 0.5) 0px 5px 5px;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 20px;
    height: 120px;
  }
  .title {
    position: absolute;
    width: 220px;
    height: 38px;
    top: 0px;
    right: 0px;
    font-family: SourceHanSansSC, SourceHanSansSC;
    font-weight: bold;
    font-size: var(--font-body, 24px);
    color: #ffffff;
    line-height: 42px;
    letter-spacing: 2px;
    text-align: center;
    font-style: normal;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(180deg, #00afff 0%, #04405b 100%);
      box-shadow: 0px 0px 10px 0px rgba(43, 156, 208, 0.64),
        inset 0px 0px 11px 0px #3fc3ff;
      border: 2px solid;
      border-image: linear-gradient(
        30deg,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0)
      );
      opacity: 0.3;
      z-index: -1;
    }
  }
  .dropdown-container {
    position: absolute;
    top: 4px;
    right: 0px;
  }
}
</style>
