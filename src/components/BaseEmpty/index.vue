<!--
 * @Author: tuoyouxin@fpwis.com
 * @Description:
 * @Date: 2023-10-25 18:11:02
 * @LastEditors: tuoyouxin@fpwis.com
 * @LastEditTime: 2023-10-25 18:16:57
-->
<template>
  <div class="empty-container">
    <div class="img"></div>
    <p class="txt">{{ text }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
})
</script>
<style lang="scss" scoped>
.empty-container {
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img {
    width: 300px;
    height: 300px;
    background: url(../../assets/images/empty.png) no-repeat center / 100%;
  }
  .txt {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}
</style>
