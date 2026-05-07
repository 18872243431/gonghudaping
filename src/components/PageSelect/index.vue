<template>
  <div class="select-container">
    <div class="side-title">重点监测对象概述</div>
    <div class="title">{{ title }}</div>
    <div class="dropdown-container" v-if="specialList.length > 0">
      <el-dropdown>
        <el-icon style="font-size: 32px; color: #3fc3ff"
          ><CaretBottom
        /></el-icon>
        <template #dropdown>
          <el-dropdown-menu class="custom-dropdown-menu">
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
      {{ displayIntroduction }}
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
  title: {
    type: String,
    default: "",
  },
  introduction: {
    type: String,
    default: "",
  },
  showDropdown: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["click"]);
const store = useStore();

const specialList = ref([]);

const displayIntroduction = computed(() => {
  if (props.introduction) {
    return props.introduction;
  }
  const item = specialList.value.find((item) => item.label === props.title);
  if (item) {
    return item.industryInfo;
  }
  return "";
});
const router = useRouter();
async function getSpecialData() {
  if (!props.showDropdown) return;
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
  if (props.showDropdown) {
    getSpecialData();
  }
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
    width: 280px;
    height: 46px;
    top: 2px;
    right: 80px;
    font-family: SourceHanSansSC, SourceHanSansSC;
    font-weight: bold;
    font-size: 24px;
    color: #ffffff;
    line-height: 50px;
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
      opacity: 0.4;
      z-index: -1;
    }
  }
  .dropdown-container {
    position: absolute;
    top: 10px;
    right: 90px;
  }
}
</style>
