<template>
  <el-config-provider :locale="locale">
    <scale-box :width="width">
      <router-view v-slot="{ Component }">
        <transition name="el-zoom-in-center" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </scale-box>
  </el-config-provider>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import ScaleBox from "@/components/ScaleBox";
import { useRoute } from "vue-router";
import { useTimeoutFn } from "@vueuse/core";
import { setToken } from "@/libs/cookie";

const route = useRoute();
const width = Number(process.env.VUE_APP_SCREEN_WIDTH);

watch(
  () => route.path,
  () => {
    insertPopover();
  }
);

onMounted(() => {
  // insertPopover();
  observePopoverElements();
  const urlObj = new URL(window.location.href);
  const queryString = urlObj.search;
  const queryPart = queryString.substring(1);
  if (queryPart) setToken(queryPart);
});

function insertPopover() {
  useTimeoutFn(() => {
    const children = document.querySelectorAll(
      ".el-popover,.el-dropdown__popper,.el-select__popper"
    );
    const scaleContainer = document.querySelector(".ScreenAdapter");
    children.forEach((child) => {
      scaleContainer.appendChild(child);
    });
  }, 800);
}

function observePopoverElements() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 &&
          (node.classList.contains("el-popover") ||
            node.classList.contains("el-dropdown__popper") ||
            node.classList.contains("el-select__popper") ||
            node.classList.contains("el-picker__popper"))
        ) {
          const scaleContainer = document.querySelector(".ScreenAdapter");
          if (scaleContainer && node.parentNode !== scaleContainer) {
            scaleContainer.appendChild(node);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

const locale = reactive({
  name: "zh-cn",
  el: {
    colorpicker: {
      confirm: "确定",
      clear: "清空",
    },
    datepicker: {
      now: "此刻",
      today: "今天",
      cancel: "取消",
      clear: "清空",
      confirm: "确定",
      selectDate: "选择日期",
      selectTime: "选择时间",
      startDate: "开始日期",
      startTime: "开始时间",
      endDate: "结束日期",
      endTime: "结束时间",
      prevYear: "前一年",
      nextYear: "后一年",
      prevMonth: "上个月",
      nextMonth: "下个月",
      year: "年",
      month1: "1 月",
      month2: "2 月",
      month3: "3 月",
      month4: "4 月",
      month5: "5 月",
      month6: "6 月",
      month7: "7 月",
      month8: "8 月",
      month9: "9 月",
      month10: "10 月",
      month11: "11 月",
      month12: "12 月",
      // week: '周次',
      weeks: {
        sun: "日",
        mon: "一",
        tue: "二",
        wed: "三",
        thu: "四",
        fri: "五",
        sat: "六",
      },
      months: {
        jan: "一月",
        feb: "二月",
        mar: "三月",
        apr: "四月",
        may: "五月",
        jun: "六月",
        jul: "七月",
        aug: "八月",
        sep: "九月",
        oct: "十月",
        nov: "十一月",
        dec: "十二月",
      },
    },
    select: {
      loading: "加载中",
      noMatch: "无匹配数据",
      noData: "无数据",
      placeholder: "请选择",
    },
    cascader: {
      noMatch: "无匹配数据",
      loading: "加载中",
      placeholder: "请选择",
      noData: "暂无数据",
    },
    pagination: {
      goto: "前往",
      pagesize: "条/页",
      total: "共 {total} 条",
      pageClassifier: "页",
      deprecationWarning:
        "你使用了一些已被废弃的用法，请参考 el-pagination 的官方文档",
    },
    messagebox: {
      title: "提示",
      confirm: "确定",
      cancel: "取消",
      error: "输入的数据不合法!",
    },
    upload: {
      deleteTip: "按 delete 键可删除",
      delete: "删除",
      preview: "查看图片",
      continue: "继续上传",
    },
    table: {
      emptyText: "暂无数据",
      confirmFilter: "筛选",
      resetFilter: "重置",
      clearFilter: "全部",
      sumText: "合计",
    },
    tree: {
      emptyText: "暂无数据",
    },
    transfer: {
      noMatch: "无匹配数据",
      noData: "无数据",
      titles: ["列表 1", "列表 2"],
      filterPlaceholder: "请输入搜索内容",
      noCheckedFormat: "共 {total} 项",
      hasCheckedFormat: "已选 {checked}/{total} 项",
    },
    image: {
      error: "加载失败",
    },
    pageHeader: {
      title: "返回",
    },
    popconfirm: {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    },
  },
});
</script>

<style lang="scss">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  @extend .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
  color: $--color-primary;
}
#app {
  @extend .size;
}
</style>
