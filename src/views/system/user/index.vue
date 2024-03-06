<!--
 * @Author: rk
 * @Description: 用户管理
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 15:21:51
-->
<template>
  <div class="app-container">
    <el-row :gutter="10">
      <!--部门数据-->
      <!-- <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick" />
        </div>
      </el-col> -->
      <!--用户数据-->
      <!-- <el-col :lg="20" :xm="24"> -->
      <el-col :lg="24" :xm="24">
        <el-card class="search-card" v-show="showSearch">
          <el-form
            v-show="showSearch"
            ref="queryRef"
            :inline="true"
            :model="queryParams">
            <el-form-item label="用户名称" prop="account">
              <el-input
                v-model="queryParams.account"
                placeholder="请输入用户名称"
                clearable
                @clear="handleDataSearch"
                @keyup.enter="handleDataSearch" />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input
                v-model="queryParams.mobile"
                placeholder="请输入手机号码"
                clearable
                @clear="handleDataSearch"
                @keyup.enter="handleDataSearch" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                @change="handleDataSearch">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value" />
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
              <el-button
                type="primary"
                icon="search"
                v-throttle="handleDataSearch"
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
            <el-col :span="12">
              <el-button
                v-hasPermi="['system:user:add']"
                type="primary"
                icon="Plus"
                plain
                @click="handleDataAdd">
                新增
              </el-button>
              <el-button
                v-hasPermi="['sys:user:remove']"
                type="danger"
                icon="Delete"
                plain
                :disabled="multiple"
                @click="handleDataDelete">
                删除
              </el-button>
              <el-button
                v-hasPermi="['system:user:import']"
                type="warning"
                icon="Upload"
                plain
                @click="handleFileImport">
                导入
              </el-button>
              <el-button
                v-hasPermi="['system:user:export']"
                type="success"
                icon="Download"
                plain
                @click="handleFileExport">
                导出
              </el-button>
            </el-col>
            <right-toolbar
              v-model:showSearch="showSearch"
              :columns="columns"
              @query-table="getTableList"></right-toolbar>
          </el-row>

          <el-table
            v-loading="loading"
            ref="dataTable"
            :data="userList"
            :default-sort="defaultSort"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange">
            <el-table-column
              type="selection"
              width="50"
              align="center"
              :selectable="selectable" />
            <el-table-column
              v-if="columns.showColumn('id')"
              label="用户编号"
              align="center"
              key="id"
              prop="id"
              sortable="custom"
              min-width="110" />
            <el-table-column
              v-if="columns.showColumn('account')"
              label="用户名称"
              align="center"
              key="account"
              prop="account"
              sortable="custom"
              min-width="110"
              :show-overflow-tooltip="true" />
            <el-table-column
              v-if="columns.showColumn('nickname')"
              label="用户昵称"
              align="center"
              key="nickname"
              prop="nickname"
              sortable="custom"
              min-width="110"
              :show-overflow-tooltip="true" />

            <!-- <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="deptName"
            v-if="columns.showColumn('deptName')"
            :show-overflow-tooltip="true" /> -->
            <el-table-column
              v-if="columns.showColumn('mobile')"
              label="手机号码"
              align="center"
              prop="mobile"
              key="mobile"
              min-width="120"
              sortable="custom"
              :show-overflow-tooltip="true" />
            <el-table-column
              v-if="columns.showColumn('status')"
              key="status"
              label="状态"
              align="center"
              prop="status"
              sortable="custom"
              min-width="80">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="0"
                  :inactive-value="1"
                  :disabled="
                    scope.row.id === 1 || scope.row.account === 'admin'
                  "
                  @change="handleStatusChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns.showColumn('lockstatus')"
              key="lockstatus"
              label="是否被锁定"
              align="center"
              prop="lockstatus"
              sortable="custom"
              min-width="100">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.lockstatus"
                  :active-value="1"
                  :inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns.showColumn('createTime')"
              label="创建时间"
              align="center"
              prop="createTime"
              min-width="180"
              sortable="custom"
              :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              v-if="columns.showColumn('gender')"
              prop="gender"
              label="性别"
              align="center"
              sortable="custom"
              min-width="80">
              <template #default="scope">
                <el-tag
                  :type="['primary', 'danger', 'warning'][scope.row.gender]"
                  >{{ dictionaryMatch(scope.row.gender, sexOptions) }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns.showColumn('avatar')"
              prop="avatar"
              label="头像地址"
              align="center"
              min-width="90">
              <template #default="scope">
                <el-image
                  class="avatar"
                  fit="contain"
                  preview-teleported
                  lazy
                  :hide-on-click-modal="true"
                  :src="scope.row.avatar"
                  :preview-src-list="[scope.row.avatar]">
                  <div>
                    <el-icon :size="15"><document /></el-icon>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              v-if="columns.showColumn('email')"
              prop="email"
              label="用户邮箱"
              align="center"
              sortable="custom"
              min-width="120"
              :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" min-width="350">
              <template #default="scope">
                <el-button
                  v-if="scope.row.id !== 1"
                  v-hasPermi="['system:user:edit']"
                  type="primary"
                  icon="Edit"
                  text
                  @click="handleDataEdit(scope.row)">
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.id !== 1"
                  v-hasPermi="['system:user:remove']"
                  type="danger"
                  icon="Delete"
                  text
                  @click="handleDataDelete(scope.row)">
                  删除
                </el-button>
                <el-button
                  v-if="scope.row.id !== 1"
                  v-hasPermi="['system:user:reset-password']"
                  type="success"
                  icon="Key"
                  title="重置密码"
                  text
                  @click="handleResetPwd(scope.row)">
                  重置密码</el-button
                >
                <el-button
                  v-if="scope.row.id !== 1"
                  v-hasPermi="['system:user:set-role']"
                  type="warning"
                  icon="CircleCheck"
                  text
                  @click="handleSetRole(scope.row)">
                  分配角色</el-button
                >
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <EditForm ref="editFormRef" @get-edit-result="getTableList"></EditForm>

    <!-- 用户导入对话框 -->
    <ImportFile ref="uploadRef" @get-upload-result="getTableList"></ImportFile>

    <!-- 分配角色 -->
    <AssigningRoles
      :params-data="paramsData"
      @get-role-result="getRoleResult"></AssigningRoles>
  </div>
</template>

<script setup name="user">
// api
// import { treeselect } from '@/api/system/dept'
import { listAll } from '@/api/system/role'
import {
  changeUserStatus,
  listUser,
  resetUserPwd,
  delUser,
  exportUser,
  queryRoleMenus
} from '@/api/system/user'
// component
import AssigningRoles from './component/AssigningRoles.vue'
import EditForm from './component/EditForm.vue'
import ImportFile from './component/ImportFile.vue'
// utils
import { dictionaryMatch, deepClone } from '@/utils'

// 获取当前组件实例，proxy类似于vue2的this
const { proxy } = getCurrentInstance()

// 表格总条数
const total = ref(0)
// 用户表格数据
const userList = ref([])
const loading = ref(false)
// 是否展示搜索条件
const showSearch = ref(true)
// 多选id集合
const ids = ref([])
// 是否多选
const multiple = ref(true)
// 部门名称
const deptName = ref('')
// 部门数据
// const deptOptions = ref(undefined)
// 角色弹窗数据
const paramsData = ref({})
// 修改|编辑dom
const editFormRef = ref(null)
// 导入弹窗dom
const uploadRef = ref(null)

// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true, prop: 'id' },
  { key: 1, label: `用户名称`, visible: true, prop: 'account' },
  { key: 2, label: `用户昵称`, visible: true, prop: 'nickname' },
  { key: 3, label: `部门`, visible: true, prop: 'deptName' },
  { key: 4, label: `手机号码`, visible: true, prop: 'mobile' },
  { key: 5, label: `状态`, visible: true, prop: 'status' },
  { key: 6, label: `创建时间`, visible: true, prop: 'createTime' },
  { key: 7, label: `性别`, visible: false, prop: 'gender' },
  { key: 8, label: `头像`, visible: false, prop: 'avatar' },
  { key: 9, label: `邮箱`, visible: false, prop: 'email' }
  // { key: 10, label: `最后登录时间`, visible: false, prop: 'loginDate' }
])

