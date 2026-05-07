<template>
    <v-chart class="chart" :option="option" :autoresize="true" />
</template>

<script setup>
/* eslint-disable */
import * as echarts from 'echarts';
import VChart from 'vue-echarts';
import config from '../config';
import { computed } from 'vue';

const { yAxis, grid, tooltip } = config

const props = defineProps({
  option: {
    type: Object,
    default: () => {}
  },
  data: {
    type: Object,
    default: () => {
        return {
            name: '被攻击的行业排名',
            list: [
                { x: 1000, y: 304, name: '制造业' },
                { x: 807, y: 695, name: '互联网' },
                { x: 1300, y: 558, name: '建筑业' },
                { x: 905, y: 281, name: '新能源' },
                { x: 1100, y: 833, name: '金融业' },
                { x: 1400, y: 766, name: '服装业' },
                { x: 1340, y: 681, name: '林牧业' },
                { x: 1000, y: 633, name: '矿业' },
                { x: 400, y: 896, name: '汽车业' },
                { x: 1250, y: 682, name: '服务业' },
                { x: 915, y: 720, name: '医疗业' },
                { x: 1150, y: 720, name: '教育业' },
                { x: 303, y: 423, name: '餐饮业' },
                { x: 1220, y: 783, name: '零售业' },
                { x: 202, y: 447, name: '旅游业' },
                { x: 105, y: 333, name: 'IT行业' },
                { x: 405, y: 496, name: '医药业' },
                { x: 303, y: 724, name: '家具业' },
            ]
        }
    }
  }
});

function generateColorArray(data, colors) {
    const dataLength = data.length;
    const colorsLength = colors.length;
    let newColors = [];
    if (dataLength <= colorsLength) {
        // 如果 data 数组的长度小于或等于 colors 数组的长度，直接取前 dataLength 个颜色
        newColors = colors.slice(0, dataLength);
    } else {
        // 如果 data 数组的长度大于 colors 数组的长度，重复 colors 数组直到满足 data 数组的长度
        for (let i = 0; i < dataLength; i++) {
            newColors.push(colors[i % colorsLength]);
        }
    }
    return newColors;
}

function updateColorAlpha(colors, alpha) {
    return colors.map(color => {
        // 使用正则表达式提取 RGB 值
        const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
        if (rgbaMatch) {
            const r = rgbaMatch[1];
            const g = rgbaMatch[2];
            const b = rgbaMatch[3];
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return color; // 如果格式不匹配，返回原始颜色
    });
}

const series = computed(() => {
    const defaultColor = [
        'rgba(255, 103, 135, 1)',
        'rgba(103, 182, 255, 1)',
        'rgba(103, 255, 236, 1)',
        'rgba(255, 219, 103, 1)',
        'rgba(66, 181, 216, 1)',
        'rgba(191, 174, 34, 1)',
        'rgba(58, 137, 81, 1)',
        'rgba(255, 58, 47, 1)',
        'rgba(124, 89, 233, 1)',
        'rgba(215, 116, 52, 1)',
        'rgba(200, 51, 113, 1)',
        'rgba(115, 2, 235, 1)',
        'rgba(110, 167, 221, 1)',
        'rgba(128, 104, 176, 1)'
    ]
    const colors = generateColorArray(props.data.list, defaultColor);
    const areaColors = updateColorAlpha(colors, 0.1);
    const retData = []
    props.data.list.forEach((item, ind) => {
        const scatter = {
            name: props.data.name,
            type: 'scatter',
            symbolSize: 70,
            label: {
                show: true,
                fontSize: 16,
                formatter: '{b}',
            },
            itemStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                    {
                        offset: 0.2,
                        color: areaColors[ind],
                    },
                    {
                        offset: 1,
                        color: colors[ind],
                    },
                ]),
                borderWidth: 2,
                borderColor: colors[ind],
            },
            data: [{name: item.name, value: [item.x, item.y]}]
        }
        retData.push(scatter)
    });
    console.log(retData)
    return retData
});

const option = computed(() => {
    return {
        grid: { ...grid, ...props.option?.grid },
        tooltip: { ...tooltip, ...props.option?.tooltip },
        yAxis: { ...yAxis, ...props.option?.yAxis },
        xAxis: { ...yAxis, ...props.option?.xAxis },
        series: series.value
    }
});
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>