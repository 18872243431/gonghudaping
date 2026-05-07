<template>
  <div class="notification">
    <div class="notification-title">
      {{ data?.eventType || "" }}安全事件分析
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">深度研判分析中...</div>
    </div>
    <div v-else class="notification-content" :class="{ 'enter-seq': enterSeq }">
      <div class="notification-content-item">
        <div class="notification-content-item-title">
          {{ data?.detailInfo?.title?.headline1 || "" }}
        </div>
        <div class="notification-content-item-content">
          <div class="info">
            <div class="info-title info-title1">
              {{ data?.detailInfo?.title?.title1 || "" }}
            </div>
            <div style="height: 166px">
              <act-table
                :showSeq="false"
                :columns="columns"
                :tableData="tableData || []"
                class="table16"
                :needScroll="false"
              ></act-table>
            </div>
          </div>
          <div class="info">
            <div class="info-title info-title2">
              {{ data?.detailInfo?.title?.title2 || "" }}
            </div>
            <div class="abnormal-features">
              <div
                v-for="item in data?.detailInfo?.feature?.abnormalFeatures ||
                []"
                :key="item"
                class="abnormal-feature-item"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div class="info">
            <div class="info-title info-title3">
              {{ data?.detailInfo?.title?.title3 || "" }}
            </div>
            <div class="abnormal-features">
              <div
                v-for="item in data?.detailInfo?.feature?.actualAlarm || []"
                :key="item"
                class="abnormal-feature-item"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="notification-content-item notification-content-item2">
        <div class="notification-content-item-title">
          {{ data?.detailInfo?.title?.headline2 || "" }}
        </div>
        <div class="notification-content-item-content">
          <div class="info">
            <div class="info-title info-title4">
              {{ data?.detailInfo?.title?.title4 || "" }}
            </div>
            <div class="info" style="padding: 0 20px">
              <div class="sub-title">
                {{ data?.detailInfo?.title?.label1 || "" }}:
              </div>
              <div class="info-text">
                {{ data?.detailInfo?.intelligence?.attackInfo || "" }}
              </div>
              <div class="type-list">
                <div
                  v-for="item in data?.detailInfo?.intelligence?.type || []"
                  :key="item"
                  class="type-item"
                  :title="item"
                >
                  {{ item }}
                </div>
              </div>
              <div class="sub-title">
                {{ data?.detailInfo?.title?.label2 || "" }}:
              </div>
              <div class="family">
                <div
                  class="family-item"
                  :title="data?.detailInfo?.intelligence?.family?.type || ''"
                >
                  {{ data?.detailInfo?.intelligence?.family?.type || "" }}
                </div>
                <div class="info-text">
                  匹配度：{{
                    data?.detailInfo?.intelligence?.family?.ratio || ""
                  }}
                </div>
                <div class="info-text">
                  威胁等级：<span
                    :style="{
                      color:
                        data?.detailInfo?.intelligence?.family?.level === '高危'
                          ? '#ff5858'
                          : data?.detailInfo?.intelligence?.family?.level ===
                            '中危'
                          ? '#ffb74d'
                          : '#4caf50',
                    }"
                    >{{
                      data?.detailInfo?.intelligence?.family?.level || ""
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="info-title info-title5">
              {{ data?.detailInfo?.title?.title5 || "" }}
            </div>
            <div class="info-text info-danger">
              {{ data?.detailInfo?.intelligence?.analyse || "" }}
            </div>
          </div>
        </div>
      </div>
      <div class="notification-content-item notification-content-item3">
        <div class="notification-content-item-title">
          {{ data?.detailInfo?.title?.headline3 || "" }}
        </div>
        <div class="notification-content-item-content">
          <div class="info">
            <div class="info-title info-title6">
              {{ data?.detailInfo?.title?.title6 || "" }}
            </div>
            <div class="info-text">
              <div class="sin">
                <div class="label">被攻击IP:</div>
                <div class="value">{{ data?.detailInfo?.report?.attacked_ip || "" }}</div>
              </div>
               <div class="sin">
                <div class="label">攻击IP:</div>
                <div class="value">{{ data?.detailInfo?.report?.attack_ip || "" }}</div>
              </div>
               <div class="sin">
                <div class="label">发现时间:</div>
                <div class="value">{{ currentData }} </div>
              </div>
              <div class="sin">
                {{ data?.detailInfo?.report?.event_type || "" }}
              </div>
              <div class="sin">
                ............
              </div>
            </div>
          </div>
          <div class="info">
            <div class="info-title info-title7">
              {{ data?.detailInfo?.title?.title7 || "" }}
            </div>
            <div class="info-text">
              {{ data?.detailInfo?.report?.advice || "" }}
            </div>
          </div>
        </div>
        <div class="buttons">
          <div class="button button1" @click="download">查看完整报告</div>
          <div
            class="button button2"
            :class="{
              'is-loading': btn2Status === 'loading',
              'is-done': btn2Status === 'done',
            }"
            @click="onClickButton2"
          >
            <span v-if="btn2Status === 'idle'">通报预警</span>
            <span v-else-if="btn2Status === 'loading'">
              <el-icon class="loading-icon"><Loading /></el-icon>处理中...
            </span>
            <span v-else>已完成</span>
          </div>
        </div>
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
import { ref, watch, onMounted, nextTick } from "vue";
import ActTable from "@c/ActTable";
import { Loading } from "@element-plus/icons-vue";
import { downloadReport, sendWarning } from "@/api/enterpriseRisk";
import { useRoute } from "vue-router";
import { dateFormat } from "@/libs/util";
const currentData = dateFormat(new Date(),"YYYY-MM-dd");
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const tableData = ref([]);
const dialogVisible = ref(false);
const imgUrl = ref('');
const route = useRoute();
const emit = defineEmits(['close']);

const columns = [
  { label: "时间", prop: "startTime", width: 150 },
  { label: "源IP", prop: "srcIp" },
  { label: "目标IP", prop: "dstIp" },
];

const btn2Status = ref("idle");
const enterSeq = ref(false);
const isLoading = ref(true);
 function applySequentialTimes(list, baseDate) {
    const base = new Date(baseDate)
    const maxSec = 24 * 60 * 60 - 1
    let totalSec = 0
    for (let i = 0; i < list.length; i++) {
      const d = new Date(base.getTime() - totalSec * 1000)
      list[i].startTime = dateFormat(d, "YYYY-MM-dd hh:mm:ss")
      if (i < list.length - 1) {
        const step = Math.floor(Math.random() * 9) + 1
        totalSec = Math.min(totalSec + step, maxSec)
      }
    }
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
  { immediate: true }
);
watch(
  () => props.data?.detailInfo?.feature?.tableList,
  (val) => {
    if (val && val.length > 0) {
      tableData.value = val
      applySequentialTimes(tableData.value, new Date())
    }
  },
  { immediate: true }
);
onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    nextTick(() => {
      enterSeq.value = true;
    });
  }, 3000);
});

