/*
 * @Author: rk
 * @Description: 字典数据api
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 16:33:48
 */
import request, { download } from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: '/system/dict/data/list',
    method: 'post',
    data
  })
}

// 查询字典数据详细
export function getData(query) {
  return request({
    url: '/system/dict/data/detail',
    method: 'get',
    params: query
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(query) {
  return request({
    url: '/system/dict/data/type/query',
    method: 'get',
    params: query
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data/add',
    method: 'post',
    data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data/edit',
    method: 'post',
    data
  })
}

// 删除字典数据
export function delData(data) {
  return request({
    url: '/system/dict/data/delete',
    method: 'post',
    data
  })
}

// 导出字典数据
export async function exportData(data) {
  // return request({
  //   url: '/system/dict/data/export',
  //   method: 'get',
  //   params: query
  // })
  await download('/system/dict/data/export', data)
}
