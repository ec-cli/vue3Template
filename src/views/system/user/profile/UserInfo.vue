<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 更新用户信息
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 09:12:50
-->
<template>
  <el-form
    ref="userRef"
    label-width="80px"
    label-position="left"
    :model="user"
    :rules="rules">
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="user.nickname" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="user.mobile" maxlength="11" />
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="用户性别" prop="gender">
      <el-radio-group v-model="user.gender">
        <el-radio :label="0">男</el-radio>
        <el-radio :label="1">女</el-radio>
        <el-radio :label="2">未知</el-radio>
      </el-radio-group>
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
import { updateUser } from '@/api/system/user'

const props = defineProps({
  user: {
    type: Object
  }
})
const { proxy } = getCurrentInstance()
const loading = ref(false)
// 校验规则
const rules = ref({
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: "'请输入正确的邮箱地址",
      trigger: ['blur', 'change']
    }
  ],
  mobile: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }]
})

// 提交按钮
const handleFormSubmit = () => {
  const obj = {
    id: props.user.userId,
    nickname: props.user.nickname,
    mobile: props.user.mobile,
    email: props.user.email,
    gender: props.user.gender
  }
  proxy.$refs.userRef.validate((valid) => {
    if (valid) {
      loading.value = true
      updateUser(obj).then((res) => {
        loading.value = false
        if (res) {
          proxy.$modal.msgSuccess('修改成功')
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
