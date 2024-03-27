/*
 * @Author: rk
 * @Description: 常用工具类方法
 * @Date: 2023-10-19 09:59:05
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 10:07:51
 */
import { useWebNotification } from '@vueuse/core'
const baseURL = import.meta.env.VITE_APP_BASE_API
/**
 * 将url后的参数转为obj,如www.baidu.com?a=123&b=234 => {a:123,b:234}
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 合并对象
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 切换dom类名
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * 数组去重
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * 创建不重复的随机字符串
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * 判断dom节点是否存在某个calss类名
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 为dom节点添加一个class类名
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 删除dom节点的某个class类名
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 首字母转大写
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 下划线转驼峰
 * @param {string} str
 * @returns  {string}
 */
export function camelCase(str) {
  return str.replace(/_[a-z]/g, (str1) => str1.substr(-1).toUpperCase())
}
/**
 * - 转驼峰
 * @param {*} str
 * @param {*} upperCaseFirst
 * @returns
 */
export function toCamelCase(str, upperCaseFirst) {
  str = (str || '').toLowerCase().replace(/-(.)/g, function (match, group1) {
    return group1.toUpperCase()
  })

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1)
  }

  return str
}

/**
 * 判断是否数字
 * @param {*} str
 * @returns {boolean}
 */
export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

/**
 * 变浅颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后rgb格式的颜色值
 */
export function getLightColor(color, level) {
  const reg = /^\#?[0-9A-Fa-f]{6}$/
  if (!reg.test(color)) return color
  const rgb = hexToRgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * hex颜色转rgb颜色
 * @param str 颜色值字符串
 * @returns 返回处理后的颜色值
 */
export function hexToRgb(str) {
  let hexs = ''
  const reg = /^\#?[0-9A-Fa-f]{6}$/
  if (!reg.test(str)) return str
  str = str.replace('#', '')
  hexs = str.match(/../g)
  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16)
  return hexs
}

/**
 * rgb颜色转Hex颜色
 * @param r 代表红色
 * @param g 代表绿色
 * @param b 代表蓝色
 * @returns 返回处理后的颜色值
 */
export function rgbToHex(r, g, b) {
  const reg = /^\d{1,3}$/
  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return ''
  const hexs = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) if (hexs[i].length === 1) hexs[i] = `0${hexs[i]}`
  return `#${hexs.join('')}`
}

/**
 * 随机生成十六进制颜色
 * @returns {string}
 */
export function color16() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
  return color
}

/**
 * 浏览器Web通知
 * @param { title: 'title' } optinos
 */
export function webNotify(optinos) {
  const { show, isSupported } = useWebNotification({
    title: optinos.title,
    dir: 'auto',
    lang: 'en',
    renotify: true,
    tag: 'tag',
    body: optinos.body
  })
  if (isSupported) {
    show()
  }
}

/**
 *  匹配字典的方法
 *  @param {string|number} index 索引值
 *  @param {Array} dictionary 字典数据
 *  @returns {string} label
 */
export function dictionaryMatch(index, dictionary) {
  let label = ''
  let value = ''
  dictionary.forEach((item) => {
    // ?? 如果左侧是null或者undefined才会继续，如果是0，则取值为0
    value = item.value ?? item.id ?? item.type
    if (value === index) {
      label = item.label || item.name
    }
  })
  return label
}

/**
 * 回显数据字典
 * @param {*} datas
 * @param {*} value
 * @returns
 */
export function selectDictLabel(datas, value) {
  if (value === undefined) {
    return ''
  }
  var actions = []
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue === '' + value) {
      actions.push(datas[key].dictLabel)
      return true
    }
  })
  if (actions.length === 0) {
    actions.push(value)
  }
  return actions.join('')
}
/**
 * 回显数据字典（字符串数组）
 * @param {*} datas
 * @param {*} value
 * @param {*} separator
 * @returns
 */
export function selectDictLabels(datas, value, separator) {
  if (value === undefined) {
    return ''
  }
  var actions = []
  var currentSeparator = undefined === separator ? ',' : separator
  var temp = value.split(currentSeparator)
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].value === '' + temp[val]) {
        actions.push(datas[key].label + currentSeparator)
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1)
}

/**
 * form表单重置
 * @param {*} refName 要重置的form表单ref
 */
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

/**
 * 24点数组转96点数组
 * @param {Aarry} list 必传 要转换的长度为24的数组
 * @param {number} toFixed 非必传 要保留的小数位，默认不处理 注意保留小数位后返回的数据是string类型
 * @returns Array 转化后的长度为96的数组
 */
