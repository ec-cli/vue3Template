<!--
 * @Author: rk
 * @Description: 分配角色
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 15:24:50
-->
<template>
  <el-dialog
    v-model="paramsData.visible"
    title="分配角色"
    width="500px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleDialogCancel">
    <el-form ref="userRef" label-width="80px" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :lg="24">
          <el-form-item label="用户名" prop="account">
            <el-input
              v-model="form.account"
              placeholder="请输入用户名(用于登陆)"
              style="width: 300px"
              disabled />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="form.nickname"
              placeholder="请输入用户昵称"
              style="width: 300px"
              disabled />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="form.role"
              placeholder="请选择角色"
              style="width: 300px"
              multiple
              collapse-tags
              collapse-tags-tooltip>
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleDialogCancel">取消</el-button>
      <el-button type="primary" @click="handleFormSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
// api
import { assignUserRole } from '@/api/system/user.js'

// props
const props = defineProps({
  paramsData: {
    type: Object,
    default: () => ({})
  }
})

// 获取当前组件实例，proxy类似于vue2的this
const { proxy } = getCurrentInstance()
// 定义form表单数据
const form = reactive({
  account: '',
  nickname: '',
  role: []
})
// 定义表单校验规则
const rules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}
// 定义角色列表数据
const roleList = ref([])

// watch监听
watch(
  () => props.paramsData,
  (newVal, oldVal) => {
    if (newVal.visible) {
      roleList.value = newVal.allRole
      proxy.resetForm('userRef')
      form.account = newVal.account
      form.nickname = newVal.nickname
      form.role = newVal.roleIds
    }
  },
  { immediate: true, deep: true }
)

// 子组件传父组件emit
const emit = defineEmits(['get-role-result'])

// 取消
const handleDialogCancel = () => {
  props.paramsData.visible = false
}
// 提交
const handleFormSubmit = () => {
  const obj = {
    roleIds: form.role,
    userId: props.paramsData.id
  }
  proxy.$refs['userRef'].validate((valid) => {
    if (valid) {
      assignUserRole(obj).then((res) => {
        if (res) {
          proxy.$modal.msgSuccess('分配成功')
          emit('get-role-result')
        }
      })
    }
  })
}
</script>

<style scoped lang="scss"></style>
