/*
 * @Author: rk
 * @Description: 动态路由管理
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-11-07 10:10:59
 */
import { ElLoading } from 'element-plus'
import { constantRoutes } from '@/router'
// import { getRouters } from '@/api/system/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import cache from '@/plugins/cache'
import { toCamelCase } from '@/utils'

// 全局loading
let systemLoadingInstance
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    commonlyUsedRoutes: [] // 常用路由
  }),
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes
    },
    // 生成路由
    generateRoutes() {
      return new Promise((resolve, reject) => {
        systemLoadingInstance = ElLoading.service({
          text: '正在拉取路由信息，请稍候'
        })
        // 向后端请求路由数据
        getRouters()
          .then((res) => {
            systemLoadingInstance.close()
            if (res) {
              const sdata = JSON.parse(JSON.stringify(res))
              const rdata = JSON.parse(JSON.stringify(res))
              const defaultData = JSON.parse(JSON.stringify(res))
              const sidebarRoutes = filterAsyncRouter(sdata)
              const rewriteRoutes = filterAsyncRouter(rdata, false, true)
              const defaultRoutes = filterAsyncRouter(defaultData)
              this.setRoutes(rewriteRoutes)
              this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
              this.setDefaultRoutes(sidebarRoutes)
              this.setTopbarRoutes(defaultRoutes)
              this.setCommonlyUsedRoutes()
              resolve(rewriteRoutes)
            } else {
              reject('获取路由信息失败')
            }
          })
          .catch(() => {
            systemLoadingInstance.close()
            reject('获取路由信息失败')
          })
      })
    },
    // 设置常用路由
    setCommonlyUsedRoutes() {
      var arraryObjectLocal = cache.local.getJSON('commonlyUseMenu') || []
      this.commonlyUsedRoutes = arraryObjectLocal
    },
    // 移除常用路由
    removeCommonlyUsedRoutes(item) {
      var routes = this.commonlyUsedRoutes

      const fi = routes.findIndex((v) => v.path === item.path)
      routes.splice(fi, 1)
      cache.local.setJSON('commonlyUseMenu', routes)
    }
  }
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    route.meta = {
      title: route.menuName,
      icon: route.icon,
      noCache: route.isCache !== 0
    }
    route.alwaysShow = false
    route.hidden = route.visible !== 0
    if (route.path && route.parentId === 0) {
      route.path = '/' + route.path
    }
    if (route.sectionName) {
      route.name = route.sectionName
    } else {
      // 路由地址转首字母大写驼峰，作为路由名称，适配 keepAlive
      route.name = toCamelCase(route.path, true)
      // 处理三级及以上菜单路由缓存问题，将 path 名字赋值给 name
      if (route.path && route.path.indexOf('/') !== -1) {
        const pathArr = route.path.split('/')
        route.name = toCamelCase(pathArr[pathArr.length - 1], true)
      }
    }
    if (route.children && route.children.length > 0) {
      // 父节点
      if (route.parentId === 0) {
        route.component = Layout
      } else {
        if (route.isFrame === 0) {
          route.component = InnerLink
        } else {
          route.component = ParentView
        }
      }
    } else {
      // 根节点
      route.component = loadView(route.component)
    }
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
      route.alwaysShow =
        route.alwaysShow !== undefined ? route.alwaysShow : true
    } else {
      delete route['children']
      delete route['redirect'] // 如果没有子菜单，就不需要考虑 alwaysShow 字段
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  let res

  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]

    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore
