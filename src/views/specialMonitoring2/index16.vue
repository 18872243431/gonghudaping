<template>
  <div class="special-monitoring">
    <div class="left">
      <div class="left-title">演练总览</div>
      <div class="left-content">
        <div class="left-content-item">
          <div class="left-content-item-title">演练任务名称</div>
          <div class="left-content-item-content">{{ info.name }}</div>
        </div>
        <div class="left-content-item">
          <div class="left-content-item-title">监测对象</div>
          <div class="left-content-item-content">{{ info.range }}</div>
        </div>
        <div class="left-content-item">
          <div class="left-content-item-title">风险事件数量</div>
          <div class="left-content-item-content" style="color: #00ffff">
            {{ info.count }}
          </div>
        </div>
        <div class="left-content-item">
          <div class="left-content-item-title">监测起止时间</div>
          <div class="left-content-item-content" style="color: #00ffff">
            {{ info.time }}
          </div>
        </div>
        <div class="left-content-item">
          <div class="left-content-item-title">任务概要</div>
          <div class="left-content-item-content">{{ info.content }}</div>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="center-title">演练期间网络安全态势</div>
      <div class="top">
        <div class="text1">被攻击次数</div>
        <div class="text2">风险企业数</div>
        <ChinaMap
          :data="mapData"
          :baseOption="{ zoom: 1, top: 20, center: [104.27, 29.71] }"
          :option="{
            ...mapOption,
            visualMap2: { ...mapOption.visualMap2, left: 200 },
          }"
          :showCube="true"
          name1="被攻击次数"
          name2="风险企业数"
        ></ChinaMap>
      </div>
      <div class="bottom">
        <chart-box title="网络攻击特点分析">
          <template v-slot:chart>
            <div class="network-attack-container">
              <div class="overview-container">
                <div class="overview-item">
                  <div class="name">总攻击次数</div>
                  <div class="value">
                    {{ formatNumber(networkInfo.total) }}次
                  </div>
                </div>
                <div class="overview-item">
                  <div class="name">最高单日攻击量</div>
                  <div class="value">
                    {{ formatNumber(networkInfo.today) }}次
                  </div>
                </div>
              </div>
              <div class="line-container">
                <LineArea
                  :data="lineData"
                  :option="{
                    legend: { right: 30, top: 0 },
                    grid: { top: 50 },
                  }"
                ></LineArea>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="攻击特征">
          <template v-slot:chart>
            <div class="attack-content">
              <div class="attack-type-container">
                <div class="attack-title">攻击类型</div>
                <div
                  class="attack-list"
                  v-for="(item, ind) in attackTypeList"
                  :key="ind"
                >
                  <div class="attack-type">
                    <img
                      :src="require('./imgs16/left-icon' + (ind + 1) + '.png')"
                      alt=""
                      class="attack-type-icon"
                    />
                    <div class="attack-type-name">{{ item.name }}</div>
                    <div class="attack-type-value">
                      <span> {{ formatNumber(item.value) }}</span>
                      <span class="rate">（{{ item.rate }}）</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="attack-ip-container">
                <div class="attack-title">攻击IP</div>
                <div
                  class="attack-list"
                  v-for="(item, ind) in attackIpList"
                  :key="ind"
                >
                  <div class="attack-ip">
                    <img
                      :src="require('./imgs16/right-icon' + (ind + 1) + '.png')"
                      alt=""
                      :class="['attack-ip-icon', `attack-ip-icon-${ind + 1}`]"
                    />
                    <div class="attack-ip-name">{{ item.ip }}</div>
                    <div class="attack-ip-value">
                      <span class="value">
                        {{ formatNumber(item.value) }}
                      </span>
                      <div class="country" v-flag>
                        {{ item.country }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <chart-box title="高危漏洞攻击利用排名">
          <template v-slot:chart>
            <div class="hole-list">
              <div class="hole-item" v-for="(item, ind) in holeList" :key="ind">
                <div class="hole-item-t">
                  <div class="hole-name">{{ item.name }}</div>
                  <div class="hole-value">{{ formatNumber(item.value) }}</div>
                </div>
                <div class="hole-content">{{ item.content }}</div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right3">
        <chart-box title="风险企业排名">
          <template v-slot:chart>
            <el-scrollbar
              class="scrollbar"
              style="height: 300px; margin-top: -20px"
            >
              <div class="risk-company-list">
                <div
                  :class="[
                    'risk-company-item',
                    `risk-company-item-${item.risk}`,
                  ]"
                  v-for="(item, ind) in riskCompanyList"
                  :key="ind"
                >
                  <div
                    class="risk-company-name"
                    @click="gotoCompany(item.name)"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </div>
                  <div class="risk-company-value">
                    {{ formatNumber(item.value) }}
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import LineArea from "@c/echarts/Line/lineArea16";
import ChinaMap from "@/components/echarts/map/China16/index";
import { useData } from "./hooks/useData";
import { useRouter } from "vue-router";

const router = useRouter();

const {
  info,
  attackTypeList,
  attackIpList,
  holeList,
  riskCompanyList,
  networkInfo,
  lineData,
  mapData,
  mapOption,
} = useData();

function gotoCompany(name) {
  router.push(`/enterpriseRisk2?companyName=${name}`);
}

function formatNumber(value) {
  const num = Number(value);
  if (isNaN(num)) return "";
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  } else {
    return num.toLocaleString();
  }
}
</script>

<style lang="scss" scoped>
@import "./index16.scss";
</style>
