/*
 * @Author: rk
 * @Description: 字典类型api
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-10-31 19:53:30
 */
import request, { download } from '@/utils/request'

// 查询字典类型列表
export function listType(data) {
  return request({
    url: '/system/dict/type/list',
    method: 'post',
    data
  })
}

// 查询字典类型详细
export function getType(data) {
  return request({
    url: '/system/dict/type/getInfo',
    method: 'post',
    data
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/system/dict/type/add',
    method: 'post',
    data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/system/dict/type/edit',
    method: 'post',
    data
  })
}

// 删除字典类型
export function delType(data) {
  return request({
    url: '/system/dict/type/delete',
    method: 'post',
    data
  })
}

// 导出字典类型
export async function exportType(data) {
  // return request({
  //   url: '/system/dict/type/export',
  //   method: 'get',
  //   params: query
  // })
  await download('/system/dict/type/export', data)
}
