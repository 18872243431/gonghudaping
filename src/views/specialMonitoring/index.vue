<template>
  <div class="specialMonitoring">
    <div class="left">
      <div class="left1">
         <chart-box title="专项监测任务">
            <template v-slot:chart>
              <div class="dropdown-container">
                <el-dropdown>
                  <el-icon style="font-size: 30px; color: #3fc3ff"
                    ><CaretBottom
                  /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="item in eventList"
                        :key="item.id"
                        @click.native="handleClick(item)"
                        >{{ item.eventName }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="left1-con">
                 <div class="task-name-card">
                    <div class="icon task-icon"></div>
                    <div class="task-content">
                      <span class="task-label">专项监测任务名称:</span>
                      <span class="task-value">{{ info[0].value }}</span>
                    </div>
                  </div>
                  <!-- 时间和监测数量 -->
                  <div class="info-row">
                    <div class="info-card time-card">
                      <div class="icon time-icon"></div>
                      <div class="info-content">
                        <span class="info-label">监测起止时间:</span>
                        <span class="info-value">{{ info[1].value }}</span>
                      </div>
                    </div>
                    <div class="info-card monitor-card">
                      <div class="icon monitor-icon"></div>
                      <div class="info-content">
                        <span class="info-label">监测对象数量:</span>
                        <span class="info-value highlight">{{ info[2].value }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="task-desc">
                    <div class="desc-label">专项监测任务服务:</div>
                    <div class="desc-value">{{ info[3].value }}</div>
                  </div>
                </div>
            </template>
          </chart-box>
      </div>
      <div class="left2">
        <chart-box title="监测对象分布及被攻击情况">
          <template v-slot:chart>
            <div class="map-container">
              <ChinaMap
              :showClipDefs="true"
           :style="{ height: '100%', transform: 'scaleX(1.0) scaleY(1.0)',
            top: '0px' ,left:'-40px'}"
              :baseOption="{ zoom: 1.6, top: 110, center: [112.97, 29.71] }"
                v-if="!provinceName"
                :data="mapData"
                :showCube="false"
                :option="{ ...mapOption, visualMap2: {
                      ...mapOption.visualMap2,
                      left: 80,   /* 控制右侧图例的左右位置：需跟随左侧图例同步增加 */
                      top: 350,/* 控制右侧图例的上下位置：需跟随左侧图例同步调整 */
                    }, label:{show: true, fontSize: 14, color: '#ffffff'},textStyle: { fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif', color: '#ffffff', fontSize: 20 } }"
                name1="被攻击次数"
              ></ChinaMap>
              <ProvinceMap
                v-else
                :provinceName="provinceName"
                :data="mapData"
                :option="{ textStyle: { fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif', color: '#ffffff', fontSize: 20 } }"
                @click="provinceMapClick"
              ></ProvinceMap>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="center1">
          <div
            class="total-card"
            v-for="(item, ind) in totalOneList"
            :key="ind"
          >
            <total-one :data="item"></total-one>
          </div>
      </div>
      <div class="center2">
        <chart-box title="风险企业告警">
          <template v-slot:chart>
            <act-table
              :showSeq="true"
              :columns="columns2"
              :tableData="companyList"
              :needScroll="true"
            >
              <template #companyName="{ row }">
                <div
                  class="company-name"
                  :title="row.companyName"
                  style="cursor: pointer; text-decoration: underline"
                  @click="gotoCompany(row.companyName)"
                >
                  {{ row.companyName }}
                </div>
              </template>
              <template #eventTab="{ row }">
                  <span
                    v-if="row.eventTab && row.eventTab.length > 0"
                    :title="row.eventTab[0]"
                    >{{ row.eventTab[0] }}</span
                  >
              </template>
            </act-table>
          </template>
        </chart-box>
      </div>
      <div class="center3">
        <chart-box title="网络攻击时段特点分析">
          <template v-slot:chart>
             <Line :option="{ ...lineOpts, textStyle: { fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif', color: '#ffffff', fontSize: 20 } }" :data="lineData3"></Line>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <div class="right1">
         <div class="right-sin">
            <chart-box  title="网络攻击类型分布" >
              <template v-slot:chart>
                <Pie 
                  :data="pieData"
                  :option="{
                    innerRaduis: ['70%', '90%'],
                    outerRaduis: ['89%', '100%'],
                    lineRaduis: ['65%', '66%'],
                    shadowRadius: '61%',
                    textStyle: { fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif', color: '#ffffff', fontSize: 20 },
                    colors: [
                      'rgba(0, 255, 255, 1)',
                      'rgba(0, 204, 255, 1)',
                      'rgba(0, 153, 255, 1)',
                      'rgba(0, 102, 255, 1)',
                      'rgba(0, 51, 255, 1)',
                      'rgba(0, 0, 255, 1)',
                      'rgba(0, 102, 204, 1)',
                      'rgba(0, 153, 204, 1)'
                    ]
                  }"
                ></Pie>
            </template>
            </chart-box>
        </div>
        <div class="right-sin">
          <chart-box  title="攻击国家排名" >
              <template v-slot:chart>
                <RankBar
                  :data="rankBarData"
                  :option="{ textStyle: { fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif', color: '#ffffff', fontSize: 20 } }"
                  :showNational="true"
                ></RankBar>
              </template>
          </chart-box>
        </div>
      </div>
     <div class="right2">
      <chart-box title="攻击行为监测">
        <template v-slot:chart>
          <vue3-scroll-seamless
           class="vulnerability-list"
            :classOptions="{ limitMoveNum: 4, step: 0.5 }"
            :dataList="noticeData"
          >
            <div
              class="vulnerability-item"
              v-for="(item, i) in noticeData"
              :key="i"
            >
              <div class="time">· {{ item.timestamp }}</div>
              <div class="info" v-if="item.type == 1">
                <span style="margin-right: 14px">监测发现</span>
                <span style="margin-right: 14px">{{ item.attackedCorpName }}</span>
                <span>遭受 </span>
                <span style="color: rgba(255, 189, 67, 1); margin-right: 4px">{{
                  item.attackIp
                }}</span>
                <span v-flag="{ hiddenText: true }">{{ item.attackCountry }}</span>
                <span> 的{{ item.eventTypeName }}</span>
              </div>
              <div class="info" v-if="item.type == 2">
                <span style="margin-right: 14px">监测发现</span>
                <span style="margin-right: 14px">{{ item.attackedCorpName }}</span>
                <span>连接至 </span>
                <span style="color: rgba(255, 189, 67, 1); margin-right: 4px">{{
                  item.attackIp
                }}</span>
                <span v-flag="{ hiddenText: true }">{{ item.attackCountry }}</span>
                <span style="margin-right: 14px">
                  ，涉及{{ item.eventTypeName }}，存在数据泄露/远控风险
                </span>
              </div>
              <div class="info" v-if="item.type == 3">
                <span style="margin-right: 14px">监测发现</span>
                <span style="margin-right: 14px">{{ item.attackCorpName }}</span>
                <span>对 </span>
                <span style="color: rgba(255, 189, 67, 1); margin-right: 4px">{{
                  item.attackedIp
                }}</span>
                <span v-flag="{ hiddenText: true }">{{ item.attackedCountry }}</span>
                <span style="margin-right: 14px"> 实施{{ item.eventTypeName }}</span>
              </div>
              <div class="info" v-if="item.type == 4">
                <span style="margin-right: 14px">监测发现</span>
                <span style="margin-right: 14px">{{ item.attackedCorpName }}</span>
                <span style="margin-right: 14px">感染{{ item.eventTypeName }} </span>
              </div>
            </div>
          </vue3-scroll-seamless>
        </template>
      </chart-box>
     </div>
    </div>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import ChinaMap from "@/components/echarts/map/ImgChina/index";
import ProvinceMap from "@/components/echarts/map/Province/index";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import TotalOne from "@c/ActTotal/one.vue";
import Line from "@c/echarts/Line/lineArea/index.vue";
import Pie from "@c/echarts/Pie/NewPie";
import RankBar from "@c/echarts/bar/BackgroundBar/index.vue";
import ActTable from "@c/ActTable";
import { CaretBottom } from "@element-plus/icons-vue";
import {
  useLeft,
  useCenter,
  useRight1,
  useRight2,
} from "./hooks/useSpecialMonitoring";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {computed } from "vue";
const {
  eventList,
  info,
  mapData,
  noticeData,
  handelMapClick,
  provinceName,
  provinceMapClick,
  handleClick,
  mapOption,
} = useLeft();
const { overflowData1, totalOneList, totalTwoList, columns2, companyList } =
  useCenter();

// 调整 32:9 页面下表格后三列的宽度
columns2.value.forEach((col) => {
  if (col.prop === "atdNum") col.width = 240;
  if (col.prop === "ipNum") col.width = 240;
  if (col.prop === "eventTab") col.width = 340;
});

const { pieData, columns, tableData, rankBarData } = useRight1();
const { attackIpList, lineData3, lineOpts } = useRight2();

const router = useRouter();
const store = useStore();
  const eventId = computed(() => {
    return store.state.page.eventId;
  });

function gotoCompany(name) {
  router.push(`/enterpriseRisk?companyName=${name}&sourceType=3&uploadLabel=${eventId.value}&timeBtnsShow=1`);
}
</script>

<style scoped lang="scss">
@import "./index.scss";


</style>
