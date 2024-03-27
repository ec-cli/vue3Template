<!--
 * @Author: rk
 * @Description: 首页
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2024-03-27 16:47:45
-->
<template>
  <div class="home">
    <!-- 用户信息 -->
    <el-row :gutter="15">
      <el-col class="mb15" :md="24" :lg="16" :xl="16">
        <el-card>
          <div class="user-item">
            <div class="user-item-left">
              <el-avatar shape="circle" :size="60" :src="useStore.avatar" />
            </div>
            <div class="user-item-right">
              <el-row>
                <el-col
                  class="right-title mb20 one-text-overflow"
                  :xs="24"
                  :md="24">
                  {{ welcomeMessage }}
                  <strong>{{ userInfo.nickname || userInfo.account }}</strong>
                  欢迎回来。
                </el-col>
              </el-row>
              <el-row>
                <router-link to="/user/profile">
                  <el-button icon="edit">修改信息</el-button></router-link
                >
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col class="mb15" :lg="8" :xl="8">
        <el-card style="height: 100%">
          <div class="text-warning mb10">{{ currentTime }} {{ weekName }}</div>
          <!-- <div>今日电价：{{ userInfo.loginDate }}</div> -->
        </el-card>
      </el-col>
    </el-row>
    <!-- 常用功能 -->
    <el-row :gutter="15">
      <el-col class="mb10" :md="24" :lg="24" :xl="24">
        <el-card>
          <template #header>
            <el-row>
              <el-col :span="12">
                <span><SvgIcon name="tool" /> 常用功能</span>
              </el-col>
              <el-col class="text-r" :span="12">
                <el-button type="primary" text @click="handleDataAdd"
                  >新增</el-button
                >
              </el-col>
            </el-row>
          </template>
          <div class="info">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <CommonMenu v-model="showEdit"></CommonMenu
            ></el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="index">
import CommonMenu from './component/CommonMenu' // 常用功能组件
import useUserStore from '@/store/modules/user'
import { getWeek } from '@/utils/date'
const useStore = useUserStore()
const showEdit = ref(false)
const { proxy } = getCurrentInstance()
const userInfo = computed(() => {
  return useUserStore().userInfo
})
const currentTime = computed(() => {
  return proxy.parseTime(new Date(), 'YYYY-MM-DD')
})
const weekName = getWeek()

const getWelcomeMessage = () => {
  const h = new Date().getHours()
  let str = ''
  if (h < 6) {
    str = '凌晨好'
  } else if (h >= 6 && h < 12) {
    str = '上午好'
  } else if (h >= 12 && h < 13) {
    str = '中午好'
  } else if (h >= 13 && h < 19) {
    str = '下午好'
  } else {
    str = '晚上好'
  }
  return str
}
const welcomeMessage = getWelcomeMessage()

const handleDataAdd = () => {
  proxy.$modal.msg('请通过搜索添加！')
}
</script>

<style lang="scss" scoped>
.home {
  .home-card-more {
    float: right;
    padding: 3px 0;
    font-size: 13px;
  }

  .user-item {
    // height: 198px;
    display: flex;
    align-items: center;
    .user-item-left {
      width: 60px;
      height: 60px;
      overflow: hidden;
      margin-right: 10px;
    }
    .user-item-right {
      flex: 1;
      .right-title {
        font-size: 20px;
      }
    }
  }
  .info {
    height: 200px;
    // overflow-y: scroll;
  }
}
</style>
