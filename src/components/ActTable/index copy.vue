<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-12-16 16:05:23
 * @LastEditTime: 2021-12-16 16:10:12
 * @Description: 
-->
<template>
  <el-table
    :data="tableData"
    ref="scrollTable"
    width="100%"
    height="100%"
    class="data-table"
  >
    <el-table-column
      v-if="showSeq"
      type="index"
      :index="indexMethod"
      label="序号"
      width="80"
      align="left"
    >
    </el-table-column>
    <el-table-column
      :align="item.align"
      v-for="(item, index) in columns"
      :key="index"
      v-bind="item"
    >
      <template v-slot="scope">
        <template v-if="Object.keys(slots).indexOf(item.prop) !== -1">
          <slot :name="item.prop" :row="scope.row" />
        </template>
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useSlots } from 'vue'
import { elTableScroll } from './tableScroll'

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
  needScroll: {
    // 是否需要滚动
    type: Boolean,
    default: false,
  },
})

const scrollTable = ref(null)
let tableDom = null
const slots = useSlots()

onMounted(() => {
  if (props.needScroll) scroll()
})

onBeforeUnmount(() => {
  tableDom && tableDom.stop()
  tableDom = null
})

function indexMethod(index) {
  return index + 1
}

async function scroll() {
  tableDom && tableDom.stop()
  tableDom = await elTableScroll(scrollTable.value, {
    step: 0.3,
    duration: 25,
    useType: 'step',
  })
}
</script>
