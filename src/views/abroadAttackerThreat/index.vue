<template>
  <div class="abroadAttackerThreat">
    <div class="left">
      <div class="left1 source-country">
        <chart-box title="攻击来源国家" :showLine="false">
          <template v-slot:chart>
            <div class="source-country-content">
              <div class="country-info">
                <div class="flag-wrapper">
                  <img :src="attackInfo.brief" alt="" class="flag-img" />
                </div>
                <div class="country-name">
                  {{ attackInfo.country }}
                </div>
              </div>
              <div class="divider"></div>
              <div class="stats-info">
                <div class="stat-item">
                  <div class="label">活跃恶意IP数</div>
                  <div class="value-row">
                    <span class="value">{{ attackInfo.attackCountryCount }}</span>
                    <span class="unit">个</span>
                    <span class="arrow">↑</span>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="stat-item">
                  <div class="label">境外攻击来源占比</div>
                  <div class="value-row">
                    <span class="value percent-value">{{ attackInfo.attackCountryPercent }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="left2 stats-row">
        <div class="stat-card" v-for="(item, i) in totalList" :key="i">
          <chart-box :title="item.label" :showLine="false">
            <template v-slot:chart>
              <div class="stat-content">
                <div class="icon-wrapper" :class="`icon-${i}`">
                  <img v-if="i === 0" src="./imgs/1.png" alt="" />
                  <img v-else src="./imgs/2.png" alt="" />
                </div>
                <div class="value-rate-group">
                  <div class="value-text">
                    {{ Number(item.value).toLocaleString() }}
                    <span class="unit-text">{{ item.unit }}</span>
                  </div>
                  <div class="rate-tag" :class="item.status1 === 'up' ? 'up' : 'down'">
                    <span class="rate-label">环比</span>
                    <span class="rate-icon">{{ item.status1 === 'up' ? '上升' : '下降' }}</span>
                    <span class="rate-value">{{ item.value1 }}</span>
                  </div>
                </div>
              </div>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="left3">
        <div class="chart-card">
          <chart-box title="网络攻击趋势" :showLine="false">
            <template v-slot:chart>
              <Line :option="lineOpts" :data="lineData1"></Line>
            </template>
          </chart-box>
        </div>
        <div class="chart-card">
          <chart-box title="攻击时段分析 " :showLine="false">
            <template v-slot:chart>
              <TimeBar :data="timeBarData"></TimeBar>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="bg"></div>
      <div class="tips">
        <span class="label">攻击态势</span>
        <p class="content">
          {{
            `近7天监测网络攻击 ${
              totalList[0].value + totalList[0].unit
            }，涉及 ${
              totalList[1].value + totalList[1].unit
            }企业，主要集中在${industryNameText}。`
          }}
          <!-- {{ overviewText }} -->
        </p>
      </div>
      <div class="map-container">
        <!-- 飞线起始点图片 -->
        <div class="flyline-start-point">
          <img src="./imgs/3.png" alt="境外攻击源" />
        </div>
        <ChinaMap
        :showClipDefs="true"
           :style="{ height: '98%', transform: 'scaleX(1.2) scaleY(0.9)',
            top: '100px' ,left:'-120px'}"
          :data="{ ...mapData, lines: flyLines }"
          :baseOption="{ zoom: 1.39, top: 240, aspectScale: 0.85 }"
          :option="{
                    ...mapOption,
                    visualMap2: {
                      ...mapOption.visualMap2,
                      left: 250,   /* 控制右侧图例的左右位置：需跟随左侧图例同步增加 */
                      top: 700,/* 控制右侧图例的上下位置：需跟随左侧图例同步调整 */
                    },
                  }"
          name1="被攻击次数"
        ></ChinaMap>
      </div>
      <div class="pie-container">
        <chart-box title="攻击企业排名" :showLine="false">
          <template v-slot:chart>
             <CustomRankingList
              :listData="companyList"
              nameKey="companyName"
              valueKey="atdNum"
              rawKey="atdNumRaw"
            />
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="攻击行业排名">
          <template v-slot:chart>
            <div class="industry-ranking-wrapper">
              <div class="ranking-header">
                <span class="col-rank">排名</span>
                <span class="col-name">行业名称</span>
                <span class="col-corp">被攻击企业数</span>
                <span class="col-count">网络攻击次数</span>
              </div>
              <div class="ranking-list system-scrollbar">
                <div
                  class="ranking-item"
                  v-for="(item, i) in sortedIndustryList"
                  :key="i"
                >
                  <div class="col-rank">
                    <span class="rank-num">{{ (i + 1).toString().padStart(2, '0') }}</span>
                  </div>
                  <div class="col-name" :title="item.name">{{ item.name }}</div>
                  <div class="col-corp">
                    <span class="num">{{ item.value1 }}</span><span class="unit">家</span>
                  </div>
                  <div class="col-count">
                    <div class="count-text">
                      <span class="num" v-html="formatCount(item.value2)"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <div class="right2Sin">
          <chart-box title="远控端活跃情况排名" :showLine="false">
            <template v-slot:chart>
              <RankBar :data="attackData"></RankBar>
            </template>
          </chart-box>
        </div>
        <div class="right2Sin">
           <chart-box title="活跃病毒家族分布情况" :showLine="false">
            <template v-slot:chart>
              <RankBar :data="pieData"></RankBar>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataFun } from "./hooks/useData";
