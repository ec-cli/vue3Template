import axios from 'axios'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import useUserStore from '@/store/modules/user'
import { tansParams, blobValidate, delEmptyQueryNodes } from '@/utils/index'
import { saveAs } from 'file-saver'

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let cacheRequestArr = []
// 将所有的请求都push到数组中,其实数组是[function(token){}, function(token){},...]
function cacheRequestArrHandle(cb) {
  cacheRequestArr.push(cb)
}
// 数组中的请求得到新的token之后自执行，用新的token去重新发起请求
function afreshRequest(token) {
  cacheRequestArr.map((cb) => cb(token))
  cacheRequestArr = []
}
// 通用下载loading
let downloadLoadingInstance

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  // baseURL: 'http://192.168.100.87:9415/', // 96
  baseURL: 'http://192.168.100.243:9415/', // 联调地址
  // 超时时间
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    if (getToken()) {
      // 将token放到请求头发送给服务器,将tokenkey放在请求头中
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    const method = config?.method || 'get'
    const header = config?.headers['Content-Type'] ?? ''

    if (
      (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') &&
      header !== 'multipart/form-data'
    ) {
      config.data = delEmptyQueryNodes(config.data)
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const { errorCode, message } = res.data
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res
    }
    if (errorCode === 0) {
      // 返回 data 字段
      return res.data.data || true
    } else if (errorCode === 100009) {
      // accessToken 过期，需要刷新token
      // 所有的请求来了，先判断是否正在刷新token
      // 如果不是，将刷新token标志置为true并请求刷新token
      // 如果是，则先将请求缓存到数组中
      // 等到刷新完token后再次重新请求之前缓存的请求接口即可
      var config = res.config // 获取失败请求的axios中的config配置数据
      if (config.headers['Content-Type'] === 'application/json;charset=utf-8') {
        config.data = JSON.parse(config.data)
      }
      if (!isRefreshing) {
        // 没有刷新
        isRefreshing = true
        useUserStore()
          .updateToken()
          .then(() => {
            if (res) {
              // 刷新token
              // 更新config.headers中的token
              config.headers['Authorization'] = 'Bearer ' + getToken()
              console.log('token已刷新')
              // 刷新token后重新执行之前被缓存的未成功的请求
              afreshRequest(getToken())
            }
          })
          .catch((res) => {
            console.error('refreshtoken error =>', res)
          })
          .finally(() => {
            // 无论是否有触发异常，该语句都会执行
            isRefreshing = false
          })
        // 缓存未成功的请求
        const retry = new Promise((resolve) => {
          cacheRequestArrHandle((token) => {
            // token为刷新完成后传入的token
            config.headers['Authorization'] = 'Bearer ' + token
            // 将请求挂起
            resolve(service(config))
          })
        })
        return retry
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        // 保存函数 等待执行
        // 把请求都保存起来 等刷新完成后再一个一个调用
        const retry = new Promise((resolve) => {
          cacheRequestArrHandle((token) => {
            // token为刷新完成后传入的token
            config.headers['Authorization'] = 'Bearer ' + token
            // 将请求挂起
            resolve(service(config))
          })
        })
        return retry
      }
    } else if (errorCode === 100012) {
      // refreshToken 过期，需要重新登录
      ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'small'
      }).then(() => {
        useUserStore()
          .fedLogOut()
          .then(() => {
            if (location.pathname.indexOf('/login') !== 0) {
              location.href = import.meta.env.VITE_APP_ROUTER_PREFIX + 'index'
            }
          })
      })
      Promise.reject('无效的会话，或者会话已过期，请重新登录。')
      return false
    } else {
      ElMessage({
        message: message,
        type: 'error'
      })
      Promise.reject(res.data)
      return false
    }
  },
  (error) => {
    var duration = 3000
    let { message } = error
    if (message === 'Network Error') {
      message = '接口连接异常！'
    } else if (message.includes('timeout')) {
      message = '接口请求超时！'
    } else if (message.includes('code 401')) {
      ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'small'
      }).then(() => {
        useUserStore()
          .fedLogOut()
          .then(() => {
            if (location.pathname.indexOf('/login') !== 0) {
              location.href = import.meta.env.VITE_APP_ROUTER_PREFIX + 'index'
            }
          })
      })

      Promise.reject(error)
      return false
    } else if (message.includes('Request failed with status code')) {
      message =
        '接口' + message.substr(message.length - 3) + '异常，请联系管理员！'

      if (import.meta.env.DEV) {
        duration = 0
      }
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: duration,
      showClose: true,
      grouping: true
    })
    return Promise.reject(error).catch(() => {
      console.log(error)
    })
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params, config) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        ...config
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 */
export function post(url, data, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        data,
        ...config
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 提交表单
 * @param {*} url
 * @param {*} data
 */
export function postForm(url, data, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, config)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 通用get下载方法
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 * @param {*} config 配置
 * @returns
 */
export async function downFile(url, params, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  service
    .get(url, {
      params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })
    .then(async (resp) => {
      handleFormat(resp)
    })
    .catch(() => {
      ElMessage({
        message: '下载文件出现错误，请联系管理员！',
        type: 'error'
      })
      downloadLoadingInstance.close()
    })
}

/**
 * 通用post下载方法
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 * @returns
 */
export async function download(url, params, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  service
    .post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params)
        }
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })
    .then(async (resp) => {
      handleFormat(resp)
    })
    .catch((r) => {
      ElMessage({
        message: '下载文件出现错误，请联系管理员！',
        type: 'error'
      })
      downloadLoadingInstance.close()
    })
}

// 拆分下载方法
async function handleFormat(resp) {
  const { data } = resp
  const isBlob = await blobValidate(data)
  if (isBlob) {
    var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    var contentDisposition = decodeURI(resp.headers['content-disposition'])
    var result = patt.exec(contentDisposition)
    var fileName = result[1]
    fileName = fileName.replace(/\"/g, '')
    const blob = new Blob([data])
    saveAs(blob, fileName)
  } else {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    ElMessage({
      message: errMsg,
      type: 'error'
    })
  }
  downloadLoadingInstance.close()
}
export default service
