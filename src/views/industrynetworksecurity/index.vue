<template>
  <div class="aerospace">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <PageSelect :title="keyWord" :introduction="introduction" :showDropdown="false"></PageSelect>
      <div class="left1">
        <div class="overflow-container1">
          <div
            class="overflow-item"
            v-for="(item, i) in totalOneList1"
            :key="i"
            v-show="!(keyWord.includes('新能源汽车') && i === 1)"
          >
            <div class="item-icon"></div>
            <div class="item-info">
              <div class="name">
                {{ item.name }}
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="top"
                  v-if="i === 2"
                >
                  <template #content>
                    <div style="width: 180px">
                      网络安全风险指数体系由暴露面指数（20%）、外部威胁指数（30%）及失陷指标指数（50%）三个核心维度加权构成。通过对各维度下的细化指标进行量化评分，最终构成0-100分的综合风险值，并据此划分为高、中、低三个风险等级，综合评估重点产业链的网络安全状况。
                    </div>
                  </template>
                  <el-icon
                    style="
                      color: #fff;
                      margin-left: -4px;
                      font-size: var(--font-label);
                    "
                    ><QuestionFilled
                  /></el-icon>
                </el-tooltip>
              </div>
              <div>
                <el-popover
                  placement="bottom"
                  :width="i === 0 ? 1400 : 600"
                  trigger="hover"
                  v-if="i === 0"
                >
                  <template #reference
                    ><span class="value" @mouseover="showPopover(i)">{{
                      formatNumber(item.value)
                    }}</span></template
                  >
                  <div
                    style="padding: 20px; backdrop-filter: blur(10px)"
                    v-if="i === 0"
                  >
                    <div class="search-item">
                      <span>企业名称：</span>
                      <el-input
                        class="custom-search-input"
                        style="width: 312px; margin-bottom: 10px"
                        placeholder="企业名称"
                        v-model="searchCompanyName"
                      ></el-input>
                      <div
                        class="custom-search-button"
                        @click="getIntegratedCompanyListData(1)"
                      >
                        查询
                      </div>
                    </div>
                    <act-table
                      :showSeq="false"
                      :columns="[
                        { label: '企业名称', prop: 'companyname', width: 500 },
                        { label: '注册省份', prop: 'registProvince' },
                        {
                          label: '行业小类',
                          prop: 'subIndustryName',
                          width: 400,
                        },
                        { label: '注册资金', prop: 'registMoney' },
                      ]"
                      :tableData="integratedCompanyList"
                      :needScroll="false"
                      style="height: 250px"
                    >
                      <template #companyname="{ row }">
                        <div
                          class="company-name"
                          :title="row.companyname"
                          style="
                            cursor: pointer;
                            font-size: 18px;
                            text-decoration: underline;
                          "
                          @click="goto(row.companyname)"
                        >
                          {{ row.companyname }}
                        </div>
                      </template>
                    </act-table>
                    <el-pagination
                      layout="prev, pager, next"
                      :total="total"
                      :current-page="currentPage"
                      style="text-align: right; margin-top: 10px"
                      @current-change="getIntegratedCompanyListData"
                    />
                  </div>
                </el-popover>
                <span class="value" v-else>{{ formatNumber(item.value) }}</span>
                <span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="left2">
        <chart-box title="四大原材料行业遭受攻击分布">
          <template v-slot:chart>
            <div class="raw-materials-grid">
              <div class="raw-materials-item" v-for="(item, i) in rawMaterialsList" :key="i">
                <div class="item-left">
                  <div class="item-logo">
                    <img v-if="item.icon === 'petrochemical'" src="./imgs/petrochemical.png" alt="石油化工" />
                    <img v-else-if="item.icon === 'building'" src="./imgs/building.png" alt="建材工业" />
                    <img v-else-if="item.icon === 'metal'" src="./imgs/metal.png" alt="有色金属" />
                    <img v-else-if="item.icon === 'steel'" src="./imgs/steel.png" alt="钢铁工业" />
                  </div>
                  <div class="item-name">{{ item.name }}</div>
                </div>
                <div class="item-right">
                  <div class="data-row">
                    <span class="data-label">网络攻击次数</span>
                    <span class="data-value" :style="{ color: item.attackColor }">{{ formatNumber(item.attackCount) }}次</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">风险企业数量</span>
                    <span class="data-value" :style="{ color: item.riskColor }">{{ item.riskCount }}家</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="center-top">
        <chart-box title="网络攻击分布情况">
          <template v-slot:chart>
            <div class="total-container">
                <div
                  class="total-card"
                  v-for="(item, i) in totalOneList2"
                  :key="i"
                >
                  <total-one :data="item"></total-one>
                </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="center-con">
        <div class="sin sin1">
           <chart-box title="网络攻击类型排名" :showLine="false">
            <template v-slot:chart>
              <ul class="battery-bar system-scrollbar">
                <li
                  class="item"
                  v-for="(item, i) in batteryList"
                  :key="item.name"
                >
                  <div class="bar-box">
                    <div class="bg"></div>
                    <div class="battery-chart-box">
                      <battery-rank-bar2
                        :data="item"
                        :serial="i + 1"
                        :max="batteryList[0].value"
                        unit="次"
                      ></battery-rank-bar2>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
          </chart-box>
        </div>
        <div class="sin sin2">
          <chart-box title="境外攻击来源TOP5" :showLine="false">
            <template v-slot:chart>
              <div class="rank-container" style="height: 100%">
                <RankBar
                  :data="[{
                    name: '攻击次数',
                    list: foreignAttackSourceList
                  }]"
                  :showNational="true"
                ></RankBar>
              </div>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="center-bot">
        <chart-box title="网络攻击变化趋势" :showLine="false" class="trend-chart">
            <template v-slot:chart>
              <LineArea :data="lineData"></LineArea>
            </template>
          </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right-top">
        <chart-box title="被攻击企业排名">
          <template v-slot:chart>
            <CustomRankingList
              :listData="sortedCompanyList"
              nameKey="attackedCorpname"
              valueKey="attackedTotal"
            />
          </template>
        </chart-box>
      </div>
      <div class="right1">
        <div class="fui-card">
          <div class="block-title" style="color: #ffffff; font-weight: bold;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            安全事件预警与协同机制
          </div>
          <div class="bottom-content-wrapper">
            <!-- 专属事件列表 - 左右排列 -->
            <div class="events-col">
              <div class="notify-info" v-for="event in warningEventsList" :key="event.id">
                <span class="notify-title">{{ event.title }}</span>
                <div class="notify-content-row">
                  <div class="risk-details">
                    <div class="detail-item">
                      <span class="detail-label">风险类型：</span>
                      <span class="detail-value">{{ event.riskType }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">风险等级：</span>
                      <span class="detail-value">{{ event.riskLevel }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">通报时间：</span>
                      <span class="detail-value">{{ event.notifyTime }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">处置状态：</span>
                      <span class="detail-status">{{ event.status }}</span>
                    </div>
                  </div>
                  <div class="report-thumb" @click="openDia(event.imgBase64)">
                    <img :src="require('./imgs/report.png')">
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 弹框 -->
  <el-dialog v-if="notificationType === 1"
    v-model="notificationModalVisible"
    title="预警详情"
    width="800px"
    destroy-on-close
    append-to-body
    custom-class="right2Dialog"
    :before-close="closeNotificationModal"
  >
    <div v-if="notificationType === 1" class="dialog-image-container">
      <el-image :src="notificationImgUrl" lazy class="dialog-image"/>
    </div>
  </el-dialog>
  <el-dialog
    v-model="notificationModalVisible"
    title="预警详情"
    width="800px"
    destroy-on-close
    append-to-body
    custom-class="right2Dialog"
    :before-close="closeNotificationModal"
    v-if="notificationType === 2"
  >
    <div v-if="notificationType === 2" class="dialog-image-container">
      <el-image :src="notificationImgUrl" lazy class="dialog-image"/>
    </div>
  </el-dialog>
</template>

<script setup>
import PageSelect from "@c/PageSelect";
import { useDataFun } from "./hooks/useData";
import TotalOne from "@c/ActTotal/one.vue";
import chartBox from "@c/chartBox";
import BatteryRankBar2 from "@c/echarts/bar/BatteryRankBar2";
import LineArea from "@c/echarts/Line/lineArea";
import ActTable from "@c/ActTable";
import ActTabs from "@c/ActTabs";
import CustomRankingList from "@/components/CustomRankingList/index.vue";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, watch, ref } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";

const router = useRouter();

function formatNumber(num) {
  if (num == null || num === "") return "";
  num = Number(num);
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return num.toLocaleString();
}

// 安全事件预警与协同机制相关变量
const notificationModalVisible = ref(false)
const notificationImgUrl = ref("")
const notificationType = ref(1) // 1: 图片, 2: 结构化内容



function openDia(imgBase64){
  notificationModalVisible.value = true
  notificationImgUrl.value = imgBase64
}


const store = useStore();
const keyWord = computed(() => {
  // return store.state.page.keyWord;
  return "原材料工业";
});
const {
  warningEventsList,
  totalOneList1,
  totalOneList2,
  rawMaterialsList,
  introduction,
  total,
  getIntegratedCompanyListData,
  searchCompanyName,
  currentPage,
  integratedCompanyList,
  showPopover,
  batteryList,
  lineData,
  companyList,
  tabsList,
  activeTab,
  changeTab,
  foreignAttackSourceList,
} = useDataFun(keyWord);

const sortedCompanyList = computed(() => {
  return [...companyList.value].sort((a, b) => b.attackedTotal - a.attackedTotal);
});

watch(
  keyWord,
  (val) => {
    if (val === "车联网企业") {
      totalOneList1.value[0].name = "车联网企业数量";
    } else if (val === "新能源汽车") {
      totalOneList1.value[0].name = "新能源汽车企业数量";
    } else {
      totalOneList1.value[0].name = "监测企业数量";
    }
  },
  {
    immediate: true,
  }
);

function goto(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}&sourceType=2&uploadLabel=${keyWord.value}`);
}

function closeNotificationModal() {
  notificationModalVisible.value = false;
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

:deep() {
  .custom-search-input .el-input__inner {
    border-radius: 20px;
    border: 2px solid #3fc3ff;
    height: 38px;
    color: #184077;
    font-size: var(--font-number-sm);
    background: linear-gradient(90deg, #eaf6ff 0%, #d6eaff 100%);
    box-shadow: none;
    padding: 0 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    font-family: var(--font-family-body);
  }
  .custom-search-input .el-input__inner:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    background: linear-gradient(90deg, #f5fbff 0%, #e3f2ff 100%);
  }
  .custom-search-input .el-input__inner::placeholder {
    color: #c0c9d8;
    font-size: var(--font-body);
    letter-spacing: 1px;
    font-family: var(--font-family-body);
  }
}

.custom-search-button {
  display: inline-block;
  margin-left: 12px;
  border-radius: 20px;
  background: linear-gradient(90deg, #3fc3ff 0%, #409eff 100%);
  color: #fff;
  font-size: var(--font-label);
  height: 38px;
  line-height: 38px;
  padding: 0 32px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
  user-select: none;
  border: none;
}
.custom-search-button:hover {
  background: linear-gradient(90deg, #409eff 0%, #3fc3ff 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.18);
}

.search-item > span {
  color: #fff;
  font-size: var(--font-label);
  font-weight: 500;
  margin-right: 10px;
  vertical-align: middle;
  line-height: 38px;
  font-family: var(--font-family-body);
}
</style>
<style lang="scss">
.el-overlay-dialog{
   overflow:hidden;
}
.centerDialog{
    .el-dialog__body {
        height:82vh;
        overflow: hidden;
  }
}
.right2Dialog {
  --el-dialog-margin-top: 5vh;
   .el-dialog__header{
    text-align: center;
    }
  .el-dialog__body {
     height:82vh;
     overflow-y: auto;
     overflow-x: hidden;

     // 自定义滚动条样式
     &::-webkit-scrollbar {
       width: 8px;
     }

     &::-webkit-scrollbar-track {
       background: rgba(0, 0, 0, 0.2);
       border-radius: 4px;
     }

     &::-webkit-scrollbar-thumb {
       background: linear-gradient(180deg, #4dd5ff, #0061c1);
       border-radius: 4px;

       &:hover {
         background: linear-gradient(180deg, #6fe7ff, #1396f9);
       }
     }
  }
}
</style>
