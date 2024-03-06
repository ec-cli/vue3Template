<!--
 * @Author: rk
 * @Description: 字典数据详情
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:47:01
-->
<template>
  <el-form ref="queryForm" :inline="true" :model="queryParams">
    <el-form-item label="字典名称" prop="dictType">
      <el-select v-model="queryParams.dictType" @change="handleDataSearch">
        <el-option
          v-for="item in typeOptions"
          :key="item.dictId"
          :label="item.dictName"
          :value="item.dictType" />
      </el-select>
    </el-form-item>
    <el-form-item label="字典标签" prop="dictLabel">
      <el-input
        v-model="queryParams.dictLabel"
        placeholder="请输入字典标签"
        style="width: 200px"
        clearable
        @clear="handleDataSearch"
        @keyup.enter="handleDataSearch" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="search" v-throttle="handleDataSearch"
        >搜索</el-button
      >
      <el-button icon="refresh" v-throttle="handleFormReset">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
        v-hasPermi="['system:dict:add']"
        type="primary"
        icon="plus"
        plain
        @click="handleDataAdd"
        >新增数据</el-button
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
  </el-row>
  <el-table
    v-loading="loading"
    ref="dataTable"
    :data="dataList"
    @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="字典编码" align="center" prop="id" />
    <el-table-column label="字典标签" align="center" prop="dictLabel">
      <template #default="scope">
        <span
          v-if="scope.row.listClass == '' || scope.row.listClass == 'default'"
          :class="scope.row.cssClass"
          >{{ scope.row.dictLabel }}</span
        >
        <el-tag
          v-else
          :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass"
          :class="scope.row.cssClass"
          >{{ scope.row.dictLabel }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="字典键值"
      align="center"
      prop="dictValue"
      sortable />
    <el-table-column label="字典排序" align="center" prop="dictSort" sortable />
    <el-table-column
      label="备注"
      align="center"
      prop="remark"
      :show-overflow-tooltip="true" />
    <el-table-column label="操作" align="center" width="130px">
      <template #default="scope">
        <div v-if="scope.row.id > 0">
          <el-button
            v-hasPermi="['system:dict:edit']"
            type="primary"
            icon="edit"
            text
            @click="handleDataEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-hasPermi="['system:dict:remove']"
            type="danger"
            icon="delete"
            text
            @click="handleDataDelete(scope.row)"
            >删除
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

  <!-- 添加或修改参数配置对话框 -->
  <el-dialog
    v-model="open"
    width="500px"
    draggable
    append-to-body
    :title="title">
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" :disabled="true" />
      </el-form-item>
      <el-form-item label="数据标签" prop="dictLabel">
        <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
      </el-form-item>
      <el-form-item label="数据键值" prop="dictValue">
        <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
      </el-form-item>
      <el-form-item label="显示排序" prop="dictSort">
        <el-input-number
          v-model="form.dictSort"
          controls-position="right"
          :min="0" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleFormCancel">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup name="dictData">
// api
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
  exportData
} from '@/api/system/dict/data'
import { listType, getType } from '@/api/system/dict/type'

const { proxy } = getCurrentInstance()
const props = defineProps({
  dictId: {
    type: Number,
    default: 0
  }
})

const loading = ref(false)
// 选中数组
const ids = ref([])
// 非多个禁用
const multiple = ref(true)
// 总条数
const total = ref(0)
// 字典表格数据
const dataList = ref([])
// 默认字典类型
const defaultDictType = ref('')
// 弹出层标题
const title = ref('')
// 是否显示弹出层
const open = ref(false)
// 类型数据字典
const typeOptions = ref([])
// 查询参数
const queryParams = reactive({
  dictName: undefined,
  dictType: undefined,
  pageParam: {
    currentPage: 1,
    pageSize: 10
  }
})
// 表单参数
const formRef = ref()
const state = reactive({
  form: {},
  rules: {
    dictLabel: [
      { required: true, message: '数据标签不能为空', trigger: 'blur' }
    ],
    dictValue: [
      { required: true, message: '数据键值不能为空', trigger: 'blur' }
    ],
    dictSort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }]
  }
})

const { form, rules } = toRefs(state)

// 查询字典类型详细
const getTypeInfo = (dictId) => {
  getType({ id: dictId }).then((response) => {
    if (response) {
      queryParams.dictType = response.dictType
      defaultDictType.value = response.dictType
      getTableList()
    }
  })
}
// 查询字典类型列表
const getTypeList = () => {
  const obj = {
    dictName: undefined,
    dictType: undefined,
    createTime: [],
    pageParam: {
      currentPage: 1,
      pageSize: 100000
    }
  }
  listType(obj).then((res) => {
    if (res) {
      typeOptions.value = res.list
    }
  })
}

// 查询字典数据列表
const getTableList = () => {
  loading.value = true
  listData(queryParams).then((res) => {
    if (res) {
      dataList.value = res.data
      total.value = res.total
    }
    setTimeout(() => {
      loading.value = false
    }, 1000)
  })
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id)
  multiple.value = !selection.length
}
// 取消按钮
const handleFormCancel = () => {
  open.value = false
  handleFormReset()
}
// 表单重置
const resetForm = () => {
  form.value = {
    id: undefined,
    dictLabel: undefined,
    dictValue: undefined,
    dictSort: 0,
    remark: undefined
  }
  proxy.resetForm('formRef')
}

// 搜索按钮操作
const handleDataSearch = () => {
  queryParams.currentPage = 1
  getTableList()
}

// 重置按钮操作
const handleFormReset = () => {
  proxy.resetForm('queryForm')
  queryParams.dictType = defaultDictType.value
  handleDataSearch()
}
// 新增按钮操作
const handleDataAdd = () => {
  resetForm()
  open.value = true
  title.value = '添加字典数据'
  form.value.dictType = queryParams.dictType
}
// 修改按钮操作
const handleDataEdit = (id) => {
  resetForm()
  getData({ id }).then((res) => {
    if (res) {
      form.value = res
      open.value = true
      title.value = '修改字典数据'
    }
  })
}
// 提交按钮
const handleFormSubmit = () => {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.id !== undefined) {
        updateData(form.value).then((res) => {
          if (res) {
            proxy.$modal.msgSuccess('修改成功')
            open.value = false
            getTableList()
          }
        })
      } else {
        addData(form.value).then((res) => {
          if (res) {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            getTableList()
          }
        })
      }
    }
  })
}

// 删除按钮操作
const handleDataDelete = (row) => {
  const dictCodes = row.id ? [row.id] : ids.value
  proxy.$modal
    .confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项?', '警告')
    .then(() => {
      loading.value = true
      delData(dictCodes).then((res) => {
        if (res) {
          proxy.$modal.msgSuccess('删除成功')
          getTableList()
        }
        setTimeout(() => {
          loading.value = false
        }, 1000)
      })
    })
    .catch(() => {
      proxy.$refs.dataTable.clearSelection()
    })
}

// 导出按钮操作
const handleFileExport = () => {
  proxy.$modal.confirm('是否确认导出所有类型数据项?').then(async () => {
    await exportData(queryParams.value)
  })
}

watch(
  () => props.dictId,
  (newVal, oldValue) => {
    if (newVal) {
      getTypeInfo(newVal)
      getTypeList()
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
