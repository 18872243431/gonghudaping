<template>
  <div class="notificationTip">
    <div class="notification-title">
      {{ data?.dataInfo.pageTitle || "" }}
    </div>
    <div v-show="!isLoading" class="notification-content" :class="{ 'enter-seq': enterSeq }">
      <NotificationTipContentNew v-if="!showDetail" :data="data" :enterSeq="enterSeq" @deep-monitor="onDeepMonitor" @close="emit('close')" />
      <NotificationTipContentOriginal v-else :data="data" :enterSeq="enterSeq" @close="emit('close')" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { Loading } from "@element-plus/icons-vue";
import { downloadReport, sendWarning } from "@/api/enterpriseRisk";
import { useRoute } from "vue-router";
import NotificationTipContentNew from "./NotificationTipContentNew.vue";
import NotificationTipContentOriginal from "./NotificationTipContentOriginal.vue";
const emit = defineEmits(['close'])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();

const columns = [
  { label: "时间", prop: "time", width: 150 },
  { label: "源IP", prop: "srcIp" },
  { label: "目标IP", prop: "dstIp" },
];

const btn2Status = ref("idle");
const enterSeq = ref(false);
const isLoading = ref(true);
const showDetail = ref(false);
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
  {deep: true}
);
onMounted(() => {
  isLoading.value = false;
  nextTick(() => {
    enterSeq.value = true;
    startSequence();
  });
});

