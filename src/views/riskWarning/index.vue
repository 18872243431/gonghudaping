<template>
  <div class="risk-warning">
    <div class="risk-warning-card">
      <div class="card-title title1">
        <span class="text">数据挖掘分析</span>
      </div>
      <div class="card-content">
        <!-- <div class="pyramid-bottom"></div> -->
        <div class="pyramid-container">
          <div
            class="number"
            :class="`number${i + 1}`"
            v-for="(d, i) in pyramidData"
            :key="i"
          >
            <p style="color: #06fbff; font-size: var(--font-h3)">{{ d.name }}</p>
            <span> {{ d.value.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="arrow-right" style="left: 722px"></div>
    <div class="risk-warning-card">
      <div class="card-title title2">
        <span class="text">研判</span>
      </div>
      <div class="card-content">
        <div class="card-flipper-container">
          <div class="bottom"></div>
          <div class="icon"></div>
          <div class="name">研判报告</div>
          <div class="card-flipper-list">
            <div class="card-flipper-item" v-for="i in 4" :key="i"></div>
          </div>
          <div class="number">
            <ActNum :num="overviewData.totalNum" />
          </div>
          <div class="unit">份</div>
        </div>
        <div class="card-bottom">
          <chart-box title="研判事件类型分布">
            <template v-slot:chart>
              <Pie :data="pieData"></Pie>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="arrow-right" style="left: 1482px"></div>
    <div class="risk-warning-card">
      <div class="card-title title3">
        <span class="text">通报</span>
      </div>
      <div class="card-content">
        <div class="card-flipper-container">
          <div class="bottom"></div>
          <div class="icon icon2"></div>
          <div class="name name2">通报企业数量</div>
          <div class="card-flipper-list">
            <div class="card-flipper-item" v-for="i in 4" :key="i"></div>
          </div>
          <div class="number">
            <ActNum :num="overviewData.noticeEnterpriseNum" />
          </div>
          <div class="unit">家</div>
        </div>
        <div class="card-bottom" style="height: 480px">
          <chart-box title="通报行业排名">
            <template v-slot:chart>
              <act-table
                :showSeq="true"
                :columns="columns"
                :tableData="tableData"
              >
              </act-table>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="arrow-right" style="left: 2242px"></div>
    <div class="risk-warning-card">
      <div class="card-title title4">
        <span class="text">处置</span>
      </div>
      <div class="card-content">
        <div class="card-flipper-container">
          <div class="bottom"></div>
          <div class="icon icon3"></div>
          <div class="name">累计处置</div>
          <div class="card-flipper-list">
            <div class="card-flipper-item" v-for="i in 4" :key="i"></div>
          </div>
          <div class="number">
            <ActNum :num="overviewData.disposalNum" />
          </div>
          <div class="unit">次</div>
        </div>
        <div class="card-bottom">
          <chart-box title="各省通报处置情况排名">
            <template v-slot:chart>
              <CubeBarLine
                :data="barLineData.slice(0, 5)"
                :dataZoom="{
                  show: false,
                  start: 0,
                  end: 100,
                  height: 20,
                }"
                :bottom="50"
                :option="{
                  yAxis: [{}, {}],
                  tooltip: {
                    formatter: (params) => {
                      const name = params[0].name;
                      const value1 = params[0].value;
                      const value2 = params[1].value;
                      const value3 = params[2].value;
                      // console.log(params);
                      return `<p style=font-size:20px;color:#fff;margin-bottom:10px>${name}</p>
                      <p style=font-size:var(--font-small);color:#fff;>通报：${value1}</p>
                      <p style=font-size:var(--font-small);color:#fff;>处置：${value2}</p>
                      <p style=font-size:var(--font-small);color:#fff;>处置率：${value3}%</p>
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
    <div class="arrow-right" style="left: 3002px"></div>
    <div class="risk-warning-card">
      <div class="card-title title5">
        <span class="text">验证</span>
      </div>
      <div class="card-content">
        <div class="arrow"></div>
        <div class="total-container">
          <div class="icon"></div>
          <div class="info">
            <p class="name">企业</p>
            <div class="value">{{ overviewData.ratio }}%</div>
          </div>
        </div>
        <div class="chart-container">
          <cube-bar
            :data="cubeData"
            :single="0"
            :cubeOption="{ width: 48, height: 6, space: 12 }"
            :option="{
              legend: { show: false },
              yAxis: { show: false },
            }"
          ></cube-bar>
        </div>
        <div class="overview-container">
          <div class="item">
            <span class="label">告警数量</span>
            <span class="value"
              >{{ Math.abs(disposalRatio) }}%
              <span
                class="icon iconfont"
                :class="
                  disposalRatio > 0 ? 'icon-shangsheng' : 'icon-xiajiang1'
                "
                :style="{
                  color:
                    disposalRatio > 0
                      ? 'rgba(255, 58, 47, 1)'
                      : 'rgba(0, 255, 167, 1)',
                }"
              ></span>
            </span>
          </div>
          <div class="item">
            <span class="label">涉及企业数量</span>
            <span class="value value2">{{ enterpriseNum }}家</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from "./hooks/useData";
import ActNum from "@/components/ActNum";
import Pie from "@c/echarts/Pie/NewPie";
import ActTable from "@c/ActTable";
import ChartBox from "@c/chartBox";
import CubeBarLine from "@c/echarts/bar/CubeBarLine";
import CubeBar from "@c/echarts/bar/CubeBar";

const {
  pyramidData,
  overviewData,
  pieData,
  columns,
  tableData,
  barLineData,
  cubeData,
  disposalRatio,
  enterpriseNum,
} = useData();
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
