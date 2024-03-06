/*
 * @Author: rk
 * @Description: v-debounce按钮防抖指令
 * @Date: 2023-08-28 10:48:25
 * @LastEditors: rk
 * @LastEditTime: 2023-08-28 11:21:45
 */
/**
 * 默认是1000毫秒
 * <el-input v-debounce="handleQuery"></el-input>
 * 如果时间需要自定义，则使用如下：
 * <el-input v-debounce:2000="handleQuery"></el-input>
 */
const directive = {
  mounted(el, binding) {
    if (typeof binding.value !== 'function') {
      console.error('callback must be a function')
      return
    }
    binding.value.id = null
    el.addEventListener('input', () => {
      clearTimeout(binding.value.id)
      binding.value.id = setTimeout(() => {
        binding.value()
      }, binding.arg || 1000)
    })
  }
}

export default directive
