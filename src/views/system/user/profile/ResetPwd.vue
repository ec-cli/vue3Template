<!--
 * @Author: rk
 * @Description: 设置密码
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 09:11:30
-->
<template>
  <el-form
    ref="pwdRef"
    label-width="80px"
    label-position="left"
    :model="user"
    :rules="rules">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
        show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
        show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="handleFormSubmit"
        >保存</el-button
      >
      <el-button type="danger" @click="handleClose">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
// api
import { updatePassword } from '@/api/system/user'

const { proxy } = getCurrentInstance()
const loading = ref(false)
// 用户密码信息
const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})
// 校验两次输入密码是否一致
const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
// 校验规则
const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      pattern:
        /^(?![\da-z]+$)(?![\dA-Z]+$)(?![\d!@#$%^&.*]+$)(?![a-zA-Z]+$)(?![a-z!@#$%^&.*]+$)(?![A-Z!@#$%^&.*]+$)[\da-zA-z!@#$%^&.*]{8,20}$/,
      message:
        '密码长度为8-20位，至少包含大写字母、小写字母、数字和特殊字符其中三种，特殊字符可包含 !@#$%^&.*',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
})

// 提交按钮
const handleFormSubmit = () => {
  proxy.$refs.pwdRef.validate((valid) => {
    if (valid) {
      loading.value = true
      updatePassword(user).then((res) => {
        loading.value = false
        if (res) {
          proxy.$modal.msgSuccess('修改成功')
          proxy.resetForm('pwdRef')
        }
      })
    }
  })
}
// 关闭按钮
const handleClose = () => {
  proxy.$tab.closePage()
}
</script>
