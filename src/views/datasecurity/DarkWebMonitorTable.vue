<template>
  <div class="dark-web-monitor-table">
    <el-table
      :data="tableData"
      style="width: 100%; height: 100%"
      class="table1 big"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
      >
        <template #default="scope">
          <span
            :class="
              scope.$index < 3
                ? 'serial serial' + (scope.$index + 1)
                : 'serial'
            "
          >
            <span class="text">{{ scope.$index + 1 }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="企业名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="dataVolume"
        label="泄露数据量"
        align="center"
        width="120"
      />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  }
});


</script>

<style scoped lang="scss">
.dark-web-monitor-table {
  width: 100%;
  height: 100%;
  
  :deep(.el-table) {
    background: transparent;
    
    &::before {
      display: none;
    }
    
    .el-table__header-wrapper {
      th {
        background: linear-gradient(
          180deg,
          rgba(32, 158, 255, 0.3) 0%,
          rgba(0, 77, 172, 0.3) 100%
        ) !important;
        border-right: none !important;
        border-left: none !important;
        border-top: 1px solid rgba(77, 213, 255, 0.24) !important;
        border-bottom: 1px solid rgba(77, 213, 255, 0.24) !important;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        font-family: SourceHanSansSC, sans-serif;
        padding: 12px 0;
        .cell {
          color: #fff;
        }
      }
    }
    
    .el-table__body-wrapper {
      background: transparent;
      
      .el-table__row {
        background: transparent;
        
        &:hover {
          background: rgba(89, 181, 218, 0.15) !important;
        }
        
        &:nth-child(odd) {
          background: rgba(89, 181, 218, 0.05);
        }
        
        td {
          border-bottom: 1px solid rgba(89, 181, 218, 0.1);
          border-right: none !important;
          border-left: none !important;
          color: #fff;
          font-size: 13px;
          font-family: SourceHanSansSC, sans-serif;
          padding: 14px 0;
        }
      }
    }
    
    .serial {
      min-width: 20px;
      height: 20px;
      padding: 0px;
      margin-top: 3px;
      text-align: center;
      display: inline-block;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(19, 150, 249, 0.3);
      border: 1px solid #1396f9;
      border-radius: 2px;
      transform: rotate(45deg);
      
      .text {
        transform: rotate(-45deg);
        display: block;
        line-height: 18px;
      }
    }
    
    .serial1 {
      background: rgba(255, 58, 47, 0.3);
      border: 1px solid #ff3a2f;
    }
    
    .serial2 {
      background: rgba(173, 149, 11, 0.3);
      border: 1px solid #ad950b;
    }
    
    .serial3 {
      background: rgba(19, 150, 249, 0.3);
      border: 1px solid #1396f9;
    }
  }
}
</style>
