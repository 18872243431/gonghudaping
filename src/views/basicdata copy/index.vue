<template>
  <div class="basicdata">
    <div class="left">
      <div class="left1">
        <chart-box title="平台监测覆盖总览">
          <template v-slot:chart>
            <div class="left1-container">
              <div class="left-title">
                <div class="text">对接情况</div>
              </div>
              <div class="total-container">
                <img src="./imgs/left-icon1.png" width="212" alt="" srcset="" />
                <div class="content">
                  <div class="label">对接省级平台数量</div>
                  <div class="value">
                    {{ total }}<span class="unit">个</span>
                  </div>
                </div>
              </div>
              <div class="total-list-container">
                <div
                  class="total-item"
                  :class="`total-item${i + 1}`"
                  v-for="(item, i) in totalList1"
                >
                  <div class="name">{{ item.name }}</div>
                  <div class="value">
                    {{ item.value }}<span class="unit">个</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="left2">
        <div class="left2-l">
          <div class="text">企业基础信息</div>
          <div class="total-list-container">
            <div class="total-item" v-for="(item, i) in totalList2" :key="i">
              <div class="name">{{ item.name }}</div>
              <div class="value">
                {{ item.value }}<span class="unit">万</span>
              </div>
            </div>
          </div>
        </div>
        <div class="left2-r">
          <chart-box title="重点行业监测企业数量排名" :showLine="false">
            <template v-slot:chart>
              <RankBar :data="rankData"></RankBar>
            </template>
          </chart-box>
        </div>
      </div>
      <div class="left3">
        <chart-box title="安全知识">
          <template v-slot:chart>
            <div class="left3-container">
              <div
                class="left3-item"
                :class="`left3-item${i + 1}`"
                v-for="(item, i) in totalList3"
                :key="i"
              >
                <div class="name">{{ item.name }}</div>
                <div class="value">
                  {{ item.value }}<span class="unit">{{ item.unit }}</span>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="bg"></div>
      <div class="flow"></div>
      <!-- <div
        class="text"
        :class="`text${i + 1}`"
        v-for="(text, i) in textList"
        :key="i"
      >
        {{ text }}
      </div> -->
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="上报数据质量分析">
          <template v-slot:chart>
            <div class="total-container">
              <div class="total-box">
                <div class="total-box-t">
                  <div
                    class="total-card"
                    v-for="(item, i) in totalList4"
                    :key="i"
                  >
                    <total-one :data="item"></total-one>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <div class="right-container" v-for="(item, i) in totalList5" :key="i">
          <div class="name">{{ item.name }}</div>
          <div class="list">
            <div class="item" v-for="(t, j) in item.list" :key="j">
              <span class="label">{{ t.name }}</span>
              <span class="value1">{{ t.value1.value }}</span>
              <span class="value2"
                >{{ Math.abs(t.value2.value) }}%<span
                  style="margin-left: 5px; font-size: 20px; font-weight: 600"
                  :style="{
                    color:
                      t.value2.value < 0 ? 'rgba(0, 206, 209, 1)' : '#fc6b49',
                  }"
                  >{{ t.value2.value > 0 ? "↑" : "↓" }}</span
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="right3">
        <div class="right3-l">
          <chart-box title="部侧数据横向共享联动情况" :showLine="false">
            <template v-slot:chart>
              <div class="list-container">
                <div class="item" v-for="(item, i) in totalList6" :key="i">
                  <img
                    :src="require(`./imgs/right-icon${i + 1}.png`)"
                    alt=""
                    srcset=""
                    width="69"
                  />
                  <div class="info">
                    <div class="name">{{ item.name }}</div>
                    <div class="value">{{ item.value }}</div>
                  </div>
                </div>
              </div>
            </template>
          </chart-box>
        </div>
        <div class="right3-r">
          <chart-box title="各省份上报数据完整性与及时性排名" :showLine="false">
            <template v-slot:chart>
              <CubeBarLine
                :data="barLineData"
                :dataZoom="{
                  show: true,
                  start: 0,
                  end: 20,
                  height: 20,
                }"
                :bottom="50"
              ></CubeBarLine>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLeft, useCenter, useRight } from "./hooks/useData";
import chartBox from "@c/chartBox";
import RankBar from "@c/echarts/bar/CircleSymbolBar";
import TotalOne from "@c/ActTotal/one.vue";
import CubeBarLine from "@c/echarts/bar/CubeBarLine";

const { total, totalList1, totalList2, rankData, totalList3 } = useLeft();
const { textList } = useCenter();
const { totalList4, totalList5, totalList6, barLineData } = useRight();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
