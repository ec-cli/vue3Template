/*
 * @Author: rk
 * @Description: 时间相关工具类
 * @Date: 2023-10-26 15:27:22
 * @LastEditors: rk
 * @LastEditTime: 2023-10-26 16:50:08
 */
import dayjs from 'dayjs'
/**
 * 日期格式化
 * @param {*} time
 * @param {* } pattern 'YYYY-MM-DD HH:mm:ss'
 * @returns
 */
export function parseTime(time, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (arguments.length === 0 || !time) {
    return null
  }
  return dayjs(time).format(pattern)
}

/**
 * 时间格式化
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 将24小时分割为指定间隔的数组
 * @param {number} interval 分割间隔 注意该参数必须能被24*60的结果整除
 * 按照15分钟分割[00:15,00:30,00:45,01:00...]
 * 按照30分钟分割[00:30,01:00,01:30,02:00...]
 * 按照60分钟分割[01:00,02:00,03:00,04:00...]
 * @returns {Array}
 */
export function partitionTime(interval) {
  const size = Math.floor((24 * 60) / interval)
  const timeArrays = new Array(size).fill('').map((item, index) => {
    const timeVal = (index + 1) * interval
    const timeHour = Math.floor(timeVal / 60)
    const timeMinute = timeVal % 60
    const lastTime =
      (timeHour < 10 ? '0' + timeHour : timeHour) +
      ':' +
      (timeMinute === 0 ? '00' : timeMinute)
    return lastTime
  })
  return timeArrays
}

/**
 * 添加日期范围
 * @param { beginTime: '', endTime: '', page: 1} params
 * @param {*} dateRange 日期范围数组
 * @param {*} propName C#属性名首字母大写
 * @returns
 */
export function addDateRange(params, dateRange, propName) {
  let search = params
  search =
    typeof search === 'object' && search !== null && !Array.isArray(search)
      ? search
      : {}
  dateRange = Array.isArray(dateRange) ? dateRange : []
  if (typeof propName === 'undefined') {
    search['beginTime'] = dateRange[0]
    search['endTime'] = dateRange[1]
  } else {
    search['begin' + propName] = dateRange[0]
    search['end' + propName] = dateRange[1]
  }
  return search
}

/**
 * 获取当前季度
 * @returns
 */
export function getCurrQuarter() {
  const currMonth = new Date().getMonth() + 1
  return Math.floor(currMonth % 3 === 0 ? currMonth / 3 : currMonth / 3 + 1)
}

/**
 * 获取当前月份
 * @returns {string} 当前月份
 */
export function getCurrMonth() {
  var date = new Date()
  var month =
    date.getFullYear() +
    '-' +
    (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1))
  return month
}

/**
 * 获取当前旬
 * @returns {string} 当前旬 1，2，3分别代表上中下旬
 */
export function getCurrTenday() {
  const date = new Date().getDate()
  if (date <= 10) {
    return 1
  } else if (date <= 20 && date > 10) {
    return 2
  } else {
    return 3
  }
}

/**
 * 获取当前日期
 * @returns {string} 当前日期
 */
export function getCurrDate() {
  var time = new Date().getTime()
  var yesterday = new Date(time)
  var month = yesterday.getMonth()
  var day = yesterday.getDate()
  return (yesterday =
    yesterday.getFullYear() +
    '-' +
    (month > 8 ? month + 1 : '0' + (month + 1)) +
    '-' +
    (day > 9 ? day : '0' + day))
}

/**
 * 返回星期几
 * @param {*} num
 * @returns
 */
export function getWeek(num = 0) {
  var datas = dayjs().add(num, 'day').day()
  var week = ['日', '一', '二', '三', '四', '五', '六']
  return '星期' + week[datas]
}
