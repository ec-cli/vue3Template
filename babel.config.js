/*
 * @Author: yangchenguang
 * @Description: 配置可选链
 * @Date: 2023-10-08 10:21:18
 * @LastEditors: yangchenguang
 * @LastEditTime: 2023-10-08 10:21:22
 */

module.exports = {
  presets: ['@vitejs/plugin-vue'],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining'
  ]
}
