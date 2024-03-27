<template>
  <el-drawer
    class="setting-drawer"
    v-model="showSettings"
    :withHeader="false"
    direction="rtl"
    size="350px">
    <div class="setting-drawer-title">
      <h3 class="drawer-title">主题风格设置</h3>
    </div>
    <!-- 主题风格设置 -->
    <div class="drawer-item">
      <el-radio-group v-model="mode" @change="handleModeChange(mode)">
        <el-radio label="light">明亮</el-radio>
        <el-radio label="dark">暗黑</el-radio>
        <el-radio label="cafe">色弱</el-radio>
        <el-radio label="gray">灰色</el-radio>
      </el-radio-group>
    </div>
    <el-divider />
    <!-- 系统风格设置 -->
    <h3 class="drawer-title">系统风格设置</h3>
    <!-- 顶部导航开关 -->
    <div class="drawer-item">
      <span>开启 顶部导航</span>
      <span class="comp-style">
        <el-switch v-model="topNav" class="drawer-switch" />
      </span>
    </div>
    <!-- Tags-Views开关 -->
    <div class="drawer-item">
      <span>开启 Tags-Views</span>
      <span class="comp-style">
        <el-switch v-model="tagsView" class="drawer-switch" />
      </span>
    </div>
    <!-- footer开关 -->
    <div class="drawer-item">
      <span>开启 底部栏</span>
      <span class="comp-style">
        <el-switch v-model="showFooter" class="drawer-switch" />
      </span>
    </div>
    <!-- 水印开关 -->
    <div class="drawer-item">
      <span>开启 水印</span>
      <span class="comp-style">
        <el-switch v-model="showWatermark" class="drawer-switch" />
      </span>
    </div>
    <!-- 是否固定header -->
    <!-- <div class="drawer-item">
      <span>固定 Header</span>
      <span class="comp-style">
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </span>
    </div> -->
    <!-- 是否显示logo -->
    <div class="drawer-item">
      <span>显示 Logo</span>
      <span class="comp-style">
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </span>
    </div>
    <!-- 是否显示菜单搜索 -->
    <div class="drawer-item">
      <span>显示 菜单搜索图标</span>
      <span class="comp-style">
        <el-switch v-model="showHeaderSearchIcon" class="drawer-switch" />
      </span>
    </div>
    <!-- 是否显示全屏 -->
    <div class="drawer-item">
      <span>显示 全屏图标</span>
      <span class="comp-style">
        <el-switch v-model="showScreenfullIcon" class="drawer-switch" />
      </span>
    </div>
    <!-- 是否显示系统配置图标 -->
    <div class="drawer-item">
      <span>显示 系统配置图标</span>
      <span class="comp-style">
        <el-switch v-model="showThemeIcon" class="drawer-switch" />
      </span>
    </div>
    <!-- 是否显示大小设置图标 -->
    <div class="drawer-item">
      <span>显示 大小设置图标</span>
      <span class="comp-style">
        <el-switch v-model="showSizeIcon" class="drawer-switch" />
      </span>
    </div>
    <!-- 是否显示语言设置图标 暂时不用 -->
    <!-- <div class="drawer-item">
      <span>显示 语言设置图标</span>
      <span class="comp-style">
        <el-switch v-model="showLangIcon" class="drawer-switch" />
      </span>
    </div> -->
    <!-- 是否显示消息通知图标 暂时不用 -->
    <!-- <div class="drawer-item">
      <span>显示 消息通知图标</span>
      <span class="comp-style">
        <el-switch v-model="showMessageIcon" class="drawer-switch" />
      </span>
    </div> -->
    <!-- 动态标题开关 -->
    <div class="drawer-item">
      <span>动态标题</span>
      <span class="comp-style">
        <el-switch v-model="dynamicTitle" class="drawer-switch" />
      </span>
    </div>

    <el-divider />

    <div class="text-c">
      <el-button type="primary" plain icon="DocumentAdd" @click="saveSetting"
        >保存配置</el-button
      >
      <el-button plain icon="Refresh" @click="resetSetting">重置配置</el-button>
    </div>
  </el-drawer>
