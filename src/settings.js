/*
 * @Author: tuoyouxin@fpwis.com
 * @Description:
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: tuoyouxin@fpwis.com
 * @LastEditTime: 2023-12-21 10:22:50
 */
export default {
  /**
   * 系统版本号
   */
  version: '1.0.0',
  /**
   * 网页标题
   */
  title: import.meta.env.VITE_APP_TITLE,
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',
  /**
   * 框架主题颜色值
   */
  theme: '#5b84f5',
  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: true,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: true,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  /**
   * 版权信息
   */
  copyright: 'Copyright ©2023 数据资源聚合管理平台 All Rights Reserved.',
  /**
   * 是否显示底部栏
   */
  showFooter: true,
  /**
   * 是否显示水印
   */
  showWatermark: false,
  /**
   * 是否显示其他登录
   */
  showOtherLogin: false,
  /**
   * 默认大小
   */
  defaultSize: 'small',
  /**
   * 默认语言
   */
  defaultLang: 'zh-cn',
  /**
   * 是否显示菜单搜索图标
   */
  showHeaderSearchIcon: true,
  /**
   * 是否显示全屏图标
   */
  showScreenfullIcon: true,
  /**
   * 是否显示主题设置图标
   */
  showThemeIcon: true,
  /**
   * 是否显示大小设置图标
   */
  showSizeIcon: true,
  /**
   * 是否显示语言设置图标
   */
  showLangIcon: false,
  /**
   * 是否显示消息图标
   */
  showMessageIcon: false
}
