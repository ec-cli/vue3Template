/*
 * @Author: rk
 * @Description: 输入框限制指令
 * @Date: 2023-11-01 14:31:59
 * @LastEditors: rk
 * @LastEditTime: 2023-11-01 14:35:54
 */

const inputDirective = {
  mounted(el, binding) {
    const input =
      el.querySelector('.el-input__inner') ||
      el.querySelector('.el-textarea__inner') ||
      el

    input.addEventListener('compositionstart', () => {
      el.locking = true // 解决中文输入双向绑定失效
    })

    input.addEventListener('compositionend', () => {
      el.locking = false // 解决中文输入双向绑定失效
      input.dispatchEvent(new Event('input'))
    })

    input.onkeyup = () => {
      if (el.locking) {
        return
      }

      // v-input.float
      if (binding.modifiers.float) {
        // 只能输入浮点型（只能一个小数点）
        onlyFloat(input, binding.value)
      } else if (binding.modifiers.int) {
        // v-input.int
        // 只能输入整数（0+正整数）（开头不能多个0）
        onlyInt(input)
      } else if (binding.modifiers.intp) {
        // v-input.intp
        // 只能输入正整数
        onlyIntp(input)
      } else if (binding.modifiers.alp) {
        // v-input.alp
        // 只能输入字母
        onlyAlp(input)
      } else if (binding.modifiers.num_alp) {
        // v-input.num_alp
        // 只能输入数字+字母
        onlyNumAlp(input)
      }
      input.dispatchEvent(new Event('input'))
    }
  }
}

const onlyInt = (input) => {
  let value = input.value
  value = value.replace(/\D+/g, '')
  input.value = value ? Number(value).toString() : value // 去掉开头多个0
}

const onlyIntp = (input) => {
  if (!/^[1-9][0-9]*$/.test(input.value)) {
    let value = input.value.replace(/\D+/g, '')
    if (value && value.substring(0, 1) === '0') {
      // 0开头去除0
      value = value.substring(1)
    }
    input.value = value
  }
}

const onlyFloat = (input, n) => {
  let value = input.value
  value = value.replace(/[^\d.]/g, '')
  value = value.replace(/^\./g, '')
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  if (n && Number(n) > 0) {
    // 限制n位
    var d = new Array(Number(n)).fill('\\d').join('')
    var reg = new RegExp(`^(\\-)*(\\d+)\\.(${d}).*$`, 'ig')
    value = value.replace(reg, '$1$2.$3')
  }
  if (value && !value.includes('.')) {
    value = Number(value).toString() // 去掉开头多个0
  }
  input.value = value
}

const onlyAlp = (input) => {
  input.value = input.value.replace(/[^A-Za-z]/g, '')
}

const onlyNumAlp = (input) => {
  input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
}

export default {
  directive: 'v-input',
  beforeMount(el, binding) {
    el.locking = false
    inputDirective.mounted(el, binding)
  }
}
