<!--
 * @Author: rk
 * @Description: 文件上传结果弹窗
 * @Date: 2023-09-11 16:18:46
 * @LastEditors: rk
 * @LastEditTime: 2024-03-27 16:43:23
-->
<template>
  <el-dialog
    v-model="importResultDialog.visible"
    title="文件上传结果"
    class="upload-result-dialog"
    width="800px"
    top="10vh"
    :close-on-click-modal="true"
    :append-to-body="true">
    <div v-if="importResultDialog.data" class="upload-result-box">
      <div class="upload-result-num-box">
        <span class="primary"
          >上传文件总数：<b>{{ importResultDialog.data.totalCount }}</b></span
        >
        <span class="success"
          >上传成功文件数：<b>{{
            importResultDialog.data.successCount
          }}</b></span
        >
        <span class="error"
          >上传失败文件数：<b>{{ importResultDialog.data.failCount }}</b></span
        >
      </div>
      <h2 class="error-title"><i class="el-icon-error"></i> 错误信息：</h2>
      <ul class="error-list">
        <li
          v-show="!item.success"
          v-for="(item, i) in importResultDialog.data.fileUploadVOList"
          :key="i">
          {{ i + 1 + '：' + item.fileName + '-' + item.failReason }}
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="right" size="small" @click="closeDialog"
        >关闭</el-button
      >
    </span>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  importResultDialog: {
    type: Object,
    default: () => ({})
  }
})
const closeDialog = () => {
  props.importResultDialog.visible = false
}
</script>
<style scoped lang="scss">
.upload-result-dialog {
  .upload-result-box {
    padding: 0 20px;
    .upload-result-num-box {
      text-align: center;
      font-size: 16px;
      span {
        margin: 0 10px;
        &.primary {
          b {
            color: var(--el-color-primary);
          }
        }
        &.success {
          b {
            color: var(--el-color-success);
          }
        }
        &.error {
          b {
            color: var(--el-color-danger);
          }
        }
      }
    }
    .error-title {
      font-size: 16px;
      line-height: 60px;
      color: var(--el-color-danger);
    }
    .error-list {
      li {
        line-height: 40px;
        text-indent: 2em;
        color: var(--el-color-danger);
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
