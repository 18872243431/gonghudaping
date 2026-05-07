<template>
  <div class="layout" ref="layout">
    <header>
      <div class="left-title-box">
        <img src="@/assets/img/layout/logo.png" alt="" />
        <span>{{ title }}</span>
      </div>
      <div class="titlebox">
        <span>{{ route.query.provinceName }}{{ activeMenuTitle }}</span>
      </div>
      <div class="current-time">
        <span v-html="currentTime"></span>
      </div>
      <div class="gohome-box" title="进入管理系统" @click="gotoHome">
        <el-icon><HomeFilled /></el-icon>
      </div>
      <div class="logout-box" title="退出登录" @click="logout">
        <el-icon><SwitchButton /></el-icon>
      </div>
      <ul class="menubox menubox-left">
        <li
          class="menu-item"
          v-for="(m, ind) in allmenus.slice(0, 3)"
          ref="buttonRef"
          :key="`menu${ind}`"
        >
          <div
            class="menu"
            v-if="!m.children && m.meta.hidden === false"
            :class="{
              active:
                route.matched.length === 2
                  ? m.path === route.path
                  : route.path.indexOf(m.path) > -1,
            }"
            @click="changeMenu(m.path)"
          >
            <span>{{ m.meta.title }}</span>
          </div>
          <template v-else-if="m.meta.hidden === false">
            <el-popover placement="bottom" :width="200" trigger="hover">
              <template #reference>
                <div
                  class="menu"
                  :class="{
                    active: m.children.find((item) => item.path === route.path),
                  }"
                  @click="changeMenu(m.path)"
                >
                  <span
                    >{{ m.meta.title }}
                    <!-- <el-icon style="margin-left: -5px"> <arrow-down /> </el-icon> -->
                  </span>
                </div>
              </template>
              <template #default>
                <el-menu>
                  <template v-for="subM in m.children">
                    <el-menu-item
                      v-if="subM.meta.hidden === false"
                      :key="subM.path"
                      :index="subM.path"
                      @click="changeMenu(subM.path)"
                      >{{ subM.meta.title }}</el-menu-item
                    >
                  </template>
                </el-menu>
              </template>
            </el-popover>
          </template>
        </li>
      </ul>
      <ul class="menubox menubox-right">
        <li
          class="menu-item"
          v-for="(m, ind) in allmenus.slice(3)"
          ref="buttonRef"
          :key="`menu${ind}`"
        >
          <div
            class="menu"
            v-if="!m.children && m.meta.hidden === false"
            :class="{
              active:
                route.matched.length === 2
                  ? m.path === route.path
                  : route.path.indexOf(m.path) > -1,
            }"
            @click="changeMenu(m.path)"
          >
            <span>{{ m.meta.title }}</span>
          </div>
          <template v-else-if="m.meta.hidden === false">
            <el-popover placement="bottom" :width="160" trigger="hover">
              <template #reference>
                <div
                  class="menu"
                  :class="{
                    active:
                      route.matched.length === 2
                        ? m.path === route.path
                        : route.path.indexOf(m.path) > -1,
                  }"
                  @click="changeMenu(m.path)"
                >
                  {{ m.meta.title }}
                </div>
              </template>
              <template #default>
                <el-menu>
                  <template v-for="subM in m.children">
                    <el-menu-item
                      v-if="subM.meta.hidden === false"
                      :key="subM.path"
                      :index="subM.path"
                      @click="changeMenu(subM.path)"
                      >{{ subM.meta.title }}</el-menu-item
                    >
                  </template>
                </el-menu>
              </template>
            </el-popover>
          </template>
        </li>
      </ul>
    </header>
    <section class="container">
      <router-view v-slot="{ Component }">
        <transition name="el-zoom-in-center">
          <div style="margin-top: 30px">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, watch, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowDown, SwitchButton, HomeFilled } from "@element-plus/icons-vue";
const store = useStore();
const router = useRouter(),
  route = useRoute();

const title = computed(() => store.getters.title);

const allmenus = computed(() =>
  store.getters.menus.filter((menu) => menu.path !== "/home")
);

console.error("全部菜单:", allmenus.value);

const changeMenu = (path) => {
  router.push({ path });
};

const activeMenuTitle = ref("");

const getTitleFromMenus = (menus, path) => {
  for (const m of menus) {
    if (m.path === path) return m.meta?.title || "";
    if (m.children && m.children.length) {
      const t = getTitleFromMenus(m.children, path);
      if (t) return t;
    }
  }
  return "";
};

const sanitizeTitle = (t) =>
  (t || "")
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/\s*（[^）]*）\s*/g, "")
    .trim();

