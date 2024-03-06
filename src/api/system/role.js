/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 角色管理api
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 12:04:17
 */
import request, { downFile } from '@/utils/request'

// 查询角色列表--分页
export function listRole(data) {
  return request({
    url: '/system/role/list',
    method: 'post',
    data
  })
}
// 查询角色列表-未分页
export function listAll(data) {
  return request({
    url: '/system/role/listAll',
    method: 'post',
    data
  })
}

// 新增角色
export const addRole = (data) => {
  return request({
    url: '/system/role/save',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

// 角色状态修改
export function changeRoleStatus(data) {
  return request({
    url: '/system/role/updateStatus',
    method: 'post',
    data
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    data
  })
}

// 查询角色拥有的菜单
export function queryRoleMenus(roleId) {
  return request({
    url: '/system/permission/roleMenus',
    method: 'post',
    data: { roleId }
  })
}

// 给角色分配菜单
export function assignRoleMenu(data) {
  return request({
    url: '/system/permission/assignRoleMenu',
    method: 'post',
    data
  })
}

// 导出角色
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  })
}
// 导出角色菜单
export async function exportRoleMenu(query) {
  await downFile('/system/role/exportRoleMenu', { ...query })
}
