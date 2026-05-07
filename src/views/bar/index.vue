<template>
  <div class="control-device">
    <chart-box class="box" title="1">
      <template v-slot:chart>
        <AttackRankBar></AttackRankBar>
      </template>
    </chart-box>
    <chart-box class="box" title="2">
      <template v-slot:chart>
        <BackgroundBar></BackgroundBar>
      </template>
    </chart-box>

    <chart-box class="box" title="3">
      <template v-slot:chart>
        <Bar></Bar>
      </template>
    </chart-box>

    <chart-box class="box" title="4">
      <template v-slot:chart>
        <Bar1></Bar1>
      </template>
    </chart-box>

    <chart-box class="box" title="5">
      <template v-slot:chart>
        <BarBatterySymbol></BarBatterySymbol>
      </template>
    </chart-box>

    <chart-box class="box" title="6">
      <template v-slot:chart>
        <BarBatterySymbol2></BarBatterySymbol2>
      </template>
    </chart-box>

    <chart-box class="box" title="7">
      <template v-slot:chart>
        <BarCircleSymbol></BarCircleSymbol>
      </template>
    </chart-box>

    <chart-box class="box" title="8">
      <template v-slot:chart>
        <BarDoubleY></BarDoubleY>
      </template>
    </chart-box>

    <chart-box class="box" title="9">
      <template v-slot:chart>
        <BarRectangleNationalSymbol></BarRectangleNationalSymbol>
      </template>
    </chart-box>

    <chart-box class="box" title="10">
      <template v-slot:chart>
        <BarRectangleSymbol></BarRectangleSymbol>
      </template>
    </chart-box>

    <chart-box class="box" title="11">
      <template v-slot:chart>
        <BaseRankBar></BaseRankBar>
      </template>
    </chart-box>

    <chart-box class="box" title="12">
      <template v-slot:chart>
        <BatteryBar></BatteryBar>
      </template>
    </chart-box>

    <chart-box class="box" title="13">
      <template v-slot:chart>
        <BatteryRankBar></BatteryRankBar>
      </template>
    </chart-box>

    <chart-box class="box" title="13">
      <template v-slot:chart>
        <BatteryRankBar2></BatteryRankBar2>
      </template>
    </chart-box>

    <chart-box class="box" title="14">
      <template v-slot:chart>
        <CubeBar></CubeBar>
      </template>
    </chart-box>

    <chart-box class="box" title="15">
      <template v-slot:chart>
        <CubeBar1></CubeBar1>
      </template>
    </chart-box>

    <chart-box class="box" title="16">
      <template v-slot:chart>
        <CubeBar2></CubeBar2>
      </template>
    </chart-box>

    <chart-box class="box" title="17">
      <template v-slot:chart>
        <CylinderBar></CylinderBar>
      </template>
    </chart-box>

    <chart-box class="box" title="18">
      <template v-slot:chart>
        <HCubeBar></HCubeBar>
      </template>
    </chart-box>

    <chart-box class="box" title="18">
      <template v-slot:chart>
        <CubeBarLine></CubeBarLine>
      </template>
    </chart-box>

    

    <chart-box class="box" title="19">
      <template v-slot:chart>
        <ProvinceRankBar></ProvinceRankBar>
      </template>
    </chart-box>

    <chart-box class="box" title="20">
      <template v-slot:chart>
        <RankBar></RankBar>
      </template>
    </chart-box>

    <chart-box class="box" title="21">
      <template v-slot:chart>
        <RankScrollBar></RankScrollBar>
      </template>
    </chart-box>

    <chart-box class="box" title="22">
      <template v-slot:chart>
        <TerminalRankBar></TerminalRankBar>
      </template>
    </chart-box>

    <chart-box class="box" title="23">
      <template v-slot:chart>
        <TmtBar></TmtBar>
      </template>
    </chart-box>

    <chart-box class="box" title="24">
      <template v-slot:chart>
        <TmtDoubleBar></TmtDoubleBar>
      </template>
    </chart-box>

    <chart-box class="box" title="25">
      <template v-slot:chart>
        <TmtLineBar></TmtLineBar>
      </template>
    </chart-box>

    <chart-box class="box" title="26">
      <template v-slot:chart>
        <TopBar></TopBar>
      </template>
    </chart-box>
    <!-- <div class="control-device-left">
      <div class="item-box">
        <chart-box title="暴露资产及漏洞数量概览">
          <template v-slot:chart>
              
          </template>
        </chart-box>
      </div>
      <div class="item-box">
        <chart-box title="暴露工控设备及系统数量排名">
          <template v-slot:chart>
            
          </template>
        </chart-box>
      </div>
      <div class="item-box">
        <div class="item-box-l">
          <chart-box title="漏洞类型排名">
            <template v-slot:chart>
              
            </template>
          </chart-box>
        </div>
        <div class="item-box-r">
          <chart-box title="资产及漏洞发现趋势">
            <template v-slot:chart>
              
            </template>
          </chart-box>
        </div>
      </div>
    </div>
    <div class="control-device-center">

    </div>
    <div class="control-device-right">
      <div class="item-box">
        <chart-box title="被攻击的行业排名各厂商设备及系统风险情况分析">
            <template v-slot:chart>
              
            </template>
          </chart-box>
      </div>
      <div class="item-box">
        
        <chart-box title="工控设备及系统被攻击情况">
          <template v-slot:chart>
            
          </template>
        </chart-box>
      </div>
    </div> -->

    
  </div>
</template>
<script setup>
import chartBox from '@c/chartBox'
import AttackRankBar from '@c/echarts/bar/AttackRankBar'
import BackgroundBar from '@c/echarts/bar/BackgroundBar'
import Bar from '@c/echarts/bar/Bar'
import Bar1 from '@c/echarts/bar/Bar/index1.vue'
import BarBatterySymbol from '@c/echarts/bar/BarBatterySymbol'
import BarBatterySymbol2 from '@c/echarts/bar/BarBatterySymbol2'
import BarCircleSymbol from '@c/echarts/bar/BarCircleSymbol'
import BarDoubleY from '@c/echarts/bar/BarDoubleY'
import BarRectangleNationalSymbol from '@c/echarts/bar/BarRectangleNationalSymbol'
import BarRectangleSymbol from '@c/echarts/bar/BarRectangleSymbol'
import BaseRankBar from '@c/echarts/bar/BaseRankBar'
import BatteryBar from '@c/echarts/bar/BatteryBar'
import BatteryRankBar from '@c/echarts/bar/BatteryRankBar'
import BatteryRankBar2 from '@c/echarts/bar/BatteryRankBar2'
import CubeBar from '@c/echarts/bar/CubeBar'
import CubeBar1 from '@c/echarts/bar/CubeBar1'
import CubeBar2 from '@c/echarts/bar/CubeBar2'
import CylinderBar from '@c/echarts/bar/CylinderBar'
import HCubeBar from '@c/echarts/bar/HCubeBar'
import CubeBarLine from '@c/echarts/bar/CubeBarLine'

import ProvinceRankBar from '@c/echarts/bar/ProvinceRankBar'
import RankBar from '@c/echarts/bar/RankBar'
import RankScrollBar from '@c/echarts/bar/RankScrollBar'
import TerminalRankBar from '@c/echarts/bar/TerminalRankBar'
import TmtBar from '@c/echarts/bar/TmtBar'
import TmtDoubleBar from '@c/echarts/bar/TmtDoubleBar'
import TmtLineBar from '@c/echarts/bar/TmtLineBar'
import TopBar from '@c/echarts/bar/TopBar'

</script>
<style scoped lang="scss">

@import './index.scss';
</style>