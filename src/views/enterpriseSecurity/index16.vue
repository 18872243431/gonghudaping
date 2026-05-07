<template>
  <div class="enterprise-security">
    <ActTabs
      @change-tab="changeTab"
      :tabsList="tabsList"
      :active="activeTab"
      top="-42px"
    ></ActTabs>
    <div class="left">
      <div class="left1">
        <div
          class="overview-item"
          v-for="item in overviewData1"
          :key="item.name"
        >
          <img
            class="overview-item-icon"
            :src="require(`./imgs/${item.icon}.png`)"
            alt=""
            srcset=""
          />
          <div class="overview-item-name">{{ item.name }}</div>
          <div class="overview-item-value">{{ formatNumber(item.value) }}</div>
        </div>
      </div>
      <div class="left2">
        <chart-box title="整体安全评估与趋势">
          <template v-slot:chart>
            <div class="left2-content">
              <div class="left2-content-l">
                <div class="progress">
                  <Percentage
                    :percentage="80"
                    title=""
                    :primaryColor="['#00FFF0', '#2D55E3']"
                  ></Percentage>
                </div>
                <div class="progress-title"><span>综合安全指数</span></div>
              </div>
              <div class="left2-content-r">
                <div class="bar-title">近三个月攻击态势变化</div>
                <div class="bar-container">
                  <CubeBarLine
                    :single="0"
                    :data="barLineData"
                    :option="{
                      yAxis: [{}, {}],
                      grid: {
                        top: 40,
                      },
                      tooltip: {
                        formatter: (params) => {
                          const name = params[0].name;
                          const value1 = params[0].value;
                          const value2 = params[1].value;
                          return `<p style=font-size:20px;color:#fff;margin-bottom:10px>${name}</p>
                      <p style=font-size:18px;color:#fff;>受攻击企业：${value1}家</p>
                      <p style=font-size:18px;color:#fff;>攻击次数：${value2}万次</p>
                      `;
                        },
                      },
                    }"
                  ></CubeBarLine>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="left3">
        <chart-box title="重点产业链风险企业数量">
          <template v-slot:chart>
            <div class="left3-content">
              <div
                class="overview-item"
                v-for="item in overviewData2"
                :key="item.name"
              >
                <img
                  class="overview-item-icon"
                  :src="require(`./imgs/industry/${item.name}.png`)"
                  alt=""
                  srcset=""
                />
                <div class="overview-item-info">
                  <div class="overview-item-name">{{ item.name }}</div>
                  <div class="overview-item-value">
                    <span class="value">{{ formatNumber(item.value) }}</span>
                    <img src="./imgs/equal.png" alt="" v-if="item.flag === 0" />
                    <img
                      src="./imgs/up.png"
                      alt=""
                      v-else-if="item.flag === 1"
                    />
                    <img src="./imgs/down.png" alt="" v-else />
                    <span class="rate">{{
                      item.flag === 0 ? "持平" : item.rate + "%"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="center-title">全国安全态势分布</div>
      <div class="map-type-container">
        <div
          v-for="item in mapTypes"
          :key="item"
          class="map-type-item"
          :class="activeMapType === item ? 'active' : ''"
          @click="activeMapType = item"
        >
          {{ item }}
        </div>
      </div>
      <div class="china-map" v-if="activeMapType === '中国'">
        <ChinaMap
          :data="mapData"
          :baseOption="{ zoom: 1.23, top: 200 }"
          :option="mapOption"
          name1="被攻击次数"
        ></ChinaMap>
      </div>
      <div class="world-map" v-if="activeMapType === '世界'">
        <WorldMap
          :lines="{ data: worldMapData }"
          :map="worldData"
          :visualMap="visualMap"
        ></WorldMap>
      </div>
      <div class="bottom-container">
        <chart-box title="重点产业链风险企业数量">
          <template v-slot:chart>
            <div class="bottom-content">
              <div class="bottom-content-l">
                <div class="bottom-content-title">网络风险等级分布</div>
                <div class="bottom-content-list">
                  <div
                    :class="['bottom-content-li', item.id]"
                    v-for="item in networkSecurityData"
                    :key="item.id"
                  >
                    <div class="name">{{ item.name }}危企业</div>
                    <div class="value">{{ formatNumber(item.value) }}</div>
                    <div class="rate">{{ item.rate }}%</div>
                  </div>
                </div>
              </div>
              <div class="bottom-content-c">
                <div class="bottom-content-c-list">
                  <div
                    class="bottom-content-li"
                    v-for="item in overviewData3"
                    :key="item.name"
                  >
                    <div class="value">{{ formatNumber(item.value) }}</div>
                    <div class="name">{{ item.name }}</div>
                    <div class="rate">{{ item.rate }}%</div>
                  </div>
                </div>
                <span
                  :class="['arrow', `arrow-${i}`]"
                  v-for="i in 3"
                  :key="i"
                ></span>
              </div>
              <div class="bottom-content-r">
                <div class="bottom-content-title">数据安全风险</div>
                <div class="bottom-content-list">
                  <div
                    :class="['bottom-content-li', item.id]"
                    v-for="item in dataSecurityRiskData"
                    :key="item.id"
                  >
                    <div class="name">{{ item.name }}危企业</div>
                    <div class="value">{{ formatNumber(item.value) }}</div>
                    <div class="rate">{{ item.rate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="境外威胁来源分析">
          <template v-slot:chart>
            <div class="right1-content">
              <div class="total-container">
                <span class="value">{{ formatNumber(rightData1.total) }}</span>
                <span class="text">个境外攻击源</span>
                <span class="rate">占比{{ rightData1.rate }}%</span>
              </div>
              <el-carousel
                indicator-position="none"
                arrow="hover"
                :autoplay="true"
                height="160px"
                :interval="10000"
              >
                <el-carousel-item
                  v-for="(page, pageIndex) in countryPages"
                  :key="pageIndex"
                >
                  <div class="country-container">
                    <div
                      class="country-item"
                      v-for="item in page"
                      :key="item.name"
                    >
                      <div
                        class="name"
                        v-flag="{ style: 'width:18px;margin-right:6px;' }"
                      >
                        {{ item.name }}
                      </div>
                      <div class="value">{{ formatNumber(item.value) }}</div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <chart-box title="攻击特征分析">
          <template v-slot:chart>
            <div class="right2-content">
              <div class="right2-content-l">
                <div
                  class="right2-content-item"
                  v-for="item in rightData2"
                  :key="item.name"
                >
                  <img
                    :src="require(`./imgs/${item.icon}.png`)"
                    alt=""
                    srcset=""
                    class="right-icon"
                  />
                  <div class="info">
                    <div class="name">{{ item.name }}</div>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        padding-left: 10px;
                      "
                    >
                      <div class="rate1">{{ item.rate1 }}%</div>
                      <div class="rate2">
                        <span style="margin-right: 5px">
                          {{ item.rate2 }}%</span
                        >
                        <img
                          src="./imgs/up.png"
                          alt=""
                          style="width: 10px"
                          v-if="item.flag === 1"
                        />
                        <img
                          src="./imgs/down.png"
                          style="width: 10px"
                          alt=""
                          v-else
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right2-content-r">
                <Pie :data="pieData"></Pie>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right3">
        <chart-box title="重点监测企业">
          <template v-slot:chart>
            <div class="right3-content">
              <el-carousel
                indicator-position="none"
                arrow="hover"
                :autoplay="true"
                height="240px"
              >
                <el-carousel-item
                  v-for="(page, pageIndex) in companyPages"
                  :key="pageIndex"
                >
                  <div class="right3-content-page">
                    <div
                      class="right3-content-item"
                      v-for="item in page"
                      :key="item.name"
                    >
                      <div class="company-l">
                        <img
                          :src="
                            require(`../networksecurity/imgs/logos2/${item.name}.png`)
                          "
                          alt=""
                          srcset=""
                          class="logo"
                        />
                      </div>
                      <div class="company-r">
                        <div class="company-r-top">
                          <span class="name">网络安全事件</span>
                          <span class="value">{{
                            formatNumber(item.value1)
                          }}</span>
                        </div>
                        <div class="company-r-bottom">
                          <span class="name">数据安全风险</span>
                          <span class="value">{{
                            formatNumber(item.value2)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import chartBox from "@c/chartBox";
import Percentage from "@c/echarts/Pie/Percentage";
import CubeBarLine from "@c/echarts/bar/CubeBarLine/index16.vue";
import Pie from "@c/echarts/Pie/NewPie";
import ActTabs from "@c/ActTabs";
import ChinaMap from "@/components/echarts/map/China16/index";
import WorldMap from "@c/echarts/map/World.vue";
import { useData } from "./hooks/useData";

const {
  overviewData1,
  barLineData,
  overviewData2,
  mapTypes,
  activeMapType,
  networkSecurityData,
  dataSecurityRiskData,
  overviewData3,
  rightData1,
  rightData2,
  companyList,
  pieData,
  tabsList,
  activeTab,
  changeTab,
  mapData,
  mapOption,
  worldMapData,
  worldData,
  visualMap,
  formatNumber,
} = useData();

const countryPages = computed(() => {
  const list = rightData1?.list ?? rightData1?.value?.list ?? [];
  const pages = [];
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i += 4) {
      pages.push(list.slice(i, i + 4));
    }
  }
  return pages;
});

const companyPages = computed(() => {
  const list = companyList?.value ?? [];
  const pages = [];
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i += 2) {
      pages.push(list.slice(i, i + 2));
    }
  }
  return pages;
});
</script>

<style lang="scss" scoped>
@import "./index16.scss";
</style>
