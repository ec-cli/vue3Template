<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 新增｜修改窗口
 * @Date: 2023-08-28 11:18:08
 * @LastEditors: rk
 * @LastEditTime: 2024-01-02 10:08:59
-->
<template>
  <el-dialog
    v-model="open"
    width="800px"
    top="5vh"
    append-to-body
    :title="title"
    :close-on-click-modal="false">
    <el-form ref="formRef" label-width="100px" :model="form" :rules="rules">
      <el-row :gutter="15">
        <el-col :lg="12">
          <el-form-item label="租户名称" prop="tenantName">
            <el-input
              v-model.trim="form.tenantName"
              placeholder="请输入租户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="租户ID" prop="tenantId">
            <template #label>
              <span>
                <el-tooltip
                  content="租户ID：租户唯一标识，例如：tenant001"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                租户ID
              </span>
            </template>
            <el-input v-model.trim="form.tenantId" placeholder="请输入租户ID" />
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="过期时间" prop="expireTime">
            <el-date-picker
              v-model="form.expireTime"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择过期时间"
              style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :lg="12" v-if="!form.id">
          <el-form-item label="用户账号" prop="adminAccount">
            <template #label>
              <span>
                <el-tooltip
                  content="用户账号：租户管理员登录账号"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                用户账号
              </span>
            </template>
            <el-input
              v-model.trim="form.adminAccount"
              placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12" v-if="!form.id">
          <el-form-item label="用户密码" prop="adminPassword">
            <template #label>
              <span>
                <el-tooltip
                  content="用户密码：租户管理员登录密码"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                用户密码
              </span>
            </template>
            <el-input
              v-model.trim="form.adminPassword"
              type="adminPassword"
              placeholder="请输入用户密码"
              show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="租户状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
                >{{ dict.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="24">
          <el-form-item label="菜单权限">
            <div v-loading="menuLoading">
              <el-checkbox
                v-model="menuExpand"
                @change="handleCheckedTreeExpand($event)"
                >展开/折叠</el-checkbox
              >
              <el-checkbox
                v-model="menuNodeAll"
                @change="handleCheckedTreeNodeAll($event)"
                >全选/全不选</el-checkbox
              >
              <el-checkbox
                v-model="form.menuCheckStrictly"
                @change="handleCheckedTreeConnect($event)"
                >父子联动</el-checkbox
              >
              <el-tree
                ref="menuRef"
                class="tree-border"
                node-key="id"
                show-checkbox
                :data="menuOptions"
                :check-strictly="!form.menuCheckStrictly"
                :empty-text="emptyText"
                :filter-node-method="menuFilterNode"
                :props="defaultProps">
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
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
// utils
import { deepClone } from '@/utils'
// api
import { treeselect } from '@/api/system/menu'
import { createTenant, updateTenant } from '@/api/system/tenant'

const { proxy } = getCurrentInstance()
const loading = ref(false)
// 是否显示弹出层
const open = ref(false)
// 窗口标题
const title = ref('')
// 状态数据字典
const statusOptions = ref([
  { dictValue: 0, dictLabel: '正常' },
  { dictValue: 1, dictLabel: '停用' }
])
// form表单
const state = reactive({
  form: {},
  rules: {
    tenantName: [
      { required: true, message: '租户名称不能为空', trigger: 'blur' }
    ],
    tenantId: [
      { required: true, message: '租户ID不能为空', trigger: 'blur' },
      {
        pattern: /^[A-Za-z0-9]+$/,
        message: '租户ID只能输入英文字母或数字',
        trigger: 'blur'
      }
    ],
    adminAccount: [
      { required: true, message: '用户账号不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户账号长度为 2~20 字符',
        trigger: 'blur'
      }
    ],
    adminPassword: [
      {
        pattern:
          /^(?![\da-z]+$)(?![\dA-Z]+$)(?![\d!@#$%^&.*]+$)(?![a-zA-Z]+$)(?![a-z!@#$%^&.*]+$)(?![A-Z!@#$%^&.*]+$)[\da-zA-z!@#$%^&.*]{8,20}$/,
        message:
          '密码长度为8-20位，至少包含大写字母、小写字母、数字和特殊字符其中三种，特殊字符可包含 !@#$%^&.*',
        trigger: 'blur'
      }
    ],
    expireTime: [{ required: true, message: '请选择过期时间', trigger: 'blur' }]
  },
  defaultProps: {
    children: 'children',
    label: 'menuName'
  }
})
const { form, rules, defaultProps } = toRefs(state)
// 新增｜修改窗口
const formRef = ref()
// 菜单树
const menuRef = ref()
const menuExpand = ref(true)
const menuNodeAll = ref(false)
// 菜单列表
const menuOptions = ref([])
// 菜单树加载提示
const emptyText = ref('加载中，请稍后')
// 菜单树loading
const menuLoading = ref(false)

const emit = defineEmits(['get-edit'])

// 打开新增｜修改窗口
const openEditForm = (type, data) => {
  resetForms()
  if (type === 1) {
    title.value = '新增'
    getRoleMenuTreeselect()
  } else {
    title.value = '编辑'
    form.value = deepClone(data)
    form.value.menuCheckStrictly = true
    getRoleMenuTreeselect(true)
  }
  open.value = true
}

// 查询全部菜单树结构
const getRoleMenuTreeselect = (state) => {
  menuLoading.value = true
  treeselect().then((res) => {
    emptyText.value = '加载中，请稍后'
    menuLoading.value = false
    if (res) {
      menuOptions.value = res
      // state 存在表示当前为编辑状态
      if (state && form.value.menuIds) {
        // 当前租户已拥有的菜单id列表
        const checkedKeys = form.value.menuIds
        // 菜单匹配渲染
        checkedKeys.forEach((v) => {
          nextTick(() => {
            proxy.$refs.menuRef.setChecked(v, true, false)
          })
        })
      }
    } else {
      emptyText.value = '加载失败'
    }
  })
}

// 树权限（展开/折叠）
const handleCheckedTreeExpand = (value) => {
  const treeList = menuOptions.value
  for (let i = 0; i < treeList.length; i++) {
    proxy.$refs.menuRef.store.nodesMap[treeList[i].id].expanded = value
  }
}

// 获取所有菜单节点数据
const getMenuAllCheckedKeys = () => {
  // 目前被选中的菜单节点
  const checkedKeys = proxy.$refs.menuRef.getCheckedKeys()
  // 半选中的菜单节点
  const halfCheckedKeys = proxy.$refs.menuRef.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

// 树权限（全选/全不选）
const handleCheckedTreeNodeAll = (value) => {
  proxy.$refs.menuRef.setCheckedNodes(value ? menuOptions.value : [])
}

// 树权限（父子联动）
const handleCheckedTreeConnect = (value) => {
  form.value.menuCheckStrictly = !!value
}

// 菜单筛选
const menuFilterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
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
      form.value.menuIds = getMenuAllCheckedKeys()
      if (form.value.id) {
        // 修改
        loading.value = true
        updateTenant(form.value).then((res) => {
          loading.value = false
          if (res) {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            emit('get-edit')
          }
        })
      } else {
        // 新增
        loading.value = true
        createTenant(form.value).then((res) => {
          loading.value = false
          if (res) {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            emit('get-edit')
          }
        })
      }
    }
  })
}

// 表单重置
const resetForms = () => {
  menuExpand.value = false
  menuNodeAll.value = false
  menuOptions.value = []
  emptyText.value = '加载中，请稍后'
  form.value = {
    id: undefined,
    tenantName: undefined,
    tenantId: undefined,
    adminAccount: undefined,
    adminPassword: undefined,
    expireTime: undefined,
    status: 0,
    menuIds: [],
    menuCheckStrictly: true
  }
  proxy.resetForm('formRef')
}

// 方法暴漏给父组件
defineExpose({ openEditForm })
</script>
<style scoped>
.tree-border {
  margin-top: 5px;
  border: 1px solid var(--el-border-color-light);
  background: var(--base-bg-main) none;
  border-radius: 4px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
}
:deep(input:-webkit-autofill) {
  background-color: transparent !important;
  background-image: none;
  -webkit-text-fill-color: #606266 !important;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: #fff;
}
</style>
