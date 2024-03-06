/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 动态路由管理
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-27 09:10:49
 */
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/system/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import cache from '@/plugins/cache'

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
      return new Promise((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          console.log(res)
          //   const sdata = JSON.parse(JSON.stringify(res.data))
          //   const rdata = JSON.parse(JSON.stringify(res.data))
          //   const defaultData = JSON.parse(JSON.stringify(res.data))
          //   const sidebarRoutes = filterAsyncRouter(sdata)
          //   const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          //   const defaultRoutes = filterAsyncRouter(defaultData)
          //   this.setRoutes(rewriteRoutes)
          //   this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          //   this.setDefaultRoutes(sidebarRoutes)
          //   this.setTopbarRoutes(defaultRoutes)
          //   this.setCommonlyUsedRoutes()
          //   resolve(rewriteRoutes)
        })
        const res = {
          code: 200,
          msg: 'success',
          data: [
            {
              alwaysShow: true,
              hidden: false,
              name: 'dataAnalysis',
              path: '/data-analysis',
              redirect: 'noRedirect',
              meta: {
                title: '数据分析',
                icon: 'monitor',
                noCache: false,
                titleKey: 'menu.monitoring',
                link: ''
              },
              children: [
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'analysisShanxi',
                  path: 'shanxi',
                  redirect: null,
                  meta: {
                    title: '山西',
                    icon: 'log',
                    noCache: false,
                    titleKey: 'menu.systemLog1',
                    link: ''
                  },
                  component: 'ParentView',
                  children: [
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sxAnalysisPublic',
                      path: 'public',
                      redirect: 'noRedirect',
                      meta: {
                        title: '披露数据',
                        icon: 'list',
                        noCache: false,
                        titleKey: 'menu.articleList',
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: true,
                          hidden: false,
                          name: 'sxAnalysisRecentMarket',
                          path: 'recent-market',
                          redirect: null,
                          meta: {
                            title: '日前市场披露',
                            icon: '',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'ParentView',
                          children: [
                            {
                              alwaysShow: false,
                              hidden: false,
                              name: 'sxUniformLoad',
                              path: 'uniform-load',
                              redirect: null,
                              meta: {
                                title: '统调负荷预测',
                                icon: '',
                                noCache: false,
                                titleKey: 'menu.articleList',
                                link: ''
                              },
                              component:
                                'dataAnalysis/shanxi/public/recentMarket/uniformLoad'
                            },
                            {
                              alwaysShow: false,
                              hidden: false,
                              name: 'sxNewEnergyLoad',
                              path: 'new-energy-load',
                              redirect: null,
                              meta: {
                                title: '新能源出力预测',
                                icon: '',
                                noCache: false,
                                titleKey: 'menu.articleList',
                                link: ''
                              },
                              component:
                                'dataAnalysis/shanxi/public/recentMarket/newEnergyLoad'
                            }
                          ]
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxAnalysisRealMarket',
                          path: 'real-market',
                          redirect: null,
                          meta: {
                            title: '实时市场披露',
                            icon: '',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shanxi/public/realTimeMarket/index'
                        },
                        {
                          alwaysShow: true,
                          hidden: false,
                          name: 'sxAnalysisEelecRealValue',
                          path: 'elec-real-value',
                          redirect: null,
                          meta: {
                            title: '电网实际运行值',
                            icon: '',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'ParentView',
                          children: [
                            {
                              alwaysShow: false,
                              hidden: false,
                              name: 'sxSystemLoad',
                              path: 'system-load',
                              redirect: null,
                              meta: {
                                title: '系统负荷实际值',
                                icon: '',
                                noCache: false,
                                titleKey: 'menu.articleList',
                                link: ''
                              },
                              component:
                                'dataAnalysis/shanxi/public/elecRealValue/systemLoad'
                            },
                            {
                              alwaysShow: false,
                              hidden: false,
                              name: 'sxOutgoActuals',
                              path: 'outgo-actuals',
                              redirect: null,
                              meta: {
                                title: '外送实际值',
                                icon: '',
                                noCache: false,
                                titleKey: 'menu.articleList',
                                link: ''
                              },
                              component:
                                'dataAnalysis/shanxi/public/elecRealValue/outgoActuals'
                            },
                            {
                              alwaysShow: false,
                              hidden: false,
                              name: 'sxWindPowerActuals',
                              path: 'wind-power-actuals',
                              redirect: null,
                              meta: {
                                title: '风电实际值',
                                icon: '',
                                noCache: false,
                                titleKey: 'menu.articleList',
                                link: ''
                              },
                              component:
                                'dataAnalysis/shanxi/public/elecRealValue/windPowerActuals'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sxAnalysisClear',
                      path: 'clear',
                      redirect: null,
                      meta: {
                        title: '出清数据',
                        icon: 'tree-table',
                        noCache: false,
                        titleKey: null,
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxAnalysisOverview',
                          path: 'overview',
                          redirect: null,
                          meta: {
                            title: '市场概况',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'dataAnalysis/shanxi/clear/overview/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxAnalysisSpotPrice',
                          path: 'spot-price',
                          redirect: null,
                          meta: {
                            title: '全网现货价格',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'dataAnalysis/shanxi/clear/spotPrice/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxAnalysisNodePrice',
                          path: 'node-price',
                          redirect: null,
                          meta: {
                            title: '节点价格',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'dataAnalysis/shanxi/clear/nodePrice/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxAnalysisClearElec',
                          path: 'clear-elec',
                          redirect: null,
                          meta: {
                            title: '现货出清电量',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'dataAnalysis/shanxi/clear/clearElec/index'
                        }
                      ]
                    }
                  ]
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'analysisShandong',
                  path: 'shandong',
                  redirect: null,
                  meta: {
                    title: '山东',
                    icon: 'log',
                    noCache: false,
                    titleKey: 'menu.systemLog1',
                    link: ''
                  },
                  component: 'ParentView',
                  children: [
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sdAnalysisPublic',
                      path: 'public',
                      redirect: 'noRedirect',
                      meta: {
                        title: '披露数据',
                        icon: 'list',
                        noCache: false,
                        titleKey: 'menu.articleList',
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisRecentMarket',
                          path: 'recent-market',
                          redirect: null,
                          meta: {
                            title: '日前市场披露',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/public/recentMarket/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisRealMarket',
                          path: 'real-market',
                          redirect: null,
                          meta: {
                            title: '实时市场披露',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/public/realMarket/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisEelecRealValue',
                          path: 'elec-real-value',
                          redirect: null,
                          meta: {
                            title: '电网实际运行值',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/public/elecRealValue/index'
                        }
                      ]
                    },
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sdAnalysisClear',
                      path: 'clear',
                      redirect: null,
                      meta: {
                        title: '出清数据',
                        icon: 'tree-table',
                        noCache: false,
                        titleKey: null,
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisOverview',
                          path: 'overview',
                          redirect: null,
                          meta: {
                            title: '市场概况',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/clear/overview/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisSpotPrice',
                          path: 'spot-price',
                          redirect: null,
                          meta: {
                            title: '全网现货价格',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/clear/spotPrice/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisNodePrice',
                          path: 'node-price',
                          redirect: null,
                          meta: {
                            title: '节点价格',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/clear/nodePrice/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdAnalysisClearElec',
                          path: 'clear-elec',
                          redirect: null,
                          meta: {
                            title: '现货出清电量',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataAnalysis/shandong/clear/clearElec/index'
                        }
                      ]
                    }
                  ]
                }
              ],
              component: 'Layout'
            },
            {
              alwaysShow: true,
              hidden: false,
              name: 'dataManage',
              path: '/data-manage',
              redirect: 'noRedirect',
              meta: {
                title: '数据管理',
                icon: 'tool',
                noCache: false,
                titleKey: 'menu.systemTools',
                link: ''
              },
              children: [
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'shanxi',
                  path: 'shanxi',
                  redirect: null,
                  meta: {
                    title: '山西',
                    icon: 'log',
                    noCache: false,
                    titleKey: 'menu.systemLog1',
                    link: ''
                  },
                  component: 'ParentView',
                  children: [
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sxPublic',
                      path: 'public',
                      redirect: 'noRedirect',
                      meta: {
                        title: '披露数据',
                        icon: 'list',
                        noCache: false,
                        titleKey: 'menu.articleList',
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxRecentMarket',
                          path: 'recent-market',
                          redirect: null,
                          meta: {
                            title: '日前市场披露',
                            icon: 'list',
                            noCache: true,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataManage/shanxi/public/recentMarket/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxRealTimeMarket',
                          path: 'real-market',
                          redirect: null,
                          meta: {
                            title: '实时市场披露',
                            icon: 'list',
                            noCache: true,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataManage/shanxi/public/realTimeMarket/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxEelecRealValue',
                          path: 'elec-real-value',
                          redirect: null,
                          meta: {
                            title: '电网实际运行值',
                            icon: 'list',
                            noCache: true,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataManage/shanxi/public/elecRealValue/index'
                        }
                      ]
                    },
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sxClear',
                      path: 'clear',
                      redirect: null,
                      meta: {
                        title: '出清数据',
                        icon: 'tree-table',
                        noCache: false,
                        titleKey: null,
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sxClearData',
                          path: 'clear-data',
                          redirect: null,
                          meta: {
                            title: '出清数据',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'dataManage/shanxi/clear/clearData/index'
                        }
                      ]
                    }
                  ]
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'shandong',
                  path: 'shandong',
                  redirect: null,
                  meta: {
                    title: '山东',
                    icon: 'log',
                    noCache: false,
                    titleKey: 'menu.systemLog1',
                    link: ''
                  },
                  component: 'ParentView',
                  children: [
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sdPublic',
                      path: 'public',
                      redirect: 'noRedirect',
                      meta: {
                        title: '披露数据',
                        icon: 'list',
                        noCache: false,
                        titleKey: 'menu.articleList',
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdRrecentMarket',
                          path: 'recent-market',
                          redirect: null,
                          meta: {
                            title: '日前市场披露',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataManage/shandong/public/recentMarket/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdRealTimeMarket',
                          path: 'real-market',
                          redirect: null,
                          meta: {
                            title: '实时市场披露',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataManage/shandong/public/realTimeMarket/index'
                        },
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdElecRealValue',
                          path: 'elec-real-value',
                          redirect: null,
                          meta: {
                            title: '电网实际运行值',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component:
                            'dataManage/shandong/public/elecRealValue/index'
                        }
                      ]
                    },
                    {
                      alwaysShow: true,
                      hidden: false,
                      name: 'sdClear',
                      path: 'clear',
                      redirect: null,
                      meta: {
                        title: '出清数据',
                        icon: 'tree-table',
                        noCache: false,
                        titleKey: null,
                        link: ''
                      },
                      component: 'ParentView',
                      children: [
                        {
                          alwaysShow: false,
                          hidden: false,
                          name: 'sdClearData',
                          path: 'clear-data',
                          redirect: null,
                          meta: {
                            title: '出清数据',
                            icon: 'list',
                            noCache: false,
                            titleKey: 'menu.articleList',
                            link: ''
                          },
                          component: 'dataManage/shandong/clear/clearData/index'
                        }
                      ]
                    }
                  ]
                }
              ],
              component: 'Layout'
            },
            {
              alwaysShow: true,
              hidden: false,
              name: 'system',
              path: '/system',
              redirect: 'noRedirect',
              meta: {
                title: '系统设置',
                icon: 'system',
                noCache: false,
                titleKey: 'menu.system',
                link: ''
              },
              children: [
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'user',
                  path: 'user',
                  redirect: null,
                  meta: {
                    title: '用户管理',
                    icon: 'user',
                    noCache: false,
                    titleKey: 'menu.systemUser',
                    link: ''
                  },
                  component: 'system/user/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'role',
                  path: 'role',
                  redirect: null,
                  meta: {
                    title: '角色管理',
                    icon: 'peoples',
                    noCache: false,
                    titleKey: 'menu.systemRole',
                    link: ''
                  },
                  component: 'system/role/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'menu',
                  path: 'menu',
                  redirect: null,
                  meta: {
                    title: '菜单管理',
                    icon: 'tree-table',
                    noCache: false,
                    titleKey: 'menu.systemMenu',
                    link: ''
                  },
                  component: 'system/menu/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'dept',
                  path: 'dept',
                  redirect: null,
                  meta: {
                    title: '部门管理',
                    icon: 'tree',
                    noCache: false,
                    titleKey: 'menu.systemDept',
                    link: ''
                  },
                  component: 'system/dept/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'post',
                  path: 'post',
                  redirect: null,
                  meta: {
                    title: '岗位管理',
                    icon: 'post',
                    noCache: false,
                    titleKey: 'menu.systemPost',
                    link: ''
                  },
                  component: 'system/post/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'dict',
                  path: 'dict',
                  redirect: null,
                  meta: {
                    title: '字典管理',
                    icon: 'dict',
                    noCache: false,
                    titleKey: 'menu.systemDic',
                    link: ''
                  },
                  component: 'system/dict/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'notice',
                  path: 'notice',
                  redirect: null,
                  meta: {
                    title: '通知公告',
                    icon: 'message',
                    noCache: false,
                    titleKey: 'menu.systemNotice',
                    link: ''
                  },
                  component: 'system/notice/index'
                },
                {
                  alwaysShow: true,
                  hidden: false,
                  name: 'log',
                  path: 'log',
                  redirect: 'noRedirect',
                  meta: {
                    title: '日志管理',
                    icon: 'log',
                    noCache: false,
                    titleKey: 'menu.systemLog',
                    link: ''
                  },
                  children: [
                    {
                      alwaysShow: false,
                      hidden: false,
                      name: 'operlog',
                      path: 'operlog',
                      redirect: null,
                      meta: {
                        title: '操作日志',
                        icon: 'form',
                        noCache: false,
                        titleKey: 'menu.operLog',
                        link: ''
                      },
                      component: 'monitor/operlog/index'
                    },
                    {
                      alwaysShow: false,
                      hidden: false,
                      name: 'logininfor',
                      path: 'logininfor',
                      redirect: null,
                      meta: {
                        title: '登录日志',
                        icon: 'logininfor',
                        noCache: false,
                        titleKey: 'menu.loginLog',
                        link: ''
                      },
                      component: 'monitor/logininfor/index'
                    }
                  ],
                  component: 'ParentView'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'config',
                  path: 'config',
                  redirect: null,
                  meta: {
                    title: '参数设置333',
                    icon: 'edit',
                    noCache: false,
                    titleKey: 'menu.systemParam',
                    link: ''
                  },
                  component: 'system/config/index'
                },
                {
                  alwaysShow: false,
                  hidden: false,
                  name: 'commonlang',
                  path: 'CommonLang',
                  redirect: null,
                  meta: {
                    title: '多语言配置',
                    icon: 'language',
                    noCache: false,
                    titleKey: 'menu.systemLang',
                    link: ''
                  },
                  component: 'system/commonLang/index'
                }
              ],
              component: 'Layout'
            }
          ]
        }
        console.log(res.data)
        const sdata = JSON.parse(JSON.stringify(res.data))
        const rdata = JSON.parse(JSON.stringify(res.data))
        const defaultData = JSON.parse(JSON.stringify(res.data))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        const defaultRoutes = filterAsyncRouter(defaultData)
        this.setRoutes(rewriteRoutes)
        this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
        this.setDefaultRoutes(sidebarRoutes)
        this.setTopbarRoutes(defaultRoutes)
        this.setCommonlyUsedRoutes()
        resolve(rewriteRoutes)
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
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
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
