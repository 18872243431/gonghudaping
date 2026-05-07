<template>
  <div class="basicdata">
    <div class="left">
      <div class="left2">
        <div class="left2-l">
          <chart-box title="企业基础信息" :showLine="false">
            <template v-slot:chart>
              <div class="total-list-container">
                <div
                  class="total-item"
                  v-for="(item, i) in totalList2"
                  :class="`total-item${item.id}`"
                  :key="i"
                >
                  <div class="icon"></div>
                  <div class="name">{{ item.name }}</div>
                  <div class="value">
                    {{ item.value }}<span class="unit">万</span>
                  </div>
                </div>
              </div>
            </template>
          </chart-box>
        </div>
        <div class="left2-r">
          <chart-box title="重点行业监测企业数量排名" :showLine="false">
            <template v-slot:chart>
              <RankBar :data="rankData.slice(0, 5)"></RankBar>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="left3">
        <div class="left3-l">
          <chart-box title="联网设备库" :showLine="false"></chart-box>
          <div style="margin-top: -20px">
            <div
              class="left3-item"
              :class="`left3-item${i + 1}`"
              v-for="(item, i) in totalList3"
              :key="i"
            >
              <div class="icon"></div>
              <div class="name">{{ item.name }}</div>
              <div class="value">
                {{ item.value }}<span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="left3-r">
          <chart-box title="设备指纹厂商分布" :showLine="false">
            <template v-slot:chart>
              <TerminalRankBar :data="pieData.slice(0, 5)"></TerminalRankBar>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="center">
      <!-- <div class="bg"></div> -->
      <div class="flow"></div>
      <div class="arrow" style="top: 276px; left: 498px"></div>
      <div class="arrow" style="top: 592px; left: 498px"></div>
    </div>
    <div class="right">
      <div class="right1 total-container">
        <div class="icon"></div>
        <div class="content">
          <span class="label">威胁情报</span>
          <span class="value">{{ total1 }}<span class="unit">条</span></span>
        </div>
      </div>
      <div class="right2">
        <div class="right-container" v-for="(item, i) in totalList5" :key="i">
          <div class="name">{{ item.name }}</div>
          <div class="list">
            <div class="item" v-for="(t, j) in item.list" :key="j">
              <span class="label" v-if="i === 0">{{ t.name }}</span>
              <span class="value"
                >{{
                  t.value > 9999
                    ? (Number(t.value) / 10000).toFixed(1) + "万"
                    : t.value.toLocaleString("en-US")
                }}
                <span class="unit">个</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right3 total-container">
        <div class="icon"></div>
        <div class="content">
          <span class="label">监测规则</span>
          <span class="value"
            >{{ total2.toLocaleString("en-US")
            }}<span class="unit">条</span></span
          >
        </div>
      </div>
      <div class="right4">
        <chart-box
          title="高置信度规则分布情况"
          :showLine="false"
          style="height: 300px"
        >
          <template v-slot:chart>
            <TerminalRankBar
              :data="lineData.slice(0, 5)"
              :dataZoom="{
                show: false,
                start: 0,
                end: 100,
                height: 20,
              }"
              :option="{ grid: { bottom: 70 } }"
              :labelWidth="200"
            ></TerminalRankBar>
          </template>
        </chart-box>
        <chart-box
          title="活跃病毒家族排名"
          :showLine="false"
          style="height: 280px"
        >
          <template v-slot:chart>
            <RankBar :data="rankData2.slice(0, 5)"></RankBar>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLeft, useRight } from "./hooks/useData";
import chartBox from "@c/chartBox";
import RankBar from "@c/echarts/bar/CircleSymbolBar/index16.vue";
import Pie from "@c/echarts/Pie/NewPie16";
import TerminalRankBar from "@c/echarts/bar/TerminalRankBar2/index16.vue";

const { totalList2, rankData, totalList3, pieData } = useLeft();
const { total1, totalList5, total2, lineData, rankData2 } = useRight();
</script>

<style scoped lang="scss">
@import "./index16.scss";
</style>
