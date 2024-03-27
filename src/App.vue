<!--
 * @Author: rk
 * @Description: 入口
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-19 10:05:48
-->
<template>
  <el-config-provider :size="size">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import useAppStore from './store/modules/app'
import { ElConfigProvider } from 'element-plus'
import defaultSettings from '@/settings'

const size = ref(defaultSettings.defaultSize)
size.value = useAppStore().size
</script>
