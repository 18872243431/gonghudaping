<template>
  <v-chart
    ref="sankeyChartRef"
    class="sankey-chart"
    :option="chartOption"
    :autoresize="true"
  />
</template>

<script setup>
import { computed, ref } from 'vue';
import * as echarts from 'echarts';
import VChart from 'vue-echarts';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      nodes: [],
      links: []
    })
  },
  option: {
    type: Object,
    default: () => ({})
  }
});

const sankeyChartRef = ref(null);

const chartOption = computed(() => {
  // 计算每个节点的连接数，找出中间节点（连接数最多的节点作为目标企业）
  const degreeMap = {};
  (props.data.links || []).forEach(link => {
    degreeMap[link.source] = (degreeMap[link.source] || 0) + 1;
    degreeMap[link.target] = (degreeMap[link.target] || 0) + 1;
  });
  
  let centerNodeName = '';
  let maxDegree = 0;
  Object.keys(degreeMap).forEach(key => {
    if (degreeMap[key] > maxDegree) {
      maxDegree = degreeMap[key];
      centerNodeName = key;
    }
  });

  // 处理 nodes 数据，动态将中间企业节点的标签放到上方
  const processedNodes = (props.data.nodes || []).map(node => {
    if (node.name === centerNodeName) {
      return {
        ...node,
        label: {
          ...(node.label || {}),
          position: 'top'
        }
      };
    }
    return node;
  });

  // 处理 links 数据，添加标签显示攻击类型，并根据类型调整颜色
  const processedLinks = (props.data.links || []).map(link => {
    // 只有后半段（以中间节点为源）才需要根据攻击类型进行颜色的区分
    const isSecondHalf = link.source === centerNodeName;
    const isIllegalOutbound = isSecondHalf && link.attackType === '非法外联';
    
    const linkData = {
      ...link,
      label: {
        show: true,
        formatter: link.attackType || '',
        color: isIllegalOutbound ? '#ffe58f' : '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textBorderColor: 'transparent',
        position: 'inside'
      }
    };
    
    // 如果是后半段的非法外联，改变连线的颜色为淡黄色
    if (isIllegalOutbound) {
      linkData.lineStyle = {
        color: '#ffe58f',
        opacity: 0.4
      };
    }
    
    return linkData;
  });

  const defaultOption = {
    tooltip: {
      show: false,
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `${params.name}<br/>价值：${params.value || 0}`;
        } else {
          const attackType = params.data.attackType ? `<br/>攻击类型：${params.data.attackType}` : '';
          return `${params.fromName} → ${params.toName}<br/>流量：${params.value}${attackType}`;
        }
      }
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        left: '5%',
        right: '11%',
        top: '5%',
        bottom: '5%',
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle: {
          color: 'source',
          opacity: 0.2,
          curveness: 0.5
        },
        label: {
          position: 'right',
          color: '#fff',
          fontSize: 20
        },
        edgeLabel: {
          show: true,
          color: '#fff',
          fontSize: 16,
          formatter: (params) => {
            return params.data.attackType || '';
          }
        },
        data: processedNodes,
        links: processedLinks
      }
    ],
    ...props.option
  };

  return defaultOption;
});

defineExpose({
  chartRef: sankeyChartRef
});
</script>

<style lang="scss" scoped>
.sankey-chart {
  width: 100%;
  height: 100%;
}
</style>
