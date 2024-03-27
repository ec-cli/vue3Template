/*
 * @Author: rk
 * @Description:
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 18:11:22
 */
import { createApp } from 'vue'
import 'default-passive-events'
import '@/assets/styles/index.scss' // global css
import ElementPlus from 'element-plus'

import App from './App'
import router from './router'
import directive from './directive' // directive
// 注册指令
import plugins from './plugins' // plugins
import { downFile } from '@/utils/request'
import signalR from '@/utils/signalR'
import pinia from '@/store/index'

// svg图标
import '@/assets/iconfont/iconfont.js' //iconfont
import 'virtual:svg-icons-register'
import elementIcons from '@/components/SvgIcon/svgicon'
// el-date-picker 快捷选项
import dateOptions from '@/utils/dateOptions'

import './permission' // permission control

import { getDicts } from '@/api/system/dict/data'
import {
  resetForm,
  handleTree,
  selectDictLabel,
  downloadFile
} from '@/utils/index'
import { parseTime, addDateRange } from '@/utils/date'
import components from '@/components/index.js'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
// signalR.init(import.meta.env.VITE_APP_SOCKET_API)
// app.config.globalProperties.signalr = signalR
// 全局方法挂载
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.downloadFile = downloadFile
app.config.globalProperties.downFile = downFile
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.dateOptions = dateOptions

directive(app)

app
  .use(pinia)
  .use(router)
  .use(plugins)
  .use(components)
  .use(elementIcons)
  .use(ElementPlus, {
    locale: zhLocale
  })
  .mount('#app')
