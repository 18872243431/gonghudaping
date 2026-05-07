<template>
  <div class="risk-warning">
    <div class="risk-left">
      <div class="title">
        <span class="text">通报处置流程</span>
      </div>
      <div class="content"></div>
    </div>
    <div class="risk-center">
      <div class="top">
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
      <div class="bot">
        <div class="line">
          <ChartBox title="通报处置趋势分析">
            <template v-slot:chart>
              <Line :data="lineData" :option="{
                legend: { textStyle: { color: '#ffffff', fontSize: 20, fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', \'SourceHanSansSC\', sans-serif' } },
                xAxis: { axisLabel: { color: '#ffffff', fontSize: 20, fontFamily: '\'DIN\', \'SourceHanSansSC\', sans-serif' } },
                yAxis: { axisLabel: { color: '#ffffff', fontSize: 20, fontFamily: '\'DIN\', \'SourceHanSansSC\', sans-serif' } }
              }"></Line>
            </template>
          </ChartBox>
        </div>
        <div class="pie">
          <ChartBox title="通报企业归属行业分布">
            <template v-slot:chart>
              <Pie :data="pieData" v-if="pieData && pieData.length > 0"  :chartName="'通报企业归属行业分布'"></Pie>
            </template>
          </ChartBox>
        </div>
      </div>
    </div>
    <div class="risk-right">
      <ChartBox title="企业通报处置案例">
        <template v-slot:chart>
          <div class="list-container">
            <div
              class="list-item"
              v-for="(item, i) in riskCompanyList.slice(0, 3)"
              :key="i"  @click="handleClick(item)"
            >
              <div class="top">
                <img :src="require('./imgs/8.png')" />
                <div class="label" :title="item.title">{{ item.title }}</div>
              </div>
              <div class="bot">
                <div class="info-col">
                  <div class="detail">
                    <div class="sin l">
                      <div class="label">风险类型：</div>
                      <div class="value">{{ item.riskType }}</div>
                    </div>
                  </div>
                  <div class="detail">
                    <div class="sin l">
                      <div class="label">风险等级：</div>
                      <div :class="['value', 'level', 'level-' + item.level]">
                        {{ item.riskLevel }}
                      </div>
                    </div>
                  </div>
                  <div class="detail">
                    <div class="sin l">
                      <div class="label">处置状态：</div>
                      <div
                        :class="['value', 'status', 'status-' + item.disposalNum]"
                      >
                        {{ item.disposal }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="img-col">
                  <img :src="require('./imgs/report.png')" class="report-img" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </ChartBox>
    </div>
    <el-dialog  
    v-model="dialogVisible"
    title="报告详情"
    width="1600px"
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
@import "./index.scss";
</style>
<style lang="scss">
.dialog-custom {
  &.spec{
  .el-dialog__header{
    text-align: center;
    .el-dialog__title {
      font-size: 22px;
      font-family: var(--font-family-body);
    }
  }
    .el-dialog__body {
    overflow-y: auto;
    height: 753px;
    text-align: center;
    .el-image{
      width: 100%;
      padding: 0 50px;
    }
  }
}
}
</style>
