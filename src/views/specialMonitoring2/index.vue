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
         <!-- <div class="text1">被攻击次数</div> -->
        <!-- <div class="text2">风险企业数</div>  -->
        <div class="map-container">
           <ChinaMap
            :data="mapData" 
            :showClipDefs="true"
            :style="{ height: '98%', transform: 'scaleX(1.6) scaleY(0.9)',top: '-20px' ,left:'-100px'}"
            :baseOption="{ zoom: 1.32, top: 20, center: [104.27, 29.71] }"
            :option="{
              ...mapOption,
               visualMap1: {
                ...mapOption.visualMap1,
                left: 250,   /* 控制左侧图例的左右位置：增加数值向右移 */
                top: 520, /* 控制左侧图例的上下位置：减小数值向下移 */
              },
              visualMap2: {
                 ...mapOption.visualMap2, left: 430 , top: 520, },
            }"
            :showCube="true"
            name2="风险企业数"
            name1="被攻击次数"
          ></ChinaMap>
        </div>
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
        <div class="attack-type-container">
          <chart-box title="攻击类型">
            <template v-slot:chart>
              <Pie :data="attackTypeList"></Pie>
            </template>
          </chart-box>
        </div>
        <div class="attack-ip-container">
          <chart-box title="攻击IP">
            <template v-slot:chart>
              <RectangleNationalSymbolBar
                :data="attackIpList"
              ></RectangleNationalSymbolBar>
            </template>
          </chart-box>
        </div>
        <!-- <chart-box title="攻击特征">
          <template v-slot:chart>
            <div class="attack-content">
              <div class="attack-type-container">
                <div class="attack-title">攻击类型</div>
                <Pie :data="attackTypeList"></Pie>
              </div>
              <div class="attack-ip-container">
                <div class="attack-title">攻击IP</div>
                <div class="attack-ip">
                  <RectangleNationalSymbolBar
                  :data="attackIpList"
                    ></RectangleNationalSymbolBar>
                </div>
              </div>
            </div>
          </template>
        </chart-box> -->
      </div>
      <div class="right2">
        <chart-box title="高危漏洞攻击利用排名">
          <template v-slot:chart>
            <div class="hole-list">
              <div class="hole-item" v-for="(item, ind) in holeList" :key="ind">
                <div class="top">
                  <div class="hole-name">{{ item.name }}</div>
                  <div class="hole-value">{{ formatNumber(item.value) }}</div>
                </div>
                <div class="hole-content">
                  <span class="sin">{{ item.content }}</span>
                  <span class="sin">{{ item.content }}</span>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right3">
        <chart-box title="风险企业排名">
          <template v-slot:chart>
            <el-carousel
              indicator-position="none"
              arrow="hover"
              :autoplay="true"
              height="238px"
              :interval="8000"
              v-if="riskCompanyList.length > 0"
            >
              <el-carousel-item
                v-for="(page, pageIndex) in list2Pages"
                :key="pageIndex"
              >
                <div class="list-container">
                  <div
                    class="list-item"
                    v-for="(item, i) in page"
                    :key="item.name"
                    :title="item.name"
                    @click="gotoCompany(item.name)"
                  >
                    <div class="icon">
                      <img src="./imgs/right4.png" alt="" srcset="" />
                      <div class="top" :class="`top${i + 1}`">
                        TOP{{ item.top }}
                      </div>
                    </div>
                    <div class="info">
                      <div class="item-name">{{ item.name }}</div>
                      <div class="detail">
                        <span class="label">被攻击次数：</span>
                        <span :class="['value', `value-${item.risk}`]">{{
                          formatNumber(item.value)
                        }}</span>
                        <span class="unit">次</span>
                      </div>
                      <div class="detail">
                        <span class="label">被攻击IP数：</span>
                        <span :class="['value', `value-${item.risk}`]">{{
                          formatNumber(item.ipNum)
                        }}</span>
                        <span class="unit">个</span>
                      </div>
                      <div class="detail">
                        <span class="label">危险等级：</span>
                        <span :class="['risk', `risk-${item.risk}`]">{{
                          item.level
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import LineArea from "@c/echarts/Line/lineArea16";
import ChinaMap from "@/components/echarts/map/ImgChina/index.vue";
import { useData } from "./hooks/useData";
import { useRouter } from "vue-router";
import Pie from "@c/echarts/Pie/NewPie";
import RectangleNationalSymbolBar from "@/components/echarts/bar/RectangleNationalSymbolBar/index.vue";
import { computed } from "vue";

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

const list2Pages = computed(() => {
  const pages = [];
  const arr = Array.isArray(riskCompanyList.value) ? riskCompanyList.value : [];
  for (let i = 0; i < arr.length; i += 3) {
    pages.push(arr.slice(i, i + 3));
  }
  return pages;
});

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
@import "./index.scss";
</style>
