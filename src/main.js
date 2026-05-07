/*
 * @Author: cxm
 * @LastEditors: wangmeng wm1259972249@163.com
 * @Date: 2022-09-27 10:29:49
 * @LastEditTime: 2025-08-12 17:14:00
 */
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import '@/assets/font/font.css'
import './element-variable.scss'
import ElementPlus from 'element-plus'
import styleVars from '@/assets/theme/style-vars.js'
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'
import '@/assets/css/common.scss'
import '@/assets/css/elementui-custom.scss'
import createDirectives from '@/directives'

// import vue3SeamlessScroll from "vue3-seamless-scroll";
/**
 * 后端联调时，没有实现相应的接口，需要将mock拦截打开，展示前台的mock数据，打开下面的注释即可（如果打包联调，在打包前打开注释）
 * 前端开发时不需要打开此代码
 */
console.log('process.env.VUE_APP_MOCK', process.env.VUE_APP_MOCK, process.env.VUE_APP_MOCK === 'true')
if (process.env.VUE_APP_MOCK === 'true') {
  const m = require('../mock-server/interceptor')
  console.warn(m)
}

const app = createApp(App)

// app.use(vue3SeamlessScroll);
// 全局挂载styleVars变量
app.config.globalProperties.$styleVars = styleVars
createDirectives(app)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')