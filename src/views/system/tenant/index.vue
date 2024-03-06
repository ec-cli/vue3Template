<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description:租户管理
 * @Date: 2023-08-25 09:05:02
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:57:06
-->
<template>
  <div class="app-container">
    <el-card v-show="showSearch" class="search-card">
      <el-form ref="queryRef" :inline="true" :model="queryParams">
        <el-form-item label="租户名称" prop="tenantName">
          <el-input
            v-model="queryParams.tenantName"
            placeholder="请输入租户名称"
            clearable
            v-debounce="handleDataSearch"
            @clear="handleDataSearch" />
        </el-form-item>
        <el-form-item label="租户ID" prop="tenantId">
          <el-input
            v-model="queryParams.tenantId"
            placeholder="请输入租户ID"
            clearable
            v-debounce="handleDataSearch"
            @clear="handleDataSearch" />
        </el-form-item>
        <el-form-item label="租户状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择租户状态"
            clearable
            @change="handleDataSearch">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            style="width: 240px"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDataSearch"></el-date-picker>
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
            v-hasPermi="['system:tenant:add']"
            type="primary"
            icon="Plus"
            plain
            @click="handleDataAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:tenant:export']"
            type="success"
            icon="download"
            plain
            @click="handleFileExport"
            >导出</el-button
          >
        </el-col>
        <right-toolbar
          v-model:showSearch="showSearch"
          @query-table="getTableList"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="tenantList"
        :default-sort="defaultSort"
        @sort-change="sortChange">
        <el-table-column
          label="租户编号"
          prop="id"
          width="110"
          align="center"
          sortable="custom"
          fixed="left"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="租户名称"
          prop="tenantName"
          min-width="120"
          align="center"
          sortable="custom"
          fixed="left"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="租户ID"
          prop="tenantId"
          sortable="custom"
          align="center"
          min-width="110"></el-table-column>
        <el-table-column
          label="过期时间"
          prop="expireTime"
          sortable="custom"
          align="center"
          min-width="170"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          label="租户状态"
          prop="status"
          align="center"
          sortable="custom"
          min-width="110">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          sortable="custom"
          align="center"
          min-width="170"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="操作"
          align="center"
          min-width="160"
          fixed="right">
          <template #default="scope">
            <el-button
              v-hasPermi="['system:tenant:edit']"
              type="success"
              icon="edit"
              text
              @click.stop="handleDataEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              v-hasPermi="['system:tenant:remove']"
              type="danger"
              icon="delete"
              text
              @click.stop="handleDataDelete(scope.row.tenantId)">
              删除
            </el-button>
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
    <EditForm ref="editFormRef" @get-edit="getTableList"></EditForm>
  </div>
</template>
<script setup name="Tenant">
// components
import EditForm from './component/EditForm.vue'
// api
import {
  listTenant,
  deleteTenant,
  updateStatus,
  exportTenant
} from '@/api/system/tenant'

const { proxy } = getCurrentInstance()
// 显示搜索条件
const showSearch = ref(true)
// loading
const loading = ref(false)
// 总条数
const total = ref(0)
// 租户表格数据
const tenantList = ref([])
// 新增｜修改窗口
const editFormRef = ref(null)
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
    orderType: 2,
    sortName: 'id'
  },
  tenantName: undefined, // 租户名称
  tenantId: undefined, // 租户ID
  status: undefined, // 租户状态
  createTime: undefined // 创建时间
})
// 默认排序
const defaultSort = reactive({ prop: 'id', order: 'ascending' })

// 查询租户列表
const getTableList = () => {
  loading.value = true
  listTenant(queryParams).then((res) => {
    loading.value = false
    if (res) {
      tenantList.value = res.data
      total.value = res.total
    }
  })
}

// 排序改变
const sortChange = (column) => {
  // 1-正序-ASC、2-逆序-DESC
  if (column.prop == null || column.order == null) {
    queryParams.pageParam.orderType = 1
    queryParams.pageParam.sortName = 'id'
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
  proxy.resetForm('queryRef')
  handleDataSearch()
}

// 租户状态修改
const handleStatusChange = (row) => {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.tenantName + '"租户吗?', '警告')
    .then(() => {
      loading.value = true
      updateStatus(row)
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

// 删除按钮操作
const handleDataDelete = (id) => {
  proxy.$modal
    .confirm('是否确认删除租户ID为"' + id + '"的数据项?', '警告')
    .then(() => {
      loading.value = true
      deleteTenant({ tenantIds: [id] }).then((res) => {
        loading.value = false
        if (res) {
          getTableList()
          proxy.$modal.msgSuccess('删除成功')
        }
      })
    })
    .catch(() => {})
}

// 导出按钮操作
const handleFileExport = () => {
  proxy.$modal
    .confirm('是否确认导出所有租户数据项?')
    .then(() => {
      return exportTenant(queryParams)
    })
    .catch(() => {})
}

getTableList()
</script>
