/*
 * @Author: rk
 * @Description: 配置管理api
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-10-31 19:53:30
 */
import request, { download } from '@/utils/request'

// 查询参数列表
export function getConfigListApi(data) {
  return request({
    url: '/system/config/list',
    method: 'post',
    data
  })
}

// 修改参数配置
export function updateConfigApi(data) {
  return request({
    url: '/system/config/update',
    method: 'post',
    data
  })
}

// 导出参数配置
export async function exportConfigApi(data) {
  await download('/system/config/export', data)
}
