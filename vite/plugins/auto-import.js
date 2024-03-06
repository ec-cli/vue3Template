/*
 * @Author: rk
 * @Description:
 * @Date: 2023-10-18 18:28:24
 * @LastEditors: rk
 * @LastEditTime: 2023-12-12 19:28:17
 */
import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: 'src/auto-import.d.ts', // 生成 `auto-import.d.ts` 全局声明
    eslintrc: {
      enabled: true
    }
  })
}
