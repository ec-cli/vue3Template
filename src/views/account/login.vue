<template>
  <!-- 背景 -->
  <vanta-background></vanta-background>

  <div class="login">
    <div class="login-header">
      <div class="logo"></div>
      <div class="txt">
        <h2>xxxx管理平台</h2>
        <h4>Resource Aggregation Management Platform</h4>
      </div>
    </div>
    <div class="login-content">
      <div class="login-content-left">
        <div class="img"></div>
      </div>
      <div class="login-content-right">
        <div class="login-form" v-loading="pageLoading">
          <el-form
            ref="loginRef"
            :model="loginForm"
            :rules="loginRules"
            :disabled="loading">
            <h3 class="title">欢迎登录</h3>
            <!-- 账号 -->
            <el-form-item prop="username">
              <el-input
                v-model.trim="loginForm.username"
                type="text"
                auto-complete="off"
                placeholder="账号">
                <template #prefix>
                  <SvgIcon name="user" class="input-icon" />
                </template>
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="密码"
                show-password
                @keyup.enter="handlerLoginClick">
                <template #prefix>
                  <SvgIcon name="password" class="input-icon" />
                </template>
              </el-input>
            </el-form-item>
            <!-- 图片验证码 captchaType 为 inputWord 时显示 -->
            <el-form-item v-if="captchaType === 'inputWord'" prop="code">
              <el-input
                v-model="loginForm.code"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter="handlerLoginClick">
                <template #prefix>
                  <SvgIcon name="validCode" class="input-icon" />
                </template>
              </el-input>
              <div class="login-code">
                <span v-if="!codeUrl">图片加载中...</span>
                <img
                  v-else
                  class="login-code-img"
                  :src="codeUrl"
                  @click="getCode" />
              </div>
            </el-form-item>

            <div style="display: flex; justify-content: space-between">
              <el-checkbox v-model="loginForm.rememberMe">记住账号</el-checkbox>
              <span style="font-size: 12px; line-height: 32px">
                <span class="forget-pwd" @click="handleForgetPwd()"
                  >忘记密码</span
                >
                <router-link v-if="register" class="link-type" :to="'/register'"
                  >注册</router-link
                >
              </span>
            </div>

            <el-form-item class="mt5" style="width: 100%">
              <el-button
                :loading="loading"
                size="default"
                type="primary"
                style="width: 100%"
                @click.prevent="handlerLoginClick">
                <span v-if="!loading">登录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <div v-html="defaultSettings.copyright"></div>
    </div>
  </div>
  <!-- 人机验证 点选｜滑动 -->
  <Verify
    v-if="captchaType === 'blockPuzzle' || captchaType === 'clickWord'"
    ref="verify"
    mode="pop"
    :captcha-type="captchaType"
    :img-size="{ width: '330px', height: '155px' }"
    @success="verifySuccess"></Verify>
</template>

<script setup name="login">
// 组件
import VantaBackground from './vantaBackground/index' // 页面背景
import Verify from './verifition/index' // 验证码
// api
import { getCaptcha, getCaptchaTypeApi } from '@/api/system/login'

import { ref, getCurrentInstance } from 'vue'
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
// 登录form表单
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
  code: '' // 当captchaType 为 inputWord 时使用
})
// 域名信息
const host = window.location.host
// form校验规则
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
}
// 登录人机验证方式
const captchaType = ref('')
// 验证码图片 captchaType 为 inputWord 时使用
const codeUrl = ref('')
// 验证码token 当captchaType 为 inputWord 时使用
const codeToken = ref('')
// 人机验证开关 captchaType 为 blockPuzzle 或 clickWord 时使用
const verify = ref(null)
// 注册开关
const register = ref(false)
// loading
const loading = ref(false)
// pageLoading
const pageLoading = ref(false)
// 路由重定向地址
const redirect = ref()
redirect.value = route.query.redirect

// 登录按钮点击事件
const handlerLoginClick = () => {
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      // 勾选了需要记住密码设置在cookie中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('username', loginForm.value.username, {
          expires: 30,
          path: host
        })
        Cookies.set('rememberMe', loginForm.value.rememberMe, {
          expires: 30,
          path: host
        })
      } else {
        // 否则移除
        Cookies.remove('username')
        Cookies.remove('rememberMe')
      }
      // 调用人机验证 如果登录验证方式为 滑动拼图（blockPuzzle）或 点选文字（clickWord）时需要调用人机验证
      if (
        captchaType.value === 'blockPuzzle' ||
        captchaType.value === 'clickWord'
      ) {
        verify.value.show()
      } else {
        // 图片验证码方式直接登录
        handleLoginSubmit()
      }
    }
  })
}
// 人机验证回调
const verifySuccess = (params) => {
  // params 返回的二次验证参数, 和登录参数一起回传给登录接口，后台进行二次验证
  handleLoginSubmit(params.captchaVerification)
}
// 登录方法
const handleLoginSubmit = (captchaVerification) => {
  // 不传 captchaVerification 默认为图片字符验证码
  loading.value = true
  const loginParams = {
    account: loginForm.value.username,
    password: loginForm.value.password,
    captchaVerification: captchaVerification || loginForm.value.code,
    token: captchaType.value === 'inputWord' ? codeToken.value : null,
    captchaType: captchaType.value === 'inputWord' ? captchaType.value : null
  }
  // 调用action的登录方法
  userStore
    .login(loginParams)
    .then((res) => {
      if (res.errorCode === 500001) {
        getCode()
        loading.value = false
      } else {
        loading.value = false
        proxy.$modal.msgSuccess('登录成功')
        setTimeout(() => {
          router.push({ path: redirect.value || '/' })
        })
      }
    })
    .catch(() => {
      loading.value = false
    })
}
// 获取图片验证码
const getCode = () => {
  const data = {
    captchaType: captchaType.value
  }
  getCaptcha(data).then((res) => {
    codeUrl.value = 'data:image/gif;base64,' + res.originalImageBase64
    codeToken.value = res.token
  })
}
// 获取cookie信息
const getCookie = () => {
  const username = Cookies.get('username')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}
// 忘记密码
const handleForgetPwd = () => {
  proxy.$modal.msg('请联系管理员')
}

// 获取登录验证方式
const getCaptchaType = async () => {
  pageLoading.value = true
  const res = await getCaptchaTypeApi()
  pageLoading.value = false
  if (res) {
    captchaType.value = res
    // 当且仅当登录验证方式为图片字符（inputWord）的时候需要获取图片验证码
    if (captchaType.value === 'inputWord') {
      getCode()
    }
  }
}

// getCaptchaType()

getCookie()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/login.scss';
.forget-pwd {
  color: var(--el-text-color-placeholder);
  margin-right: 10px;
  cursor: pointer;
}
// 主要去除浏览器记住密码选择后的白色背景色
:deep(input:-webkit-autofill) {
  background-color: transparent !important;
  background-image: none;
  -webkit-text-fill-color: #fff !important; // 记住密码的字的颜色
  transition: background-color 5000s ease-in-out 0s; // 延时渲染背景色来去除背景色
  caret-color: #fff; // 光标颜色
}
</style>
