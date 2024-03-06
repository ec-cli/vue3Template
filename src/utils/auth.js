/*
 * @Author: rk
 * @Description: cookie方法封装
 * @Date: 2023-10-20 11:56:26
 * @LastEditors: rk
 * @LastEditTime: 2023-11-08 17:46:54
 */
import Cookies from 'js-cookie'

const accessToken = 'dataPlatToken' // 短token 用于交互
const refreshToken = 'refreshToken' // 长token 用于刷新令牌
const isWeakPassword = 'isWeakPassword' // 用户是否使用初始密码登录

export function getToken() {
  return Cookies.get(accessToken)
}

export function getIsWeakPassword() {
  return Cookies.get(isWeakPassword)
}

export function setIsWeakPassword(isInitialPassword) {
  return Cookies.set(isWeakPassword, isInitialPassword)
}

export function removeIsWeakPassword() {
  return Cookies.remove(isWeakPassword)
}

export function setToken(token) {
  return Cookies.set(accessToken, token)
}

export function removeToken() {
  return Cookies.remove(accessToken)
}

export function getRefreshToken() {
  return Cookies.get(refreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshToken, token)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshToken)
}
