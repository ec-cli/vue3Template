/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 租户管理api
 * @Date: 2023-08-22 09:10:48
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 16:34:27
 */
import request, { download } from '@/utils/request'

// 查询租户列表
export function listTenant(data) {
  return request({
    url: '/system/tenant/list',
    method: 'post',
    data
  })
}

// 新增租户
export function createTenant(data) {
  return request({
    url: '/system/tenant/save',
    method: 'post',
    data
  })
}

// 修改租户
export function updateTenant(data) {
  return request({
    url: '/system/tenant/update',
    method: 'post',
    data
  })
}

// 更新租户状态
export function updateStatus(data) {
  return request({
    url: '/system/tenant/updateStatus',
    method: 'post',
    data
  })
}

// 删除租户
export function deleteTenant(data) {
  return request({
    url: '/system/tenant/delete',
    method: 'post',
    data
  })
}

// 导出租户
export async function exportTenant(data) {
  await download('/system/tenant/export', data)
}
