<!--
 * @Author: rk
 * @Description: 导入弹窗
 * @Date: 2023-08-25 15:55:53
 * @LastEditors: rk
 * @LastEditTime: 2023-10-27 16:15:54
-->
<template>
  <el-dialog
    v-model="upload.open"
    width="500px"
    append-to-body
    :title="upload.title">
    <el-upload
      v-loading="upload.isUploading"
      name="file"
      ref="uploadRef"
      action=""
      accept=".xlsx,.xls"
      drag
      :auto-upload="false"
      :limit="1"
      v-model:file-list="fileList"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :before-upload="beforeUPload">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            style="font-size: 12px; vertical-align: baseline"
            :underline="false"
            @click="handleExportTemplate"
            >下载模板</el-link
          >
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="handleDialogCancel">取消</el-button>
      <el-button type="primary" @click="handleFormSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
// api
import { importTemplate, importUser } from '@/api/system/user'
const { proxy } = getCurrentInstance()

/** * 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false
})
// 导入文件数据
const fileList = ref([])
const emit = defineEmits(['get-upload-result'])

// 打开窗口
const openUploadForm = () => {
  resetForms()
  upload.open = true
  upload.title = '用户导入'
}
// 重置
const resetForms = () => {
  fileList.value = []
}
// 取消按钮操作
const handleDialogCancel = () => {
  upload.open = false
  resetForms()
}
// 文件变更
const handleFileChange = (file, fileList) => {
  fileList.value = fileList
}
// 文件删除
const handleFileRemove = (file, fileList) => {
  fileList.value = fileList
}
/** 提交上传文件 */
const handleFormSubmit = () => {
  const fd = new FormData()
  fd.append('file', fileList.value[0].raw)
  upload.isUploading = true
  importUser(fd).then((res) => {
    if (res) {
      proxy.$modal.msgSuccess('文件上传成功')
      upload.open = false
      emit('get-upload-result')
    }
    upload.isUploading = false
  })
}

/** 下载模板操作 */
const handleExportTemplate = () => {
  importTemplate()
}

// 给父组件暴漏方法
defineExpose({ openUploadForm })
</script>

<style scoped lang="scss"></style>
