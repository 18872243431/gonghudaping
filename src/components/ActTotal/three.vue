<template>
    <div class="total-three" ref="totalThreeRef">
        <div class="xbox" :class="data.color" :style="{
                width: len,
                height: len,
                top: top,
                left: left,
            }">
            <div class="txtbox">
                <div class="row1">
                    <span>{{ `NO.${data.order}`}}</span>
                </div>
                <div class="row2">
                    <act-num :num="data.value" :thousandsFmt="true"></act-num>
                </div>
                <div class="row3">
                    <span>{{ data.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ActNum from '@c/ActNum';

/* eslint-disable */
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {
                label: '通用设备',
                value: 34564,
                order: 1,
                color: 'red'
            }
        }
    }
})

const totalThreeRef = ref(null);

const len = ref('0px');
const top = ref('0px');
const left = ref('0px');

onMounted(() => {
    const w = totalThreeRef.value.offsetWidth;
    const h = totalThreeRef.value.offsetHeight;
    len.value = `${w > h? h : w}px`;
    if (w > h) {
        left.value = `${(w - h) / 2}px`;
        top.value = `0px`;
    } else {
        left.value = `0px`;
        top.value = `${(h - w) / 2}px`;
    }
})
</script>

<style lang="scss" scoped>
.total-three {
    position: relative;
    width: 100%;
    height: 100%;
    .xbox {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat; /* 不重复背景图 */
        background-position: center center; /* 背景图居中 */
        background-size: 100% 100%; /* 背景图铺满整个元素 */
        .txtbox {
            position: relative;
            width: 50%;
            height: 32%;
            display: flex;
            flex-direction: column;
            .row1 {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    font-size: 20px;
                    font-family: YouSheBiaoTiHei;
                    font-weight: 500;
                    color: transparent;
                    background-clip: text; // 裁剪背景到文字区域
                    -webkit-background-clip: text; // 兼容 WebKit 浏览
                }
            }
            .row2 {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    background: linear-gradient(180deg,#ffffff 19%, #ffb215 66%);
                    font-size: 20px;
                    font-weight: 600;
                    color: transparent;
                    line-height: 29px;
                    text-shadow: 0px 0px 28px 0px rgba(123,213,255,0.61);
                    background-clip: text; // 裁剪背景到文字区域
                    -webkit-background-clip: text; // 兼容 WebKit 浏览
                }
            }
            .row3 {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    font-size: 22px;
                    font-family: YouSheBiaoTiHei;
                    font-weight: 500;
                    text-align: center;
                    color: #ffffff;
                    text-shadow: 0px 2px 4px 0px rgba(0,0,0,0.50);
                }
            }
        }
    }
    .red {
        background-image: url("~assets/img/total/total-redbg.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(254,14,14,1.00) 12%, rgba(255,184,184,0.99) 37%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
    .blue {
        background-image: url("~assets/img/total/total-bluebg.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(14,145,254,1.00) 12%, rgba(184,225,255,0.99) 38%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
    .yellow {
        background-image: url("~assets/img/total/total-yellowbg.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(254,182,14,1.00) 12%, rgba(255,230,184,0.99) 37%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
    .green {
        background-image: url("~assets/img/total/total-greenbg.png"); /* 背景图 */
        .row1 {
            span {
                background: linear-gradient(0deg,rgba(77, 255, 221, 1) 12%, rgba(184,255,184,0.99) 38%, rgba(255,255,255,0.98) 87%);
            }
        }
    }
}
</style>