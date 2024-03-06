/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 菜单管理api
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 16:33:09
 */
import request from '@/utils/request'

// 查询菜单列表
export function listMenu(data) {
  return request({
    url: '/system/menu/list',
    method: 'post',
    data
  })
}

// 查询菜单下拉树结构
export function treeselect(data) {
  return request({
    url: '/system/menu/listMenuTree',
    method: 'post',
    data
  })
}

// 新增菜单
export const addMenu = (data) => {
  return request({
    url: '/system/menu/save',
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu/update',
    method: 'post',
    data
  })
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: '/system/menu/delete',
    method: 'post',
    data
  })
}

// 更新菜单状态
export function updateStatus(data) {
  return request({
    url: '/system/menu/updateStatus',
    method: 'post',
    data
  })
}

// 获取当前登录用户路由菜单
export const getRouters = () => {
  return request({
    url: '/system/menu/listSidebar',
    method: 'post'
  })
}
