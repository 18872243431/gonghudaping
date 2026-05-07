<template>
  <v-chart class="chart" ref="earthChart" :option="option" :autoresize="true" />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import * as echarts from 'echarts'
import 'echarts-gl'
import VChart from 'vue-echarts'

import { useCreateEarth } from './hooks/useCreateEarth'

use([CanvasRenderer])

const props = defineProps({
  linesData: {
    type: Array,
    default: () => [],
  },
})

const { earthChart, option } = useCreateEarth(props)
</script>
