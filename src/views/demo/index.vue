<template>
    <div class="networksecurity">
        <ActTabs @change-tab="changeTab" :tabsList="tabsList" :active="activeTab"></ActTabs>
        <div class="left-box">
            <div class="left-box-top">
                <chart-box title="网络攻击风险指标概览">
                    <template v-slot:chart>
                        <div class="total-box">
                            <div class="total-box-t">
                                <div class="total-card" v-for="(item, ind) in totalOneList" :key="ind">
                                    <total-one :data="item"></total-one>
                                </div>
                            </div>
                            <div class="total-box-b">
                                <div class="total-card" v-for="(item2, ind2) in totalTwoList" :key="ind2">
                                    <total-two :data="item2"></total-two>
                                </div>
                            </div>
                        </div>
                    </template>
                </chart-box>
            </div>
            <div class="left-box-center">
                <div class="chart-card">
                    <chart-box title="网络攻击趋势" :showLine="false">
                        <template v-slot:chart>
                            <Line :option="lineOpts" :data="lineData1"></Line>
                        </template>
                    </chart-box>
                </div>
                <div class="chart-card">
                    <chart-box title="攻击源数量变化趋势" :showLine="false">
                        <template v-slot:chart>
                            <Line :option="lineOpts" :data="lineData2"></Line>
                        </template>
                    </chart-box>
                </div>
                <div class="chart-card">
                    <chart-box title="被攻击企业数量变化趋势" :showLine="false">
                        <template v-slot:chart>
                            <Line :option="lineOpts" :data="lineData3"></Line>
                        </template>
                    </chart-box>
                </div>
            </div>
            <div class="left-box-bottom">
                <div class="chart-card">
                    <chart-box title="网络攻击告警类型分布">
                        <template v-slot:chart>
                            <Pie></Pie>
                        </template>
                    </chart-box>
                </div>
                <div class="chart-card">
                    <chart-box title="网络威胁等级分布">
                        <template v-slot:chart>
                            <div class="progress-box">
                                <div class="pbox-top">
                                    <div class="pbox-top-item">
                                        <Gauge :option="gaugeOpts" :data="gaugeData1" color="rgba(255, 58, 47, 1)"></Gauge>
                                    </div>
                                    <div class="pbox-top-item">
                                        <Gauge :option="gaugeOpts" :data="gaugeData2" color="rgba(255, 189, 67, 1)"></Gauge>
                                    </div>
                                    <div class="pbox-top-item">
                                        <Gauge :option="gaugeOpts" :data="gaugeData3" color="rgba(77, 213, 255, 1)"></Gauge>
                                    </div>
                                </div>
                                <div class="pbox-bottom t"></div>
                            </div>
                        </template>
                    </chart-box>
                </div>
            </div>
        </div>
        <div class="center-box">
            <div class="test">
                <div class="xitem">
                    <total-three :data="redTotal"></total-three>
                </div>
                <div class="xitem">
                    <total-three :data="yellowTotal"></total-three>
                </div>
                <div class="xitem">
                    <total-three :data="greenTotal"></total-three>
                </div>
                <div class="xitem">
                    <total-three :data="blueTotal"></total-three>
                </div>
            </div>
            <div class="test">
                <div style="flex: 3;display: flex;justify-content: center;align-items: center;">
                    <act-table
                        :showSeq="true"
                        :columns="columns"
                        :tableData="tableData"
                    >
                    </act-table>
                </div>
                <div class="xitem">
                    <Pie1 :option="pieOpts1"></Pie1>
                </div>
            </div>
            <div class="test">
                <div class="xitem">
                    <ImgGauge :data="imgGaugeRed"></ImgGauge>
                </div>
                <div class="xitem">
                    <ImgGauge :data="imgGaugeYellow"></ImgGauge>
                </div>
                <div class="xitem">
                    <ImgGauge :data="imgGaugeGreen"></ImgGauge>
                </div>
                <div class="xitem">
                    <ImgGauge :data="imgGaugeBlue"></ImgGauge>
                </div>
            </div>
        </div>
        <div class="right-box">
            <div class="right-box-top">
                <chart-box title="被攻击的行业排名">
                    <template v-slot:chart>
                        <cube-bar :data="cubeData" :single="0"></cube-bar>
                    </template>
                </chart-box>
            </div>
            <div class="right-box-bottom">
                <chart-box title="被攻击的行业排名">
                    <template v-slot:chart>
                        <Scatter :data="scatterData" :option="scatterOpts"></Scatter>
                    </template>
                </chart-box>
            </div>
        </div>
    </div>
