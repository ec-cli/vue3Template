/*
 * @Author: rk
 * @Description: 路由鉴权
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 15:11:21
 */
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
NProgress.configure({ showSpinner: false })

const whiteList = [
  '/login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/socialLogin'
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (useUserStore().roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        useUserStore()
          .getInfo()
          .then(() => {
            usePermissionStore()
              .generateRoutes()
              .then((accessRoutes) => {
                // 根据roles权限生成可访问的路由表
                accessRoutes.forEach((route) => {
                  if (!isHttp(route.path)) {
                    router.addRoute(route) // 动态添加可访问路由表
                  }
                })
                router.addRoute({
                  path: '/:pathMatch(.*)*',
                  redirect: '/404',
                  hidden: true
                })
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
          })
          .catch((err) => {
            useUserStore()
              .logOut()
              .then(() => {
                // ElMessage.error(err != undefined ? err : '登录失败')
                next({ path: '/' })
              })
          })
      } else {
        if (
          useUserStore().isWeakPassword === 'true' &&
          to.path !== '/update-password'
        ) {
          next({ path: '/update-password' })
        } else {
          next()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      console.log('to login')
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
