<template>
  <div class="notification-content" :class="{ 'enter-seq': enterSeq }">
    <div class="notification-content-item">
      <div class="notification-content-item-content">
        <div class="info-top fade-in-up">
          <div class="logo">
            <img :src="require('./imgs16/bg3.png')" alt="" />
          </div>
          <div class="text text1">{{ data?.dataInfo?.sections?.[4]?.sectionTitle || "" }}</div>
        </div>
        <div class="info-center fade-in-up">
          <div class="summary-detail" v-for="(item,index) in data?.dataInfo?.sections?.[4]?.items1" :key="index">
            <div class="label">{{ item.label }}：</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
        <div class="info-bot fade-in-up">
          <div class="summary">
            <div class="link-text">{{ data?.dataInfo?.sections?.[4]?.linkText || "" }}：</div>
            <div class="summary-table">
              <div class="summary-row summary-header">
                <div class="col type">{{ data?.dataInfo?.sections?.[4]?.titleObj?.title || "" }}</div>
                <div class="col info">{{ data?.dataInfo?.sections?.[4]?.titleObj?.tagName || "" }}</div>
              </div>
              <div class="summary-row" v-for="(x, xi) in data?.dataInfo?.sections?.[4]?.items2" :key="xi">
                <div class="col type" :class="typeClass(x.label)">{{ x.label }}</div>
                <div class="col info">{{ x.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="notification-content-item notification-content-item2" v-if="showItem2">
      <div class="notification-content-item-content">
        <div class="info-top" v-show="showInfoTop2" :class="{ 'fade-in-up': showInfoTop2 }">
          <div class="logo">
            <img :src="require('./imgs16/bg4.png')" alt="" />
          </div>
          <div class="text text2">{{ data?.dataInfo?.sections?.[1]?.sectionTitle || "" }}</div>
        </div>
        <div class="info-center" v-show="showInfoCenter2" :class="{ 'fade-in-up': showInfoCenter2 }">
          <div class="detail">
            <div class="label">分析状态：</div>
            <div class="value status" :style="{ opacity: valueOpacity2 }">{{ statusText2 }}</div>
          </div>
          <div class="progress">
            <el-progress
              :percentage="progress2"
              :indeterminate="false"
              :color="progressColor2"
            />
          </div>
        </div>
        <div class="info-bot" v-show="showInfoBot2" :class="{ 'fade-in-up': showInfoBot2 }">
          <div class="detail"  v-for="(item,index) in data?.dataInfo?.sections?.[1]?.items" :key="item.label">
            <div class="label">{{ item.label }}:</div>
            <div class="value" v-if="index!=data?.dataInfo?.sections?.[1]?.items.length-1">{{ item.value }}</div>
            <div class="tags" v-else>
              <div class="sin" v-for="(tag,index) in item.value" :key="index">{{ tag }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="notification-content-item notification-content-item3" v-if="showItem3">
      <div class="notification-content-item-content">
       <div class="info-top" v-show="showInfoTop3" :class="{ 'fade-in-up': showInfoTop3 }">
          <div class="logo">
            <img :src="require('./imgs16/bg5.png')" alt="" />
          </div>
          <div class="text text3">{{ data?.dataInfo?.sections?.[2]?.sectionTitle || "" }}</div>
        </div>
        <div class="info-center" v-show="showInfoCenter3" :class="{ 'fade-in-up': showInfoCenter3 }">
          <div class="detail">
            <div class="label">当前任务：</div>
          </div>
          <div class="progress">
            <el-progress
              :percentage="progress3"
              :indeterminate="false"
              :color="progressColor3"
            />
          </div>
        </div>
        <div class="info-bot" v-show="showLogs3 || showInfoBot3" :class="{ 'fade-in-up': showLogs3 || showInfoBot3 }">
           <div class="detail">
            <div class="label">关联风险研判结果：</div>
            <div class="value2" v-show="showInfoBot3">研判中</div>
          </div>
          <div class="detail">
            <div class="label">{{ data?.dataInfo?.sections?.[2]?.logs?.title || "" }}:</div>
          </div>
          <div class="logs">
            <div
              class="sin log-fade-in"
              v-for="(item,index) in visibleLogs3"
              :key="index"
              :style="{ animationDelay: (index * 0.2) + 's' }"
            >
              <div class="value">
                > {{ item }}<span v-if="isLastLog(index)" class="dots"></span>
              </div>
            </div>
          </div>
          <div class="botBtn" v-show="showInfoBot3" :class="{ loading: shareStatus === 'loading', done: shareStatus === 'done' }" @click="onClickPublish">
            <img :src="require('./imgs16/bg9.png')" alt="" />
            {{ botBtnText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { downloadReport, sendWarning } from "@/api/enterpriseRisk";
import { useRoute } from "vue-router";

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  enterSeq: { type: Boolean, default: false }
});
const emit = defineEmits(['close'])

const route = useRoute();
function typeClass(label) {
  const s = (label || "").toLowerCase();
  if (s.includes("c2")) return "type-c2";
  if (s.includes("dns")) return "type-dns";
  return "type-other";
}
const btn2Status = ref("idle");
const showItem1 = ref(false);
const showItem2 = ref(false);
const showItem3 = ref(false);
const showInfoTop = ref(false);
const showInfoCenter = ref(false);
const showInfoBot = ref(false);
const showInfoTop2 = ref(false);
const showInfoCenter2 = ref(false);
const showInfoBot2 = ref(false);
const showInfoTop3 = ref(false);
const showInfoCenter3 = ref(false);
const showInfoBot3 = ref(false);
const showLogs3 = ref(false);
const logsToShowCount3 = ref(0);
const visibleLogs3 = computed(() => {
  const arr = props?.data?.dataInfo?.sections?.[2]?.logs?.content || [];
  return arr.slice(0, Math.min(logsToShowCount3.value, arr.length));
});
function isLastLog(index) {
  return logsToShowCount3.value === 3 && index === visibleLogs3.value.length - 1;
}
const progress = ref(0);
const progressColor = "#FA4040";
const statusText = ref("提取中");
const valueOpacity = ref(1);
const progress2 = ref(0);
const progressColor2 = "#00F3FF";
const statusText2 = ref("分析中");
const valueOpacity2 = ref(1);
const progress3 = ref(0);
const progressColor3 = "#04EFD0";

const shareStatus = ref('idle')
const botBtnText = computed(() => {
  if (shareStatus.value === 'loading') return '监测规则下发中'
  if (shareStatus.value === 'done') return '已完成'
  return props?.data?.dataInfo?.sections?.[2]?.footerButton || ''
})

async function speak(text) {
  const synth = window.speechSynthesis
  const utter = new SpeechSynthesisUtterance(text)
  const voices = await new Promise((resolve) => {
    const list = synth.getVoices()
    if (list && list.length) resolve(list)
    else {
      const handler = () => {
        resolve(synth.getVoices())
        synth.onvoiceschanged = null
      }
      synth.onvoiceschanged = handler
    }
  })
  const zhVoices = voices.filter(v => (v.lang || '').toLowerCase().includes('zh'))
  const chosen = zhVoices[0] || voices[0]
  if (chosen) {
    utter.voice = chosen
  }
  utter.pitch = 0.1
  utter.rate = 0.8
  utter.volume = 1
  synth.speak(utter)
}

function onClickPublish() {
  if (shareStatus.value === 'done') {
    emit('close')
    return
  }
  if (shareStatus.value !== 'idle') return
  shareStatus.value = 'loading'
  setTimeout(() => {
    shareStatus.value = 'done'
    const url = require('./2.mp3')
    const audio = new Audio(url)
    audio.play()
  }, 8000)
}

watch(
  () => props.data?.detailInfo?.report?.status,
  (val) => {
    if (val === "已通报") {
      btn2Status.value = "done";
    } else if (val === "未通报") {
      btn2Status.value = "idle";
    } else {
      btn2Status.value = "idle";
    }
  },
  { immediate: true },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    startSequence();
  });
});

