<template>
  <div class="targetMonitor">
    <div class="left-box">
      <div class="left-box-title">
        <span>重点保障服务一览</span>
      </div>
      <div class="left-box-content">
        <el-timeline>
          <el-timeline-item
            v-for="(month, index) in timelineData"
            :key="index"
            :timestamp="`${month.timestamp}`"
            :color="month.color"
            :placement="month.placement"
            :icon="month.icon"
          >
            <div class="month" v-for="(item, m) in month.list" :key="m">
              <div class="month-title">
                {{ item.month }}
              </div>
              <div
                v-for="(card, cardIndex) in item.cards"
                :key="cardIndex"
                class="custom-card"
                @click="goto(card.id)"
              >
                <div class="vertical-line"></div>
                <div class="card-content">
                  <h4>{{ card.title }}</h4>
                  <p>{{ card.description }}</p>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div class="right-box">
      <div class="right-box-top">
        <div class="title">
          <span class="label">服务保障活动：</span>
          <span class="value">{{ total }}项</span>
        </div>
        <div class="subtitle-list">
          <div
            class="subtitle"
            :class="`subtitle${i + 1}`"
            v-for="(item, i) in totalList"
            :key="item.name"
          >
            <span class="label">{{ item.name }}：</span>
            <span class="value">{{ item.value }}项</span>
          </div>
        </div>
      </div>
      <div class="right-box-bottom">
        <div class="rbb-top">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span class="title">服务保障</span>
              </div>
            </template>
            <div class="view">
              <div class="list">
                <div
                  class="item"
                  v-for="(item, i) in events"
                  :key="i"
                  @click="goto(item.id)"
                >
                  <div class="header">
                    <span class="title">{{ item.eventName }}</span>
                    <img
                      class="status-icon"
                      :src="require(`./imgs/status${item.eventStatus}.png`)"
                      alt=""
                      srcset=""
                    />
                  </div>
                  <img :src="require(`./imgs/${i + 1}.png`)" alt="" />
                  <div class="content">
                    <div class="date">
                      {{ item.startTimeStr }}—{{ item.endTimeStr }}
                    </div>
                    <div class="info">
                      <div class="info-item">
                        <span class="label">监测企业：</span>
                        <span class="value">{{ item.monitorCompanyNum }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">攻击数：</span>
                        <span class="value">{{ item.atdNum }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">风险企业数：</span>
                        <span class="value">{{ item.riskCompanyNum }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">通报企业数：</span>
                        <span class="value">{{ item.reportCompanyNum }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, onBeforeMount } from "vue";
import TimeIcon from "./timeIcon.vue";
// import { getGuaranteeList, getGuaranteeList2 } from "@/api/keyGuarantee";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import mockData from "./data.json";

const timelineData = ref([]);
const store = useStore();

const total = ref(0);
const totalList = ref([
  { name: "进行中", value: 0, key: "doingCount" },
  // { name: "未开始", value: 0, key: "undoingCount" },
  { name: "已结束", value: 0, key: "doneCount" },
]);

function getGuaranteeListData() {
  const res = mockData.guaranteeList;
  if (res.code === 0) {
    total.value = res.data.totalCount;
    totalList.value.forEach((item) => {
      item.value = res.data[item.key];
    });
    timelineData.value = Object.keys(res.data.bigEvent)
      .sort((a, b) => b - a)
      .map((year) => {
        const yearData = res.data.bigEvent[year];
        const list = Object.keys(yearData).map((month) => {
          const cards = yearData[month].map((item) => {
            return {
              ...item,
              title: item.eventName,
              description: `${item.startTimeStr}~${item.endTimeStr}`,
            };
          });
          return {
            month,
            cards,
          };
        });
        return {
          timestamp: year + "年",
          color: "rgba(0,0,0,0)",
          placement: "top",
          icon: markRaw(TimeIcon),
          list,
        };
      });
  }
}

const events = ref([]);
function getGuaranteeList2Data() {
  const res = mockData.guaranteeList2;
  if (res.code == 0) {
    events.value = res.data;
  }
}

onBeforeMount(() => {
  getGuaranteeListData();
  getGuaranteeList2Data();
});

const router = useRouter();
function goto(id) {
  store.commit("page/setEventId", id);
  router.push("/specialMonitoring");
}
</script>

<style scoped lang="scss">
@import "./index16.scss";
</style>
