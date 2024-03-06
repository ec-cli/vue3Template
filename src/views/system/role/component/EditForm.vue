<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 新增｜修改窗口
 * @Date: 2023-08-25 09:38:02
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:55:04
-->
<template>
  <el-dialog
    v-model="open"
    width="700px"
    append-to-body
    :title="title"
    :close-on-click-modal="false">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-row :gutter="15">
        <el-col :lg="24">
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model.trim="form.roleName"
              placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="权限字符" prop="roleCode">
            <el-input
              v-model.trim="form.roleCode"
              placeholder="请输入权限字符:ROLE_XXX">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number
              v-model.trim="form.sort"
              controls-position="right"
              :min="0" />
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="+dict.dictValue"
                >{{ dict.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
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
      <el-button type="primary" :loading="loading" @click="handleFormSubmit"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>
<script setup>
import { deepClone } from '@/utils'
// api
import { addRole, updateRole } from '@/api/system/role'

// 状态数据字典
const props = defineProps(['statusOptions'])

const { proxy } = getCurrentInstance()

// 字典数据
const statusOptions = props.statusOptions
const loading = ref(false)
// 是否显示弹出层
const open = ref(false)
// 弹出层标题
const title = ref('')

// form表单
const state = reactive({
  form: {},
  rules: {
    roleName: [
      { required: true, message: '角色名称不能为空', trigger: 'blur' }
    ],
    roleCode: [
      { required: true, message: '权限字符不能为空', trigger: 'blur' }
    ],
    sort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
  }
})
const { form, rules } = toRefs(state)
// 新增｜修改窗口
const formRef = ref()

const emit = defineEmits(['get-edit-result'])

// 打开新增｜编辑窗口
const openEditForm = (type, data) => {
  resetForms()
  if (type === 1) {
    title.value = '新增'
  } else {
    title.value = '编辑'
    form.value = deepClone(data)
  }
  open.value = true
}

// 取消按钮操作
const handleDialogCancel = () => {
  open.value = false
  setTimeout(() => {
    resetForms()
  }, 200)
}

// 确定按钮操作
const handleFormSubmit = () => {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value.id) {
        updateRole(form.value).then((res) => {
          loading.value = false
          if (res) {
            open.value = false
            proxy.$modal.msgSuccess('修改成功')
            emit('get-edit-result')
          }
        })
      } else {
        addRole(form.value).then((res) => {
          loading.value = false
          if (res) {
            open.value = false
            proxy.$modal.msgSuccess('新增成功')
            emit('get-edit-result')
          }
        })
      }
    }
  })
}

// 表单重置
const resetForms = () => {
  form.value = {
    id: undefined,
    roleName: undefined,
    roleCode: undefined,
    sort: 99,
    status: 0,
    remark: undefined
  }
  proxy.resetForm('formRef')
}

defineExpose({ openEditForm })
</script>
