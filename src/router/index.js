import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import store from '../store'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (store.getters.name.length === 0) {
    // 判断当前用户是否已拉取完user_info信息
    store
      .dispatch('GetInfo')
      .then(() => {
        store.dispatch('GenerateRoutes').then((accessRoutes) => {
          // 根据roles权限生成可访问的路由表
          router.addRoute(accessRoutes[0]) // 动态添加可访问路由表
          console.log('accessRoutes::::::', accessRoutes)
          console.log(router.options.routes, '====route============')
          next({
            ...to,
            replace: true,
          })
        })
      })
      .catch((err) => {
        store.dispatch('LogOut').then(() => {
          console.log(err)
          next({
            path: '/',
          })
        })
      })
  } else {
    next()
  }
})

router.onError((error) => {
  console.error('router:', error)
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
  window.scrollTo(0, 0)
})

export default router
