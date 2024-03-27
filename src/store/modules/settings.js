/*
 * @Author: rk
 * @Description:
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-12-11 18:13:19
 */
import cache from '@/plugins/cache'
import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'

const {
  sideTheme,
  theme,
  showSettings,
  topNav,
  tagsView,
  fixedHeader,
  sidebarLogo,
  dynamicTitle,
  showFooter,
  showWatermark,
  showHeaderSearchIcon,
  showScreenfullIcon,
  showThemeIcon,
  showSizeIcon,
  showLangIcon,
  showMessageIcon
} = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '', // 页面标题
    systemTheme: cache.local.get('vueuse-color-scheme') || 'light', // 系统主题
    theme: storageSetting.theme || theme, // 主题
    sideTheme: storageSetting.sideTheme || sideTheme, // 菜单栏主题
    showSettings: showSettings, // 是否显示系统布局设置
    topNav:
      storageSetting.topNav === undefined ? topNav : storageSetting.topNav, // 是否显示顶部导航
    tagsView:
      storageSetting.tagsView === undefined
        ? tagsView
        : storageSetting.tagsView, // 是否显示 tagsView
    fixedHeader:
      storageSetting.fixedHeader === undefined
        ? fixedHeader
        : storageSetting.fixedHeader, // 是否固定头部
    sidebarLogo:
      storageSetting.sidebarLogo === undefined
        ? sidebarLogo
        : storageSetting.sidebarLogo, // 是否显示logo
    dynamicTitle:
      storageSetting.dynamicTitle === undefined
        ? dynamicTitle
        : storageSetting.dynamicTitle, // 是否显示动态标题
    showFooter:
      storageSetting.showFooter === undefined
        ? showFooter
        : storageSetting.showFooter, // 是否显示footer
    showWatermark:
      storageSetting.showWatermark === undefined
        ? showWatermark
        : storageSetting.showWatermark, // 是否显示水印
    showHeaderSearchIcon:
      storageSetting.showHeaderSearchIcon === undefined
        ? showHeaderSearchIcon
        : storageSetting.showHeaderSearchIcon, // 是否显示菜单搜索图标
    showScreenfullIcon:
      storageSetting.showScreenfullIcon === undefined
        ? showScreenfullIcon
        : storageSetting.showScreenfullIcon, // 是否显示全屏图标
    showThemeIcon:
      storageSetting.showThemeIcon === undefined
        ? showThemeIcon
        : storageSetting.showThemeIcon, // 是否显示主题设置图标
    showSizeIcon:
      storageSetting.showSizeIcon === undefined
        ? showSizeIcon
        : storageSetting.showSizeIcon, // 是否显示大小设置图标
    showLangIcon:
      storageSetting.showLangIcon === undefined
        ? showLangIcon
        : storageSetting.showLangIcon, // 是否显示语言设置图标
    showMessageIcon:
      storageSetting.showMessageIcon === undefined
        ? showMessageIcon
        : storageSetting.showMessageIcon, // 是否显示消息图标
    sideWidth: localStorage.getItem('sideWidth') || 235 // 左侧菜单栏宽度
  }),
  actions: {
    // 修改布局设置
    changeSetting(data) {
      const { key, value } = data
      if (Object.prototype.hasOwnProperty.call(this.$state, key)) {
        this[key] = value
      }
    },
    // 设置网页标题
    setTitle(title) {
      this.title = title
      useDynamicTitle()
    },
    // 设置左侧菜单栏宽度
    setSideWidth(data) {
      this.sideWidth = data
      localStorage.setItem('sideWidth', data)
    }
  }
})
export default useSettingsStore