import chartBox from "@c/chartBox";
import ChinaMap from "@/components/echarts/map/ImgChina/index";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import Liquidfill from "@c/echarts/Liquidfill/index.vue";
// import RankBar from "@c/echarts/bar/CircleSymbolBar";
import Line from "@c/echarts/Line/lineArea/index.vue";
import TimeBar from "@/components/echarts/bar/TimeBar/index.vue";
import Pie from "@c/echarts/Pie/NewPie1";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import CustomRankingList from "@/components/CustomRankingList/index.vue";
import ChinaNameMap from "/public/map/coords/ChinaNameMap.js";

// const props = defineProps({
//   attackCountry: {
//     type: String,
//     default: "美国",
//   },
// });
const router = useRouter();

const country = computed(() => {
  return {
    attackCountry: useRoute().query.countryName || "美国",
  };
});

const {
  totalList,
  lineOpts,
  lineData1,
  lineData2,
  data,
  option,
  attackInfo,
  mapData,
  attackData,
  pieData,
  mapOption,
  industryNameText,
  industryList,
  companyList,
  timeBarData,
} = useDataFun(country.value);

// 飞线数据，最多取5条
const flyLines = ref([]);

// 计算飞线数据：从右侧起始点到地图省份
function calculateFlyLines(mapDataList) {
  if (!mapDataList || mapDataList.length === 0) {
    flyLines.value = [];
    return;
  }
  
  // 按value降序排序，取前5条
  const sortedData = [...mapDataList].sort((a, b) => b.value - a.value).slice(0, 5);
  
  // 起始点坐标（地图右上方，对应图片位置）
  const startPoint = [150, 52];
  
  // 生成飞线数据
  flyLines.value = sortedData.map((item) => ({
    from: startPoint,
    to: item.name,
    value: item.value,
    fromName: "境外攻击源",
    toName: item.name,
  }));
}

// 监听mapData变化，计算飞线
watch(() => mapData.value.map, (newMapData) => {
  calculateFlyLines(newMapData);
}, { immediate: true });

const sortedIndustryList = computed(() => {
  return [...industryList.value].sort((a, b) => b.value2 - a.value2);
});

function formatCount(val) {
  if (val >= 10000) {
    return (val / 10000).toFixed(1) + ' <span style="font-size:14px;color:#fff">万次</span>';
  }
  return val + ' <span style="font-size:14px;color:#fff">次</span>';
}

function gotoCompany(name) {
  router.push(`/enterpriseRisk?companyName=${name}`);
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
