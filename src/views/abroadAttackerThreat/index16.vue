<template>
  <div class="abroadAttackerThreat">
    <div class="left">
      <div class="left1">
        <div class="info info1">
          <div class="title">攻击来源</div>
          <div class="value">
            <img :src="attackInfo.brief" alt="" srcset="" />{{
              attackInfo.country
            }}
          </div>
        </div>
        <div class="info info2">
          <div class="title">攻击范围</div>
          <div class="text-box">
            <div class="text-item mr-20">
              <span class="text">省份：</span>
              <span class="value"
                >{{ attackInfo.province
                }}<span style="font-size: 16px; color: #fff; margin-left: 3px"
                  >个</span
                ></span
              >
            </div>
            <div class="text-item">
              <span class="text">行业：</span>
              <span class="value"
                >{{ attackInfo.industry
                }}<span style="font-size: 16px; color: #fff; margin-left: 3px"
                  >个</span
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="left2">
        <div class="container">
          <div class="total-card" v-for="(item, i) in totalList" :key="i">
            <total-one :data="item"></total-one>
          </div>
        </div>
      </div>
      <div class="left4">
        <div class="chart-card">
          <chart-box title="网络攻击趋势" :showLine="false">
            <template v-slot:chart>
              <Line :option="lineOpts" :data="lineData1"></Line>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="left5">
        <chart-box title="网络攻击威胁等级分布">
          <template v-slot:chart>
            <div class="level-box">
              <div class="level-item">
                <div class="liquid-fill">
                  <Liquidfill
                    :data="data[0]"
                    :option="option[0]"
                    :fontSize="20"
                  ></Liquidfill>
                </div>
                <div class="txt-box">
                  <div class="title">{{ data[0][0].name }}</div>
                  <div class="value">{{ data[0][0].num }}</div>
                </div>
              </div>
              <div class="level-item">
                <div class="liquid-fill">
                  <Liquidfill
                    :data="data[1]"
                    :option="option[1]"
                    :fontSize="20"
                  ></Liquidfill>
                </div>
                <div class="txt-box">
                  <div class="title">{{ data[1][0].name }}</div>
                  <div class="value">{{ data[1][0].num }}</div>
                </div>
              </div>
              <div class="level-item">
                <div class="liquid-fill">
                  <Liquidfill
                    :data="data[2]"
                    :option="option[2]"
                    :fontSize="20"
                  ></Liquidfill>
                </div>
                <div class="txt-box">
                  <div class="title">{{ data[2][0].name }}</div>
                  <div class="value">{{ data[2][0].num }}</div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <!-- <div class="bg"></div> -->
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
        <!-- <ChinaMap></ChinaMap> -->
        <ChinaMap
          :data="mapData"
          :baseOption="{ zoom: 1.28, top: 180, aspectScale: 0.8 }"
          :option="{
            ...mapOption,
            visualMap2: { ...mapOption.visualMap2, left: 80, bottom: 100 },
          }"
          name="被攻击次数"
        ></ChinaMap>
      </div>
      <div class="bar-container">
        <chart-box title="远控端活跃情况排名" :showLine="false">
          <template v-slot:chart>
            <RankBar :data="attackData"></RankBar>
          </template>
        </chart-box>
      </div>
      <div class="pie-container">
        <chart-box title="活跃病毒家族分布情况" :showLine="false">
          <template v-slot:chart>
            <!-- <Pie :data="pieData"></Pie> -->
            <RankBar :data="pieData"></RankBar>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="攻击行业排名">
          <template v-slot:chart>
            <div class="industry-list">
              <div
                class="industry-item"
                v-for="(item, i) in industryList"
                :key="i"
              >
                <div class="logo">
                  <div class="icon">
                    <img
                      :src="require(`./imgs/industry/${item.name}.png`)"
                      alt=""
                      srcset=""
                    />
                  </div>
                  <div class="top" :class="`top${i + 1}`">TOP{{ i + 1 }}</div>
                </div>
                <div class="info">
                  <div class="name" :title="item.name">{{ item.name }}</div>
                  <div class="detail">
                    <span class="label">被攻击企业数</span>
                    <span class="value"
                      >{{ item.value1 }}<span class="unit">家</span></span
                    >
                  </div>
                  <div class="detail">
                    <span class="label">网络攻击次数</span>
                    <span class="value"
                      >{{ item.value2 }}<span class="unit">次</span></span
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <chart-box title="攻击企业排名">
          <template v-slot:chart>
            <div class="company-list">
              <div
                class="company-item"
                v-for="(item, i) in companyList.slice(0, 3)"
                :key="i"
              >
                <div class="logo">
                  <img src="./imgs/logo-seq.png" alt="" srcset="" />
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
                      >{{ item.value1 }}<span class="unit">次</span></span
                    >
                  </div>
                  <div class="detail">
                    <span class="label">被攻击IP数</span>
                    <span class="value"
                      >{{ item.value2 }}<span class="unit">个</span></span
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
import TotalOne from "@c/ActTotal/one.vue";
import TotalTwo from "@c/ActTotal/two1.vue";
import { useDataFun } from "./hooks/useData";
import chartBox from "@c/chartBox";
import ChinaMap from "@/components/echarts/map/China16";
import RankBar from "@c/echarts/bar/BackgroundBar/index16.vue";
import Liquidfill from "@c/echarts/Liquidfill/index.vue";
// import RankBar from "@c/echarts/bar/CircleSymbolBar";
import Line from "@c/echarts/Line/lineArea/index.vue";
import Pie from "@c/echarts/Pie/NewPie1";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

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
} = useDataFun(country.value);

function gotoCompany(name) {
  router.push(`/enterpriseRisk?companyName=${name}`);
}
</script>

<style lang="scss" scoped>
@import "./index16.scss";
</style>