</template>

<script setup>
import chartBox from '@c/chartBox';
import Line from '@c/echarts/Line/lineArea/index.vue';
import CubeBar from "@c/echarts/bar/CubeBar";
import Scatter from '@c/echarts/Scatter';
import Pie from '@c/echarts/Pie/NewPie';
import Pie1 from '@c/echarts/Pie/NewPie1';
import ActTabs from '@c/ActTabs';
import ActTable from "@c/ActTable";
import TotalTwo from '@c/ActTotal/two.vue'
import TotalOne from '@c/ActTotal/one.vue'
import TotalThree from '@c/ActTotal/three.vue'
import Gauge from '@c/echarts/gauge';
import ImgGauge from '@c/echarts/gauge/ImgGauge';
import { ref } from 'vue';

//#region act-table组件
const columns = ref([
  { prop: "ip", label: "IP地址" },
  { prop: "attacktype", label: "攻击类型" },
  { prop: "attacknum", label: "攻击次数" },
  { prop: "attackfirm", label: "攻击企业" },
]);

const tableData = ref([
    { ip: "192.168.1.1", attacktype: "挖矿程序", attacknum: 123, attackfirm: "百度" },
    { ip: "192.168.1.2", attacktype: "僵尸网络", attacknum: 123, attackfirm: "腾讯" },
    { ip: "192.168.1.3", attacktype: "加密流量事件", attacknum: 123, attackfirm: "网易" },
    { ip: "192.168.1.4", attacktype: "隐秘隧道事件", attacknum: 123, attackfirm:"京东" },
    { ip: "192.168.1.5", attacktype: "挖矿程序", attacknum: 123, attackfirm: "拼多多" }
]);
//#endregion

//#region Pie1组件
const pieOpts1 = ref({
    innerRaduis: ['55%', '75%'],
    outerRaduis: ['74%', '85%'],
    lineRaduis: ["50%", "51%"],
    shadowRadius: "46%",
    colors: [
        'rgba(255, 66, 66, 1)',
        'rgba(255, 128, 53, 1)',
        'rgba(141, 72, 199, 1)',
        'rgba(88, 79, 255, 1)',
        'rgba(255, 189, 67, 1)',
        'rgba(25, 220, 255, 1)',
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
        'rgba(128, 104, 176, 1)',
        'rgba(255, 244, 92, 1)',
        'rgba(130, 132, 255, 1)',
        'rgba(0, 212, 135, 1)',
        'rgba(255, 45, 21, 1)',
        'rgba(255, 128, 53, 1)'
    ]
})
//#endregion

//#region img-gauge
const imgGaugeRed = ref({
    progess: 68,
    label: '通用设备',
    value: 34564,
    order: 1,
    color: 'red'
});

const imgGaugeYellow = ref({
    progess: 45,
    label: '通用设备',
    value: 5643,
    order: 2,
    color: 'yellow'
});

const imgGaugeGreen = ref({
    progess: 78,
    label: '通用设备',
    value: 12345,
    order: 3,
    color: 'green'
});

const imgGaugeBlue = ref({
    progess: 88,
    label: '通用设备',
    value: 12345,
    order: 4,
    color: 'blue'
});
//#endregion

//#region total-three
const redTotal = ref({
    label: '通用设备',
    value: 34564,
    order: 1,
    color: 'red'
});

const yellowTotal = ref({
    label: '通用设备',
    value: 5643,
    order: 2,
    color: 'yellow'
});

const greenTotal = ref({
    label: '通用设备',
    value: 12345,
    order: 3,
    color: 'green'
});

const blueTotal = ref({
    label: '通用设备',
    value: 12345,
    order: 4,
    color: 'blue'
});
//#endregion

//#region 日期查询条件
const tabsList = ref([
    { label: '24小时', value: '24h' },
    { label: '近7天', value: '7d' },
    { label: '近30天', value: '30d' },
    { label: '近1年', value: 'year' },
]);

const activeTab = ref('24h');

function changeTab(tab) {
    console.error(tab, 'changeTab');
    activeTab.value = tab;
}
//#endregion