async function speak(text) {
  const synth = window.speechSynthesis
  const utterThis = new SpeechSynthesisUtterance(text)
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
    utterThis.voice = chosen
  }
  utterThis.pitch = 0.1
  utterThis.rate = 0.8
  utterThis.volume = 1
  synth.speak(utterThis)
}

watch(btn2Status, (val) => {
  if (val === 'done') {
    const url = require('./1.mp3')
    const audio = new Audio(url)
    audio.play()
  }
});

function handleClose() {
  dialogVisible.value = false;
}

async function onClickButton2() {
  if (btn2Status.value === 'done') {
    emit('close');
    return;
  }
  if (btn2Status.value !== "idle") return;
  btn2Status.value = "loading";
  try {
    // 屏蔽真实接口，使用 8 秒模拟处理
    setTimeout(() => {
      btn2Status.value = "done";
    }, 8000);
//  const id = props.data?.orId;
//     const company = route?.query?.companyName;
//     if (!id || !company) {
//       btn2Status.value = "idle";
//       return;
//     }
//     const res = await sendWarning({
//       id,
//       company,
//     });
//     if (res && res.code === 0) {
//       setTimeout(() => {
//         btn2Status.value = "done";
//       }, 8000);
//     } else {
//       btn2Status.value = "idle";
//     }
  } catch (e) {
    btn2Status.value = "idle";
  }
}