// 查询条件
const queryParams = reactive({
  account: undefined,
  mobile: undefined,
  status: undefined,
  createTime: [],
  deptId: undefined,
  pageParam: {
    currentPage: 1,
    pageSize: 10,
    orderType: 1,
    sortName: 'id'
  }
})
// 性别字典
const sexOptions = reactive([
  { value: 0, label: '男' },
  { value: 1, label: '女' },
  { value: 2, label: '未知' }
])
// 状态字典
const statusOptions = reactive([
  { value: 0, label: '正常' },
  { value: 1, label: '停用' }
])
// 默认排序
const defaultSort = reactive({ prop: 'id', order: 'ascending' })

/** 根据名称筛选部门树 */
watch(deptName, (val) => {
  proxy.$refs['deptTreeRef'].filter(val)
})

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

// /** 通过条件过滤节点  */
// const filterNode = (value, data) => {
//   if (!value) return true
//   return data.label.indexOf(value) !== -1
// }

// /** 查询部门下拉树结构 */
// const getTreeselect = () => {
//   treeselect().then((res) => {
//     if (res) {
//       deptOptions.value = res.data
//     }
//   })
// }

/** 查询用户列表 */
const getTableList = () => {
  loading.value = true
  listUser(queryParams).then((res) => {
    loading.value = false
    if (res) {
      userList.value = res.data
      total.value = res.total
    }
  })
}

