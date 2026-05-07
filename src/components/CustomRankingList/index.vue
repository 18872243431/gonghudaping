<template>
  <div class="ranking-container" style="height: 100%">
    <div class="ranking-list system-scrollbar">
      <div
        v-for="(item, index) in listData"
        :key="index"
        class="ranking-item"
      >
        <div class="ranking-rank" :class="'rank-' + (index + 1)">
          <span class="rank-num">{{ index + 1 }}</span>
        </div>
        <div class="ranking-content">
          <div class="ranking-info">
            <span class="ranking-name" :title="item[nameKey]">{{
              item[nameKey]
            }}</span>
            <div class="ranking-stats">
              <span class="ranking-count">{{
                item[valueKey]?.toLocaleString()
              }}</span>
              <span class="ranking-unit">次</span>
            </div>
          </div>
          <div class="ranking-progress-row">
            <div class="ranking-progress-bar">
              <div
              class="ranking-progress-fill"
              :style="{
                width:
                  (listData[0] ? (getValueForProgress(item) / getValueForProgress(listData[0])) * 100 : 0) + '%',
              }"
            ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  nameKey: {
    type: String,
    default: 'name'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  rawKey: {
    type: String,
    default: ''
  }
});

const getValueForProgress = (item) => {
  if (props.rawKey && item[props.rawKey] !== undefined) {
    return Number(item[props.rawKey]) || 0;
  }
  const val = item[props.valueKey];
  return typeof val === 'number' ? val : parseFloat(String(val).replace(/[万千,]/g, '')) || 0;
};
</script>

<style lang="scss" scoped>
.ranking-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    position: relative;

    .ranking-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 15px; /* 减小间距 */
      width: 100%;

      .ranking-tab {
        flex: 1; /* 平分宽度 */
        position: relative;
        padding: 6px 0;
        cursor: pointer;
        color: #8ba2c4;
        font-size: 24px; /* 调小两号 */
        font-weight: 500;
        text-align: center;
        transition: all 0.3s;
        background: rgba(30, 58, 95, 0.3);
        transform: skewX(-20deg); /* 倾斜形成梯形/平行四边形 */
        border: 1px solid rgba(109, 241, 255, 0.1);

        .tab-text {
          display: inline-block;
          transform: skewX(20deg); /* 文字反向倾斜回来 */
          white-space: nowrap;
        }

        &:hover {
          color: #fff;
          background: rgba(30, 58, 95, 0.6);
        }

        &.active {
          color: #fff;
          background: linear-gradient(90deg, #1e3a5f 0%, #3fc3ff 100%);
          border-color: #3fc3ff;
          box-shadow: 0 0 15px rgba(63, 195, 255, 0.3);
          font-weight: bold;
        }
      }
    }

    .ranking-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px; /* 减小间距 */
      position: relative;
      padding-right: 20px;

      .ranking-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 15px; /* 适当增加内边距 */
        margin-bottom: 0;
        background: transparent; /* 去掉背景 */
        border: none; /* 去掉边框 */
        border-bottom: 1px solid rgba(109, 241, 255, 0.1); /* 改为下边线 */
        border-radius: 0;

        &:last-child {
          border-bottom: none;
        }

        .ranking-rank {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
          transform: rotate(45deg);
          margin: 0 15px 0 5px;

          .rank-num {
            transform: rotate(-45deg);
            display: inline-block;
          }

          &.rank-1 { 
            background: rgba(255, 77, 79, 0.2); 
            border-color: #ff4d4f;
            box-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
          }
          &.rank-2 { 
            background: rgba(250, 173, 20, 0.2); 
            border-color: #faad14;
            box-shadow: 0 0 10px rgba(250, 173, 20, 0.3);
          }
          &.rank-3 { 
            background: rgba(0, 229, 255, 0.2); 
            border-color: #00e5ff;
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
          }
        }

        .ranking-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;

          .ranking-info {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .ranking-name {
              color: #ffffff;
              font-size: 23px;
              font-weight: 500;
              max-width: 450px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .ranking-stats {
              display: flex;
              align-items: baseline;
              gap: 4px;

              .ranking-count {
                font-size: 24px;
                font-weight: bold;
                font-family: "Orbitron", sans-serif;
                color: #00e5ff; /* 统一使用鲜亮的青色 */
                text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
              }

              .ranking-unit {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.7);
              }
            }
          }

          .ranking-progress-row {
            display: flex;
            align-items: center;
            gap: 15px;

            .ranking-progress-bar {
              flex: 1;
              height: 4px;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 2px;
              overflow: hidden;

              .ranking-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, transparent 0%, #00e5ff 100%);
                box-shadow: 0 0 8px #00e5ff;
                border-radius: 2px;
                transition: width 1s ease-out;
              }
            }

            .ranking-type-tag {
              color: #00e5ff; /* 改为青色边框虚线 */
              border: 1px dashed #00e5ff;
              padding: 0 8px;
              border-radius: 2px;
              font-size: 14px;
              min-width: 80px;
              text-align: center;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              opacity: 0.8;
            }
          }
        }
      }
    }
      }
</style>
