<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 菜单权限
 * @Date: 2023-08-25 09:38:02
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:55:54
-->
<template>
  <!-- 角色菜单弹框 -->
  <el-dialog
    v-model="showRoleScope"
    title="菜单权限"
    width="500px"
    top="5vh"
    :close-on-click-modal="false">
    <el-form :model="form" label-width="80px">
      <el-form-item label="角色名称">
        {{ form.roleName }}
      </el-form-item>
      <el-form-item label="权限字符">
        <el-tag>{{ form.roleCode }}</el-tag>
      </el-form-item>
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
            empty-text="加载中，请稍后"
            show-checkbox
            :data="menuOptions"
            :check-strictly="!form.menuCheckStrictly"
            :filter-node-method="menuFilterNode"
            :props="defaultProps">
          </el-tree>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleDialogCancel">取消</el-button>
      <el-button
        v-hasPermi="['system:role:set-menu']"
        type="primary"
        :loading="loading"
        @click="handleFormSubmit"
        >保存</el-button
      >
    </template>
  </el-dialog>
</template>
<script setup>
// api
import { queryRoleMenus, assignRoleMenu } from '@/api/system/role'
import { treeselect } from '@/api/system/menu'

const { proxy } = getCurrentInstance()

const loading = ref(false)
// 是否显示弹出层
const showRoleScope = ref(false)
// 菜单树
const menuRef = ref()
// 展开/折叠
const menuExpand = ref(true)
// 全选/全不选
const menuNodeAll = ref(false)
// 菜单列表
const menuOptions = ref([])
// 菜单树loading
const menuLoading = ref(false)
const state = reactive({
  form: {},
  defaultProps: {
    children: 'children',
    label: 'menuName'
  }
})
const { form, defaultProps } = toRefs(state)

const emit = defineEmits(['get-menu-result'])

// 打开菜单权限窗口
const handleMenuScope = (data) => {
  resetForms()
  showRoleScope.value = true
  const roleId = data.id
  // 查询当前登录用户拥有的菜单树
  const roleMenu = getRoleMenuTreeselect(roleId)
  // 查询当前选中角色已拥有的菜单id列表
  const roleMenuIds = getRoleMenuIds(roleId)
  roleMenu.then((res) => {
    // 菜单树
    menuOptions.value = res
    roleMenuIds.then((res) => {
      // 当前选中角色拥有的菜单id
      const checkedKeys = res
      // 菜单匹配渲染
      checkedKeys.forEach((v) => {
        nextTick(() => {
          proxy.$refs.menuRef.setChecked(v, true, false)
        })
      })
    })
  })
  form.value = {
    id: data.id,
    roleName: data.roleName,
    roleCode: data.roleCode,
    menuCheckStrictly: data.menuCheckStrictly || true
  }
}

// 查询全部菜单树结构
const getRoleMenuTreeselect = () => {
  menuLoading.value = true
  return treeselect().then((res) => {
    menuLoading.value = false
    return res
  })
}

// 根据角色id查询当前角色拥有的菜单id列表
const getRoleMenuIds = (roleId) => {
  menuLoading.value = true
  return queryRoleMenus(roleId).then((res) => {
    menuLoading.value = false
    return res
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
function handleCheckedTreeConnect(value) {
  form.value.menuCheckStrictly = !!value
}
// 菜单筛选
const menuFilterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

// 提交按钮操作
const handleFormSubmit = () => {
  const menuIds = getMenuAllCheckedKeys()
  const params = {
    roleId: form.value.id,
    menuIds: menuIds
  }
  loading.value = true
  assignRoleMenu(params).then((res) => {
    loading.value = false
    if (res) {
      proxy.$modal.msgSuccess('修改成功')
      handleDialogCancel()
      emit('get-menu-result')
    }
  })
}

// 取消按钮操作
const handleDialogCancel = () => {
  showRoleScope.value = false
  setTimeout(() => {
    resetForms()
  }, 200)
}

// 表单重置
const resetForms = () => {
  if (proxy.$refs.menuRef !== undefined) {
    proxy.$refs.menuRef.setCheckedKeys([])
  }
  menuExpand.value = false
  menuNodeAll.value = false
  menuOptions.value = []
  form.value = {
    id: undefined,
    roleName: undefined,
    roleCode: undefined,
    menuIds: [],
    menuCheckStrictly: true
  }
}

defineExpose({ handleMenuScope })
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
</style>
