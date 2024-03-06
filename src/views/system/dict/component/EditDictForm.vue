<!--
 * @Author: rk
 * @Description: 新增、修改字典类型
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 11:10:09
-->
<template>
  <el-dialog
    v-model="editVisible.visible"
    width="500px"
    draggable
    append-to-body
    :title="editVisible.title">
    <el-form ref="formRef" label-width="90px" :model="form" :rules="rules">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="form.dictName" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="form.dictType" placeholder="请输入字典类型" />
      </el-form-item>
      <el-form-item label="字典状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="String(dict.value)"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
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
import { getType, addType, updateType } from '@/api/system/dict/type'
const { proxy } = getCurrentInstance()
const state = reactive({
  form: {},
  rules: {
    dictName: [
      {
        required: true,
        message: '请输入字典名称',
        trigger: 'blur'
      }
    ],
    dictType: [
      {
        required: true,
        message: '请输入字典类型',
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
const { form, rules, statusOptions } = toRefs(state)

// 编辑窗口参数
const editVisible = reactive({
  visible: false, // 窗口开关
  title: '' // 窗口标题
})
const emit = defineEmits(['get-dict-result'])

// 表单重置
const resetForms = () => {
  form.value = {
    id: undefined,
    dictName: undefined,
    dictType: undefined,
    status: '0',
    remark: undefined
  }
  proxy.resetForm('formRef')
}
// 新增、编辑
const openEditForm = (type, id) => {
  resetForms()
  if (type === 1) {
    // 新增
    editVisible.title = '新增'
  } else {
    getType({ dictId: id }).then((res) => {
      if (res) {
        form.value = res
      }
    })
    // 修改
    editVisible.title = '编辑'
  }
  editVisible.visible = true
}

// 取消
const handleFormCancel = () => {
  editVisible.visible = false
  resetForms()
}
// 确认
const handleFormSubmit = () => {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.id) {
        updateType(form.value).then((res) => {
          if (res) {
            proxy.$modal.msgSuccess('修改成功')
            editVisible.visible = false
            emit('get-dict-result')
          }
        })
      } else {
        addType(form.value).then((res) => {
          if (res) {
            proxy.$modal.msgSuccess('新增成功')
            editVisible.visible = false
            emit('get-dict-result')
          }
        })
      }
    }
  })
}

defineExpose({ openEditForm })
</script>

<style scoped lang="scss"></style>
