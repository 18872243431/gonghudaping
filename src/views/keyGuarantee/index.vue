<template>
  <div class="key-guarantee">
    <div class="left">
      <div class="flow">
        <div class="flow-title">工业互联网企业通报处置流程</div>
        <div
          :class="['node-name', `node-name-${i + 1}`]"
          v-for="(item, i) in nodeNames"
          :key="item.name"
          :style="{
            top: item.top,
            left: item.left,
          }"
        >
          {{ item.name }}
        </div>
        <div class="edge-name edge-name-1">
          <div class="l">
            <p>风险预警</p>
            <p>漏洞隐患</p>
            <p>安全事件</p>
          </div>
          <p class="r">信息报送</p>
        </div>
        <div class="edge-name edge-name-2 h">
          <p>通报</p>
          <p>同步归档</p>
        </div>
        <div class="edge-name edge-name-3 h">
          <p>通报</p>
          <p>同步归档</p>
        </div>
        <div class="edge-name edge-name-4 h">
          <p>整改</p>
          <p>反馈</p>
        </div>
        <div class="edge-name edge-name-5 h">
          <p>联合通报</p>
          <p>整改反馈</p>
        </div>
        <div class="edge-name edge-name-6 h">
          <p>整改</p>
          <p>反馈</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="t">
        <div class="right-t-title">监测预警概览</div>
        <div class="overview-container">
          <div class="overview-item">
            <div class="overview-item-title">告警降噪</div>
            <div class="overview-item-content">
              <div class="info-item">
                <img src="./imgs/icon1.png" alt="" class="overview-icon" />
                <div class="name">原始告警</div>
                <div class="value">
                  <span> {{ formatNumber(overviewData1[0]) }}</span
                  ><span class="unit">家</span>
                </div>
              </div>
              <div class="info-item">
                <img src="./imgs/icon2.png" alt="" class="overview-icon" />
                <div class="name">线索初筛</div>
                <div class="value">
                  <span> {{ formatNumber(overviewData1[1]) }}</span
                  ><span class="unit">家</span>
                </div>
              </div>
            </div>
          </div>
          <div class="overview-item">
            <div class="overview-item-title">事件研判</div>
            <div class="overview-item-content">
              <div class="info-item">
                <img
                  src="./imgs/icon3.png"
                  style="width: 28px; left: 111px"
                  alt=""
                  class="overview-icon"
                />
                <div class="name">可疑事件</div>
                <div class="value">
                  <span> {{ formatNumber(overviewData2[0]) }}</span
                  ><span class="unit">家</span>
                </div>
              </div>
              <div class="info-item">
                <img
                  src="./imgs/icon4.png"
                  style="width: 26px; left: 111px"
                  alt=""
                  class="overview-icon"
                />
                <div class="name">验证事件</div>
                <div class="value">
                  <span> {{ formatNumber(overviewData2[1]) }}</span
                  ><span class="unit">家</span>
                </div>
              </div>
            </div>
          </div>
          <div class="overview-item">
            <div class="overview-item-title">通报预警</div>
            <div class="overview-item-content">
              <div class="info-item">
                <img
                  src="./imgs/icon5.png"
                  style="width: 28px; left: 111px"
                  alt=""
                  class="overview-icon"
                />
                <div class="name">通报企业数量</div>
                <div class="value">
                  <span> {{ formatNumber(overviewData3[0]) }}</span
                  ><span class="unit">家</span>
                </div>
              </div>
              <div class="info-item">
                <img
                  src="./imgs/icon6.png"
                  style="width: 26px; left: 111px"
                  alt=""
                  class="overview-icon"
                />
                <div class="name">累计处理</div>
                <div class="value">
                  <span> {{ formatNumber(overviewData3[1]) }}</span
                  ><span class="unit">家</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="b">
        <el-carousel
          class="company-carousel"
          indicator-position="none"
          height="410px"
          :interval="10000"
          v-if="companyPages.length > 0"
        >
          <el-carousel-item v-for="(page, pi) in companyPages" :key="pi">
            <div class="company-page">
              <div class="company" v-for="company in page" :key="company.name">
                <div class="company-name">{{ company.name }}</div>
                <div class="time">
                  <img
                    src="./imgs/time-icon.png"
                    alt=""
                    srcset=""
                    class="time-icon"
                  />
                  <span class="time-text">{{ company.time }}</span>
                </div>
                <div class="info">
                  <div class="info-item">
                    <img src="./imgs/icon1-bottom.png" alt="" srcset="" />
                    <span>恶意IP：{{ company.ip }}</span>
                  </div>
                  <div class="info-item">
                    <img src="./imgs/icon2-bottom.png" alt="" srcset="" />
                    <span>事件：{{ company.event }}</span>
                  </div>
                </div>
                <div class="warning-content">风险：{{ company.warning }}</div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from "./hooks/useData";

import { computed } from "vue";
const { overviewData1, overviewData2, overviewData3, companyList } = useData();

const companyPages = computed(() => {
  const list = companyList?.value || [];
  const pages = [];
  for (let i = 0; i < list.length; i += 3) {
    pages.push(list.slice(i, i + 3));
  }
  return pages;
});

function formatNumber(value) {
  const num = Number(value);
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + "亿";
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  } else {
    return num.toLocaleString();
  }
}

const nodeNames = [
  {
    name: "工信部",
    top: "351px",
    left: "315px",
  },
  {
    name: "省级工信主管部门",
    top: "306px",
    left: "945px",
  },
  {
    name: "工业企业",
    top: "332px",
    left: "1723px",
  },
  {
    name: "中国信息通信研究院",
    top: "788px",
    left: "232px",
  },
  {
    name: "地方通信管理局",
    top: "788px",
    left: "959px",
  },
  {
    name: "车联网服务平台企业",
    top: "570px",
    left: "1675px",
  },
  {
    name: "平台企业标识解析企业",
    top: "809px",
    left: "1675px",
  },
];
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
