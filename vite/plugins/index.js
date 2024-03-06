/*
 * @Author: rk
 * @Description:
 * @Date: 2023-10-18 18:28:24
 * @LastEditors: rk
 * @LastEditTime: 2023-12-12 19:31:43
 */
import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import eslint from 'vite-plugin-eslint' // 新增

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  // vitePlugins.push(eslint())
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