</template>

<script setup>
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useDark, useCycleList, useColorMode } from '@vueuse/core'
import { useDynamicTitle } from '@/utils/dynamicTitle'
import { getLightColor } from '@/utils/index'
import { getmark } from '@/utils/wartermark'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission1'
import useUserStore from '@/store/modules/user'
const { proxy } = getCurrentInstance()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const showSettings = ref(false)
const theme = ref(settingsStore.theme)
const sideTheme = ref(settingsStore.sideTheme)
const storeSettings = computed(() => settingsStore)
const predefineColors = ref([
  '#5b84f5',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585'
])
const { setWatermark, removeWatermark } = getmark()
// 可以手动更改当前值 model.value = 'cafe'
const mode = useColorMode({
  modes: {
    // custom colors
    gray: 'gray',
    cafe: 'cafe'
  }
})
const { next } = useCycleList(['light', 'dark', 'cafe', 'gray'], {
  initialValue: mode
})
// const isDark = useDark()

/** 是否需要topnav */
const topNav = computed({
  get: () => storeSettings.value.topNav,
  set: (val) => {
    settingsStore.changeSetting({ key: 'topNav', value: val })
    if (!val) {
      appStore.toggleSideBarHide(false)
      permissionStore.setSidebarRouters(permissionStore.defaultRoutes)
    }
  }
})
/** 是否需要tagview */
const tagsView = computed({
  get: () => storeSettings.value.tagsView,
  set: (val) => {
    settingsStore.changeSetting({ key: 'tagsView', value: val })
  }
})
/**是否需要固定头部 */
const fixedHeader = computed({
  get: () => storeSettings.value.fixedHeader,
  set: (val) => {
    settingsStore.changeSetting({ key: 'fixedHeader', value: val })
  }
})
// 是否显示底部
const showFooter = computed({
  get: () => storeSettings.value.showFooter,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showFooter', value: val })
  }
})
/**是否需要侧边栏的logo */
const sidebarLogo = computed({
  get: () => storeSettings.value.sidebarLogo,
  set: (val) => {
    settingsStore.changeSetting({ key: 'sidebarLogo', value: val })
  }
})
/**是否显示菜单搜索 */
const showHeaderSearchIcon = computed({
  get: () => storeSettings.value.showHeaderSearchIcon,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showHeaderSearchIcon', value: val })
  }
})
/**是否显示全屏图标 */
const showScreenfullIcon = computed({
  get: () => storeSettings.value.showScreenfullIcon,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showScreenfullIcon', value: val })
  }
})
/**是否显示系统配置图标 */
const showThemeIcon = computed({
  get: () => storeSettings.value.showThemeIcon,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showThemeIcon', value: val })
  }
})
/**是否大小设置图标 */
const showSizeIcon = computed({
  get: () => storeSettings.value.showSizeIcon,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showSizeIcon', value: val })
  }
})
/**是否语言设置图标 */
const showLangIcon = computed({
  get: () => storeSettings.value.showLangIcon,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showLangIcon', value: val })
  }
})
/**是否消息通知图标 */
const showMessageIcon = computed({
  get: () => storeSettings.value.showMessageIcon,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showMessageIcon', value: val })
  }
})
/**是否需要侧边栏的动态网页的title */
const dynamicTitle = computed({
  get: () => storeSettings.value.dynamicTitle,
  set: (val) => {
    settingsStore.changeSetting({ key: 'dynamicTitle', value: val })
    // 动态设置网页标题
    useDynamicTitle()
  }
})
/**是否显示水印 */
const showWatermark = computed({
  get: () => storeSettings.value.showWatermark,
  set: (val) => {
    settingsStore.changeSetting({ key: 'showWatermark', value: val })
    changeWatermark()
  }
})

