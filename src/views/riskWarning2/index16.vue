<template>
  <div class="risk-warning">
    <div class="risk-left">
      <div class="title">
        <span class="text">通报处置流程</span>
      </div>
      <div class="content"></div>
    </div>
    <div class="risk-right">
      <div class="sin">
        <ChartBox title="通报处置统计">
          <template v-slot:chart>
            <div class="info">
              <div
                :class="['info-item', 'item' + i]"
                v-for="(item, i) in infoList"
                :key="i"
              >
                <div class="value">{{ insertSeparator(item.value) }}</div>
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
          </template>
        </ChartBox>
      </div>
      <div class="sin">
        <div class="sin-l">
          <ChartBox title="通报处置趋势分析">
            <template v-slot:chart>
              <Line :data="lineData"></Line>
            </template>
          </ChartBox>
        </div>
        <div class="sin-r">
          <ChartBox title="企业归属行业分布">
            <template v-slot:chart>
              <Pie :data="pieData" :chartName="'企业归属行业分布'"></Pie>
            </template>
          </ChartBox>
        </div>
      </div>
      <div class="sin">
        <ChartBox title="企业通报处置案例">
          <template v-slot:chart>
            <el-carousel
              indicator-position="none"
              arrow="hover"
              :autoplay="true"
              height="196px"
              :interval="8000"
              v-if="riskCompanyList.length > 0"
            >
              <el-carousel-item
                v-for="(page, pageIndex) in listPages"
                :key="pageIndex"
              >
                <div class="list-container">
                  <div class="list-item" v-for="(item, i) in page" :key="i" @click="handleClick(item)">
                    <div class="top">
                      <img :src="require('./imgs16/8.png')" />
                      <div class="label" :title="item.title">
                        {{ item.title }}
                      </div>
                    </div>
                    <div class="bot">
                      <div class="detail">
                        <div class="sin l">
                          <div class="label">风险类型：</div>
                          <div class="value">{{ item.riskType }}</div>
                        </div>
                        <div class="sin r">
                          <div class="label">风险等级：</div>
                          <div
                            :class="[
                              'value',
                              'level-text',
                              'level-' + item.level,
                            ]"
                          >
                            {{ item.riskLevel }}
                          </div>
                        </div>
                      </div>
                      <div class="detail">
                        <div class="sin l">
                          <div class="label">通报时间：</div>
                          <div class="value">{{ item.time }}</div>
                        </div>
                        <div class="sin r">
                          <div class="label">处置状态：</div>
                          <div
                            :class="[
                              'value',
                              'status',
                              'status-' + item.disposalNum,
                            ]"
                          >
                            {{ item.disposal }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </template>
        </ChartBox>
      </div>
    </div>
    <el-dialog  
    v-model="dialogVisible"
    title="报告详情"
    width="800px"
      destroy-on-close
      custom-class="dialog-custom spec"
    :before-close="handleClose">
    <el-image :src="imgUrl" lazy  class="dialog-image"/>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref} from "vue";
import { useData } from "./hooks/useData";
import { computed } from "vue";
import ChartBox from "@c/chartBox";
import Line from "@c/echarts/Line/lineArea16/index.vue";
import Pie from "@c/echarts/Pie/NewPie16.vue";
import { insertSeparator } from "@/libs/util";
const listPages = computed(() => {
  const pages = [];
  const arr = Array.isArray(riskCompanyList.value) ? riskCompanyList.value : [];
  for (let i = 0; i < arr.length; i += 3) {
    pages.push(arr.slice(i, i + 3));
  }
  return pages;
});
const dialogVisible = ref(false);
const imgUrl = ref('');
function handleClick(item){
  imgUrl.value = item.image;
  dialogVisible.value = true;
}
const { pieData, infoList, riskCompanyList, lineData } = useData();
</script>

<style lang="scss" scoped>
@import "./index16.scss";
</style>
<style lang="scss">
.dialog-custom {
  &.spec{
  .el-dialog__header{
    text-align: center;
  }
    .el-dialog__body {
    overflow-y: auto;
    height: 753px;
    text-align: center;
  }
}
}
</style>
