<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description:
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 10:14:36
-->
<template>
  <vanta-background></vanta-background>
  <div class="login">
    <el-form ref="loginRef" class="login-form" :model="loginForm">
      <h3 class="title">{{ defaultSettings.title }}</h3>

      <div v-if="!loading" style="text-align: center" class="pb20">
        <el-empty
          v-if="!loading"
          description="未获取到授权信息，请返回重新授权登录" />
        <router-link class="link-type" :to="'/login'">返回登录</router-link>
      </div>
      <div v-else class="loading">登 录 中...</div>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <div v-html="defaultSettings.copyright"></div>
    </div>
  </div>
</template>
<script setup name="socialLogin">
import VantaBackground from './vantaBackground/index' // 页面背景
import { getQueryObject } from '@/utils/index'
import useUserStore from '@/store/modules/user'
import defaultSettings from '@/settings'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loginForm = ref(undefined)
const callbackQuery = ref(undefined)
const redirect = ref()
const authSource = ref('')
const loading = ref(false)
callbackQuery.value = getQueryObject()
redirect.value = route.query.redirect
authSource.value = route.query.authSource

// const userInfo = computed(() => {
//   return userStore.userInfo
// })
if (callbackQuery.value && callbackQuery.value.state != null) {
  loading.value = true
  // 调用action的登录方法
  userStore
    .oauthLogin(callbackQuery.value, { authSource: authSource.value })
    .then(() => {
      proxy.$modal.msgSuccess('登录成功')
      router.push({ path: redirect.value || '/' })
    })
    .catch((error) => {
      console.error('login-error', error)
      proxy.$modal.msgError(error.msg)
      loading.value = false
    })
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/components/login.scss';
.loading {
  text-align: center;
  color: #ccc;
  padding: 10px;
}
</style>