function startSequence() {
  showItem1.value = true;
  setTimeout(() => {
    showInfoTop.value = true;
    setTimeout(() => {
      showInfoCenter.value = true;
      startProgress();
    }, 600);
  }, 50);
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
          setTimeout(() => {
            showItem2.value = true;
            startSecondBlockSequence();
            setTimeout(() => {
              showItem3.value = true;
              startThirdBlockSequence();
            }, 2800);
          }, 600);
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
    progress3.value = Math.round(ratio * 50);
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
function onDeepMonitor() {
  showDetail.value = true
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
    const res = await sendWarning({
      id,
      company,
    });
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
    const res = await downloadReport({
      reportInfo: reportName,
    });
    // 创建 Blob 对象并触发下载
    const blob = new Blob([res], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = reportName || "report";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下载失败:", error);
    // 可根据需要添加提示
  }
}
</script>

<style lang="scss" scoped>
.notificationTip {
  z-index:100;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 37px;
  padding-top: 80px;
  position: relative;
  margin-top: -10px;
  .notification-title {
    font-family: SourceHanSansSC, SourceHanSansSC;
    font-weight: bold;
    font-size: 32px;
    color: #ffffff;
    line-height: 47px;
    text-align: center;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 480px;
  }
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
          img{
            height: 38px;
            width:38px;
          }
        }
        .text{
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: bold;
          font-size: 22px;
          line-height: 33px;
          text-align: right;
          font-style: normal;
          &.text1{
             color: #FA4040;
          }
           &.text2{
             color: #00F3FF;
          }
           &.text3{
             color: #24FFD8;
          }
        }
      }
      .detail{
          height: 50px;
          display: flex;
          justify-content: space-between;
          .label{
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 400;
            font-size: 16px;
            color: #8ba5b8;
            line-height: 24px;
            text-align: left;
            font-style: normal;
          }
          .value{
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 500;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 24px;
            text-align: left;
            font-style: normal;
            transition: opacity 0.3s ease;
            &.status{
              text-align: center;
              width:80px;
              height: 23px;
              font-family: SourceHanSansSC, SourceHanSansSC;
              font-weight: 500;
              font-size: 14px;
              color: #00FF7B;
              line-height: 20px;
              font-style: normal;
              background: url(./imgs16/bg10.png) no-repeat center center / 100% 100%;
            }
          }
          .risk{
            padding-left: 10px;
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 500;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 24px;
            text-align: left;
            font-style: normal;
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
              font-family: SourceHanSansSC, SourceHanSansSC;
              font-weight: 500;
              font-size: 14px;
              color: #FFFFFF;
              font-style: normal;
              background: url(./imgs16/bg8.png) no-repeat center center / 100% 100%;
            }
          }
          .value2{
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 500;
            font-size: 16px;
            color: #FCCA00;
            line-height: 24px;
            text-align: left;
            font-style: normal;
          }
      }
      .info-center{
        padding: 10px 30px;
        height: 100px;
        .progress{
          height: 50px;
          :deep(.el-progress-bar__outer) {
            background-color: #666666;
          }
          :deep(.el-progress-bar__inner) {
            background-color: #FA4040 !important;
          }
          :deep(.el-progress__text) {
            color: #ffffff;
            font-weight: 500;
          }
        }
      }
      .info-bot{
        padding: 10px 30px;
        height: 215px;
        .logs{
          width: 100%;
          height: 90px;
          background: rgba(0,25,48,0.4);
          border-radius: 2px;
          border: 1px solid #21416B;
          .sin{
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 500;
            font-size: 13px;
            color: #FFFFFF;
            text-align: left;
            font-style: normal;
            line-height: 25px;
            padding:2px 10px;
            &.log-fade-in {
              opacity: 0;
              transform: translateY(10px);
              animation: fade-in-up 0.5s ease forwards;
            }
            &:nth-child(3){
              color: #24FFD8;
            }
          }
        }
        .botBtn{
          margin-top: 20px;
          background: rgba(213,137,0,0.29);
          border-radius: 3px;
          border: 1px solid #F3C300;
          width:100%;
          height: 36px;
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 500;
          font-size: 16px;
          color: #F3C300;
          line-height: 36px;
          letter-spacing: 3px;
          text-align: center;
          font-style: normal;
          cursor: pointer;
        }
      }
      &.notification-content-item2 {
        background: url(./imgs16/bg2.png) no-repeat center center / 100% 100%;
        .info-center{
          .progress{
            :deep(.el-progress-bar__inner){
              background-color: #00F3FF !important;
            }
          }
        }
        .info {
          .sub-title {
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 500;
            font-size: 17px;
            color: #7190ef;
            line-height: 31px;
          }
          .type-list {
            display: flex;
            justify-content: space-around;
            margin-top: 10px;
            margin-bottom: 19px;
            .type-item {
              font-family: SourceHanSansSC, SourceHanSansSC;
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
          .family-item {
            margin-top: 10px;
            width: 152px;
            height: 27px;
            background: rgba(218, 42, 0, 0.44);
            border-radius: 14px;
            border: 1px solid #f20a0a;
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 400;
            font-size: 16px;
            color: #fcf8ff;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &.notification-content-item3 {
        background: url(./imgs16/bg2.png) no-repeat center center / 100% 100%;
        position: relative;
        .info-center{
          .progress{
            :deep(.el-progress-bar__inner){
              background-color: #04EFD0 !important;
            }
          }
        }
        .dots {
          display: inline-block;
          min-width: 22px;
          margin-left: 4px;
          text-align: left;
          &::after {
            content: "";
            animation: ellipsisDots 1.2s steps(3, end) infinite;
          }
        }
        .buttons {
          position: absolute;
          bottom: 50px;
          right: 93px;
          display: flex;
          gap: 12px;
          .button {
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: bold;
            font-size: 15px;
            color: #ffffff;
            line-height: 31px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 28px;
            height: 36px;
            border-radius: 10px;
            cursor: pointer;
            position: relative;
            white-space: nowrap;
            transition: all 0.2s ease;
            &.is-loading {
              pointer-events: none;
              opacity: 0.9;
              cursor: not-allowed;
            }
            .loading-icon {
              font-size: 16px;
              margin-right: 8px;
              display: inline-block;
              animation: spin 0.9s linear infinite;
              transform-origin: 50% 50%;
            }
          }
          .button1 {
            background-color: rgba(4, 83, 130, 0.53);
            box-shadow: inset 0 0 0 1px #20b7f3,
              0 2px 4px 0 rgba(36, 153, 243, 0.5),
              inset 0 1px 14px 4px rgba(37, 171, 255, 0.5);
          }
          .button2 {
            background-color: rgba(130, 4, 4, 0.53);
            box-shadow: inset 0 0 0 1px #f32020,
              0 2px 4px 0 rgba(243, 36, 36, 0.5),
              inset 0 1px 14px 4px rgba(255, 37, 37, 0.5);
            &.is-loading {
              background-color: rgba(128, 128, 128, 0.6);
              box-shadow: inset 0 0 0 1px #999999,
                0 2px 4px 0 rgba(0, 0, 0, 0.2),
                inset 0 1px 14px 4px rgba(0, 0, 0, 0.2);
              color: #f0f0f0;
              pointer-events: none;
              cursor: not-allowed;
            }
            &.is-done {
              background-color: rgba(82, 196, 26, 0.6);
              box-shadow: inset 0 0 0 1px #52c41a,
                0 2px 4px 0 rgba(82, 196, 26, 0.5),
                inset 0 1px 14px 4px rgba(82, 196, 26, 0.5);
              pointer-events: none;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    background: rgba(0, 0, 0, 0.2);
    height: 760px;
  }
  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.6);
    border-top-color: #ffbd43;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    box-shadow: 0 0 10px rgba(255, 189, 67, 0.6);
  }
  .loading-text {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  .notification-content.enter-seq {
    .notification-content-item {
      opacity: 0;
      transform: translateX(-48px);
      animation: slide-in-left 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .notification-content-item:nth-child(1) {
      animation-delay: 0s;
    }
    .notification-content-item:nth-child(2) {
      animation-delay: 1.3s;
    }
    .notification-content-item:nth-child(3) {
      animation-delay: 2.6s;
    }
  }
  .fade-in-up {
    opacity: 0;
    transform: translateY(18px);
    animation: fade-in-up 0.6s ease forwards;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes slide-in-left {
    from {
      transform: translateX(-120px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fade-in-up {
    from {
      transform: translateY(18px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes dangerPulse {
    0% {
      box-shadow: 0 0 8px rgba(255, 41, 41, 0.35),
        inset 0 0 6px rgba(255, 41, 41, 0.2);
    }
    50% {
      box-shadow: 0 0 16px rgba(255, 41, 41, 0.7),
        inset 0 0 10px rgba(255, 41, 41, 0.35);
    }
    100% {
      box-shadow: 0 0 8px rgba(255, 41, 41, 0.35),
        inset 0 0 6px rgba(255, 41, 41, 0.2);
    }
  }
  @keyframes ellipsisDots {
    0% { content: ""; }
    33% { content: "."; }
    66% { content: ".."; }
    100% { content: "..."; }
  }
}
</style>