/** 节点单击事件 */
// const handleNodeClick = (data) => {
//   queryParams.deptId = data.id
//   handleDataSearch()
// }

/** 搜索按钮操作 */
const handleDataSearch = () => {
  queryParams.pageParam.currentPage = 1
  getTableList()
}

/** 重置按钮操作 */
const handleFormReset = () => {
  proxy.resetForm('queryRef')
  handleDataSearch()
}

/** 删除按钮操作 */
const handleDataDelete = (row) => {
  const cIds = row.id ? [row.id] : ids.value
  proxy.$modal
    .confirm('是否确认删除用户编号为"' + cIds + '"的数据项？', '警告')
    .then(() => {
      loading.value = true
      delUser({ ids: cIds }).then((res) => {
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

/** 导出按钮操作 */
const handleFileExport = () => {
  const obj = deepClone(queryParams)
  delete obj.pageParam
  proxy.$modal
    .confirm('是否确认导出所有用户数据项?')
    .then(async () => {
      await exportUser(obj)
    })
    .catch(() => {})
}

/** 用户状态修改  */
const handleStatusChange = (row) => {
  const text = row.status === 0 ? '启用' : '停用'
  const obj = {
    id: row.id,
    status: row.status
  }
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.account + '"用户吗?', '警告')
    .then(() => {
      changeUserStatus(obj).then((res) => {
        if (res) {
          proxy.$modal.msgSuccess(text + '成功')
        }
      })
    })
    .catch(function () {
      row.status = row.status === 1 ? 0 : 1
    })
}

/** 重置密码按钮操作 */
const handleResetPwd = (row) => {
  proxy
    .$prompt('请输入"' + row.account + '"的新密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: '用户密码长度必须介于 5 和 20 之间'
    })
    .then(({ value }) => {
      const obj = {
        id: row.id,
        password: value
      }
      resetUserPwd(obj).then((res) => {
        if (res) {
          proxy.$modal.msgSuccess('修改成功，新密码是：' + value)
        }
      })
    })
    .catch(() => {})
}

// 多选禁止选择管理员账号
const selectable = (row, index) => {
  if (row.id === 1) {
    return false
  } else {
    return true
  }
}

/** 选择条数  */
const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id)
  multiple.value = !selection.length
}

/** 初始化部门数据 */
// const initTreeData = () => {
//   // 判断部门的数据是否存在，存在不获取，不存在则获取
//   if (!deptOptions.value) {
//     treeselect().then((res) => {
//       if (res) {
//         deptOptions.value = res.data
//       }
//     })
//   }
// }

// 获取角色列表
const getTableListRole = async () => {
  return await listAll()
}

// 根据角色id查询当前角色拥有的菜单id列表
const queryRoleIds = async (roleId) => {
  return await queryRoleMenus(roleId)
}

// 分配角色
const handleSetRole = async (row) => {
  // 查询所有角色
  const allRole = await getTableListRole()
  // 查询用户拥有的角色
  const roleIds = await queryRoleIds(row.id)
  paramsData.value = {
    visible: true,
    id: row.id,
    account: row.account,
    nickname: row.nickname,
    allRole,
    roleIds
  }
}

// 分配角色回调
const getRoleResult = () => {
  paramsData.value.visible = false
  getTableList()
}

// 新增：
const handleDataAdd = (row) => {
  editFormRef.value.openEditForm(1, row)
}

// 修改按钮操作
const handleDataEdit = async (row) => {
  editFormRef.value.openEditForm(2, row)
}

// 导入组件
const handleFileImport = () => {
  uploadRef.value.openUploadForm()
}

/**
 * 解决编辑时角色选中不了问题
 */
// const selectRole = (e) => {
//   proxy.$forceUpdate()
// }

// getTreeselect()
getTableList()
</script>
<style scoped>
.avatar {
  width: 40px;
}
</style>
