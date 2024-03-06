/*
 * @Author: rk
 * @Description: 指令封装入口
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-11-01 14:33:02
 */
import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import clipboard from './module/clipboard'
import drag from './module/drag'
import waves from './module/waves'
import debounce from './module/debounce'
import throttle from './module/throttle'
import input from './module/input'

export default function directive(app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('clipboard', clipboard)
  app.directive('drag', drag)
  app.directive('waves', waves)
  app.directive('debounce', debounce)
  app.directive('throttle', throttle)
  app.directive('input', input)
}
