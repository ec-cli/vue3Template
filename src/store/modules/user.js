/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 用户登录信息管理
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-27 10:07:37
 */
import { ElLoading } from 'element-plus'
import {
  login,
  logout,
  updateToken,
  getInfo,
  oauthCallback
} from '@/api/system/login'
import {
  getToken,
  getIsWeakPassword,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  setIsWeakPassword,
  removeRefreshToken,
  removeIsWeakPassword
} from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg' // 默认头像
import cache from '@/plugins/cache'

// 全局loading
let systemLoadingInstance

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: '', // 用户信息
    userId: 0, // 用户id
    authSource: '', // 用户登录源
    userName: '', // 用户账号
    name: '', // 用户昵称
    avatar: '', // 头像
    token: getToken(), // accessToken 用于业务交互
    isWeakPassword: getIsWeakPassword(), // 用户是否使用初始密码登录
    refreshToken: getRefreshToken(), // refreshToken 用于刷新令牌
    roles: [], // 角色列表
    permissions: [] // 权限列表
  }),
  actions: {
    // 设置用户登录源
    setAuthSource(source) {
      this.authSource = source
    },
    // 登录
    login(userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            if (res) {
              if (res.errorCode === 500001) {
                resolve(res) // then处理
              } else {
                setToken(res.accessToken)
                setRefreshToken(res.refreshToken)
                this.token = res.accessToken
                this.refreshToken = res.refreshToken
                setIsWeakPassword(res.isWeakPassword)
                this.isWeakPassword = res.isWeakPassword + ''
                resolve(res) // then处理
              }
            } else {
              reject(false) // catch处理
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 刷新token令牌
    updateToken() {
      const params = {
        refreshToken: this.refreshToken
      }
      return new Promise((resolve, reject) => {
        updateToken(params)
          .then((res) => {
            if (res) {
              setToken(res.accessToken)
              setRefreshToken(res.refreshToken)
              this.token = res.accessToken
              this.refreshToken = res.refreshToken
              resolve(res)
            } else {
              reject(false)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     * 三方授权登录 暂时用不到
     * @param {*} data
     * @param {*} param { authSource : ''}
     * @returns
     */
    oauthLogin(data, param) {
      return new Promise((resolve, reject) => {
        oauthCallback(data, param)
          .then((res) => {
            const { code, data } = res
            if (code === 200) {
              setToken(data.token)
              this.token = data.token
              // Cookies.set('username', data.userName, { expires: 30 })
              // Cookies.set('password', encrypt(data.password), { expires: 30 })
              // Cookies.set('rememberMe', true, { expires: 30 })
              resolve(res) // then处理
            } else {
              console.log('login error ', res)
              reject(res) // catch处理
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        systemLoadingInstance = ElLoading.service({
          text: '正在拉取用户信息，请稍候'
        })
        getInfo()
          .then((res) => {
            systemLoadingInstance.close()
            if (res) {
              const avatar = !res.avatar ? defAva : res.avatar
              if (res.roles && res.roles.length > 0) {
                // 验证返回的roles是否是一个非空数组
                this.roles = res.roles
                this.permissions = res.permissions
              } else {
                this.roles = ['ROLE_DEFAULT']
              }
              cache.local.set('userInfo', JSON.stringify(res))
              this.name = res.nickname
              this.avatar = avatar
              this.userInfo = res
              this.userId = res.userId
              this.userName = res.account
              resolve(res)
            } else {
              reject('获取用户信息失败')
            }
          })
          .catch((error) => {
            systemLoadingInstance.close()
            console.error(error)
            reject('获取用户信息失败')
          })
      })
    },
    // 退出登录
    logOut() {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            this.token = ''
            this.refreshToken = ''
            this.roles = []
            this.permissions = []
            removeToken()
            removeRefreshToken()
            removeIsWeakPassword()
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 前端登出
    fedLogOut() {
      return new Promise((resolve) => {
        this.token = ''
        removeToken()
        removeRefreshToken()
        resolve()
      })
    }
  }
})
export default useUserStore
