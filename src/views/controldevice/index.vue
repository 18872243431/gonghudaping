<template>
  <div class="control-device">
    <div class="control-device-left">
      <div class="item-box">
        <chart-box title="暴露资产及漏洞数量概览">
          <template v-slot:chart>
            <div class="total1">
              <div class="total-item" v-for="(item, index) in totalList1" :key="index">
                <div class="icon-box">
                  <img :src="require(`@/assets/img/controlDevice/${item.icon}.png`)" alt="" />
                </div>
                <div class="label-val">
                  <div class="val">
                    <span v-for="(val, i) in thousands(item.value)" :key="i">
                      {{ val }}
                    </span>
                  </div>
                  <div class="label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="item-box">
        <chart-box title="暴露工控设备及系统数量排名">
          <template v-slot:chart>
            <div class="total2-box">
              <div class="total2">
                <div class="total-item" v-for="(item, index) in totalList2" :key="index">
                  <div class="icon-box">
                    <img :src="require(`@/assets/img/controlDevice/${index + 1}.png`)" alt="" />
                  </div>
                  <div :class="['label-val-box', 'box-type' + item.type]">
                    <div class="label-icon"></div>
                    <div class="label-val">
                      <div class="label">{{ item.label }}</div>
                      <div class="val">{{ item.value }} <span class="unit">{{ item.unit }}</span></div>
                    </div>
                    <div class="percentage">
                      <el-progress type="circle" :percentage="item.percentage" :width="80" :color="item.type == '1' ? '#FFBD43' : '#4BD2FD'"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="item-box">
        <div class="item-box-l">
          <chart-box title="漏洞类型排名">
            <template v-slot:chart>
              <PyramidBar :data="pyramidBarData"></PyramidBar>
            </template>
          </chart-box>
        </div>
        <div class="item-box-r">
          <chart-box title="资产及漏洞发现趋势">
            <template v-slot:chart>
              <LineArea :data="lineData"></LineArea>
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="control-device-center">
      <chart-box class="box" title="雷达图">
        <template v-slot:chart>
          <Radar :option="radarOption" :data="radarData"></Radar>
        </template>
      </chart-box>
      <chart-box class="box" title="折线柱状图">
        <template v-slot:chart>
          <CubeBarLine></CubeBarLine>
        </template>
      </chart-box>
        <chart-box class="box" title="电池排名图">
        <template v-slot:chart>
          <ul class="battery-bar system-scrollbar">
          <li class="item"
              v-for="(item, i) in batteryList"
              :key="item.name">
            <div class="bar-box">
              <div class="bg"></div>
              <div class="battery-chart-box">
                <battery-rank-bar2 :data="item"
                                  :serial="i + 1"
                                  :max="batteryList[0].value"></battery-rank-bar2>
              </div>
            </div>
          </li>
        </ul>
        </template>
      </chart-box>
    </div>

    <div class="control-device-right">
      <div class="item-box">
        <chart-box title="各厂商设备及系统风险情况分析">
          <template v-slot:chart>
            <div class="slider">
              <el-carousel indicator-position="none" :interval="3000">
                <el-carousel-item v-for="(data, index) in riskList" :key="index">
                  <ul class="platform-list">
                    <li class="list-item" v-for="item in data" :key="item.name">
                      <div class="item-box">
                        <div class="img-box">
                          <img :src="require(`public/carNetwork/${item.src}.png`)" />
                        </div>
                        <div class="total-item-box">
                          <div class="data-info">
                            <span class="label">设备及系统数量：</span>
                            <span class="value value1">{{ item.num1 }}</span>
                            <span class="unit">{{item.unit}}</span>
                          </div>
                          <div class="data-info">
                            <span class="label">漏洞数量：</span>
                            <span class="value value2">{{ item.num2 }}</span>
                            <span class="unit">{{item.unit}}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </chart-box>
      </div>
      <div class="item-box">
        
        <chart-box title="工控设备及系统被攻击情况">
          <template v-slot:chart>
            <BarBgDoubleYName></BarBgDoubleYName>
          </template>
        </chart-box>
      </div>
    </div>

    
  </div>
</template>
<script setup>
import chartBox from '@c/chartBox'
import BarBgDoubleYName from '@c/echarts/bar/BarBgDoubleYName'
import PyramidBar from '@c/echarts/bar/PyramidBar'
import LineArea from '@c/echarts/Line/lineArea'
import { usehook } from './hooks/use'
import Radar from '@c/echarts/Radar'
import CubeBarLine from '@c/echarts/bar/CubeBarLine'
import BatteryRankBar2 from '@c/echarts/bar/BatteryRankBar2'
const { 
  totalList1, 
  thousands,
  totalList2, 
  pyramidBarData, 
  lineData, 
  riskList, 
  radarOption, 
  radarData,
  batteryList
 } = usehook()
</script>
<style scoped lang="scss">
@import './index.scss';
</style>