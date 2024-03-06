<!--
 * @Author: ycg
 * @Description: 配置管理
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 09:46:55
-->
<template>
  <div class="app-container">
    <el-card v-show="showSearch" class="search-card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item label="配置名称">
          <el-input
            v-model="queryParams.configName"
            style="width: 200px"
            placeholder="请输入配置名称"
            clearable
            @clear="handleDataSearch"
            @keyup.enter="handleDataSearch" />
        </el-form-item>
        <el-form-item label="配置键名">
          <el-input
            v-model="queryParams.configKey"
            style="width: 200px"
            placeholder="请输入配置键名"
            clearable
            @clear="handleDataSearch"
            @keyup.enter="handleDataSearch" />
        </el-form-item>
        <el-form-item label="参数配置类型">
          <el-select
            v-model="queryParams.type"
            style="width: 200px"
            placeholder="参数配置类型"
            clearable
            @change="handleDataSearch">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value" />
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
            v-hasPermi="['system:dict:export']"
            type="success"
            icon="download"
            plain
            @click="handleFileExport">
            导出
          </el-button>
        </el-col>
        <right-toolbar
          v-model:showSearch="showSearch"
          @query-table="getTableList"></right-toolbar>
      </el-row>

      <el-table
        ref="dataTable"
        v-loading="loading"
        :data="tableList"
        :default-sort="defaultSort"
        @sort-change="sortChange">
        <el-table-column
          label="编号"
          align="center"
          prop="id"
          width="100"
          sortable="custom" />
        <el-table-column
          label="配置名称"
          align="center"
          min-width="120"
          prop="configName"
          sortable="custom"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="配置键名"
          align="center"
          min-width="120"
          prop="configKey"
          sortable="custom"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="配置值"
          align="center"
          min-width="120"
          prop="configValue"
          sortable="custom"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="参数配置类型"
          align="center"
          min-width="120"
          prop="type"
          sortable="custom"
          :show-overflow-tooltip="true">
          <template #default="scope">
            {{ getSelectLabel(statusOptions, scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          min-width="180"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          sortable="custom"
          min-width="120">
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template #default="scope">
            <el-button
              v-hasPermi="['system:dict:edit']"
              type="primary"
              icon="edit"
              text
              @click="handleDataEdit(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <BasePagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageParam.currentPage"
        v-model:limit="queryParams.pageParam.pageSize"
        @pagination="getTableList" />
    </el-card>

    <!-- 添加或修改参数配置对话框 -->
    <EditConfigForm
      ref="editFormRef"
      @get-config-result="getTableList"></EditConfigForm>

    <el-dialog width="60%" draggable :lock-scroll="false"> </el-dialog>
  </div>
</template>

<script setup name="config">
import { deepClone } from '@/utils'
// component
import EditConfigForm from './component/EditConfigForm.vue'
import { getConfigListApi, exportConfigApi } from '@/api/system/config'
import useGetSelectLabel from '@/hooks/useGetSelectLabel'
const { proxy } = getCurrentInstance()
// 遮罩层
const loading = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 表格数据
const tableList = ref([])

// 默认排序
const defaultSort = reactive({ prop: 'id', order: 'ascending' })

const state = reactive({
  queryParams: {
    configKey: undefined,
    configName: undefined,
    type: undefined,
    pageParam: {
      currentPage: 1,
      pageSize: 10
    }
  },
  // 状态字典
  statusOptions: [
    { value: 0, label: '系统参数配置' },
    { value: 1, label: '业务参数配置' }
  ]
})
const { queryParams, statusOptions } = toRefs(state)

const getSelectLabel = useGetSelectLabel()

// 查询字典类型列表
const getTableList = () => {
  loading.value = true
  getConfigListApi(queryParams.value).then((res) => {
    if (res) {
      tableList.value = res.data
      total.value = res.total
    }
    setTimeout(() => {
      loading.value = false
    }, 1000)
  })
}

// 搜索按钮操作
const handleDataSearch = () => {
  queryParams.value.pageParam.currentPage = 1
  getTableList()
}
// 重置按钮操作
const handleFormReset = () => {
  queryParams.value = {
    configKey: undefined,
    configName: undefined,
    type: undefined,
    pageParam: {
      currentPage: 1,
      pageSize: 10
    }
  }
  handleDataSearch()
}
// 修改按钮操作
const handleDataEdit = async (row) => {
  proxy.$refs.editFormRef.openEditForm(row)
}

// 导出按钮操作
const handleFileExport = () => {
  proxy.$modal
    .confirm('是否确认导出所有类型数据项?')
    .then(async () => {
      const params = deepClone(queryParams.value)
      delete params.pageParam
      await exportConfigApi(params)
    })
    .catch(() => {})
}
// 排序改变
const sortChange = (column) => {
  // 1-正序-ASC、2-逆序-DESC
  if (column.prop == null || column.order == null) {
    queryParams.value.pageParam.orderType = 1
    queryParams.value.pageParam.sortName = 'id'
  } else {
    queryParams.value.pageParam.sortName = column.prop
    if (column.order === 'ascending') {
      queryParams.value.pageParam.orderType = 1
    } else if (column.order === 'descending') {
      queryParams.value.pageParam.orderType = 2
    }
  }
  getTableList()
}

getTableList()
</script>
