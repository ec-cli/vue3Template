<!--
 * @Author: rk
 * @Description: 新增、编辑弹窗
 * @Date: 2023-08-25 15:55:53
 * @LastEditors: rk
 * @LastEditTime: 2023-11-01 09:06:25
-->
<template>
  <el-dialog
    v-model="editVisible.visible"
    width="600px"
    append-to-body
    :title="editVisible.title"
    :close-on-click-modal="false">
    <el-form ref="userRef" label-width="80px" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :lg="12">
          <el-form-item label="用户名" prop="account">
            <el-input
              v-model="form.account"
              placeholder="请输入用户名(用于登陆)"
              :disabled="form.id" />
          </el-form-item>
        </el-col>
        <el-col :lg="12" v-if="!form.id">
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入用户密码"
              type="password"
              show-password />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
          </el-form-item>
        </el-col>
        <!-- <el-col :lg="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择归属部门"
                check-strictly
                :render-after-expand="false" />
            </el-form-item>
          </el-col> -->
        <el-col :lg="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              v-model="form.mobile"
              placeholder="请输入手机号码"
              maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="用户性别" prop="gender">
            <el-radio-group v-model="form.gender" placeholder="请选择用户性别">
              <el-radio
                v-for="dict in sexOptions"
                :key="dict.value"
                :label="+dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :lg="12">
            <el-form-item label="用户状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="parseInt(dict.dictValue)"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        <!-- <el-col :lg="24">
            <el-form-item label="岗位">
              <el-select
                v-model="form.postIds"
                multiple
                placeholder="请选择岗位"
                class="w100">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        <!-- <el-col :lg="24">
            <el-form-item label="角色">
              <el-select
                v-model="form.roleIds"
                multiple
                placeholder="请选择角色"
                style="width: 100%"
                @change="selectRole($event)">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1">
                  <span style="float: left">{{ item.roleName }}</span>
                  <span style="float: right">{{ item.roleKey }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        <!-- <el-col :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col> -->
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleDialogCancel">取消</el-button>
      <el-button type="primary" @click="handleFormSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
// utils
import { deepClone } from '@/utils'
// api
import { addUser, updateUser } from '@/api/system/user'

const { proxy } = getCurrentInstance()
const state = reactive({
  form: {},
  rules: {
    account: [
      { required: true, message: '用户名称不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户名称长度必须介于 2 和 20 之间',
        trigger: 'blur'
      }
    ],
    nickname: [
      { required: true, message: '用户昵称不能为空', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '用户密码不能为空', trigger: 'blur' },
      {
        pattern:
          /^(?![\da-z]+$)(?![\dA-Z]+$)(?![\d!@#$%^&.*]+$)(?![a-zA-Z]+$)(?![a-z!@#$%^&.*]+$)(?![A-Z!@#$%^&.*]+$)[\da-zA-z!@#$%^&.*]{8,20}$/,
        message:
          '密码长度为8-20位，至少包含大写字母、小写字母、数字和特殊字符其中三种，特殊字符可包含 !@#$%^&.*',
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        type: 'email',
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change']
      }
    ],
    mobile: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ]
  },
  sexOptions: [
    { value: 0, label: '男' },
    { value: 1, label: '女' },
    { value: 2, label: '未知' }
  ]
})
const { form, rules, sexOptions } = toRefs(state)
// 编辑窗口参数
const editVisible = reactive({
  visible: false, // 窗口开关
  title: '' // 窗口标题
})

// 表单重置
const resetForms = () => {
  form.value = {
    id: undefined, // 菜单id
    account: undefined,
    password: undefined,
    nickname: undefined,
    mobile: undefined,
    email: undefined,
    gender: 0
  }
  proxy.resetForm('userRef')
}

// 打开新增｜编辑窗口
const openEditForm = (type, data) => {
  resetForms()
  if (type === 1) {
    // 新增
    editVisible.title = '新增'
  } else {
    // 修改
    form.value = deepClone(data)
    editVisible.title = '编辑'
  }
  editVisible.visible = true
}

// 取消按钮操作
const handleDialogCancel = () => {
  editVisible.visible = false
  setTimeout(() => {
    resetForms()
  }, 200)
}

const emit = defineEmits(['get-edit-result'])

// 提交按钮操作
const handleFormSubmit = () => {
  proxy.$refs['userRef'].validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updateUser(form.value).then((res) => {
          if (res) {
            proxy.$modal.msgSuccess('修改成功')
            editVisible.visible = false
            emit('get-edit-result')
          }
        })
      } else {
        addUser(form.value).then((res) => {
          if (res) {
            proxy.$modal.msgSuccess('新增成功')
            editVisible.visible = false
            emit('get-edit-result')
          }
        })
      }
    }
  })
}

// 给父组件暴漏方法
defineExpose({ openEditForm })
</script>

<style scoped lang="scss"></style>
