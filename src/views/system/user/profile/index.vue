<!--
 * @Author: rk
 * @Description: 个人信息
 * @Date: 2023-08-23 09:47:45
 * @LastEditors: tuoyouxin@fpwis.com
 * @LastEditTime: 2023-10-31 11:21:08
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :md="10" :lg="7">
        <el-card class="mb15">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div class="text-c">
              <UserAvatar :user="userStore.userInfo" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <SvgIcon name="user" /> 用户账号
                <div class="pull-right">{{ userStore.userInfo.account }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="user" /> 用户昵称
                <div class="pull-right">{{ userStore.userInfo.nickname }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="phone" /> 手机号码
                <div class="pull-right">{{ userStore.userInfo.mobile }}</div>
              </li>
              <li class="list-group-item">
                <SvgIcon name="email" /> 用户邮箱
                <div class="pull-right">{{ userStore.userInfo.email }}</div>
              </li>
              <!-- <li class="list-group-item">
                <SvgIcon name="tree" /> 所属部门
                <div class="pull-right">
                  {{ userStore.userInfo.deptName }} / {{ userStore.userInfo.postGroup }}
                </div>
              </li> -->
              <li class="list-group-item">
                <SvgIcon name="peoples" /> 所属角色
                <div class="pull-right">
                  <!-- <span
                    v-for="item in userStore.userInfo.roleStr"
                    :key="item"
                    style="margin: 0 5px; font-size: 12px"
                    >{{ item }}</span
                  > -->
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
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <UserInfo
                v-if="activeTab == 'userinfo'"
                :user="userStore.userInfo" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <ResetPwd v-if="activeTab == 'resetPwd'" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Profile">
// components
import UserAvatar from './UserAvatar'
import UserInfo from './UserInfo'
import ResetPwd from './ResetPwd'
// store
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
// ref
const activeTab = ref('userinfo')
</script>

<style lang="scss" scoped>
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
</style>
