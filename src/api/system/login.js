/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 登录、登出、注册等接口
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-27 10:00:24
 */
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/system/auth/login',
    method: 'POST',
    data
  })
}

// 刷新token令牌
export function updateToken(data) {
  return request({
    url: '/system/auth/refreshToken',
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/permission/getPermissionInfo',
    method: 'post'
  })
}

// 退出
export function logout() {
  return request({
    url: '/system/auth/logout',
    method: 'post'
  })
}

// 获取人机验证码
export function getCaptcha(data) {
  return request({
    url: '/system/captcha/get',
    method: 'post',
    data
  })
}

// 校验验证码
export function checkCaptcha(data) {
  return request({
    url: '/system/captcha/check',
    method: 'post',
    data
  })
}

// 获取验证码类型
export function getCaptchaTypeApi(data) {
  return request({
    url: '/system/captcha/type',
    method: 'post',
    data
  })
}

/**
 * 注册
 * @returns
 */
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

/**
 * 三方授权回调
 * @param {*} data
 * @param {*} params
 * @returns
 */
export function oauthCallback(data, params) {
  return request({
    url: '/auth/callback',
    method: 'post',
    data,
    params
  })
}
