<template>
  <div class="aerospace">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <PageSelect :title="keyWord" :introduction="introduction"></PageSelect>
      <div class="left1">
        <div class="overflow-container1">
          <div
            class="overflow-item"
            v-for="(item, i) in totalOneList1"
            :key="i"
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
                      该指数通过加权计算暴露面指数、外部威胁指数与失陷指标指数三个维度，通过0-100分的量化评分划定高、中、低风险等级，以综合评估重点产业链的网络安全状况。
                    </div>
                  </template>
                  <el-icon
                    style="color: #fff; margin-left: -4px; font-size: 18px"
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
                    style="
                      height: 290px;
                      padding: 10px;
                      backdrop-filter: blur(10px);
                    "
                    v-if="i === 4"
                  >
                    <act-table
                      :showSeq="true"
                      :columns="[{ label: '企业名称', prop: 'key' }]"
                      :tableData="importCompanyList"
                      :needScroll="false"
                    >
                      <template #key="{ row }">
                        <div
                          class="company-name"
                          :title="row.key"
                          style="cursor: pointer; text-decoration: underline"
                          @click="gotoCompany(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template>
                    </act-table>
                  </div>
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
                            text-decoration: underline;
                            font-size: 20px;
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
                    v-if="i === 5"
                  >
                    <act-table
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
                          style="cursor: pointer; text-decoration: underline"
                          @click="gotoCompany(row.key)"
                        >
                          {{ row.key }}
                        </div>
                      </template>
                    </act-table>
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
        <chart-box title="网络攻击分布情况">
          <template v-slot:chart>
            <div class="total-container">
              <div class="total-box">
                <div class="total-box-t">
                  <div
                    class="total-card"
                    v-for="(item, i) in totalOneList2"
                    :key="i"
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
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="tips">
        <span class="label">总体安全态势</span>
        <p class="content">
          {{ overviewText }}
        </p>
      </div>
      <div class="center-content">
        <div class="l">
          <chart-box title="网络攻击类型排名">
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
                      ></battery-rank-bar2>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="risk-list">
                <div
                  class="risk-item"
                  v-for="(item, i) in riskList"
                  :key="item.name"
                >
                  <div class="info">
                    <div class="name">
                      <span class="label" :class="`label${i + 1}`">{{
                        item.name
                      }}</span>
                      <span class="value"
                        >{{ formatNumber(item.value) }}次</span
                      >
                    </div>
                    <div class="tags">
                      <div
                        class="tag"
                        :class="`tag${i + 1}`"
                        v-for="tag in item.tags"
                        :ke="tag"
                      >
                        {{ tag }}
                      </div>
                    </div>
                  </div>
                  <div class="chart">
                    <Gauge
                      :option="{
                        gaugeRadius: '80%',
                        progressWidth: 16,
                        axisTickLength: 6,
                        axisTickWidth: 1,
                        axisTickDistance: -22,
                        innerLineRadius: ['51%', '52%'],
                        innerCircleRadius: '48%',
                        ringRadius: 0.9,
                        ringShapeRadius: 3,
                        fontSize: 18,
                        fontColor: '#fff',
                      }"
                      :data="item.rate"
                      :color="item.color"
                    ></Gauge>
                  </div>
                </div>
              </div>
            </template>
          </chart-box>
        </div>
        <div class="r">
          <div class="t">
            <chart-box title="网络攻击变化趋势">
              <template v-slot:chart>
                <LineArea :data="lineData"></LineArea>
              </template>
            </chart-box>
          </div>
          <div class="b">
            <chart-box title="攻击国家排名及攻击源分析">
              <template v-slot:chart>
                <div class="container">
                  <div class="pie">
                    <Pie :data="pieData" unit="次"></Pie>
                  </div>
                  <div class="table">
                    <act-table
                      :showSeq="true"
                      :columns="columns1"
                      :tableData="ipList"
                      :needScroll="true"
                    >
                      <template #attackIp="{ row }">
                        <p style="font-size: 20px; color: #fff">
                          <span v-flag="{ hiddenText: true }">{{
                            row.attackCountry
                          }}</span>
                          <span>{{ row.attackIp }}</span>
                        </p>
                      </template>
                      <template #attackTypeList="{ row }">
                        <div class="tags">
                          <span
                            class="tag"
                            v-for="(tag, i) in row.attackTypeList"
                            :key="i"
                            :title="tag"
                            >{{ tag }}</span
                          >
                        </div>
                      </template>
                    </act-table>
                  </div>
                </div>
              </template>
            </chart-box>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="被攻击企业区域分布">
          <template v-slot:chart>
            <div class="map-container">
              <ChinaMap 
               :showClipDefs="true"
           :style="{ height: '98%', transform: 'scaleX(1) scaleY(0.9)', top: '-20px' ,left:'-120px'}"
                :data="mapData"
                :option="{...mapOption, 
                 visualMap2: {
                      ...mapOption.visualMap2,
                      left: 200,   /* 控制右侧图例的左右位置：需跟随左侧图例同步增加 */
                      top: 440,/* 控制右侧图例的上下位置：需跟随左侧图例同步调整 */
                    },label:{show: true, fontSize: 14, color: '#ffffff'},}"
                name1="遭受攻击企业数"
              ></ChinaMap>
            </div>
          </template>
        </chart-box>
        <div class="attack-list">
          <el-carousel height="180px" indicator-position="none">
            <el-carousel-item v-for="(item, i) in attackedList" :key="i">
              <div class="attack-item">
                <p class="time">{{ item.timestamp }}</p>
                <div class="content">
                  <div class="l">
                    <p class="attack">【{{ item.attackIp }}】</p>
                    <p class="attack">
                      <span v-flag>{{ item.attackCountry }}</span>
                      <span> - {{ item.name }}</span>
                    </p>
                    <span class="type">{{ item.eventTypeIdCn }}</span>
                  </div>
                  <div class="r">
                    <p class="attacked">{{ item.attackedcorpname }}</p>
                    <p class="info">
                      监测发现{{ item.attackedIp }}遭受来自{{
                        item.attackIp
                      }}的{{ item.eventTypeIdCn }}攻击。
                    </p>
                  </div>
                  <div class="attack-arrow"></div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="bar-container">
          <chart-box title="被攻击省份分布" :showLine="false">
            <template v-slot:chart>
              <RankBar :data="attackedData"></RankBar>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right2">
        <chart-box title="被攻击企业排名">
          <template v-slot:chart>
            <act-table
              :showSeq="true"
              :columns="columns2"
              :tableData="companyList"
              :needScroll="true"
            >
              <template #attackedCorpname="{ row }">
                <span
                  style="text-decoration: underline"
                  @click="goto(row.attackedCorpname)"
                  >{{ row.attackedCorpname }}</span
                >
              </template>
              <template #attackTypeList="{ row }">
                <div class="tags">
                  <span
                    class="tag"
                    v-for="(tag, i) in row.attackTypeList"
                    :key="i"
                    :title="tag"
                    >{{ tag }}</span
                  >
                </div>
              </template>
            </act-table>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageSelect from "@c/PageSelect";
