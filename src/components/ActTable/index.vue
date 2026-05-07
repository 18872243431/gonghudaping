<template>
  <el-table
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-background="rgba(0, 0, 0, 0.5)"
    :data="tableData"
    @sort-change="sortcli"
    ref="scrollTable"
    width="100%"
    height="100%"
    :class="'table1 ' + size"
  >
    <el-table-column
      v-if="showSeq"
      type="index"
      :index="indexMethod"
      :label="seqLabel"
      :width="seqWidth"
      align="left"
    >
      <template v-slot="scope">
        <span
          :class="
            scope.$index + seqNum < 4 && seqSpecial
              ? 'serial serial' + (scope.$index + seqNum)
              : 'serial'
          "
          ><span class="text">{{ scope.$index + seqNum }}</span></span
        >
      </template>
    </el-table-column>
    <template v-for="(item, index) in columns" :key="index">
      <el-table-column
        v-if="item.prop"
        :sortable="item.sortable"
        align="center"
        v-bind="item"
      >
        <template v-slot="scope">
          <template v-if="Object.keys(slots).indexOf(item.prop) !== -1">
            <slot :name="item.prop" :row="scope.row" />
          </template>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else align="center" :label="item.label">
        <el-table-column
          v-for="(ele, i) in item.childern"
          :key="i"
          :label="ele.label"
          :sortable="ele.sortable"
          v-bind="ele"
          align="center"
        >
          <template v-slot="scope">
            <template v-if="Object.keys(slots).indexOf(ele.prop) !== -1">
              <slot :name="ele.prop" :row="scope.row" />
            </template>
            <span v-else>{{ scope.row[ele.prop] }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useSlots, watch, nextTick } from 'vue'
import { elTableScroll } from './tableScroll'
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  showSeq: {
    // 是否展示序号
    type: Boolean,
    default: true,
  },
  sortable: {
    // 是否排序
    type: Boolean,
    default: false,
  },
  needScroll: {
    // 是否需要滚动
    type: Boolean,
    default: true,
  },
  size: {
    // 表格大小
    type: String,
    default: 'big',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  seqWidth: {
    type: Number,
    default: 80,
  },
  seqSpecial: {
    type: Boolean,
    default: true,
  },
  seqNum: {
    type: Number,
    default: 1,
  },
  seqLabel: {
    type: String,
    default: '序号',
  },
})

const scrollTable = ref(null)
let tableDom = null
const slots = useSlots()
const emits = defineEmits(['sortClick'])
watch(
  () => props.tableData,
  (list) => {
    stopScroll()
    useTimeoutFn(() => {
      if (props.needScroll && list.length > 0) scroll()
    }, 6000)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stopScroll()
})

function indexMethod(index) {
  return index + 10
}

async function scroll() {
  tableDom && tableDom.stop()
  tableDom = await elTableScroll(scrollTable.value, {
    step: 0.3,
    duration: 25,
    useType: 'step',
  })
}
function sortcli(data) {
  emits('sortClick', data)
}
function stopScroll() {
  tableDom && tableDom.stop()
  tableDom = null
}
</script>
<style lang="scss"></style>
