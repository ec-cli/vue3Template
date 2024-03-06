<!--
 * @Author: rk
 * @Description: 角色管理
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:55:32
-->
<template>
  <div class="app-container">
    <el-card class="search-card" v-show="showSearch">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
            v-debounce="handleDataSearch"
            @clear="handleDataSearch" />
        </el-form-item>
        <!-- <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleDataSearch" />
        </el-form-item> -->
        <el-form-item label="状态" prop="status">
          <el-select
            v-model.trim="queryParams.status"
            placeholder="角色状态"
            clearable
            @change="handleDataSearch">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" v-throttle="handleDataSearch"
            >搜索</el-button
          >
          <el-button icon="refresh" v-throttle="handleFormReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :class="showSearch ? 'mt15' : ''">
      <el-row class="mb8" :gutter="10">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:role:add']"
            type="primary"
            icon="plus"
            plain
            @click="handleDataAdd"
            >新增</el-button
          >
        </el-col>
        <right-toolbar
          v-model:showSearch="showSearch"
          @query-table="getTableList"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="roleList"
        :default-sort="defaultSort"
        @sort-change="sortChange">
        <el-table-column
          label="编号"
          prop="id"
          width="80"
          align="center"
          sortable="custom"
          fixed="left" />
        <el-table-column
          label="角色名称"
          prop="roleName"
          min-width="120"
          align="center"
          sortable="custom"
          fixed="left" />
        <el-table-column
          label="显示顺序"
          prop="sort"
          sortable="custom"
          align="center"
          min-width="110"></el-table-column>
        <el-table-column
          label="权限字符"
          prop="roleCode"
          sortable="custom"
          align="center"
          min-width="180">
          <template #default="scope">
            <el-tag>{{ scope.row.roleCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="数据权限"
          prop="dataScope"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          align="center"
          sortable="custom"
          min-width="90">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :disabled="scope.row.roleCode === 'ROLE_SUPER_ADMIN'"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="用户数"
          align="center"
          prop="userNum"
          sortable="custom"
          min-width="90">
        </el-table-column> -->
        <el-table-column
          label="创建时间"
          prop="createTime"
          sortable="custom"
          align="center"
          min-width="170" />
        <!-- <el-table-column
          label="备注"
          align="center"
          prop="remark"
          min-width="150"
          :show-overflow-tooltip="true" /> -->
        <el-table-column
          label="操作"
          align="center"
          min-width="350"
          fixed="right">
          <template #default="scope">
            <div v-if="scope.row.roleCode != 'ROLE_SUPER_ADMIN'">
              <el-button
                v-hasPermi="['system:role:edit']"
                type="success"
                icon="edit"
                text
                @click.stop="handleDataEdit(scope.row)"
                >编辑
              </el-button>
              <el-button
                v-hasPermi="['system:role:set-menu']"
                type="primary"
                icon="Menu"
                text
                @click.stop="handleMenuClick(scope.row)"
                >菜单权限
              </el-button>
              <el-button
                v-hasPermi="['system:role:set-data']"
                type="primary"
                icon="Coin"
                text
                @click.stop="handleDataClick(scope.row)"
                >数据权限
              </el-button>
              <el-button
                v-hasPermi="['system:role:remove']"
                type="danger"
                icon="delete"
                text
                @click.stop="handleDataDelete(scope.row.id)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageParam.currentPage"
        v-model:limit="queryParams.pageParam.pageSize"
        @pagination="getTableList" />
    </el-card>

    <!-- 新增｜编辑窗口 -->
    <EditForm
      ref="editFormRef"
      :status-options="statusOptions"
      @get-edit-result="getTableList"></EditForm>

    <!-- 菜单权限窗口 -->
    <RoleMenu ref="menuFormRef" @get-menu-result="getTableList"></RoleMenu>
  </div>
</template>

<script setup name="Role">
// api
import { listRole, delRole, changeRoleStatus } from '@/api/system/role'
// import { roleMenuTreeselect } from '@/api/system/menu'
// components
import EditForm from './component/EditForm.vue'
import RoleMenu from './component/RoleMenu.vue'

const { proxy } = getCurrentInstance()

const loading = ref(false)

// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 角色表格数据
const roleList = ref([])
// 新增｜修改窗口
const editFormRef = ref(null)
// 菜单权限窗口
const menuFormRef = ref(null)
// 状态数据字典
const statusOptions = ref([
  { dictValue: 0, dictLabel: '正常' },
  { dictValue: 1, dictLabel: '停用' }
])
// 查询参数
const queryParams = reactive({
  pageParam: {
    currentPage: 1,
    pageSize: 10,
    orderType: 1,
    sortName: 'sort'
  },
  roleName: undefined,
  status: null
})
// 默认排序
const defaultSort = reactive({ prop: 'sort', order: 'ascending' })

// 查询角色列表
const getTableList = () => {
  loading.value = true
  listRole(queryParams).then((res) => {
    loading.value = false
    if (res) {
      roleList.value = res.data
      total.value = res.total
    }
  })
}

// 排序改变
const sortChange = (column) => {
  // 1-正序-ASC、2-逆序-DESC
  if (column.prop == null || column.order == null) {
    queryParams.pageParam.orderType = 1
    queryParams.pageParam.sortName = 'sort'
  } else {
    queryParams.pageParam.sortName = column.prop
    if (column.order === 'ascending') {
      queryParams.pageParam.orderType = 1
    } else if (column.order === 'descending') {
      queryParams.pageParam.orderType = 2
    }
  }
  handleDataSearch()
}

// 搜索按钮操作
const handleDataSearch = () => {
  queryParams.pageParam.currentPage = 1
  getTableList()
}

// 重置按钮操作
const handleFormReset = () => {
  proxy.resetForm('queryForm')
  handleDataSearch()
}

// 角色状态修改
const handleStatusChange = (row) => {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', '警告')
    .then(() => {
      loading.value = true
      changeRoleStatus(row)
        .then((res) => {
          loading.value = false
          if (res) {
            proxy.$modal.msgSuccess(text + '成功')
          } else {
            row.status = row.status === 0 ? 1 : 0
          }
        })
        .catch(() => {
          loading.value = false
          row.status = row.status === 0 ? 1 : 0
        })
    })
    .catch(() => {
      row.status = row.status === 0 ? 1 : 0
    })
}

// 新增按钮操作
const handleDataAdd = () => {
  proxy.$refs.editFormRef.openEditForm(1)
}

// 编辑按钮操作
const handleDataEdit = (row) => {
  proxy.$refs.editFormRef.openEditForm(2, row)
}

// 菜单权限按钮操作
const handleMenuClick = (row) => {
  proxy.$refs.menuFormRef.handleMenuScope(row)
}

// 数据权限按钮操作
const handleDataClick = (row) => {
  proxy.$modal.msg('该功能暂未实现')
}

// 删除按钮操作
const handleDataDelete = (id) => {
  proxy.$modal
    .confirm('是否确认删除角色编号为"' + id + '"的数据项?', '警告')
    .then(() => {
      loading.value = true
      delRole({ ids: [id] }).then((res) => {
        loading.value = false
        if (res) {
          getTableList()
          proxy.$modal.msgSuccess('删除成功')
        }
      })
    })
    .catch(() => {})
}

getTableList()
</script>
<style lang="scss" scoped>
.tree-border {
  margin-top: 5px;
  border: 1px solid var(--el-border-color-light);
  background: var(--base-bg-main) none;
  border-radius: 4px;
  width: 100%;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown {
  vertical-align: middle;
}
</style>
