<template>
  <!-- 背景 -->
  <vanta-background></vanta-background>
  <div class="login">
    <el-row class="main" :gutter="20">
      <el-col :md="10" :lg="7">
        <el-card class="box-card mb15">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div class="text-c">
              <userAvatar :user="userStore.userInfo" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <SvgIcon name="user" /> 用户账号
                <div class="pull-right">{{ userStore.userInfo.account }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="user" /> 用户昵称
                <div class="pull-right">
                  {{ userStore.userInfo.nickname }}
                </div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="phone" /> 手机号码
                <div class="pull-right">{{ userStore.userInfo.mobile }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="email" /> 用户邮箱
                <div class="pull-right">{{ userStore.userInfo.email }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="peoples" /> 所属角色
                <div class="pull-right">
                  <span>{{ userStore.userInfo.roleStr }}</span>
                </div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="peoples" /> 归属信息
                <div class="pull-right">
                  <span>{{ userStore.userInfo.tenantId }}</span>
                </div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="date" /> 创建时间
                <div class="pull-right">
                  {{ userStore.userInfo.createTime }}
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :md="14" :lg="17">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>修改密码</span>
            </div>
          </template>
          <el-form
            ref="pwdRef"
            label-width="80px"
            label-position="left"
            :model="user"
            :rules="rules">
            <p class="tip">
              您好，检测到您使用初始密码登录，为了您的账号安全，请修改密码。
            </p>
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="user.oldPassword"
                placeholder="请输入旧密码"
                type="password"
                show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="user.newPassword"
                placeholder="请输入新密码"
                type="password"
                show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="user.confirmPassword"
                placeholder="请确认密码"
                type="password"
                show-password />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleFormSubmit"
                >保存</el-button
              >
              <el-button type="danger" @click="handleClose">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="updatePassword">
// 组件
import VantaBackground from './vantaBackground/index' // 页面背景

// components
import userAvatar from '@/views/system/user/profile/UserAvatar.vue'
// store
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

import { updatePassword } from '@/api/system/user'

const { proxy } = getCurrentInstance()
const loading = ref(false)
const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})

const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      pattern:
        /^(?![\da-z]+$)(?![\dA-Z]+$)(?![\d!@#$%^&.*]+$)(?![a-zA-Z]+$)(?![a-z!@#$%^&.*]+$)(?![A-Z!@#$%^&.*]+$)[\da-zA-z!@#$%^&.*]{8,20}$/,
      message:
        '密码长度为8-20位，至少包含大写字母、小写字母、数字和特殊字符其中三种，特殊字符可包含 !@#$%^&.*',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ]
})

// 提交按钮
const handleFormSubmit = () => {
  proxy.$refs.pwdRef.validate((valid) => {
    if (valid) {
      loading.value = true
      updatePassword(user).then((res) => {
        loading.value = false
        if (res) {
          proxy.$modal.msgSuccess('修改成功，请重新登录')
          proxy.resetForm('pwdRef')
          userStore.logOut().then(() => {
            setTimeout(() => {
              location.href = import.meta.env.VITE_APP_ROUTER_PREFIX + 'index'
            })
          })
        }
      })
    }
  })
}
// 关闭按钮
const handleClose = () => {
  proxy.$modal
    .confirm('您的账号可能存在安全隐患，是否放弃修改密码？', '警告')
    .then(() => {
      userStore.logOut().then(() => {
        setTimeout(() => {
          location.href = import.meta.env.VITE_APP_ROUTER_PREFIX + 'index'
        })
      })
      // done()
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/login.scss';
.main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10%;
}
.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 13px;
  &:first-child {
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.pull-right {
  float: right !important;
}
.tip {
  text-align: center;
  font-weight: 600;
  color: var(--el-color-danger);
  margin-top: 0;
}
</style>