async function download() {
  dialogVisible.value = true;
  console.log(props.data?.detailInfo?.report?.reportName,"mmmmmm")
  imgUrl.value = props.data?.detailInfo?.report?.reportName || '';
  // try {
  //   const reportName = props.data.detailInfo.report.reportName;
  //   const res = await downloadReport({
  //     reportInfo: reportName,
  //   });
  //   const blob = new Blob([res], { type: "application/octet-stream" });
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = reportName || "report";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   window.URL.revokeObjectURL(url);
  // } catch (error) {
  //   console.error("下载失败:", error);
  // }
}
</script>

<style lang="scss" scoped>
.notification {
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
    width: 420px;
  }
  .notification-content {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    .notification-content-item {
      width: 457px;
      height: 661px;
      padding-top: 16px;
      background: url(./imgs/card1.png) no-repeat center center / 100% 100%;
      &-title {
        font-family: SourceHanSansSC, SourceHanSansSC;
        font-weight: bold;
        font-size: 27px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
      .notification-content-item-content {
        padding: 0 28px;
        .info-title {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: bold;
          font-size: 19px;
          color: #ffffff;
          line-height: 31px;
          margin-top: 20px;
          margin-bottom: 11px;
          position: relative;
          padding-left: 36px;
          &::before {
            content: "";
            width: 32px;
            height: 32px;
            position: absolute;
            top: 0;
            left: 0;
            background: url(./imgs/title-icon1.png) no-repeat center center /
              100% 100%;
          }
        }
        .info-title2 {
          &::before {
            background-image: url(./imgs/title-icon2.png);
          }
        }
        .info-title3 {
          &::before {
            background-image: url(./imgs/title-icon3.png);
          }
        }
        .info-title4 {
          &::before {
            background-image: url(./imgs/title-icon4.png);
          }
        }
        .info-title5 {
          &::before {
            background-image: url(./imgs/title-icon5.png);
          }
        }
        .info-title6 {
          &::before {
            background-image: url(./imgs/title-icon6.png);
          }
        }
        .info-title7 {
          &::before {
            background-image: url(./imgs/title-icon7.png);
          }
        }
        .info-text {
          font-family: SourceHanSansSC, SourceHanSansSC;
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          line-height: 31px;
          padding-left: 18px;
          white-space: pre-line;
          .sin{
            display: flex;
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 400;
            font-size: 16px;
            color: #ffffff;
            line-height: 31px;
            white-space: pre-line;
            .label,.value{
                display: flex;
                font-family: SourceHanSansSC, SourceHanSansSC;
                font-weight: 400;
                font-size: 16px;
                color: #ffffff;
                line-height: 31px;
                white-space: pre-line;
            }
            .value{
                padding-left: 10px;
            }
          }
        }
        .info-danger {
        }
        .abnormal-features {
          padding-left: 16px;
          .abnormal-feature-item {
            font-family: SourceHanSansSC, SourceHanSansSC;
            font-weight: 400;
            font-size: 16px;
            color: #ffffff;
            line-height: 26px;
            position: relative;
            padding-left: 20px;
            &::before {
              content: "";
              position: absolute;
              top: 8px;
              left: 0;
              width: 13px;
              height: 13px;
              background: #ff3232;
              box-shadow: 0px 0px 9px 2px rgba(255, 41, 41, 0.5);
              border-radius: 50%;
            }
          }
        }
        .info-danger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(218, 42, 0, 0.28);
          border: 1px solid #f20a0a;
          border-radius: 10px;
          color: #fcf8ff;
          box-shadow: 0 0 10px rgba(255, 41, 41, 0.4),
            inset 0 0 6px rgba(255, 41, 41, 0.2);
          animation: dangerPulse 1.6s ease-in-out infinite;
        }
      }
      &.notification-content-item2 {
        background: url(./imgs/card2.png) no-repeat center center / 100% 100%;
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
        background: url(./imgs/card3.png) no-repeat center center / 100% 100%;
        position: relative;
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
              pointer-events: auto;
              cursor: pointer;
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
}

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
