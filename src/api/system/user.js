/*
 * @Author: rk
 * @Description: 用户列表api
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 16:34:37
 */
import request, { downFile, download } from '@/utils/request'

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/system/user/list',
    method: 'post',
    data
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user/save',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user/update',
    method: 'post',
    data
  })
}

// 用户状态修改
export function changeUserStatus(data) {
  return request({
    url: '/system/user/updateStatus',
    method: 'post',
    data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/system/user/delete',
    method: 'post',
    data
  })
}

// 用户密码重置
export function resetUserPwd(data) {
  return request({
    url: '/system/user/resetPassword',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePassword(data, config) {
  return request({
    url: '/system/user/updatePassword',
    method: 'post',
    data,
    ...config
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/updateAvatar',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 导出用户
export async function exportUser(data) {
  await download('/system/user/export', data)
}

// 下载用户导入模板
export async function importTemplate(query) {
  await downFile('/system/user/downloadImportTemplate', { ...query })
  // return request({
  //   url: '/system/user/downloadImportTemplate',
  //   method: 'get',
  //   responseType: 'blob' //1.首先设置responseType对象格式为 blob:
  // })
}

// 用户文件导入
export function importUser(data) {
  return request({
    url: '/system/user/import',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 给用户分配角色
export function assignUserRole(data) {
  return request({
    url: '/system/permission/assignUserRole',
    method: 'post',
    data
  })
}

// 查询用户拥有的角色
export function queryRoleMenus(userId) {
  return request({
    url: '/system/permission/userRoles',
    method: 'post',
    data: { userId }
  })
}
