<template>
  <div class="page-architecture">
    <div class="left">
      <div class="left1">
        <chart-box title="近一个月工业互联网安全宏观态势">
          <template v-slot:chart>
            <div class="overview-container">
              <div
                class="overview-item"
                v-for="item in overview"
                :key="item.name"
              >
                <div class="name">{{ item.name }}</div>
                <div class="value">
                  {{ item.value }}<span class="unit">家</span>
                </div>
              </div>
            </div>
            <div class="attack-container">
              <div
                class="attack-item"
                v-for="(item, i) in attackData"
                :key="item.name"
              >
                <div class="title" @click="goto(item.page)">
                  {{ item.title }}
                </div>
                <div class="box">
                  <div class="top">
                    <span class="name">{{ item.name }}</span>
                    <span class="value"
                      >{{ item.value }}<span class="unit"></span
                    ></span>
                  </div>
                  <div class="bottom">
                    <div
                      class="icon"
                      :class="i == 0 ? 'icon1' : i == 1 ? 'icon2' : 'icon3'"
                    ></div>
                    <div class="rate">
                      <div class="name">环比{{ item.label }}</div>
                      <div class="value">{{ item.rate }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="left2">
        <chart-box title="监测赋能服务专题">
          <template v-slot:chart>
            <div class="flow-img">
              <div class="title l" @click="goto('/keyGuarantee')">
                服务保障专题
              </div>
              <!-- <div class="title r" @click="goto('/integratedCircuit')">
            重点监测专题
          </div> -->
              <div class="title r">重点行业监测</div>
              <div class="view l">
                <vue3ScrollSeamless
                  class="scroll-wrap"
                  :dataList="listl"
                  v-if="listl.length > 0"
                  :classOptions="{ limitMoveNum: 4, step: 0.16 }"
                >
                  <div
                    class="item"
                    v-for="item in listl"
                    :key="item.id"
                    @click="gotoEvent(item.id)"
                  >
                    {{ item.eventName }}
                  </div>
                </vue3ScrollSeamless>
              </div>
              <div class="view r">
                <vue3ScrollSeamless
                  class="scroll-wrap"
                  :dataList="listr"
                  v-if="listr.length > 0"
                  :classOptions="{ limitMoveNum: 4, step: 0.16 }"
                >
                  <div
                    class="item"
                    v-for="item in listr"
                    :key="item"
                    @click="gotoSpecial(item)"
                  >
                    {{ item.label }}
                  </div>
                </vue3ScrollSeamless>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="flow-container">
        <div class="top-flow">
          <div class="name"></div>
          <div class="flow-header">
            <span class="text">{{ title }}</span>
          </div>
          <div class="flow-center">
            <div
              class="flow-item"
              v-for="(item, i) in [
                '宏观态势',
                '定向监测',
                '深度研判',
                '风险预警',
              ]"
              :key="i"
            >
              <div class="icon" :class="'icon' + (i + 1)"></div>
              <div class="text">{{ item }}</div>
            </div>
          </div>
          <div class="flow-arrows">
            <div class="flow-arrow l"></div>
            <div class="flow-arrow r"></div>
          </div>
        </div>
        <div class="center-flow">
          <div class="name"></div>
          <div class="flow-header">
            <span class="text">省级工业互联网安全监测平台</span>
          </div>
          <div class="flow-center">
            <div
              class="flow-item"
              v-for="(item, i) in [
                '数据采集',
                '数据清洗',
                '数据报送',
                '风险通报',
              ]"
              :key="i"
            >
              <div class="icon" :class="'icon' + (i + 1)"></div>
              <div class="text">{{ item }}</div>
            </div>
            <div class="flow-center-bottom">
              <div class="flow-text1"></div>
              <div class="flow-arrow"></div>
              <!-- <div class="flow-arrow1"></div>
              <div class="flow-arrow2"></div> -->
              <div class="flow-text2"></div>
            </div>
          </div>
        </div>
        <div class="bottom-flow">
          <div class="name"></div>
          <div class="bottom-footer"></div>
          <div
            class="flow-item"
            v-for="(item, i) in [
              '联网工业企业',
              '工业互联网平台企业',
              '标识解析企业',
            ]"
            :key="i"
            :class="`flow-item${i + 1}`"
          >
            <div class="icon" :class="'icon' + (i + 1)"></div>
            <div class="text">{{ item }}</div>
          </div>
          <div class="edges"></div>
          <div class="flow-arrow arrow1"></div>
          <div class="flow-arrow arrow2"></div>
          <div class="bottom-circle">
            <div
              class="bottom-circle-item"
              v-for="(item, i) in ['骨干网', '城域网', 'IDC']"
              :key="i"
              :class="`bottom-circle-item${i + 1}`"
            >
              {{ item }}
            </div>
          </div>
          <div class="flow-dot"></div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right1">
        <chart-box title="工业互联网发展态势">
          <template v-slot:chart>
            <div class="total-list">
              <div
                class="total-card"
                v-for="(item, ind) in totalList"
                :key="ind"
              >
                <total-one :data="item"></total-one>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="right2">
        <chart-box title="工业互联网安全发展态势">
          <template v-slot:chart>
            <CubeBarLine
              :single="0"
              :data="barLineData"
              :labelOption="{ fontSize: 18 }"
              :cubeOption="{ width: 42, height: 8, space: 8 }"
              :option="{
                yAxis: [{}, {}],
                tooltip: {
                  formatter: (params) => {
                    const name = params[0].name;
                    const value1 = params[0].value;
                    return `<p style=font-size:20px;color:#fff;margin-bottom:10px>${name}</p>
                      <p style=font-size:18px;color:#fff;>攻击次数：${value1}万次</p>
                      `;
                  },
                },
              }"
            ></CubeBarLine>
          </template>
        </chart-box>
      </div>
    </div>
  </div>
</template>

<script setup>
import CubeBarLine from "@c/echarts/bar/CubeBar";
import chartBox from "@c/chartBox";
import TotalOne from "./components/one.vue";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import { useData } from "./hooks/useData";
import { useRouter } from "vue-router";

const {
  overview,
  attackData,
  listl,
  listr,
  gotoEvent,
  gotoSpecial,
  barLineData,
  totalList,
  title,
} = useData();

const router = useRouter();
function goto(path) {
  router.push(path);
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
