<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 新增或修改菜单
 * @Date: 2023-08-22 18:27:42
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 09:47:23
-->
<template>
  <el-dialog
    v-model="editVisible.visible"
    width="720px"
    append-to-body
    :title="editVisible.title"
    :close-on-click-modal="false">
    <el-form ref="menuRef" label-width="120px" :model="form" :rules="rules">
      <el-row>
        <!-- 上级目录/菜单 -->
        <el-col :lg="24">
          <el-form-item label="上级菜单">
            <el-cascader
              v-model="form.parentId"
              class="w100"
              placeholder="请选择上级菜单"
              clearable
              :options="menuOptions"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'menuName',
                emitPath: false
              }">
              <template #default="{ node, data }">
                <span>{{ data.menuName }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <!-- 菜单类型 -->
        <el-col :lg="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 菜单名称 -->
        <el-col :lg="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model.trim="form.menuName"
              placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <!-- 组件名称 -->
        <el-col :lg="12" v-if="form.menuType !== 3">
          <el-form-item prop="sectionName">
            <template #label>
              <span>
                <el-tooltip content="使用大驼峰规则，并且唯一" placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                组件key
              </span>
            </template>
            <el-input
              v-model.trim="form.sectionName"
              placeholder="请输入组件key" />
          </el-form-item>
        </el-col>
        <!-- 显示顺序 -->
        <el-col :lg="12">
          <el-form-item label="显示顺序" prop="sort">
            <el-input-number
              v-model.trim="form.sort"
              controls-position="right"
              style="width: 100%"
              :min="0" />
          </el-form-item>
        </el-col>
        <!-- 菜单图标 -->
        <el-col :lg="24" v-if="form.menuType != 3">
          <el-form-item label="图标icon" prop="icon">
            <el-popover
              placement="bottom-start"
              trigger="click"
              :teleported="false"
              :width="540">
              <template #reference>
                <el-input
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  clearable
                  @click="handleIconSelect">
                  <template #prefix>
                    <SvgIcon v-if="form.icon" :name="form.icon" />
                    <el-icon v-else>
                      <search />
                    </el-icon>
                  </template>
                </el-input>
              </template>
              <icon-select ref="iconSelectRef" @selected="selected" />
            </el-popover>
          </el-form-item>
        </el-col>

        <!-- 是否外链 -->
        <el-col v-if="form.menuType != 3" :lg="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                是否外链
              </span>
            </template>
            <el-radio-group v-model="form.isFrame">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 路由地址 -->
        <el-col v-if="form.menuType != 3" :lg="12">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model.trim="form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <!-- 组件路径 -->
        <el-col v-if="form.menuType == 2" :lg="24">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input
              v-model.trim="form.component"
              placeholder="请输入组件路径">
              <template #prepend>
                <span>src/views/</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- 权限字符 -->
        <el-col v-if="form.menuType != 1" :lg="12">
          <el-form-item>
            <el-input
              v-model.trim="form.permission"
              placeholder="请输入权限标识"
              maxlength="100" />
            <template #label>
              <span>
                <el-tooltip
                  content="控制器中定义的权限字符，如：[ActionPermissionFilter(Permission = 'system:user:delete')])"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <!-- 是否缓存 -->
        <el-col v-if="form.menuType == 2" :lg="12">
          <el-form-item prop="isCache">
            <template #label>
              <span>
                <el-tooltip
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="form.isCache">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 是否显示 -->
        <el-col v-if="form.menuType != 3" :lg="12">
          <el-form-item prop="visible">
            <template #label>
              <span>
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                是否显示
              </span>
            </template>
            <el-radio-group v-model="form.visible">
              <el-radio
                v-for="dict in sys_show_hide"
                :key="dict.dictValue"
                :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 菜单状态 -->
        <el-col v-if="form.menuType != 3" :lg="12">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                  placement="top">
                  <el-icon :size="15">
                    <questionFilled />
                  </el-icon>
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.dictValue"
                :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleFormCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleFormSubmit"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>
<script setup>
// api
import { addMenu, updateMenu } from '@/api/system/menu'
// components
import SvgIcon from '@/components/SvgIcon'
import IconSelect from '@/components/IconSelect'
import { deepClone } from '@/utils'
const props = defineProps({
  // 上级菜单下拉树
  menuOptions: Array,
  default: () => []
})

const { proxy } = getCurrentInstance()
// icon选中dom
const iconSelectRef = ref(null)
// 菜单dom
const menuRef = ref(null)

const { menuOptions } = toRefs(props)
// 编辑窗口参数
const editVisible = reactive({
  visible: false, // 窗口开关
  title: '' // 窗口标题
})
// form表单
const state = reactive({
  form: {}, // 新增/修改form表单
  // 表单校验规则
  rules: {
    menuName: [
      { required: true, message: '菜单名称不能为空', trigger: 'blur' }
    ],
    sort: [
      { required: true, message: '菜单显示顺序不能为空', trigger: 'blur' }
    ],
    sectionName: [
      { required: true, message: '组件名称不能为空', trigger: 'blur' }
    ],
    path: [
      { required: true, message: '路由地址不能为空', trigger: 'blur' },
      {
        pattern: /^[A-Za-z].+$/,
        message: '输入格式不正确，字母开头',
        trigger: 'blur'
      }
    ],
    visible: [{ required: true, message: '显示状态不能为空', trigger: 'blur' }]
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
const loading = ref(false)
const { form, rules, sys_show_hide, sys_normal_disable } = toRefs(state)

const emit = defineEmits(['get-edit-result'])

// 打开新增｜编辑窗口
const openEditForm = (type, data) => {
  resetForms()
  if (type === 1) {
    // 新增
    if (data != null && data.id !== undefined) {
      form.value.parentId = data.id
    } else {
      form.value.parentId = 0
    }
    editVisible.title = '新增'
  } else {
    // 修改
    form.value = deepClone(data)
    editVisible.title = '编辑'
  }

  editVisible.visible = true
}
// 展示下拉图标
const handleIconSelect = () => {
  iconSelectRef.value.reset()
}
// 选择图标
const selected = (name) => {
  form.value.icon = name
}
// 表单重置
const resetForms = () => {
  form.value = {
    id: undefined, // 菜单id
    parentId: 0, // 上级菜单id
    menuName: undefined, // 菜单名称
    icon: undefined, // 菜单图标
    sectionName: undefined, // 组件名称
    menuType: 1, // 菜单类型
    sort: 99, // 显示顺序
    isFrame: 1, // 是否外链
    isCache: 1, // 是否缓存
    visible: 0, // 是否显示
    status: 0 // 菜单状态
  }
  proxy.resetForm('menuRef')
}
// 提交按钮操作
const handleFormSubmit = () => {
  proxy.$refs['menuRef'].validate((valid) => {
    if (valid) {
      if (form.value.id !== undefined) {
        loading.value = true
        updateMenu(form.value)
          .then((res) => {
            loading.value = false
            if (res) {
              proxy.$modal.msgSuccess('修改成功')
              editVisible.visible = false
              emit('get-edit-result', form.value.parentId)
            }
          })
          .catch(() => {
            loading.value = false
          })
      } else {
        loading.value = true
        addMenu(form.value).then((res) => {
          loading.value = false
          if (res) {
            proxy.$modal.msgSuccess('新增成功')
            editVisible.visible = false
            emit('get-edit-result', form.value.parentId)
          }
        })
      }
    }
  })
}
// 取消按钮操作
const handleFormCancel = () => {
  editVisible.visible = false
  setTimeout(() => {
    resetForms()
  }, 200)
}

defineExpose({ openEditForm })
</script>
<style lang="scss" scoped>
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px !important;
}
</style>