import { useLeft, useCenter, useRight } from "./hooks/useData";
import TotalOne from "@c/ActTotal/one.vue";
import TotalTwo from "@c/ActTotal/two1.vue";
import chartBox from "@c/chartBox";
import BatteryRankBar2 from "@c/echarts/bar/BatteryRankBar2";
import Gauge from "@c/echarts/gauge";
import LineArea from "@c/echarts/Line/lineArea";
import Pie from "@c/echarts/Pie/NewPie";
import ActTable from "@c/ActTable";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import ChinaMap from "@/components/echarts/map/ImgChina/index";
import ActTabs from "@c/ActTabs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, watch } from "vue";
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

const store = useStore();
const keyWord = computed(() => {
  return store.state.page.keyWord;
  // return "车联网企业";
});
const {
  totalOneList1,
  totalOneList2,
  totalTwoList,
  introduction,
  total,
  getIntegratedCompanyListData,
  searchCompanyName,
  currentPage,
  integratedCompanyList,
  riskCompanyList,
  showPopover,
  importCompanyList,
} = useLeft(keyWord);
const {
  overviewText,
  batteryList,
  riskList,
  lineData,
  pieData,
  columns1,
  ipList,
} = useCenter(keyWord);
const {
  mapData,
  columns2,
  companyList,
  mapOption,
  attackedList,
  attackedData,
  tabsList,
  activeTab,
  changeTab,
} = useRight(keyWord);

watch(
  keyWord,
  (val) => {
    if (val === "车联网企业") {
      totalOneList1.value[0].name = "车联网企业数量";
      totalOneList1.value[1].name = "车联网平台数量";
    } else {
      totalOneList1.value[0].name = "重点企业数量";
      totalOneList1.value[1].name = "监测风险企业数量";
    }
  },
  {
    immediate: true,
  }
);

function goto(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}&sourceType=2&uploadLabel=${keyWord.value}`);
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
