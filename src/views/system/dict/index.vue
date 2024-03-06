<!--
 * @Author: rk
 * @Description: 字典
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 09:46:19
-->
<template>
  <div class="app-container">
    <el-card v-show="showSearch" class="search-card">
      <el-form ref="queryForm" :inline="true" :model="queryParams">
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="queryParams.dictType"
            placeholder="请输入字典类型"
            clearable
            @clear="handleDataSearch"
            @keyup.enter="handleDataSearch" />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="queryParams.dictName"
            placeholder="请输入字典名称"
            clearable
            @clear="handleDataSearch"
            @keyup.enter="handleDataSearch" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="字典状态"
            clearable
            @change="handleDataSearch">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="queryParams.createTimeList"
            type="daterange"
            style="width: 240px"
            range-separator="-"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDataSearch">
          </el-date-picker>
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
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:dict:add']"
            type="primary"
            icon="plus"
            plain
            @click="handleDataAdd">
            新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:dict:remove']"
            type="danger"
            icon="delete"
            plain
            :disabled="multiple"
            @click="handleDataDelete">
            删除
          </el-button>
        </el-col>
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
        v-loading="loading"
        ref="dataTable"
        :data="typeList"
        :default-sort="defaultSort"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="字典编号"
          align="center"
          prop="id"
          width="110"
          sortable="custom" />
        <el-table-column
          label="字典类型"
          align="center"
          min-width="150"
          sortable="custom"
          prop="dictType"
          :show-overflow-tooltip="true">
          <template #default="scope">
            <el-link type="primary" @click="handleDictConfig(scope.row)">{{
              scope.row.dictType
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="字典名称"
          align="center"
          min-width="100"
          prop="dictName"
          sortable="custom"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          min-width="100"
          sortable="custom">
          <template #default="scope">
            <el-tag :type="['success', 'danger'][scope.row.status]">{{
              dictionaryMatch(scope.row.status, statusOptions)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          min-width="150"
          :show-overflow-tooltip="true" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          sortable="custom"
          min-width="180">
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template #default="scope">
            <el-button
              v-hasPermi="['system:dict:edit']"
              type="primary"
              icon="edit"
              text
              @click="handleDataEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              v-hasPermi="['system:dict:remove']"
              type="danger"
              icon="delete"
              text
              @click="handleDataDelete(scope.row)">
              删除
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
    <EditDictForm
      ref="editFormRef"
      @get-dict-result="getTableList"></EditDictForm>

    <el-dialog
      v-model="dictDataVisible"
      draggable
      width="60%"
      :lock-scroll="false">
      <DictConfig v-model:dictId="dictId"></DictConfig>
    </el-dialog>
  </div>
</template>

<script setup name="dict">
// component
import DictConfig from './component/DictConfig.vue'
import EditDictForm from './component/EditDictForm.vue'
import { listType, delType, exportType } from '@/api/system/dict/type'
// utils
import { dictionaryMatch } from '@/utils'
const { proxy } = getCurrentInstance()
// 遮罩层
const loading = ref(true)
// 选中数组
const ids = ref([])
// 非多个禁用
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 字典表格数据
const typeList = ref([])
// 字典弹出层
const dictDataVisible = ref(false)

// 默认排序
const defaultSort = reactive({ prop: 'id', order: 'ascending' })
// 字典Id传值给子组件
const dictId = ref(0)

// 表单数据
const state = reactive({
  queryParams: {
    dictName: undefined,
    dictType: undefined,
    status: undefined,
    createTimeList: undefined,
    pageParam: {
      currentPage: 1,
      pageSize: 10
    }
  },
  // 状态字典
  statusOptions: [
    { value: 0, label: '正常' },
    { value: 1, label: '停用' }
  ]
})
const { queryParams, statusOptions } = toRefs(state)

// 查询字典类型列表
const getTableList = () => {
  loading.value = true
  listType(queryParams.value).then((res) => {
    if (res) {
      typeList.value = res.data
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
  queryParams.value.createTimeList = []
  proxy.resetForm('queryForm')
  handleDataSearch()
}
//  新增按钮操作
const handleDataAdd = (row) => {
  proxy.$refs.editFormRef.openEditForm(1)
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id)
  multiple.value = !selection.length
}
// 修改按钮操作
const handleDataEdit = async (row) => {
  proxy.$refs.editFormRef.openEditForm(2, row.id)
}
// 删除按钮操作
const handleDataDelete = (row) => {
  const dictIds = row.id ? [row.id] : ids.value
  proxy.$modal
    .confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', '警告')
    .then(() => {
      loading.value = true
      delType({ ids: dictIds }).then((res) => {
        loading.value = false
        if (res) {
          proxy.$modal.msgSuccess('删除成功')
          getTableList()
        }
      })
    })
    .catch(() => {
      proxy.$refs.dataTable.clearSelection()
    })
}
// 导出按钮操作
const handleFileExport = () => {
  proxy.$modal
    .confirm('是否确认导出所有类型数据项?')
    .then(async () => {
      await exportType(queryParams.value)
    })
    .catch(() => {})
}
const handleDictConfig = (row) => {
  dictId.value = row.id
  dictDataVisible.value = true
}
// 排序改变
const sortChange = (column) => {
  // 1-正序-ASC、2-逆序-DESC
  if (column.prop == null || column.order == null) {
    queryParams.value.pageParam.orderType = 1
    queryParams.value.pageParam.sortName = 'sort'
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