function startSequence() {
  showItem1.value = true;
  setTimeout(() => {
    showItem2.value = true;
    startSecondBlockSequence();
  }, 1100);
}

function startProgress() {
  const start = performance.now();
  const duration = 3000;
  function step(ts) {
    const ratio = Math.min((ts - start) / duration, 1);
    progress.value = Math.round(ratio * 100);
    if (ratio < 1) {
      requestAnimationFrame(step);
    } else {
      valueOpacity.value = 0;
      setTimeout(() => {
        statusText.value = "提取完成";
        valueOpacity.value = 1;
        setTimeout(() => {
          showInfoBot.value = true;
        }, 200);
      }, 200);
    }
  }
  requestAnimationFrame(step);
}

function startSecondBlockSequence() {
  setTimeout(() => {
    showInfoTop2.value = true;
    setTimeout(() => {
      showInfoCenter2.value = true;
      startProgress2();
    }, 600);
  }, 50);
}

function startThirdBlockSequence() {
  setTimeout(() => {
    showInfoTop3.value = true;
    setTimeout(() => {
      showInfoCenter3.value = true;
      startProgress3();
    }, 600);
  }, 50);
}

function startProgress2() {
  const start = performance.now();
  const duration = 3000;
  function step(ts) {
    const ratio = Math.min((ts - start) / duration, 1);
    progress2.value = Math.round(ratio * 100);
    if (ratio < 1) {
      requestAnimationFrame(step);
    } else {
      valueOpacity2.value = 0;
      setTimeout(() => {
        statusText2.value = "分析完成";
        valueOpacity2.value = 1;
        setTimeout(() => {
          showInfoBot2.value = true;
          showItem3.value = true;
          startThirdBlockSequence();
        }, 200);
      }, 200);
    }
  }
  requestAnimationFrame(step);
}

