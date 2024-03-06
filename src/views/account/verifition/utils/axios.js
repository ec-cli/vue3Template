/*
 * @Author: rk
 * @Description:
 * @Date: 2023-10-18 18:28:24
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:59:50
 */
import axios from 'axios'

axios.defaults.baseURL = 'https://captcha.anji-plus.com/captcha-api'

const service = axios.create({
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  }
})
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (error) => {
    console.log(error)
  }
)
export default service
