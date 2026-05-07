<template>
  <div class="integrated-circuit">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-35px"
      style="transform: scale(0.8) translateX(30px)"
    ></ActTabs>
    <div class="left">
      <div class="left1">
        <div class="side-title">重点监测对象概述</div>
        <div class="title">{{ keyWord }}</div>
        <div class="dropdown-container">
          <el-dropdown trigger="hover">
            <el-icon style="font-size: var(--font-h2); color: #3fc3ff"
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
          <!-- 目前我国集成电路产业已初步形成了设计、制造和封测三业并举、较为协调的发展格局，产业链基本形成，国产供应能力日益增强，市场规模加速扩容。2024年，我国集成电路总产量达3952.7亿块，同比增长8.7%。 -->
        </p>
      </div>
      <div class="left2">
        <chart-box title="集成电路产量及同比增长变化趋势">
          <template v-slot:chart>
            <CubeBarLine
              :single="0"
              :data="barLineData"
              :option="{
                yAxis: [{}, {}],
                tooltip: {
                  formatter: (params) => {
                    const name = params[0].name;
                    const value1 = params[0].value;
                    const value2 = params[1].value;
                    // console.log(params);
                    return `<p style=font-size:var(--font-label);color:#fff;margin-bottom:10px>${name}</p>
                      <p style=font-size:var(--font-body);color:#fff;>产量：${value1}</p>
                      <p style=font-size:var(--font-body);color:#fff;>增长率：${value2}%</p>
                      `;
                  },
                },
              }"
            ></CubeBarLine>
          </template>
        </chart-box>
      </div>
      <div class="left3">
        <chart-box title="集成电路产业链图谱">
          <template v-slot:chart>
            <div class="left3-container">
              <img src="./imgs/flow.png" alt="" srcset="" />
              <div class="overview-list" v-if="false">
                <div
                  class="overview-item"
                  v-for="(item, i) in overviewList"
                  :key="i"
                >
                  <p class="row">
                    <span class="label">监测企业数量</span>
                    <span class="value"
                      >{{ item.value2 }}<span class="unit">家</span></span
                    >
                  </p>
                  <p class="row">
                    <span class="label">网络攻击数量</span>
                    <span class="value"
                      >{{ item.value1 }}<span class="unit">次</span></span
                    >
                  </p>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <!-- <div class="bg"></div> -->
      <div class="center1">
        <div class="overflow-container1">
          <div
            class="overflow-item"
            v-for="(item, i) in overflowData1"
            :key="i"
          >
            <div class="item-icon"></div>
            <div class="item-info">
              <div class="name">{{ item.name }}</div>
              <div>
                <el-popover
                  placement="bottom"
                  :width="i === 0 ? 1200 : 600"
                  trigger="hover"
                >
                  <template #reference>
                    <span class="value" @mouseover="showPopover(i)">{{
                      item.value
                    }}</span>
                  </template>
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
                      class="table16"
                      :showSeq="false"
                      :columns="[
                        { label: '企业名称', prop: 'companyname', width: 450 },
                        { label: '注册省份', prop: 'registProvince' },
                        {
                          label: '行业小类',
                          prop: 'subIndustryName',
                          width: 350,
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
                            text-decoration: underline;
                            font-size: 14px;
                          "
                          @click="gotoCompany(row.companyname)"
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
                  <div
                    style="
                      height: 290px;
                      padding: 20px;
                      backdrop-filter: blur(10px);
                    "
                    v-if="i === 1"
                  >
                    <act-table
                      class="table16"
                      :showSeq="true"
                      :columns="[
                        { label: '企业名称', prop: 'key' },
                        { label: '被攻击次数', prop: 'doc_count', width: 120 },
                      ]"
                      :tableData="riskCompanyList"
                      :needScroll="false"
                    >
                      <template #key="{ row }">
                        <div
                          class="company-name"
                          :title="row.key"
                          style="
                            cursor: pointer;
                            text-decoration: underline;
                            font-size: 14px;
                          "
                          @click="gotoCompany(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template></act-table
                    >
                  </div>
                </el-popover>
                <span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="total-box">
          <div class="total-box-t">
            <div
              class="total-card"
              v-for="(item, ind) in totalOneList"
              :key="ind"
            >
              <total-one :data="item"></total-one>
            </div>
          </div>
          <div class="total-box-b">
            <div
              class="total-card"
              v-for="(item2, ind2) in totalTwoList"
              :key="ind2"
            >
              <total-two :data="item2"></total-two>
            </div>
          </div>
        </div>
      </div>
      <div class="center2">
        <div class="chart-card">
          <chart-box title="网络攻击趋势" :showLine="false">
            <template v-slot:chart>
              <Line :option="lineOpts" :data="lineData1"></Line>
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="攻击源数量变化趋势 " :showLine="false">
            <template v-slot:chart>
              <Line :option="lineOpts" :data="lineData2"></Line>
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="被攻击IP地址数量变化趋势" :showLine="false">
            <template v-slot:chart>
              <Line :option="lineOpts" :data="lineData3"></Line>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="网络攻击分布情况">
          <template v-slot:chart>
            <div class="right1-container">
              <div class="right1-container-left" v-if="false">
                <div class="title">产业链遭受网络攻击分布情况</div>
                <div style="height: 460px">
                  <Pie :data="pieData" unit="次"></Pie>
                </div>
              </div>
              <div class="right1-container-right">
                <div class="title" v-if="false">产业链遭受网络攻击类型排名</div>
                <div style="height: 100%">
                  <RankBar :data="rankBarData" :showFlag="false"></RankBar>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <chart-box title="风险企业排名">
          <template v-slot:chart>
            <div class="company-list">
              <div
                class="company-item"
                v-for="(item, i) in companyList"
                :key="i"
              >
                <div class="logo">
                  <img
                    src="~@/views/abroadAttackerThreat/imgs/logo-seq.png"
                    alt=""
                    srcset=""
                  />
                  <div class="top" :class="`top${i + 1}`">TOP{{ i + 1 }}</div>
                </div>
                <div class="info">
                  <div
                    class="name"
                    :title="item.name"
                    style="cursor: pointer"
                    @click="gotoCompany(item.name)"
                  >
                    {{ item.name }}
                  </div>
                  <div class="detail">
                    <span class="label">被攻击次数</span>
                    <span class="value"
                      >{{ formatNumber(item.value1)
                      }}<span class="unit">次</span></span
                    >
                  </div>
                  <div class="detail">
                    <span class="label">被攻击IP数</span>
                    <span class="value"
                      >{{ formatNumber(item.value2)
                      }}<span class="unit">个</span></span
                    >
                  </div>
                  <div class="tags">
                    <span
                      class="tag"
                      v-for="(tag, i) in item.tags"
                      :key="i"
                      :title="tag"
                      >{{ tag }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import CubeBarLine from "@c/echarts/bar/CubeBarLine/index16.vue";
import ActTable from "@c/ActTable";
import TotalTwo from "@c/ActTotal/two1.vue";
import TotalOne from "@c/ActTotal/one.vue";
import Line from "@c/echarts/Line/lineArea16/index.vue";
import Pie from "@c/echarts/Pie/NewPie";
import RankBar from "@c/echarts/bar/CircleSymbolBar/index16.vue";
import ActTabs from "@c/ActTabs";
import { CaretBottom } from "@element-plus/icons-vue";
import { useLeft, useCenter, useRight } from "./hooks/useData";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const router = useRouter();
const keyWord = computed(() => {
  return store.state.page.keyWord;
});
const { specialList, barLineData, overviewList, introduction } = useLeft(
  keyWord.value
);
const {
  overflowData1,
  totalOneList,
  totalTwoList,
  lineData1,
  lineData2,
  lineData3,
  lineOpts,
  showPopover,
  riskCompanyList,
  integratedCompanyList,
  total,
  getIntegratedCompanyListData,
  searchCompanyName,
  currentPage,
} = useCenter();
const { pieData, companyList, rankBarData, tabsList, activeTab, changeTab } =
  useRight();

function handleClick(item) {
  store.commit("page/setKeyword", item.label);
  router.push(item.linkUrl);
}

const columns = [
  { label: "企业名称", prop: "name", showOverflowTooltip: true },
  { label: "被攻击次数", prop: "value1", width: 90 },
  { label: "被攻击IP数", prop: "value2", width: 110 },
  { label: "遭受网络攻击类型", prop: "tags", width: 150 },
];

function gotoCompany(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}&sourceType=2&uploadLabel='集成电路'`);
}

function formatNumber(num) {
  if (num == null || num === "") return "";
  const number = Number(num);
  if (isNaN(number)) return num;
  if (number >= 10000) {
    return (number / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  }
  return number.toLocaleString();
}
</script>

<style lang="scss" scoped>
@import "./index16.scss";

:deep() {
  .custom-search-input .el-input__inner {
    border-radius: 20px;
    border: 2px solid #3fc3ff;
    height: 38px;
    color: #184077;
    font-size: 18px;
    background: linear-gradient(90deg, #eaf6ff 0%, #d6eaff 100%);
    box-shadow: none;
    padding: 0 18px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  }
  .custom-search-input .el-input__inner:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    background: linear-gradient(90deg, #f5fbff 0%, #e3f2ff 100%);
  }
  .custom-search-input .el-input__inner::placeholder {
    color: #c0c9d8;
    font-size: 16px;
    letter-spacing: 1px;
    font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  }
  .el-pagination {
    font-size: var(--font-table, 14px);
  }
  .el-pagination .el-pager li {
    font-size: var(--font-table, 14px);
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    font-size: var(--font-table, 14px);
  }
  .el-pagination .btn-prev .el-icon,
  .el-pagination .btn-next .el-icon {
    font-size: var(--font-table, 14px);
  }
}

.custom-search-button {
  display: inline-block;
  margin-left: 12px;
  border-radius: 20px;
  background: linear-gradient(90deg, #3fc3ff 0%, #409eff 100%);
  color: #fff;
  font-size: 16px;
  height: 32px;
  line-height: 32px;
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
  font-size: 18px;
  font-weight: 500;
  margin-right: 10px;
  vertical-align: middle;
  line-height: 38px;
  font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}
</style>
