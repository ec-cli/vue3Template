<!--
 * @Author: ycg
 * @Description: 新增、修改配置管理
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:46:07
-->
<template>
  <el-dialog
    v-model="editVisible.visible"
    width="500px"
    draggable
    append-to-body
    :title="editVisible.title">
    <el-form ref="formRef" label-width="90px" :model="form" :rules="rules">
      <el-form-item label="类型" prop="type" disabled>
        <el-select
          v-model="form.type"
          placeholder="请选择类型"
          style="width: 100%"
          disabled>
          <el-option
            v-for="item in [
              { value: 0, label: '系统配置参数' },
              { value: 1, label: '业务配置参数' }
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="配置名称" prop="configName">
        <el-input
          v-model="form.configName"
          placeholder="请输入配置名称"
          disabled />
      </el-form-item>
      <el-form-item label="配置键名" prop="configKey">
        <el-input
          v-model="form.configKey"
          placeholder="请输入配置键名"
          disabled />
      </el-form-item>
      <el-form-item label="配置值" prop="configValue">
        <el-select
          v-if="form.valueItem"
          v-model="form.configValue"
          placeholder="请选择类型"
          style="width: 100%">
          <el-option
            v-for="item in form.valueItem"
            :key="item.value"
            :label="item.name"
            :value="item.value" />
        </el-select>
        <el-input
          v-else
          v-model="form.configValue"
          placeholder="请输入配置值" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleFormCancel">取消</el-button>
      <el-button type="primary" @click="handleFormSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { deepClone } from '@/utils'
// api
import { updateConfigApi } from '@/api/system/config'
const { proxy } = getCurrentInstance()
const state = reactive({
  form: {},
  rules: {
    configName: [
      {
        required: true,
        message: '请输入配置名称',
        trigger: 'blur'
      }
    ],
    configKey: [
      {
        required: true,
        message: '请输入配置键名',
        trigger: 'blur'
      }
    ],
    configValue: [
      {
        required: true,
        message: '请输入配置值',
        trigger: 'blur'
      }
    ],
    type: [
      {
        required: true,
        message: '配置类型不能为空',
        trigger: 'blur'
      }
    ],
    status: [
      {
        required: true,
        message: '请选择字典状态',
        trigger: 'change'
      }
    ]
  },
  // 状态字典
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ]
})
const { form, rules } = toRefs(state)

// 编辑窗口参数
const editVisible = reactive({
  visible: false, // 窗口开关
  title: '' // 窗口标题
})

// 表单重置
const resetForms = () => {
  form.value = {
    id: undefined,
    configName: undefined,
    configKey: undefined,
    configValue: undefined,
    type: undefined,
    status: '0',
    remark: undefined
  }
  proxy.resetForm('formRef')
}
// 新增、编辑
const openEditForm = (row) => {
  resetForms()
  editVisible.title = '编辑'
  const item = deepClone(row)
  if (item.valueItem) item.valueItem = JSON.parse(item.valueItem)
  form.value = item
  editVisible.visible = true
}
const emit = defineEmits(['get-config-result'])

// 取消
const handleFormCancel = () => {
  editVisible.visible = false
  resetForms()
}
// 确认
const handleFormSubmit = () => {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      const params = deepClone(form.value)
      delete params.valueItem
      updateConfigApi(params).then((res) => {
        if (res) {
          proxy.$modal.msgSuccess('修改成功')
          editVisible.visible = false
          emit('get-config-result')
        }
      })
    }
  })
}

defineExpose({ openEditForm })
</script>

<style scoped lang="scss"></style>
