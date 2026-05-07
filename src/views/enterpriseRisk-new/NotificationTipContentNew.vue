<template>
  <div class="tip-content-new" :class="{ 'enter-seq': enterSeq }">
    <div class="notification-content-item item-left">
      <div class="card">
        <div class="card-top" :class="{ 'fade-in-up': showLeftTop }" v-show="showLeftTop">
          <div class="stage">{{ leftTexts.stage }}</div>
          <div class="badge">
            <img :src="require('./imgs16/bg3.png')" alt="" />
          </div>
          <div class="title t-danger">{{ leftTexts.title }}</div>
        </div>
        <div class="card-center" :class="{ 'fade-in-up': showLeftCenter }" v-show="showLeftCenter">
          <div class="row">
            <div class="label">{{ leftTexts.statusLabel }}：</div>
            <div class="value status" :style="{ opacity: valueOpacity }">{{ statusText }}</div>
          </div>
          <div class="progress">
            <el-progress
              :percentage="progress"
              :indeterminate="false"
              :color="progressColor"
            />
          </div>
        </div>
        <div class="card-bot" :class="{ 'fade-in-up': showLeftBot }" v-show="showLeftBot">
          <div class="row">
            <div class="label">{{ left.sourceLabel }}：</div>
            <div class="value" :title="left.source">{{ left.source }}</div>
          </div>
          <div class="row">
            <div class="label">{{ left.sourceTypeLabel }}：</div>
            <div class="value">{{ left.sourceType }}</div>
          </div>
          <div class="row">
            <div class="label">{{ left.riskLevelLabel }}：</div>
            <div class="risk risk-danger">{{ left.riskLevel }}</div>
          </div>
          <div class="row">
            <div class="label">{{ left.signatureLabel }}：</div>
            <div class="value mono">{{ left.signature }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="middle-sep" v-show="showMiddleSep" :class="{ 'fade-in-up': showMiddleSep }"></div>
    <div class="notification-content-item item-right" v-show="showRightContainer">
      <div class="card">
        <div class="card-top" :class="{ 'fade-in-up': showRightTop }" v-show="showRightTop">
          <div class="headerbar">
            <span class="bolt">⚡</span>
            <span class="titlebar-text">{{ rightHeadTitle }}</span>
            <div class="tag tag-warning">{{ rightTag }}</div>
          </div>
        </div>
        <div class="card-bot">
          <div class="left-content" :class="{ 'fade-in-up': showRightCenter }" v-show="showRightCenter">
          <div class="file-name" v-show="showRightFile" :class="{ 'fade-in-up': showRightFile }">{{ right.fileName }}</div>
          <div class="meta2" v-show="showRightMeta" :class="{ 'fade-in-up': showRightMeta }">
            <div class="meta-row first-row">
              <span class="label">{{ right.timeLabel }}：</span>
              <span class="value">{{ currentData }}</span>
            </div>
            <div class="meta-row" v-for="(m, i) in right.items1" :key="i">
              <span class="label">{{ m.label }}：</span>
              <span class="value" :class="{ family: i === 2 || i === 3 }">
                {{ m.value }}
              </span>
            </div>
          </div>
          <div class="hashes" v-show="showRightHashes" :class="{ 'fade-in-up': showRightHashes }">
            <div class="hash" v-for="(h, hi) in right.hashes" :key="hi">
              <span class="label">{{ h.label }}：</span>
              <span class="value">{{ h.value }}</span>
            </div>
          </div>
          <div class="behavior" v-show="showRightBehavior" :class="{ 'fade-in-up': showRightBehavior }">
            <div class="label">{{ right.behaviorTitle }}：</div>
            <div class="desc danger-tip">
              <div class="type">{{ right.behaviorType }}</div>
              <div class="content">{{ right.behaviorDesc }}</div>
            </div>
          </div>
          </div>
          <div class="right-content" :class="{ 'fade-in-up': showRightBot }" v-show="showRightBot">
          <div class="iocs" v-show="showIocs" :class="{ 'fade-in-up': showIocs }">
            <div class="iocs-title">{{ right.iocTitle }}</div>
            <div class="ioc" v-for="(i, idx) in iocList" :key="idx">
              <div class="ioc-line ioc-line1">
                <div class="host">{{ i.host }}</div>
                <div class="port">{{ i.port }}</div>
              </div>
              <div class="ioc-line ioc-line2">
                <div class="label small">{{ i.label }} {{ i.loc }}</div>
              </div>
            </div>
          </div>
            <div class="buttons" v-show="showButtons" :class="{ 'fade-in-up': showButtons }">
              <div class="button button-share" @click="onClickImgInfo">{{ right.btn3Text }}</div>
              <div class="button button-share" :class="shareButtonClass" @click="onClickShare">{{ shareButtonText }}</div>
              <div class="button button-monitor" @click="emit('deep-monitor')">{{ right.btn2Text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <el-dialog  
      v-model="dialogVisible"
      title="威胁情报信息"
      width="800px"
        destroy-on-close
        custom-class="dialog-custom spec"
      :before-close="handleClose">
      <el-image :src="right.imgUrl" lazy  class="dialog-image"/>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { dateFormat } from  "@/libs/util";
const props = defineProps({
  data: { type: Object, default: () => ({}) },
  enterSeq: { type: Boolean, default: false }
})
const emit = defineEmits(['deep-monitor','close'])
const currentData = dateFormat(new Date(),"YYYY-MM-dd hh:mm:ss");
const showLeftTop = ref(false)
const showLeftCenter = ref(false)
const showLeftBot = ref(false)
const showMiddleSep = ref(false)
const showRightContainer = ref(false)
const showRightTop = ref(false)
const showRightCenter = ref(false)
const showRightBot = ref(false)
const showRightFile = ref(false)
const showRightMeta = ref(false)
const showRightHashes = ref(false)
const showRightBehavior = ref(false)
const showIocs = ref(false)
const showButtons = ref(false)

const dialogVisible = ref(false);

const section0 = props?.data?.dataInfo?.sections?.[0] || {}
const leftTexts = {
  stage: section0?.stageText || '',
  title: section0?.sectionTitle || '',
  statusLabel: section0?.statusLabel || '提取状态',
  statusTextInit: section0?.statusText || '提取完成'
}
const leftItemsArr = section0?.items || []
const left = {
  sourceLabel: leftItemsArr?.[0]?.label || '',
  source: leftItemsArr?.[0]?.value || '',
  sourceTypeLabel: leftItemsArr?.[1]?.label || '',
  sourceType: leftItemsArr?.[1]?.value || '',
  riskLevelLabel: leftItemsArr?.[2]?.label || '',
  riskLevel: leftItemsArr?.[2]?.value || '',
  signatureLabel: leftItemsArr?.[3]?.label || '',
  signature: leftItemsArr?.[3]?.value || ''
}
const section3 = props?.data?.dataInfo?.sections?.[3] || {}
const info = section3?.infoObject || {}
const rightHeadTitle = section3?.sectionTitle || ''
const rightTag = info?.tagName || ''
const right = {
  fileName: info?.title || '',
  timeLabel: info?.timeObj?.label || '',
  time: info?.timeObj?.value || '',
  items1: info?.items1 || [],
  hashes: info?.item2 || [],
  behaviorTitle: info?.fzContent?.title || '',
  behaviorType: info?.fzContent?.type || '',
  behaviorDesc: info?.fzContent?.content || '',
  iocTitle: info?.rightText || '',
  btn1Text: info?.btn1Text || '',
  btn2Text: info?.btn2Text || '',
  btn3Text: info?.btn3Text || '',
  imgUrl: info?.imgUrl || ''
}
const iocList = (info?.rightList || []).map(r => ({
  host: r?.ip || '',
  port: `${r?.protocol || ''}/${r?.value || ''}`,
  label: [r?.type1, r?.type2].filter(Boolean).join(' '),
  loc: r?.type3 || ''
}))

onMounted(() => {
  startSequence()
})

function onClickImgInfo() {
  dialogVisible.value = true
}
function handleClose() {
  dialogVisible.value = false;
}
function startSequence() {
  setTimeout(() => {
    showLeftTop.value = true
    setTimeout(() => {
      showLeftCenter.value = true
      startLeftProgress()
    }, 600)
  }, 50)
}
function startLeftProgress() {
  progress.value = 0
  statusText.value = '提取中'
  const start = performance.now()
  const duration = 3000
  function step(ts) {
    const ratio = Math.min((ts - start) / duration, 1)
    progress.value = Math.round(ratio * 100)
    if (ratio < 1) {
      requestAnimationFrame(step)
    } else {
      statusText.value = '提取完成'
      setTimeout(() => {
        showLeftBot.value = true
        setTimeout(() => {
          showMiddleSep.value = true
          setTimeout(() => {
            startRightSequence()
          }, 600)
        }, 600)
      }, 200)
    }
  }
  requestAnimationFrame(step)
}
function startRightSequence() {
  setTimeout(() => {
    showRightContainer.value = true
    showRightTop.value = true
    setTimeout(() => {
      showRightCenter.value = true
      setTimeout(() => {
        showRightFile.value = true
        setTimeout(() => {
          showRightMeta.value = true
          setTimeout(() => {
            showRightHashes.value = true
            setTimeout(() => {
              showRightBehavior.value = true
              setTimeout(() => {
                showRightBot.value = true
                setTimeout(() => {
                  showIocs.value = true
                  setTimeout(() => {
                    showButtons.value = true
                  }, 250)
                }, 250)
              }, 250)
            }, 250)
          }, 250)
        }, 250)
      }, 600)
    }, 600)
  }, 50)
}
const progress = ref(0)
const progressColor = '#FA4040'
const statusText = ref('提取中')
const valueOpacity = ref(1)
const shareStatus = ref('idle')
const shareButtonText = computed(() => {
  if (shareStatus.value === 'loading') return '信息同步中...'
  if (shareStatus.value === 'done') return '已同步'
  return right.btn1Text
})
const shareButtonClass = computed(() => {
  return {
    loading: shareStatus.value === 'loading',
    done: shareStatus.value === 'done'
  }
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

function onClickShare() {
  if (shareStatus.value === 'done') {
    emit('close')
    return
  }
  if (shareStatus.value !== 'idle') return
  shareStatus.value = 'loading'
  setTimeout(() => {
    shareStatus.value = 'done'
    const url = require('./3.mp3')
    const audio = new Audio(url)
    audio.play()
  }, 8000)
}
</script>

<style scoped lang="scss">
.tip-content-new {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  justify-content: flex-start;
}
.middle-sep {
  width: 28px;
  height: 4px;
  background: linear-gradient(90deg, rgba(0,255,255,0.2), rgba(0,255,255,0.8), rgba(0,255,255,0.2));
  border-radius: 2px;
}
.tip-content-new.enter-seq .notification-content-item {
  opacity: 0;
  transform: translateX(-48px);
  animation: slide-in-left 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.tip-content-new.enter-seq .notification-content-item:nth-child(1) { animation-delay: 0s; }
.tip-content-new.enter-seq .notification-content-item:nth-child(2) { animation-delay: 1.1s; }

.notification-content-item {
  width: 457px;
  height: 661px;
  padding-top: 16px;
  background: url(./imgs16/bg2.png) no-repeat center center / 100% 100%;
  .card {
    padding: 0 24px;
    position: relative;
  }
}
.notification-content-item.item-left {
  .card-top {
    width: 100%;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .badge { text-align: center; }
  .title { text-align: right; }
  .card-center {
    padding: 10px 10px;
    height: 100px;
  }
  .row {
    height: 50px;
    .label { font-weight: 400; }
    .value { font-weight: 500; }
    .status { width: 80px; }
  }
  .progress {
    height: 50px;
    margin: 0;
  }
  .card-bot {
    padding: 10px 10px;
    height: 215px;
    .label{
      width:120px;
    }
    .value{
      width:calc(100% - 120px);
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
      text-align: right;
    }
  }
}
.notification-content-item.item-right {
  width: 914px;
  .card {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .card-top {
      flex: 0 0 100%;
      margin-top: 25px;
    margin-bottom: 20px;
    }
  .card-bot {
    display: flex;
    height: 550px;
    gap:20px;
    .left-content{
      width:60%;
    }
    .right-content{
      width:40%;
    }
  }
  .file-name { margin-bottom: 10px; }
  .meta2 { gap: 8px; }
  .hashes { margin-top: 30px; }
  .behavior { margin-top: 17px; }
  
  .iocs { margin-top: 0; }
  .buttons {
    margin-top: 30px;
    flex-direction: column;
    .button { 
      width: 100%;
      height: 50px;
    }
  }
  .button-share.loading {
    background-color: rgba(36, 58, 92, 0.75);
    box-shadow: inset 0 0 0 1px #5c7aa3, inset 0 1px 14px 4px rgba(94,126,175,0.35);
    color: #cbd5e1;
    position: relative;
  }
  .button-share.loading::before {
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
  .button-share.done {
    background-color: rgba(0, 68, 55, 0.6);
    box-shadow: inset 0 0 0 1px #00e1b3, 0 2px 4px 0 rgba(0, 225, 179, 0.4), inset 0 1px 14px 4px rgba(0, 225, 179, 0.4);
    color: #1df7c9;
    pointer-events: auto;
    cursor: pointer;
  }
}
.stage {
  font-size: 12px;
  color: #8ba5b8;
  margin-bottom: 6px;
}
.badge {
  width: 100%;
  height: 38px;
  text-align: left;
  img { width: 38px; height: 38px; }
}
.title {
  font-family: SourceHanSansSC, SourceHanSansSC;
  font-weight: bold;
  font-size: 22px;
  line-height: 33px;
  &.t-danger { color: #FA4040; }
  &.t-info { color: #00F3FF; }
}
.headerbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  .bolt { color: #ffd543; font-size: 16px; }
  .titlebar-text {
    font-family: SourceHanSansSC;
    font-weight: bold;
    font-size: 22px;
    color: #c8ecff;
  }
}
.tag {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 800;
  color: #FA4040;
  border: 1px solid #FA4040;
  &.tag-warning { background: rgba(3, 3, 3, 0); }
}
.row {
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .label {
    font-family: SourceHanSansSC;
    font-size: 16px;
    color: #8ba5b8;
  }
  .value, .risk, .status, .mono {
    font-family: SourceHanSansSC;
    font-size: 16px;
    color: #fff;
  }
  .status {
    width: 88px;
    height: 23px;
    text-align: center;
    font-size: 14px;
    color: #00FF7B;
    background: url(./imgs16/bg10.png) no-repeat center center / 100% 100%;
  }
  .risk.risk-danger {
    width: 85px;
    height: 24px;
    padding-left: 10px;
    background: url(./imgs16/bg7.png) no-repeat center center / 100% 100%;
  }
  .mono { font-family: monospace; }
}
.progress {
  height: 50px;
  :deep(.el-progress-bar__outer) { background-color: #666666; }
  :deep(.el-progress-bar__inner) { background-color: #FA4040 !important; }
  :deep(.el-progress__text) { color: #ffffff; font-weight: 500; }
}
.file-name {
  font-family: SourceHanSansSC;
  font-size: 22px;
  color: #fff;
  margin-bottom: 8px;
}
.meta2 {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  .meta-row {
    height: 30px;
    line-height: 30px;
    display: flex;
    gap: 6px;
    .label { font-size: 14px; color: #8ba5b8; }
    .value { font-size: 14px; color: #fff; }
    .family {
      display: inline-block;
      padding: 0 8px;
      border-radius: 6px;
      font-size: 13px;
      color: #fff;
      background: #f5832a;
    }
    &.first-row { flex: 0 0 100%; }
    &:not(.first-row) { flex: 0 0 calc((100% - 8px) / 2); }
  }
}
.hashes { 
  margin-top: 8px; 
  .hash { 
    display: flex; 
    align-items: flex-start; 
    gap: 6px; 
    font-size: 14px; 
    color: #fff;
    line-height: 22px;
    min-height: 30px;
    .label { 
      width: 70px; 
      flex: 0 0 70px; 
      color: #8ba5b8; 
    } 
    .value { 
      flex: 1; 
      white-space: normal; 
      word-break: break-all; 
      overflow-wrap: anywhere; 
    } 
  } 
}
.behavior { margin-top: 8px; 
  .label { font-size: 14px; color: #8ba5b8;margin-bottom: 20px; } 
  .desc { font-size: 14px; color: #fff; } 
}
.behavior .danger-tip {
  display: block;
  margin-top: 6px;
  padding: 8px 10px;
  background: rgba(218, 42, 0, 0.28);
  border: 1px solid #f20a0a;
  border-radius: 6px;
  color: #fcf8ff;
  box-shadow: 0 0 10px rgba(255, 41, 41, 0.3),
    inset 0 0 6px rgba(255, 41, 41, 0.18);
  .type {
    display: block;
    color: #FA4040;
    font-weight: 600;
    margin-bottom: 6px;
    margin-bottom: 15px;
    font-size: 15px;
  }
  .content {
    color: #fff;
    font-size: 16px;
  }
}
.iocs {
  margin-top: 12px;
  .iocs-title { font-size: 14px; color: #8ba5b8; margin-bottom: 6px; }
  .ioc {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 6px 8px;
    border: 1px solid #21416B;
    background: rgba(0,25,48,0.32);
    color: #fff;
    margin-bottom: 15px;
    height: 60px;
    .ioc-line { display: flex; align-items: center; justify-content: space-between; }
    .ioc-line1 .host { flex: 1; color: #24ffd8; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ioc-line1 .port { width: 80px; color: #24ffd8; font-weight: 600; text-align: right; }
    .ioc-line2 .label.small { color: #8ba5b8; font-size: 12px; width: 140px; }
    .ioc-line2 .loc.small { color: #8ba5b8; font-size: 12px; width: 100px; text-align: left; }
  }
}
.buttons {
  margin-top: 16px;
  display: flex;
  gap: 20px;
  .button {
    height: 36px;
    padding: 0 18px;
    border-radius: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: SourceHanSansSC;
    font-weight: bold;
    font-size: 15px;
    color: #ffffff;
    transition: all 0.2s ease;
  }
  .button-share {
    background-color: rgba(4, 83, 130, 0.53);
    box-shadow: inset 0 0 0 1px #20b7f3,
      0 2px 4px 0 rgba(36, 153, 243, 0.5),
      inset 0 1px 14px 4px rgba(37, 171, 255, 0.5);
  }
  .button-monitor {
    background-color: rgba(130, 4, 4, 0.53);
    box-shadow: inset 0 0 0 1px #f32020,
      0 2px 4px 0 rgba(243, 36, 36, 0.5),
      inset 0 1px 14px 4px rgba(255, 37, 37, 0.5);
  }
}
.fade-in-up {
  opacity: 0;
  transform: translateY(18px);
  animation: fade-in-up 0.6s ease forwards;
}
@keyframes slide-in-left {
  from { transform: translateX(-120px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes fade-in-up {
  from { transform: translateY(18px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