function startProgress3() {
  showLogs3.value = true;
  logsToShowCount3.value = 2;
  const start = performance.now();
  const duration = 3000;
  function step(ts) {
    const ratio = Math.min((ts - start) / duration, 1);
    progress3.value = Math.round(ratio * 100);
    if (ratio < 1) {
      requestAnimationFrame(step);
    } else {
      logsToShowCount3.value = 3;
      setTimeout(() => {
        showInfoBot3.value = true;
      }, 200);
    }
  }
  requestAnimationFrame(step);
}

async function onClickButton2() {
  if (btn2Status.value !== "idle") return;
  btn2Status.value = "loading";
  try {
    const id = props.data?.orId;
    const company = route?.query?.companyName;
    if (!id || !company) {
      btn2Status.value = "idle";
      return;
    }
    const res = await sendWarning({ id, company });
    if (res && res.code === 0) {
      setTimeout(() => {
        btn2Status.value = "done";
      }, 3000);
    } else {
      btn2Status.value = "idle";
    }
  } catch (e) {
    btn2Status.value = "idle";
  }
}

async function download() {
  try {
    const reportName = props.data.detailInfo.report.reportName;
    const res = await downloadReport({ reportInfo: reportName });
    const blob = new Blob([res], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = reportName || "report";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {}
}
</script>

<style scoped lang="scss">
.notification-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap:10px;
  justify-content: flex-start;
  .notification-content-item {
    width: 457px;
    height: 661px;
    padding-top: 16px;
    background: url(./imgs16/bg2.png) no-repeat center center / 100% 100%;
    .info-top{
      width:100%;
      height: 220px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .logo{
        width: 100%;
        height: 38px;
        text-align: center;
        img{ height: 38px; width:38px; }
      }
      .text{
        font-family: SourceHanSansSC;
        font-weight: bold;
        font-size: 22px;
        line-height: 33px;
        text-align: right;
        &.text1{ color: #FA4040; }
        &.text2{ color: #00F3FF; }
        &.text3{ color: #24FFD8; }
      }
    }
    .detail{
      height: 50px;
      display: flex;
      justify-content: space-between;
      .label{
        font-family: SourceHanSansSC;
        font-weight: 400;
        font-size: 16px;
        color: #8ba5b8;
      }
      .value{
        font-family: SourceHanSansSC;
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        transition: opacity 0.3s ease;
        &.status{
          text-align: center;
          width:80px;
          height: 23px;
          font-size: 14px;
          color: #00FF7B;
          background: url(./imgs16/bg10.png) no-repeat center center / 100% 100%;
        }
      }
      .risk{
        padding-left: 10px;
        font-family: SourceHanSansSC;
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        transition: opacity 0.3s ease;
        width:85px;
        height: 24px;
        background: url(./imgs16/bg7.png) no-repeat center center / 100% 100%;
      }
      .tags{
        display: flex;
        .sin{
          margin-right: 10px;
          text-align: center;
          width:73px;
          height: 23px;
          font-family: SourceHanSansSC;
          font-weight: 500;
          font-size: 14px;
          color: #FFFFFF;
          background: url(./imgs16/bg8.png) no-repeat center center / 100% 100%;
        }
      }
      .value2{
        font-family: SourceHanSansSC;
        font-weight: 500;
        font-size: 16px;
        color: #FCCA00;
      }
    }
    .info-center{
      padding: 10px 30px;
      height: 100px;
      .summary-detail{
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label{
          font-family: SourceHanSansSC;
          font-weight: 400;
          font-size: 16px;
          color: #8ba5b8;
        }
        .value{
          font-family: SourceHanSansSC;
          font-weight: 500;
          font-size: 16px;
          color: #FFFFFF;
        }
      }
      .progress{
        height: 50px;
        :deep(.el-progress-bar__outer) { background-color: #666666; }
        :deep(.el-progress-bar__inner) { background-color: #FA4040 !important; }
        :deep(.el-progress__text) { color: #ffffff; font-weight: 500; }
      }
    }
    .info-bot{
      padding: 10px 30px;
      height: 215px;
      .summary{
        .link-text{
          font-family: SourceHanSansSC;
          font-weight: 500;
          font-size: 16px;
          color: #8ba5b8;
        }
        .summary-table{
          margin-top: 8px;
          width: 100%;
          border-top: 1px dashed rgba(255,255,255,0.18);
          .summary-row{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 36px;
            border-bottom: 1px dashed rgba(255,255,255,0.18);
            .col.type{
              width: 106px;
              font-family: SourceHanSansSC;
              font-weight: 500;
              font-size: 15px;
              text-transform: uppercase;
            }
            .col.info{
              font-family: SourceHanSansSC;
              font-weight: 500;
              font-size: 15px;
              color: #FFFFFF;
            }
            &.summary-header{
              .col.type, .col.info{ color: #8ba5b8; }
            }
          }
          .summary-row:last-child{ border-bottom: none; }
          .type-c2{ color: #FA4040; }
          .type-dns{ color: #FFD86A; }
          .type-other{ color: #8ba5b8; }
        }
      }
      .logs{
        width: 100%;
        height: 90px;
        background: rgba(0,25,48,0.4);
        border-radius: 2px;
        border: 1px solid #21416B;
        .sin{
          font-family: SourceHanSansSC;
          font-weight: 500;
          font-size: 13px;
          color: #FFFFFF;
          line-height: 25px;
          padding:2px 10px;
          &.log-fade-in { opacity: 0; transform: translateY(10px); animation: fade-in-up 0.5s ease forwards; }
          &:nth-child(3){ color: #24FFD8; }
        }
      }
      .botBtn{
        margin-top: 20px;
        background: rgba(213,137,0,0.29);
        border-radius: 3px;
        border: 1px solid #F3C300;
        width:100%;
        height: 36px;
        font-family: SourceHanSansSC;
        font-weight: 500;
        font-size: 16px;
        color: #F3C300;
        line-height: 36px;
        letter-spacing: 3px;
        text-align: center;
        cursor: pointer;
        &.loading{
          background: rgba(36, 58, 92, 0.75);
          box-shadow: inset 0 0 0 1px #5c7aa3, inset 0 1px 14px 4px rgba(94,126,175,0.35);
          color: #cbd5e1;
          position: relative;
          img{ display: none; }
        }
        &.loading::before{
          content: "";
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          border-top-color: transparent;
          margin-right: 6px;
          display: inline-block;
          animation: spin 0.8s linear infinite;
        }
        &.done{
          background-color: rgba(0, 68, 55, 0.6);
          box-shadow: inset 0 0 0 1px #00e1b3, 0 2px 4px 0 rgba(0, 225, 179, 0.4), inset 0 1px 14px 4px rgba(0, 225, 179, 0.4);
          color: #1df7c9;
          cursor: pointer;
          img{ display: none; }
        }
      }
    }
    &.notification-content-item2 {
      background: url(./imgs16/bg2.png) no-repeat center center / 100% 100%;
      .info-center .progress :deep(.el-progress-bar__inner){ background-color: #00F3FF !important; }
      .info .sub-title {
        font-family: SourceHanSansSC;
        font-weight: 500;
        font-size: 17px;
        color: #7190ef;
        line-height: 31px;
      }
      .info .type-list {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
        margin-bottom: 19px;
        .type-item {
          font-family: SourceHanSansSC;
          font-weight: 400;
          font-size: 16px;
          color: #fcf8ff;
          line-height: 23px;
          width: 174px;
          height: 27px;
          background: rgba(150, 98, 28, 0.42);
          border-radius: 14px;
          border: 1px solid #cc9643;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .info .family-item {
        margin-top: 10px;
        width: 152px;
        height: 27px;
        background: rgba(218, 42, 0, 0.44);
        border-radius: 14px;
        border: 1px solid #f20a0a;
        font-family: SourceHanSansSC;
        font-weight: 400;
        font-size: 16px;
        color: #fcf8ff;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &.notification-content-item3 {
      background: url(./imgs16/bg2.png) no-repeat center center / 100% 100%;
      position: relative;
      .info-center .progress :deep(.el-progress-bar__inner){ background-color: #04EFD0 !important; }
      .dots {
        display: inline-block;
        min-width: 22px;
        margin-left: 4px;
        text-align: left;
        &::after { content: ""; animation: ellipsisDots 1.2s steps(3, end) infinite; }
      }
      .buttons {
        position: absolute;
        bottom: 50px;
        right: 93px;
        display: flex;
        gap: 12px;
      }
    }
  }
}
.notification-content.enter-seq .notification-content-item {
  opacity: 0;
  transform: translateX(-48px);
  animation: slide-in-left 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.notification-content.enter-seq .notification-content-item:nth-child(1) { animation-delay: 0s; }
.notification-content.enter-seq .notification-content-item:nth-child(2) { animation-delay: 0s; }
.notification-content.enter-seq .notification-content-item:nth-child(3) { animation-delay: 0s; }
.fade-in-up { opacity: 0; transform: translateY(18px); animation: fade-in-up 0.6s ease forwards; }
@keyframes slide-in-left { from { transform: translateX(-120px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes fade-in-up { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes ellipsisDots { 0% { content: ""; } 33% { content: "."; } 66% { content: ".."; } 100% { content: "..."; } }
</style>
