<template>
  <div class="specialMonitoring">
    <div class="left">
      <div class="page-title">
        <div>{{ info[0].value }}</div>
      </div>
      <div class="dropdown-container">
        <el-dropdown>
          <el-icon style="font-size: var(--font-number-lg); color: #3fc3ff"
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
      <div class="left1">
        <div class="item" v-for="item in info" :key="item.label">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
      <div class="left2">
        <chart-box title="监测对象分布及被攻击情况">
          <template v-slot:chart>
            <div class="map-container">
              <div class="text1">被攻击次数</div>
              <!-- <div class="text2">监测IP数</div> -->
              <ChinaMap
                :baseOption="{ zoom: 1, top: 0, center: [109.97, 29.71] }"
                v-if="!provinceName"
                :data="mapData"
                :showCube="false"
                :option="mapOption"
                name1="被攻击次数"
                name2="监测IP数"
                ></ChinaMap>
              <ProvinceMap
                v-else
                :provinceName="provinceName"
                :data="mapData"
                @click="provinceMapClick"
              ></ProvinceMap>
            </div>
            <div class="notice-container">
              <vue3ScrollSeamless
                class="scroll-wrap"
                :classOptions="{ limitMoveNum: 3, step: 0.18 }"
                :dataList="noticeData"
              >
                <Notice
                  v-for="(item, i) in noticeData"
                  :key="i"
                  :data="item"
                ></Notice>
              </vue3ScrollSeamless>
            </div>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="center">
      <div class="center1">
        <div class="overflow-container1">
          <div
            class="overflow-item"
            v-for="(item, i) in overflowData1"
            :key="i"
          >
            <div class="item-icon"></div>
            <div class="item-info">
              <div class="name">{{ item.name }}</div>
              <div>
                <span class="value">{{ item.value }}</span>
                <span class="unit">{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="total-box">
          <div class="total-box-t">
            <div
              class="total-card"
              v-for="(item, ind) in totalOneList"
              :key="ind"
            >
              <total-one :data="item"></total-one>
            </div>
          </div>
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
              :seqWidth="50"
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
                <div class="tags">
                  <span
                    class="tag"
                    v-for="(tag, i) in row.eventTab"
                    :key="i"
                    :title="tag"
                    >{{ tag }}</span
                  >
                </div>
              </template>
            </act-table>
          </template>
        </chart-box>
      </div>
      <div class="center3">
        <chart-box title="网络攻击时段特点分析">
          <template v-slot:chart>
            <Line :option="lineOpts" :data="lineData3"></Line>
          </template>
        </chart-box>
      </div>
    </div>
    <div class="right">
      <chart-box title="攻击者特点分析">
        <template v-slot:chart>
          <div class="right1">
            <div class="right1-container">
              <div class="pie-chart-container">
                <div class="sub-title">网络攻击类型分布</div>
                <Pie :data="pieData"></Pie>
              </div>
            </div>
          </div>
          <div class="right2">
            <div class="sub-title">攻击IP行为特征分析</div>
            <div class="attack-ip-container">
              <div
                class="attack-ip-item"
                v-for="(item, i) in attackIpList.slice(0, 3)"
                :key="i"
              >
                <div class="attack-ip-item-l">
                  <div class="left-t">{{ item.ip }}</div>
                  <div class="left-c">
                    <img
                      src="~/assets/img/specialMonitoring/ip-icon.png"
                      alt=""
                      srcset=""
                    />
                  </div>
                  <div
                    class="left-b"
                    v-flag="{
                      style: 'width:18px;height:auto;margin-right:5px',
                    }"
                  >
                    {{ item.country }}
                  </div>
                </div>
                <div class="attack-ip-item-r">
                  <div class="ip-item">
                    <span class="label">攻击类型</span>
                    <div class="types">
                      <span
                        v-for="(type, i) in item.types"
                        :key="i"
                        :class="['tag', 'tag' + ((i + 1) % 4)]"
                        >{{ type }}</span
                      >
                    </div>
                  </div>
                  <div class="ip-item">
                    <span class="label">攻击次数</span>
                    <div class="value">
                      <span class="num">{{ item.count }}</span>
                      <span class="unit">次</span>
                    </div>
                  </div>
                  <div class="ip-item">
                    <span class="label">攻击目标</span>
                    <div class="ips">
                      <span
                        v-for="(ip, i) in item.attackedIps"
                        :key="i"
                        class="ip"
                        >{{ ip }}</span
                      >
                    </div>
                  </div>
                  <div class="ip-item" v-if="false">
                    <span class="label">特点总结</span>
                    <span class="description">{{ item.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="right3">
            <div class="sub-title">网络攻击时段特点分析</div>
            <div class="line-chart-container">
              <Line :option="lineOpts" :data="lineData3"></Line>
            </div>
          </div> -->
        </template>
      </chart-box>
    </div>
  </div>
</template>

<script setup>
import chartBox from "@c/chartBox";
import ChinaMap from "@/components/echarts/map/China16/index";
import ProvinceMap from "@/components/echarts/map/Province/index";
import { vue3ScrollSeamless } from "vue3-scroll-seamless";
import TotalTwo from "@c/ActTotal/two1.vue";
import TotalOne from "@c/ActTotal/one.vue";
import Line from "@c/echarts/Line/lineArea16/index.vue";
import Pie from "@c/echarts/Pie/NewPie16";
import ActTable from "@c/ActTable";
import { CaretBottom } from "@element-plus/icons-vue";
import Notice from "./Notice.vue";
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
const { overflowData1, totalOneList, totalTwoList, companyList } = useCenter();
const { pieData, columns, tableData } = useRight1();
const { attackIpList, lineData3, lineOpts } = useRight2();
const columns2 = [
  { label: "企业名称", prop: "companyName", showOverflowTooltip: true },
  { label: "被攻击次数", prop: "atdNum", width: 100 },
  { label: "被攻击IP数", prop: "ipNum", width: 100 },
  { label: "遭受网络攻击类型", prop: "eventTab", width: 280 },
];

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
@import "./index16.scss";
</style>
