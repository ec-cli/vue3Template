<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description: 上传头像
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-10-30 09:26:44
-->
<template>
  <div class="user-info-head" @click="editCropper">
    <!-- <img :src="options.img" title="点击上传头像" class="img-circle img-lg" /> -->
    <el-avatar shape="circle" :size="120" :src="options.img" />
  </div>
  <el-dialog
    v-model="open"
    width="500px"
    append-to-body
    :title="title"
    @opened="modalOpened"
    @close="closeDialog">
    <el-row>
      <el-col :xs="24" :md="24" :style="{ height: '350px' }">
        <vue-cropper
          v-if="visible"
          ref="cropper"
          :info="true"
          :img="options.img"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime" />
      </el-col>
      <!-- <el-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="avatar-upload-preview">
          <img :src="options.previews.url" :style="options.previews.img" />
        </div>
      </el-col> -->
    </el-row>
    <br />
    <el-row class="mb20 text-l">
      <el-col :span="24">
        <el-button icon="Plus" @click="changeScale(1)"></el-button>
        <el-button icon="Minus" @click="changeScale(-1)"></el-button>
        <el-button icon="RefreshLeft" @click="rotateLeft()"></el-button>
        <el-button icon="RefreshRight" @click="rotateRight()"></el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-upload
          action="#"
          accept=".jpg, .png"
          :http-request="requestUpload"
          :show-file-list="false"
          :on-change="beforeUpload">
          <el-button>
            选择
            <el-icon class="el-icon--right">
              <Upload />
            </el-icon>
          </el-button>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" :loading="loading" @click="handleFormSubmit"
          >提 交</el-button
        >
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { getBase64 } from '@/utils/index'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import useUserStore from '@/store/modules/user'
// api
import { uploadAvatar } from '@/api/system/user'

// props
const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})
// 用户store
const useStore = useUserStore()
const { proxy } = getCurrentInstance()
const loading = ref(false)
// 弹窗是否展示
const open = ref(false)
// 图片裁剪是否展示
const visible = ref(false)
const title = ref('修改头像')
// 图片裁剪数据
const options = reactive({
  img: useStore.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 150, // 默认生成截图框宽度
  autoCropHeight: 150, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  previews: {} // 预览数据
})

// 编辑头像
const editCropper = () => {
  open.value = true
}
// 打开弹出层结束时的回调
const modalOpened = () => {
  visible.value = true
}
// 覆盖默认上传行为
const requestUpload = () => {}

// 向左旋转
const rotateLeft = () => {
  proxy.$refs.cropper.rotateLeft()
}
// 向右旋转
const rotateRight = () => {
  proxy.$refs.cropper.rotateRight()
}
// 图片缩放
const changeScale = (num) => {
  num = num || 1
  proxy.$refs.cropper.changeScale(num)
}
// 上传预处理
const beforeUpload = (file) => {
  getBase64(file.raw).then((res) => {
    options.img = res
  })
}
// 保存头像
const handleFormSubmit = () => {
  proxy.$refs.cropper.getCropBlob((data) => {
    const FM = new FormData()
    FM.append('avatar', data)
    loading.value = true
    uploadAvatar(FM).then((res) => {
      loading.value = false
      if (res) {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        setTimeout(() => {
          useUserStore()
            .getInfo()
            .then((res) => {
              options.img = res.avatar
            })
        }, 1)
      }
    })
  })
}
// 实时预览
const realTime = (data) => {
  options.previews = data
}
// 关闭窗口
const closeDialog = () => {
  options.img = useStore.avatar
  options.visible = false
}
</script>

<style lang="scss" scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 120px;
  img {
    width: 100%;
  }
}

.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 120px;
  border-radius: 50%;
}
</style>