//#region 统计数据two
const totalTwoList = ref([
    { label1: '环比增长', value1: '35.1%', status1: 'up', label2: '同比下降', value2: '22.6%', status2: 'down' },
    { label1: '环比增长', value1: '35.1%', status1: 'up', label2: '同比下降', value2: '22.6%', status2: 'down' },
    { label1: '环比增长', value1: '35.1%', status1: 'up', label2: '同比下降', value2: '22.6%', status2: 'down' }
]);
//#endregion

//#region 网络威胁等级分布 进度图
const gaugeOpts = ref({
    gaugeRadius: '80%',
    progressWidth: 16,
    axisTickLength: 6,
    axisTickWidth: 1,
    axisTickDistance: -22,
    innerLineRadius: ["51%", "52%"],
    innerCircleRadius: '48%',
    ringRadius: 0.9,
    ringShapeRadius: 3,
    fontSize: 18,
    fontColor: '#fff'
});

const gaugeData1 = ref(36);
const gaugeData2 = ref(66);
const gaugeData3 = ref(78);
//#region

//#region 统计数据one
const totalOneList = ref([
    { label: '网络攻击总数', value: 3879083, unit: '万次' },
    { label: '攻击源数量', value: 9887899, unit: '万次' },
    { label: '被攻击企业数量', value: 8784423, unit: '万次' },
]);

//#region 折线图配置
const lineOpts = ref({
    grid: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 5,
        containLabel: true,
    },
    legend: {
        show: false
    }
});
//#endregion

//#region 网络攻击趋势 折线图数据
const lineData1 = ref({
    legend: ['网络攻击趋势'],
    category: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    values: [
        [10, 20, 30, 42, 21, 50, 60, 70, 80, 90, 100, 110] // 替换为你实际的数据
    ]
});
//#endregion

//#region 攻击源数量变化趋势 折线图数据
const lineData2 = ref({
    legend: ['攻击源数量变化趋势'],
    category: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    values: [
        [100, 230, 130, 142, 221, 150, 260, 170, 180, 190, 130, 160] // 替换为你实际的数据
    ]
});
//#endregion

//#region 被攻击企业数量变化趋势 折线图数据
const lineData3 = ref({
    legend: ['被攻击企业数量变化趋势'],
    category: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    values: [
        [130, 120, 50, 42, 121, 120, 160, 170, 130, 190, 140, 60] // 替换为你实际的数据
    ]
});
//#endregion

//#region 被攻击的行业排名 柱状图
const cubeData = ref([
    {
        name: "被攻击的行业排名",
        list: [
            { label: "北京", value: 150 },
            { label: "上海", value: 140 },
            { label: "广东", value: 130 },
            { label: "江苏", value: 120 },
            { label: "山东", value: 110 },
            { label: "河南", value: 100 },
            { label: "浙江", value: 90 },
            { label: "河北", value: 80 },
            { label: "四川", value: 70 },
            { label: "湖南", value: 60 },
            { label: "安徽", value: 50 },
            { label: "福建", value: 40 },
            { label: "江西", value: 30 },
            { label: "辽宁", value: 20 },
            { label: "陕西", value: 10 }
        ],
    }
]);
//#endregion

//#region 被攻击的行业排名 散点图
const scatterOpts = ref({
    grid: {
        left: 20,
        right: 20,
        top: 40,
        bottom: 5,
        containLabel: true
    },
    xAxis: {
        name: '{a|网络攻击次数}',
        nameLocation: 'end',
        nameTextStyle: {
            rich: {
                a: {
                    fontSize: 18,
                    color: '#fff',
                    padding: [0, 0, 30, -110],
                }
            }
        },
    },
    yAxis: {
        name: '攻击者数量',
        nameGap: 20,
        nameTextStyle: {
            fontSize: 18,
            color: '#fff',
        },
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(11,36,57,0.80)',
        borderColor: '#4dd5ff',
        textStyle: {
            color: '#fff',
            fontSize: 16,
        },
        axisPointer: {
            type: 'cross'
        },
        formatter: function(params) {
            return `<span style="font-size: 18px;font-weight: 600;">${params.name}</span><br/>
                网络攻击次数：${params.value[0]}<br/>
                攻击者数量：${params.value[1]}`
        }
    }
});

const scatterData = ref({
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
    ]
})
//#endregion
</script>

<style scoped lang="scss">
@import './index.scss';
</style>