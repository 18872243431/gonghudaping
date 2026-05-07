import {
  reactive,
  onBeforeMount,
  onMounted,
  toRefs,
  computed,
  watch,
} from 'vue'
import { getData } from '@/api/overall'
import { formatNumber, formatNum } from "@/libs/util";
export function usehook() {
  const state = reactive({
    systemName: '工信部跨境监管系统',
    dialogVisible: false,
    activeItem: {},
    operatorList: [
      {
        name: '电信集团', value: 'dx',
        list: [{ label: "跨境通信日志", value: "12", unit: "亿条" },
        { label: "跨境DNS日志", value: "30", unit: "亿条" },
        { label: "模型", value: "8", unit: "个" },
        { label: "样本", value: "3", unit: "个" },
        { label: "情报", value: "3", unit: "条" }]
      },
      {
        name: '移动集团', value: 'yd',
        list: [{ label: "跨境通信日志", value: "12", unit: "亿条" },
        { label: "跨境DNS日志", value: "30", unit: "亿条" },
        { label: "模型", value: "13", unit: "个" },
        { label: "样本", value: "3", unit: "个" },
        { label: "情报", value: "3", unit: "条" }]
      },
      {
        name: '联通集团', value: 'lt',
        list: [{ label: "跨境通信日志", value: "12", unit: "亿条" },
        { label: "跨境DNS日志", value: "30", unit: "亿条" },
        { label: "模型", value: "12", unit: "个" },
        { label: "样本", value: "3", unit: "个" },
        { label: "情报", value: "3", unit: "条" }]
      }
    ],
    cityList: [],
    allObjData: {},
  })

  async function getALLData() {
    const res = await getData({ vo: { ttype: '04', screen: '2' } })
    if (res.code === 200) {
      state.allObjData = res.data['04']
      state.operatorList.forEach((item) => {
        state.allObjData.forEach(all => {
          if (item.name === all.label) {
            item.list = all.listTc.map(el => {
              return {
                label: el.tlabel,
                value: formatNum(Number(el.tvalue)),
              }
            })
          }
        })
      })
    }
  }

  function handleClick(item) {
    state.cityList = []
    state.allObjData.forEach(sub => {
      if (sub.label.split('-')[0] == item.name) {
        if (sub.label.split('-')[1] != '' && sub.label.split('-')[1] != undefined) {
          let list = sub.listTc.map(el => {
            return {
              label: el.tlabel,
              value: formatNum(Number(el.tvalue)),
            }
          })
          state.cityList.push({ name: sub.label.split('-')[1], list: list })
        }
      }
    })
    state.activeItem = item
    state.dialogVisible = true
  }
  onBeforeMount(() => { })

  onMounted(() => {
    getALLData()
  })
  return {
    ...toRefs(state),
    handleClick,
  }
}