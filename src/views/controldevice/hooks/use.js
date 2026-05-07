/*
 * @Descripttion: 
 * @Author: wangmeng wm1259972249@163.com
 * @Date: 2023-08-31 16:57:00
 * @LastEditTime: 2023-09-06 09:22:21
 */
import {
  reactive,
  onBeforeMount,
  onMounted,
  toRefs,
  computed,
  watch,
} from 'vue'
import { carNetworkImg } from '@/libs/dict'
export function usehook() {
  const state = reactive({
    totalList1:[
      {icon: 'total-icon1', label: '暴露工控设备及系统数', value: 18743},
      {icon: 'total-icon2', label: '工控设备及系统漏洞数', value: 17843},
    ],
    totalList2: [
      {label: 'DTU数据中心', value: 6273, unit: '个', percentage: 23, type: '1'},
      {label: 'OPC服务器', value: 1873, unit: '个', percentage: 23, type: '1'},
      {label: 'SCADA', value: 8754, unit: '个', percentage: 23, type: '2'},
      {label: '操作员站', value: 1743, unit: '个', percentage: 23, type: '2'},
    ],
    pyramidBarData: [
      { name: '文件上传', value: 650 },
      { name: '带口令', value: 601 },
      { name: '拒绝服务', value: 403 },
      { name: '类目四', value: 366 },
      { name: '类目五', value: 266 },
    ],
    lineData: {
      legend: ['资产', '漏洞'],
      category: [ '00:00', '04:00', '08:00', '12:00', '16:00', '20:00' ],
      values: [
        [10, 20, 30, 42, 21, 23],
        [13, 27, 23, 33, 16, 10]
        
      ]
    },
    riskList: [],
    radarOption: { 
      radar: {
        indicator: [
          { name: "扫描探测"}, 
          { name: "尝试攻击" }, 
          { name: "初步感染" },
          { name: "木马下载" },
          { name: "远程控制" }, 
          { name: "行动收割" }
        ]
      }
    },
    radarData: [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: "2020年",
      },
    ],
    batteryList: [
      { name: 'chatgpt-live-proxy.vvip.top', value: 21543 },
      { name: 'chat18.aichatos.xyz', value: 6555 },
      { name: 'chatgpt-zh.top', value: 5966 },
      { name: 'airengong.cn', value: 1990 },
      { name: 'askchat.ai', value: 1942 },
    ],
   
  })
  
  function thousands(num) {
    let str = num.toString()
    const reg =
      str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
    return str.replace(reg, '$1,')
  }

  function getRiskList () {
    const data = [
      { name: '斑马智行', src: '斑马智行', unit: '个', num1: 318, num2: 318 },
      { name: '日产智联', src: '日产', unit: '个', num1: 241, num2: 241 },
      { name: '广汽传祺', src: '广汽传祺', unit: '个', num1: 196, num2: 196 },
      { name: 'MyChevy', src: '奇瑞', unit: '个', num1: 147, num2: 147 },
      {name: '吉利GNetLink', src: '吉利汽车', unit: '个', num1: 124, num2: 124},
      {name: '比亚迪', src: '比亚迪', unit: '个', num1: 120, num2: 120},
    ]
    data.forEach(item => {
      item.src = carNetworkImg.includes(item.src) ? item.src : 'default'
    })
    for (let i = 0; i < data.length; i += 6) {
      state.riskList.push(data.slice(i, i + 6))
    }
  }

  onBeforeMount(() => {
    getRiskList()
  })

  onMounted(() => { })
  return {
    ...toRefs(state),
    thousands
  }
}