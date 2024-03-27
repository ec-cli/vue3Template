<!--
 * @Author: rk
 * @Description: 常用功能
 * @Date: 2023-08-21 09:49:48
 * @LastEditors: rk
 * @LastEditTime: 2024-03-27 17:28:18
-->
<template>
  <div class="tool-wrap">
    <template v-for="item in commonRouters" :key="item">
      <div
        class="tool-item"
        @mouseenter="onMouseOver(item)"
        @mouseleave="onMouseOut(item)">
        <span v-if="item.hidden" class="close-used" @click="removeRoute(item)">
          <el-icon><CloseBold /></el-icon>
        </span>
        <router-link :to="item.path">
          <SvgIcon
            class-name="card-panel-icon mb10"
            :name="item.icon"
            :color="item.color" />
          <div class="title">{{ item.menuTitle }}</div>
        </router-link>
      </div>
    </template>
  </div>

  <el-empty
    v-if="commonRouters && commonRouters.length <= 0"
    :image-size="80" />
</template>
<script setup>
import usePermissionStore from '@/store/modules/permission1'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const showRemove = ref(false)
watch(
  () => props.modelValue,
  (val) => {
    showRemove.value = val
  },
  {
    immediate: true
  }
)
const commonRouters = computed(() => usePermissionStore().commonlyUsedRoutes)

const removeRoute = (item) => {
  usePermissionStore().removeCommonlyUsedRoutes(item)
}
const onMouseOver = (item) => {
  item.hidden = true
}
const onMouseOut = (item) => {
  item.hidden = false
}
</script>
<style lang="scss" scoped>
.tool-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .tool-item {
    text-align: center;
    width: 100px;
    margin-bottom: 30px;
    position: relative;

    .card-panel-icon {
      width: 25px !important;
      height: 25px !important;
    }
    .title {
      color: #606266;
      font-size: 13px;
    }
  }
  .el-icon {
    width: 25px !important;
    height: 25px !important;
    margin-bottom: 10px;
  }
  :deep(.el-icon svg) {
    width: 25px !important;
    height: 25px !important;
  }
  .close-used {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
}
</style>
