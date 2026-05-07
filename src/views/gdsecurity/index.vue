<template>
  <div class="gd-security">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <div class="left1">
        <div class="left1-title">工业互联网安全管理对象概述</div>
        <div class="total-box">
          <div class="total-box-t">
            <div class="total-card" v-for="(item, i) in totalOneList" :key="i">
              <total-one :data="item"></total-one>
            </div>
          </div>
        </div>
        <div class="overflow-container">
          <div
            class="overflow-item"
            v-for="(item, i) in overflowData1.slice(0, 2)"
            :key="i"
          >
            <div class="item-icon"></div>
            <div class="item-info">
              <div class="name">{{ item.name }}</div>
              <div>
                <span class="value">{{ item.value }}</span>
                <span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="left2">
        <chart-box title="基础数据上报情况">
          <template v-slot:chart>
            <div class="overview-list">
              <div
                class="overview-item"
                v-for="(item, i) in overflowData2.slice(0, 2)"
                :key="i"
              >
                <div class="name">{{ item.name }}</div>
                <div class="content">
                  <div class="icon"></div>
                  <div class="values">
                    <div class="value">
                      <span class="label">累计</span>
                      <span class="number">{{ item.value1 }}</span
                      ><span class="unit">条</span>
                    </div>
                    <!-- <div class="value">
                      <span class="label">累计</span
                      ><span class="number">{{ item.value2 }}</span
                      ><span class="unit">万条</span>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="left3">
        <div class="chart-card" style="width: 740px">
          <chart-box title="安全数据上报情况" :showLine="false">
            <template v-slot:chart>
              <Line :option="lineOpts" :data="lineData1"></Line>
            </template>
          </chart-box>
        </div>
        <div class="chart-card" style="width: 240px">
          <chart-box title="有效数据占比 " :showLine="false">
            <template v-slot:chart>
              <Liquidfill
                :data="[{ name: '', value: rate / 100 }]"
                :option="{
                  series: {
                    radius: '100',
                    shape: 'circle',
                    colors: [
                      'rgba(13, 129, 142, 1)',
                      'rgba(0, 255, 229, 1)',
                      'rgba(16, 170, 194, 1)',
                    ],
                    backgroundColors: [
                      'rgba(0, 187, 255, 0.53)',
                      'rgba(68, 182, 253, 0.25)',
                      'rgba(68, 247, 253, 0)',
                    ],
                    label: {
                      fontSize: 28,
                      fontWeight: 'bold',
                      formatter: function () {
                        return rate + '%';
                      },
                      color: '#fff',
                    },
                    outline: {
                      show: true,
                      borderDistance: 3,
                      borderWidth: 2,
                      borderColor: 'rgba(75, 210, 253, 0.5)',
                    },
                  },
                }"
              ></Liquidfill>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="bg"></div>
      <div class="tips">
        <span class="label">总体安全态势</span>
        <p class="content">
          {{ overviewText }}
        </p>
      </div>
      <div class="map-container">
        <span class="text">被攻击次数</span>
        <ProvinceMap
          :provinceName="province"
          :option="provinceOption"
          :data="{ map: mapData }"
          name="被攻击次数"
          @click="mapClick"
        ></ProvinceMap>
      </div>
      <div class="chart-card">
        <chart-box title="网络攻击类型分布" :showLine="false">
          <template v-slot:chart>
            <Pie :data="pieData"></Pie>
          </template>
        </chart-box>
      </div>
      <div class="table-container">
        <act-table :showSeq="true" :columns="columns" :tableData="tableData">
          <template #attackedCorpName="{ row }">
            <div
              class="company-name"
              style="text-decoration: underline; font-size: 18px"
              :title="row.attackedCorpName"
              @click="gotoCompany(row.attackedCorpName)"
            >
              {{ row.attackedCorpName }}
            </div>
          </template>
          <template #attackedCountry="{ row }">
            <div
              class="company-name"
              style="text-decoration: underline; font-size: 18px"
              @click="gotoCountry(row.attackedCountry)"
              v-flag
            >
              {{ row.attackedCountry }}
            </div>
          </template>
        </act-table>
      </div>
    </div>
    <div class="right">
      <div class="right4">
        <chart-box title="网络安全态势整体分析">
          <template v-slot:chart>
            <div class="overflow-container">
              <div
                class="overflow-item"
                v-for="(item, i) in overviewData3"
                :key="i"
              >
                <div class="name">{{ item.name }}</div>
                <div class="item-info">
                  <div class="item-icon"></div>
                  <div>
                    <span class="value">{{ item.value }}</span>
                    <span class="unit">{{ item.unit }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right1">
        <div class="right1-container">
          <chart-box title="工控系统及设备暴露情况" :showLine="false">
            <template v-slot:chart>
              <ul class="platform-list">
                <li
                  class="list-item"
                  v-for="item in data1.slice(0, 2)"
                  :key="item.name"
                >
                  <div class="item-box">
                    <div class="img-box">
                      <img :src="`./logos1/${item.src}.png`" />
                    </div>
                    <div class="total-item-box">
                      <div class="data-info">
                        <span class="label">设备及系统数量：</span>
                        <span class="value value1">{{ item.num1 }}</span>
                        <span class="unit">{{ item.unit }}</span>
                      </div>
                      <div class="data-info">
                        <span class="label">漏洞数量：</span>
                        <span class="value value2">{{ item.num2 }}</span>
                        <span class="unit">{{ item.unit }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
          </chart-box>
        </div>
        <div class="right1-container">
          <chart-box title="数据资产暴露情况" :showLine="false">
            <template v-slot:chart>
              <ul class="platform-list">
                <li
                  class="list-item"
                  v-for="item in data2.slice(0, 2)"
                  :key="item.name"
                >
                  <div class="item-box item-box2">
                    <div class="img-box">
                      <img :src="require(`./imgs/logos2/${item.src}.png`)" />
                    </div>
                    <div class="total-item-box">
                      <div class="data-info">
                        <span class="label">资产数量</span>
                        <span class="value value1">{{ item.num1 }}</span>
                        <span class="unit">{{ item.unit }}</span>
                      </div>
                      <div class="data-info">
                        <span class="label">漏洞数量</span>
                        <span class="value value2">{{ item.num2 }}</span>
                        <span class="unit">{{ item.unit }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="right2">
        <chart-box title="被攻击行业排名">
          <template v-slot:chart>
            <div class="total2-box">
              <div class="total2">
                <div
                  class="total-item"
                  v-for="(item, index) in totalList2.slice(0, 4)"
                  :key="index"
                >
                  <div class="icon-box">
                    <img
                      :src="
                        require(`@/views/abroadAttackerThreat/imgs/industry/${item.name}.png`)
                      "
                      alt=""
                      style="width: 70px"
                    />
                  </div>
                  <div :class="['label-val-box', 'box-type' + item.type]">
                    <div class="name" :title="item.name">{{ item.name }}</div>
                    <div class="label-icon">No{{ index + 1 }}.</div>
                    <div class="label-val">
                      <div class="list">
                        <div style="margin-right: 30px; margin-left: -5px">
                          <div class="label">企业数量</div>
                          <div class="val">
                            {{ formatNumber(item.value1) }}
                          </div>
                        </div>
                        <div>
                          <div class="label">监测企业数量</div>
                          <div class="val">
                            {{ formatNumber(item.value2) }}
                          </div>
                        </div>
                      </div>
                      <div class="rank-bar">
                        <el-progress
                          :format="
                            () => {
                              return formatNumber(item.value);
                            }
                          "
                          :percentage="item.percentage2"
                          :width="80"
                          :color="item.type == '1' ? '#FFBD43' : '#4BD2FD'"
                        />
                      </div>
                    </div>
                    <div class="percentage">
                      <el-progress
                        type="circle"
                        :percentage="item.percentage1"
                        :width="80"
                        :color="item.type == '1' ? '#FFBD43' : '#4BD2FD'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right3">
        <chart-box title="通报处置情况">
          <template v-slot:chart>
            <div class="item" v-for="(item, i) in totalList3" :key="item.name">
              <div class="icon" :class="`icon${i + 1}`"></div>
              <div class="name">{{ item.name }}</div>
              <div class="info">
                <span class="label">{{ item.item1.label }}</span>
                <span class="value"
                  >{{ item.item1.value
                  }}<span class="unit">{{ item.item1.unit }}</span></span
                >
              </div>
              <div class="info">
                <span class="label">{{ item.item2.label }}</span>
                <span class="value"
                  >{{ item.item2.value
                  }}<span class="unit">{{ item.item2.unit }}</span></span
                >
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div
      v-if="tooltipShow"
      class="tooltip-container"
      :style="{
        top: tooltipPosition.y + 'px',
        left: tooltipPosition.x + 'px',
      }"
    >
      <span class="close-button" @click="tooltipShow = false"
        ><el-icon><Close /></el-icon
      ></span>
      <div style="padding: 20px">
        <div class="tooltip-title">{{ selectedCity }}</div>
        <div class="tooltip-content">
          <div class="item" v-for="item in provinceInfo" :key="item.label">
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TotalOne from "@c/ActTotal/one.vue";
import { useLeft, useCenter, useRight } from "./hooks/useData";
import chartBox from "@c/chartBox";
import Pie from "@c/echarts/Pie/NewPie";
import Line from "@c/echarts/Line/lineArea/index.vue";
import ProvinceMap from "@c/echarts/map/Province";
import ActTable from "@c/ActTable";
import ActTabs from "@c/ActTabs";
import { Close } from "@element-plus/icons-vue";
import Liquidfill from "@c/echarts/Liquidfill/index";
import { useRouter } from "vue-router";

const router = useRouter();

// 格式化数字：不超过1万显示千分符，超过1万保留1位小数加万单位
const formatNumber = (num) => {
  if (num == null || num === "") return "";
  const number = Number(num);
  if (isNaN(number)) return num;

  if (number >= 10000) {
    return (number / 10000).toFixed(1) + "万";
  } else {
    return number.toLocaleString();
  }
};

const {
  totalOneList,
  overflowData1,
  overflowData2,
  lineOpts,
  lineData1,
  rate,
} = useLeft();

const {
  overviewText,
  mapData,
  columns,
  tableData,
  mapClick,
  tooltipShow,
  tooltipPosition,
  selectedCity,
  provinceInfo,
  province,
  pieData,
  provinceOption,
} = useCenter();
const {
  data1,
  data2,
  totalList2,
  totalList3,
  tabsList,
  activeTab,
  changeTab,
  overviewData3,
} = useRight();

function gotoCountry(name) {
  if (name === "中国") return;
  router.push(`/abroadAttackerThreat?countryName=${name}`);
}

function gotoCompany(name) {
  router.push(`/enterpriseRisk?companyName=${name}&timeType=${activeTab.value}`);
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