export function arr24To96(list, toFixed) {
  if (list && list.length !== 0) {
    const _toFixed = toFixed || null
    const newList = []
    let n = 0
    let j = 0
    for (let i = 0; i < 96; i++) {
      newList.push(list[n])
      if (_toFixed) {
        newList[i] = isNaN(newList[i]) ? null : newList[i].toFixed(_toFixed)
      }
      if (j < 3) {
        j++
      } else {
        n++
        j = 0
      }
    }
    return newList
  }
  return null
}
/**
 * 96点数组转24点数组
 * @param {Aarry} list 必传 要转换的长度为96的数组
 * @param {Boolean} noAverage 非必传，true表示不对4个点加和的值进行平均
 * @param {number} toFixed 非必传  要保留的小数位，默认不处理 注意保留小数位后返回的数据是string类型
 * @returns Array 转化后的长度为24的数组
 */
export function arr96To24({ list, noAverage, toFixed }) {
  if (list && list.length !== 0) {
    const _toFixed = toFixed || null
    const newList = []
    let val = null
    for (let i = 0; i < list.length; i++) {
      if (list[i] !== null) {
        val += list[i]
      }
      if ((i !== 0 && (i + 1) % 4 === 0) || i === list.length - 1) {
        if (noAverage) {
          newList.push(val === null ? null : Number(+val))
        } else {
          newList.push(val === null ? null : Number(+val / 4))
        }
        val = null
      }
    }
    if (_toFixed) {
      for (const i in newList) {
        newList[i] = newList[i] === null ? null : newList[i].toFixed(_toFixed)
      }
    }
    return newList
  }
  return null
}
/**
 * 深拷贝
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (typeof source !== 'object' || source == null) {
    return source
  }
  const target = Array.isArray(source) ? [] : {}
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        target[key] = deepClone(source[key])
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  var childrenListMap = {}
  var nodeIds = {}
  var tree = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

/**
 * 递归查找对应项
 * @param tree 树数据
 * @param id 查找的id
 * @param idNmae 查找的id名称
 * @param childrenName 子节点名称
 */
export function findItemById(
  tree,
  id,
  idNmae = 'id',
  childrenName = 'children'
) {
  // 遍历树的每个节点
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    // 如果当前节点的id匹配目标id，返回该节点
    if (node[idNmae] === id) {
      return node
    }
    // 如果当前节点有子节点，则递归调用findItemById继续查找
    if (node[childrenName] && node[childrenName].length > 0) {
      const result = findItemById(node[childrenName], id, idNmae, childrenName)
      // 如果在子节点中找到了匹配的id，直接返回结果
      if (result) {
        return result
      }
    }
  }
  // 如果遍历完整个树仍然没有找到匹配的id，则返回null或者自定义的默认值
  return null
}

/**
 * 查找对象的唯一键值对（比如id）去判断是否存在某个数据中
 * @param {*} arr 数组
 * @param {*} key 对象键值名
 * @param {*} val
 * @returns
 */
export function findItem(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

/**
 * 通用下载方法
 * @param {*} fileName 文件名
 */
export function downloadFile(fileName) {
  window.open(baseURL + fileName)
}

/**
 * 字符串格式化(%s )
 * @param {*} str
 * @returns
 */
export function sprintf(str) {
  var args = arguments
  var flag = true
  var i = 1
  str = str.replace(/%s/g, function () {
    var arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}

/**
 * 转换字符串，undefined,null等转化为""
 * @param {*} str
 * @returns
 */
export function parseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + '='
    if (value !== null && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof value[key] !== 'undefined') {
            const params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * 返回项目路径
 * @param {*} p 要检索的字符
 * @returns
 */
export function getNormalPath(p) {
  if (p.length === 0 || !p || p === 'undefined') {
    return p
  }
  const res = p.replace('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}

/**
 * 验证是否为blob格式
 * @param {*} data
 * @returns
 */
export async function blobValidate(data) {
  try {
    const text = await data.text()
    JSON.parse(text)
    return false
  } catch (error) {
    return true
  }
}
/**
 * 转换字符串，undefined,null等转化为""
 * @param {*} str
 * @returns
 */
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}
export function praseStrZero(str) {
  if (!str || str === 'undefined' || str === 'null') {
    console.log('zero')
    return 0
  }
  return str
}

/**
 * 字符串是否为空
 * @param {*} obj
 * @returns
 */
export function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj == null || obj === '') {
    return true
  } else {
    return false
  }
}

/**
 * 移除对象中值为null, undefined的字段
 * @param {object} obj
 * @returns {object}
 */
export const delEmptyQueryNodes = (obj = {}) => {
  if (Array.isArray(obj)) {
    return obj
  }
  const params = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: obj[key]
      }),
      {}
    )
  // console.log('过滤后参数=', params)
  return params
}

/**
 * 获取图片转base64
 * @param {*} file
 * @returns
 */
export const getBase64 = (file) => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file)
    reader.onload = function () {
      imgResult = reader.result
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}
