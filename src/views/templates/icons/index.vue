<!--
 * @Author: rk
 * @Description: 模板icon
 * @Date: 2023-10-08 16:18:36
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 10:20:59
-->
<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="svg Icons">
        <div class="item" v-for="item of svgIconList" :key="item">
          <el-tooltip placement="top">
            <template #content> {{ generateIconCode(item) }} </template>
            <div class="icon-item" @click="handlerIconClick(1, item)">
              <SvgIcon style="height: 26px; width: 26px" :name="item" />
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div v-for="item of elementIcons" :key="item">
          <el-tooltip placement="top">
            <template #content> {{ generateElementIconCode(item) }} </template>
            <div class="icon-item" @click="handlerIconClick(2, item)">
              <el-icon><component :is="item" /></el-icon>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="icons">
import icons from '@/components/IconSelect/requireIcons'
import * as elIcons from '@element-plus/icons-vue'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
const { proxy } = getCurrentInstance()

const svgIconList = ref(icons)
const elementIcons = ref([])

for (const key in elIcons) {
  elementIcons.value.push(key)
}

const generateIconCode = (symbol) => {
  return `<SvgIcon name="${symbol}" />`
}
const generateElementIconCode = (symbol) => {
  return `<el-icon><${symbol} /></el-icon>`
}

// 图标点击
const handlerIconClick = (type, val) => {
  if (type === 1) {
    copyText(generateIconCode(val))
  } else {
    copyText(generateElementIconCode(val))
  }
}

const copyText = async (val) => {
  try {
    await toClipboard(val)
    proxy.$modal.msgSuccess('复制成功！')
  } catch (e) {
    console.log(e).msgError('当前浏览器不支持')
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  overflow: hidden;

  .icon-item,
  .item {
    margin: 20px;
    height: 60px;
    text-align: center;
    width: 60px;
    float: left;
    font-size: 30px;
    color: var(--base-text-color);
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
  .disabled {
    pointer-events: none;
  }
}
</style>
