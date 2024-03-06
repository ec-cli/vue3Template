<!--
 * @Author: 夏天 likunxia@fpwis.com
 * @Date: 2023-10-08 16:50:09
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 10:28:26
 * @Description: 搜索框封装
-->
<template>
  <el-card class="mb15 search-card">
    <el-form
      ref="formRef"
      label-position="right"
      label-width="160"
      class="mt15"
      :model="baseFormData"
      :inline="true">
      <el-row>
        <el-col v-for="i in baseFormOptions" :key="i">
          <template v-if="i.type == 'input'">
            <el-form-item
              v-if="i.show()"
              style="width: 100%"
              :label="i.label"
              :prop="i.prop"
              :rules="i.rules">
              <el-input
                v-model="baseFormData[i.prop]"
                clearable
                :disabled="i.disabled()"
                :placeholder="'请输入' + i.label" />
            </el-form-item>
          </template>

          <template v-if="i.type == 'datePicker'">
            <el-form-item
              v-if="i.show()"
              style="width: 100%"
              :label="i.label"
              :prop="i.prop"
              :rules="i.rules">
              <el-date-picker
                v-model="baseFormData[i.prop]"
                type="daterange"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled="i.disabled()" />
            </el-form-item>
          </template>

          <template v-if="i.type == 'date'">
            <el-form-item
              v-if="i.show()"
              style="width: 100%"
              :label="i.label"
              :prop="i.prop"
              :rules="i.rules">
              <el-date-picker
                v-model="baseFormData[i.prop]"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :placeholder="'请选择' + i.label"
                :disabled="i.disabled()" />
            </el-form-item>
          </template>

          <template v-if="i.type == 'select'">
            <el-form-item
              v-if="i.show()"
              style="width: 100%"
              :label="i.label"
              :prop="i.prop"
              :rules="i.rules">
              <el-select
                v-model="baseFormData[i.prop]"
                style="width: 100%"
                remote
                clearable
                :filterable="i.filterable"
                :placeholder="'请选择' + i.label"
                :disabled="i.disabled()">
                <el-option
                  v-for="item in i.selectList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </template>
          <el-button type="primary" @click="handleFormSubmit">查询</el-button>
          <el-button type="warning" @click="handleFormReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script setup>
const { proxy } = getCurrentInstance()
const props = defineProps({
  baseFormOptions: {
    type: Object,
    require: true
  },
  baseFormData: {
    type: Object,
    require: true
  }
})
const formRef = ref(null)
const emits = defineEmits(['submit', 'reset'])

// 查询
const handleFormSubmit = () => {
  emits('submit')
}

//重置
const handleFormReset = () => {
  emits('reset')
}
</script>
<style lang="scss" scoped></style>