watch(
  () => route,
  (currRoute) => {
    console.error("路由变化:", currRoute);
    activeMenuTitle.value = sanitizeTitle(
      getTitleFromMenus(allmenus.value, currRoute.path) || currRoute.meta.title
    );
  },
  {
    immediate: true,
    deep: true,
  }
);

// 新增部分
const currentTime = ref("");

const updateCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const weekDays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const weekDay = weekDays[now.getDay()];
  currentTime.value = `${year}.${month}.${day}&nbsp;&nbsp;&nbsp;${hours}:${minutes}:${seconds}&nbsp;&nbsp;&nbsp;${weekDay}`;
};

let intervalId;

onMounted(() => {
  updateCurrentTime(); // 初始化时间
  intervalId = setInterval(updateCurrentTime, 1000); // 每秒更新一次
});

onUnmounted(() => {
  clearInterval(intervalId); // 清除定时器
});

function gotoHome() {
  // window.location.href =
  //   "/index.html?" + decodeURIComponent(location.search).substr(1);
  window.open(
    "/index.html?" + decodeURIComponent(location.search).substr(1),
    "_blank"
  );
}

function logout() {
  window.location.href = "/login5.html";
}
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  user-select: text;
  background-color: #000f28;
  header {
    width: 100%;
    height: 90px;
    margin-bottom: 0px;
    position: relative;
    z-index: 1;
    background: url("~assets/img/layout/headerbg.png") no-repeat center center /
      100% 100%;
    .current-time {
      position: absolute;
      top: 0px;
      right: 80px;
      height: 36px;
      font-size: 16px;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .gohome-box {
      position: absolute;
      top: 2px;
      right: 30px;
      width: 33px;
      height: 38px;
      cursor: pointer;
      font-size: 18px;
      color: #fff;
      // background: url("~assets/img/layout/user.png") no-repeat center center /
      //   100% 100%;
      // transition: all 0.1s ease;
      // &::after {
      //   transform: scale(1.1);
      // }
    }
    .logout-box {
      font-size: 18px;
      position: absolute;
      top: 2px;
      right: 0px;
      width: 33px;
      height: 38px;
      cursor: pointer;
      color: #fff;
    }
    .left-title-box {
      position: absolute;
      top: 0px;
      left: 10px;
      width: 410px;
      height: 36px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        font-size: 18px;
        font-family: YouSheBiaoTiHei;
        font-weight: 500;
        letter-spacing: 0px;
        background: linear-gradient(180deg, #fafefe 60%, #1296f9 100%);
        text-align: center;
        color: transparent;
        text-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
        background-clip: text; // 裁剪背景到文字区域
        -webkit-background-clip: text; // 兼容 WebKit 浏览
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 3px;
      }
    }
    .titlebox {
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 569px;
      height: 72px;
      cursor: pointer;
      img {
        width: 45px;
        height: 45px;
        margin-right: 3px;
      }
      span {
        font-size: 36px;
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
        letter-spacing: 2px;
        background: linear-gradient(180deg, #fafefe 45%, #1296f9 100%);
        text-align: center;
        color: transparent;
        letter-spacing: 2px;
        text-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
        background-clip: text; // 裁剪背景到文字区域
        -webkit-background-clip: text; // 兼容 WebKit 浏览
      }
    }
    .menubox {
      position: absolute;
      top: 0px;
      height: 44px;
      display: flex;
      .menu-item {
        position: relative;
        cursor: pointer;
        height: 100%;
        margin-right: -20px;
        transition: all 0.1s ease;
        &:last-child {
          margin-right: 0px;
        }
        .menu {
          position: relative;
          min-width: 132px;
          height: 100%;
          font-weight: 500;
          text-align: center;
          font-family: YouSheBiaoTiHei;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            color: #ffffff !important;
          }
        }

        .active {
          background: url("~assets/img/layout/menuactive.png") no-repeat center
            center / 100% 100%;
          span {
            font-family: YouSheBiaoTiHei;
            background: linear-gradient(180deg, #fafefe 45%, #1296f9 100%);
            text-align: center;
            color: transparent;
            text-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
            background-clip: text; // 裁剪背景到文字区域
            -webkit-background-clip: text; // 兼容 WebKit 浏览
          }
        }
      }
      &-left {
        position: absolute;
        right: 1200px;
        justify-content: flex-end;
      }
      &-right {
        left: 1200px;
        justify-content: flex-start;
      }
    }
  }
  .container {
    position: relative;
    height: calc(100% - 100px);
    margin-top: -10px;
    z-index: 99;
    > div {
      height: 100%;
      padding: 0px 20px 0px 20px;
    }
  }
}
:deep(.el-carousel__arrow) {
  width: 32px;
  height: 32px;
}
</style>