// 开启或关闭水印
const changeWatermark = () => {
  storeSettings.value.showWatermark
    ? setWatermark(useUserStore().userInfo.account)
    : removeWatermark()
}
changeWatermark()
// 监控主题颜色
// watch(
//   () => theme,
//   (val) => {
//     themeChange(val.value)
//   },
//   {
//     immediate: true
//   }
// )
watch(
  () => sideTheme,
  (val) => {
    const body = document.documentElement
    body.setAttribute('data-theme', '')
  },
  {
    immediate: true
  }
)
/**
 * 改变主题颜色
 */
function themeChange(val) {
  settingsStore.changeSetting({ key: 'theme', value: val })
  theme.value = val
  // 设置element-plus ui主题
  document.documentElement.style.setProperty('--el-color-primary', val)

  // 颜色变浅
  // for (let i = 1; i <= 9; i++) {
  //   document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor('#213d5b', i / 10)}`)
  // }
}
/**
 * 保存系统配置
 */
function saveSetting() {
  proxy.$modal.loading('正在保存到本地，请稍候...')
  let layoutSetting = {
    topNav: storeSettings.value.topNav,
    tagsView: storeSettings.value.tagsView,
    fixedHeader: storeSettings.value.fixedHeader,
    sidebarLogo: storeSettings.value.sidebarLogo,
    dynamicTitle: storeSettings.value.dynamicTitle,
    sideTheme: storeSettings.value.sideTheme,
    theme: storeSettings.value.theme,
    showFooter: storeSettings.value.showFooter,
    showWatermark: storeSettings.value.showWatermark,
    showHeaderSearchIcon: storeSettings.value.showHeaderSearchIcon,
    showScreenfullIcon: storeSettings.value.showScreenfullIcon,
    showThemeIcon: storeSettings.value.showThemeIcon,
    showSizeIcon: storeSettings.value.showSizeIcon,
    showLangIcon: storeSettings.value.showLangIcon,
    showMessageIcon: storeSettings.value.showMessageIcon
  }
  localStorage.setItem('layout-setting', JSON.stringify(layoutSetting))
  setTimeout(proxy.$modal.closeLoading(), 100)
  setTimeout('window.location.reload()', 200)
}
/**
 * 重置系统配置
 */
function resetSetting() {
  proxy.$modal.loading('正在清除设置缓存并刷新，请稍候...')
  localStorage.removeItem('layout-setting')
  setTimeout('window.location.reload()', 1000)
}
// 打开系统配置
function openSetting() {
  showSettings.value = true
}

// 主题切换
function handleModeChange(mode) {
  settingsStore.changeSetting({ key: 'systemTheme', value: mode })
}

defineExpose({
  openSetting
})
</script>

<style lang="scss" scoped>
.setting-drawer-title {
  margin-bottom: 12px;
  color: var(--base-text-color);
  line-height: 22px;
  font-weight: bold;
}
.drawer-title {
  color: var(--base-text-color);
}
.setting-drawer-block-checbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;

  .item {
    position: relative;
    margin-right: 16px;
    border-radius: 2px;
    cursor: pointer;

    img {
      width: 48px;
      height: 48px;
    }

    .custom-img {
      width: 48px;
      height: 38px;
      border-radius: 5px;
      box-shadow: 1px 1px 2px #898484;
    }

    .setting-drawer-block-checbox-selectIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-left: 24px;
      color: #1890ff;
      font-weight: 700;
      font-size: 14px;
    }
  }
}

.drawer-item {
  color: var(--base-text-color);
  padding: 12px 0;
  font-size: 14px;

  .comp-style {
    float: right;
    margin: -3px 8px 0px 0px;
  }
  .quick-color-wrap {
    display: flex;
    align-items: center;

    span {
      width: 15px;
      height: 15px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
