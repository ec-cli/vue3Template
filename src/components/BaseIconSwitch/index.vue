<!--
 * @Author: rk
 * @Description: icon 切换
 * @Date: 2023-09-05 09:27:50
 * @LastEditors: rk
 * @LastEditTime: 2023-09-05 10:45:46
-->

<template>
  <div class="module-content-top">
    <div @click="handleIconChange(0)">
      <SvgIcon name="yuce" :class="{ active: !modelValue }" />
    </div>
    <div @click="handleIconChange(1)">
      <SvgIcon name="table" :class="{ active: modelValue }" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['update:modelValue', 'handle-icon-change'])

const handleIconChange = (iconType) => {
  emits('update:modelValue', iconType)
  emits('handle-icon-change', iconType)
}
</script>

<style lang="scss" scoped>
.module-content-top {
  line-height: 40px;
  display: flex;
  justify-content: right;
  .svg-icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    transition: 0.2s;
    margin: 0 5px;
    color: var(--base-text-color);
    &.active {
      color: var(--el-color-primary);
    }
    &:hover {
      transition: 0.2s;
      color: var(--el-color-primary);
    }
  }
}
</style>
