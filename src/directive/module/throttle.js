/*
 * @Author: rk
 * @Description: 节流，一般用于按钮重复点击
 * @Date: 2023-08-28 10:53:19
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 10:25:16
 */
/*
  需求：防止按钮在短时间内被多次点击，使用节流函数限制规定时间内只能点击一次。

  思路：
    1、第一次点击，立即调用方法并禁用按钮，等延迟结束再次激活按钮
    2、将需要触发的方法绑定在指令上
  使用：给 Dom 加上 v-throttle 及回调函数即可，默认是1000毫秒
  <button v-throttle="debounceClick">节流提交</button>
  如果时间需要自定义，则如下使用
  <button v-throttle:2000="debounceClick">节流提交</button>
*/

const throttle = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }
    let timer = null
    el.__handleClick__ = function () {
      if (timer) {
        clearTimeout(timer)
      }
      if (!el.disabled) {
        el.disabled = true
        binding.value()
        timer = setTimeout(() => {
          el.disabled = false
        }, parseInt(binding.arg || 1000))
      }
    }
    el.addEventListener('click', el.__handleClick__)
  },
  beforeUnmount(el) {
    el.removeEventListener('click', el.__handleClick__)
  }
}

export default throttle
