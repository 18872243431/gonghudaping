<template>
  <div class="import-task-serve">
    <div class="left">
      <div class="container-title">重保任务支撑流程</div>
      <div class="container-content">
        <img src="./imgs/flow.png" alt="" />
      </div>
    </div>
    <div class="right">
      <div class="container-title">重保支撑任务概览</div>
      <div class="right1">
        <div class="right1-title">
        任务概况
        </div>
        <div class="overview-container-bottom">
          <div class="overview-card overview-card-total">
            <div class="card-icon">
              <el-icon :size="48" color="#24daff"><Document /></el-icon>
            </div>
            <div class="card-content">
              <span class="card-label">支撑保障任务</span>
              <span class="card-value">{{ total.totalCount }}</span>
              <span class="card-unit">项</span>
            </div>
          </div>
          <div class="overview-card overview-card-doing">
            <div class="card-icon">
              <el-icon :size="48" color="#ffc107"><Clock /></el-icon>
            </div>
            <div class="card-content">
              <span class="card-label">进行中</span>
              <span class="card-value">{{ total.doingCount }}</span>
              <span class="card-unit">项</span>
            </div>
          </div>
          <div class="overview-card overview-card-done">
            <div class="card-icon">
              <el-icon :size="48" color="#4caf50"><CircleCheck /></el-icon>
            </div>
            <div class="card-content">
              <span class="card-label">已结束</span>
              <span class="card-value">{{ total.doneCount }}</span>
              <span class="card-unit">项</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right2">
        <div class="task-title">保障支撑任务</div>
        <el-carousel
          indicator-position="none"
          arrow="hover"
          :autoplay="true"
          height="280px"
          :interval="8000"
          v-if="list1.length > 0"
        >
          <el-carousel-item
            v-for="(page, pageIndex) in list1Pages"
            :key="pageIndex"
          >
            <div class="list-container">
              <div
                :class="['list-item', `list-item-${item.status}`]"
                v-for="item in page"
                :key="item.name"
                :title="item.name"
                @click="getPage(item.id)"
              >
                <div class="list-top">
                <div class="item-name">{{ item.name }}</div>
                <div :class="['item-status', `item-status-${item.status}`]">
                  {{ item.status === 1 ? "进行中" : "已结束" }}
                </div>
                </div>
                
                <div class="img-container">
                  <img :src="item.imgUrl" alt="" />
                </div>
                <div class="item-time">
                  <el-icon><Timer /></el-icon>{{ item.time }}
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div v-else class="emptyBox"></div>
      </div>
      <div class="right3">
        <div class="task-title">典型重保任务案例</div>
        <div class="list-container" v-if="list2.length > 0">
          <div
            :class="['list-item', `list-item-${item.status}`]"
            v-for="item in list2.slice(0, 5)"
            :key="item.name"
            :title="item.name"
            @click="goto(item)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div :class="['item-status', `item-status-${item.status}`]">
              {{ item.status === 1 ? "进行中" : "已结束" }}
            </div>
            
             <div class="metrics-container">
              <div class="metrics-row" v-if="item.metrics">
                <div class="metrics-half metrics-half--mb">
                  监测对象：<span class="metrics-value metrics-value--blue">{{ item.metrics.monitorObjects }}</span>
                </div>
                <!-- <div class="metrics-half metrics-half--mb">
                  监测域名：<span class="metrics-value metrics-value--blue">{{ item.metrics.monitorDomains }}</span>
                </div> -->
                <div class="metrics-half">
                  攻击总数：<span class="metrics-value metrics-value--blue">{{ item.metrics.attackTotal }}</span>
                </div>
              </div>
              <div class="metrics-risk" v-if="item.metrics">
                风险类型：<span class="metrics-value metrics-value--yellow">{{ item.metrics.riskType }}</span>
              </div>
              <div class="metrics-harm" v-if="item.metrics">危害：{{ item.metrics.harm }}</div>
            </div>
            <div class="item-time">
              <el-icon><Timer /></el-icon>{{ item.time }}
            </div>
          </div>
        </div>
        <div v-else class="emptyBox"></div>
      </div>
    </div>
    
    <el-dialog
      v-model="dialogVisible"
      :title="currentEvent.detail?.popupTitle || currentEvent.name"
      width="1300px"
      append-to-body
      custom-class="task-dialog dialog-custom spec import-task-title"
    >
      <Dialog101 v-if="currentEvent.id === 1" :data="currentEvent" />
      <Dialog102 v-else-if="currentEvent.id === 2" :data="currentEvent" />
      <Dialog103 v-else-if="currentEvent.id === 3" :data="currentEvent" />
    </el-dialog>
  </div>
</template>

<script setup>
import { useData } from "./hooks/useData";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Dialog101 from "./Dialog101.vue";
import Dialog102 from "./Dialog102.vue";
import Dialog103 from "./Dialog103.vue";
import { computed, ref } from "vue";
import { Timer, Document, Clock, CircleCheck } from "@element-plus/icons-vue";
const { total, list1, list2 } = useData();

const list1Pages = computed(() => {
  const pages = [];
  const arr = Array.isArray(list1.value) ? list1.value : [];
  for (let i = 0; i < arr.length; i += 5) {
    pages.push(arr.slice(i, i + 5));
  }
  return pages;
});
const router = useRouter();
const store = useStore();
const dialogVisible = ref(false);
const currentEvent = ref({});
function getPage(id){
   store.commit("page/setEventId", id);
   router.push("/specialMonitoring");
}
function goto(item) {
    currentEvent.value = {...item}
    dialogVisible.value = true;
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style>
/* 仅修改本页面弹框标题样式（通过唯一 class: import-task-title） */
.el-dialog.import-task-title .el-dialog__header { padding: 16px 20px 10px; border-bottom: 1px solid rgba(36,153,243,0.25); }
.el-dialog.import-task-title .el-dialog__title { color: #ffffff !important; font-size: 22px; font-weight: 600; padding-left: 16px; position: relative; display: inline-block; }
.el-dialog.import-task-title .el-dialog__title::before { content: ""; position: absolute; left: 0; top: 2px; width: 6px; height: 20px; border-radius: 3px; background: linear-gradient(180deg,#20b7f3,#24daff); box-shadow: 0 0 8px rgba(36,153,243,0.5); }
</style>
