<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 菜单管理
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-11-01 14:13:04
-->
<template>
  <div class="app-container">
    <el-card class="search-card" v-show="showSearch">
      <el-form ref="queryRef" :inline="true" :model="queryParams">
        <el-form-item label="上级菜单" prop="parentId">
          <el-cascader
            v-model="queryParams.parentId"
            class="w100"
            placeholder="请选择上级菜单"
            clearable
            :options="menuQueryOptions"
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'menuName',
              emitPath: false
            }"
            @change="handleDataSearch">
            <template #default="{ node, data }">
              <span>{{ data.menuName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            v-debounce="handleDataSearch"
            @clear="handleDataSearch" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="菜单状态"
            clearable
            @change="handleDataSearch">
            <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="visible">
          <el-select
            v-model="queryParams.visible"
            placeholder="显示状态"
            clearable
            @change="handleDataSearch">
            <el-option
              v-for="dict in sys_show_hide"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" v-throttle="handleDataSearch"
            >搜索</el-button
          >
          <el-button icon="Refresh" v-throttle="handleFormReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :class="showSearch ? 'mt15' : ''">
      <el-row class="mb8" :gutter="10">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:menu:add']"
            type="primary"
            icon="Plus"
            plain
            @click="handleDataAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" icon="Sort" plain @click="toggleExpandAll"
            >展开/折叠</el-button
          >
        </el-col>
        <right-toolbar
          v-model:showSearch="showSearch"
          @query-table="getTableList"></right-toolbar>
      </el-row>

      <el-table
        v-if="refreshTable"
        v-loading="loading"
        ref="listRef"
        row-key="id"
        lazy
        :data="menuList"
        :default-expand-all="isExpandAll"
        :load="loadMenu"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <!-- 菜单名称 -->
        <el-table-column
          prop="menuName"
          label="菜单名称"
          min-width="180"
          fixed="left"
          :show-overflow-tooltip="true">
          <!-- <template #default="scope">
            <span v-if="scope.row.menuNameKey">
            </span>
            <span v-else>
              {{ scope.row.menuName }}
            </span>
          </template> -->
        </el-table-column>
        <!-- 菜单图标 -->
        <el-table-column
          prop="icon"
          label="图标icon"
          align="center"
          min-width="80">
          <template #default="scope">
            <SvgIcon v-if="scope.row.icon" :name="scope.row.icon" />
          </template>
        </el-table-column>
        <!-- 菜单id -->
        <el-table-column
          prop="id"
          label="菜单id"
          min-width="80"
          align="center"></el-table-column>
        <!-- 菜单类型 -->
        <el-table-column
          prop="menuType"
          label="菜单类型"
          align="center"
          min-width="80">
          <template #default="scope">
            <el-tag
              v-if="scope.row.menuType === 1 && scope.row.isFrame === 0"
              type="danger"
              >链接</el-tag
            >
            <el-tag v-else-if="scope.row.menuType === 2">菜单</el-tag>
            <el-tag v-else-if="scope.row.menuType === 1" type="success"
              >目录</el-tag
            >
            <el-tag v-else-if="scope.row.menuType === 3" type="warning"
              >按钮</el-tag
            >
          </template>
        </el-table-column>
        <!-- 显示顺序 -->
        <el-table-column
          prop="sort"
          label="显示顺序"
          min-width="110"
          align="center">
        </el-table-column>
        <!-- 权限标识 -->
        <el-table-column
          prop="permission"
          min-width="180"
          label="权限标识"
          :show-overflow-tooltip="true"></el-table-column>
        <!-- 路由地址 -->
        <el-table-column
          prop="path"
          min-width="110"
          label="路由地址"
          :show-overflow-tooltip="true"></el-table-column>
        <!-- 组件路径 -->
        <el-table-column
          prop="component"
          min-width="150"
          label="组件路径"
          :show-overflow-tooltip="true"></el-table-column>
        <!-- 是否显示 -->
        <el-table-column
          prop="visible"
          label="是否显示"
          min-width="100"
          align="center">
          <template #default="scope">
            <!-- <dict-tag :options="sys_show_hide" :value="scope.row.visible" /> -->
            <el-tag v-if="scope.row.visible == 0">显示</el-tag>
            <el-tag v-if="scope.row.visible == 1" type="danger">隐藏</el-tag>
          </template>
        </el-table-column>
        <!-- 菜单状态 -->
        <el-table-column
          prop="status"
          label="菜单状态"
          min-width="100"
          align="center">
          <template #default="scope">
            <!-- <dict-tag :options="sys_normal_disable" :value="scope.row.status" /> -->
            <el-tag v-if="scope.row.status == 0">正常</el-tag>
            <el-tag v-if="scope.row.status == 1" type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          min-width="170"
          align="center"
          prop="createTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          min-width="250"
          fixed="right">
          <template #default="scope">
            <el-button
              v-hasPermi="['system:menu:edit']"
              type="success"
              size="small"
              icon="Edit"
              text
              @click="handleDataEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-hasPermi="['system:menu:add']"
              type="primary"
              size="small"
              icon="Plus"
              text
              @click="handleDataAdd(scope.row)"
              >新增</el-button
            >
            <el-button
              v-hasPermi="['system:menu:remove']"
              type="danger"
              size="small"
              icon="Delete"
              text
              @click="handleDataDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/修改窗口 -->
    <EditForm
      ref="editFormRef"
      :menu-options="menuQueryOptions"
      :sys-show-hide="sys_show_hide"
      :sys-normal-disable="sys_normal_disable"
      @get-edit-result="getEditResult"></EditForm>
  </div>
</template>

<script setup name="Menu">
// components
import EditForm from './component/EditForm.vue'
// api
import { delMenu, treeselect } from '@/api/system/menu'

const { proxy } = getCurrentInstance()

const menuList = ref([]) // 菜单列表
const loading = ref(false) // loading
const showSearch = ref(true) // 是否显示搜索条件
const menuQueryOptions = ref([]) // 上级菜单下拉树字典
const isExpandAll = ref(false) // 表格展开｜折叠开关
const refreshTable = ref(true) // 表格展示开关
const listRef = ref(null) // 表格dom
const editFormRef = ref(null) // 新增、修改dom
const loadNodeMap = new Map() // 节点集合
// 查询参数
const state = reactive({
  queryParams: {
    menuType: [1, 2, 3], // 菜单类型
    parentId: undefined, // 上级菜单id
    menuName: undefined, // 菜单名称
    status: undefined, // 菜单状态
    visible: undefined // 是否显示
  },
  sys_show_hide: [
    { dictValue: 0, dictLabel: '显示' },
    { dictValue: 1, dictLabel: '隐藏' }
  ], // 显示隐藏字典
  sys_normal_disable: [
    { dictValue: 0, dictLabel: '正常' },
    { dictValue: 1, dictLabel: '停用' }
  ] // 正常停用字典
})
const { queryParams, sys_show_hide, sys_normal_disable } = toRefs(state)

// 查询菜单下拉树结构
const getTreeselect = () => {
  treeselect({ menuType: [1, 2] }).then((res) => {
    if (res) {
      menuQueryOptions.value = res
    }
  })
}
// 查询菜单列表
const getTableList = () => {
  loading.value = true
  treeselect(queryParams.value).then((res) => {
    loading.value = false
    if (res) {
      menuList.value = res
    }
  })
}
// 搜索按钮操作
const handleDataSearch = () => {
  getTableList()
}
// 重置按钮操作
const handleFormReset = () => {
  proxy.resetForm('queryRef')
  handleDataSearch()
}
// 新增按钮操作
const handleDataAdd = (row) => {
  proxy.$refs.editFormRef.openEditForm(1, row)
}
// 修改按钮操作
const handleDataEdit = async (row) => {
  proxy.$refs.editFormRef.openEditForm(2, row)
}
// 新增｜修改回调
const getEditResult = (pid) => {
  refreshMenu(pid)
}
// 展开/折叠操作
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}
// 删除按钮操作
const handleDataDelete = (row) => {
  proxy.$modal
    .confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', '警告')
    .then(function () {
      loading.value = true
      delMenu({ id: row.id }).then((res) => {
        loading.value = false
        if (res) {
          getTableList()
          getTreeselect()
          refreshMenu(row.parentId)
          proxy.$modal.msgSuccess('删除成功')
        }
      })
    })
    .catch(() => {})
}
// 加载菜单
const loadMenu = (row, treeNode, resolve) => {
  listMenuById(row.id).then((res) => {
    loadNodeMap.set(row.id, { row, treeNode, resolve })
    resolve(res.data)
  })
}
// 刷新懒加载后的数据
const refreshMenu = (pid) => {
  loading.value = true
  if (loadNodeMap.size > 0) {
    const hasNode = loadNodeMap.has(pid)
    if (hasNode) {
      const { row, treeNode, resolve } = loadNodeMap.get(pid)
      proxy.$refs.listRef.store.states.lazyTreeNodeMap[pid] = []
      loadMenu(row, treeNode, resolve)
    }
    loading.value = false
  } else {
    getTableList()
    getTreeselect()
  }
}

// 首次列表加载（只加载一层）
getTreeselect()
getTableList()
</script>
