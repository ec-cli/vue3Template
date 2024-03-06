<!--
 * @Author: yangchenguang
 * @Description: 卡片组件
 * @Date: 2023-09-13 16:36:43
 * @LastEditors: rk
 * @LastEditTime: 2023-11-02 10:22:47
-->

<template>
  <div class="info-list">
    <!-- 普通 -->
    <ul v-if="type === 1" class="list-box">
      <li class="list-item" v-for="(item, index) in infoList" :key="item.name">
        <h3>{{ item.name }}</h3>
        <p>
          <span
            :style="{
              color:
                chartStyle.chartColorList[item.index] ||
                chartStyle.chartColorList[index]
            }">
            {{ item.value ?? '-' }}
            {{ item.unit ? item.unit : '' }}
          </span>
        </p>
      </li>
    </ul>
  </div>
</template>
<script setup>
import chartStyle from '@/assets/styles/chartStyle.js'
const props = defineProps({
  infoList: {
    type: Array,
    default: () => []
  },
  type: {
    type: Number,
    default: 1
  }
})
</script>
<style lang="scss" scoped>
.info-list {
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-menu-active-color);
  border-radius: 4px;
  overflow: hidden;
}
// 1
.list-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  padding: 0;
  margin: 0;
  /* 隐藏滚动条 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  .list-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    border-bottom: 1px solid var(--el-color-primary);
    padding: 0 10px;
    transition: all 0.3s;
    &:hover {
      background: var(--base-bg-main);
      transform: translate(4px);
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 4px;
        height: 100%;
        position: absolute;
        left: -4px;
        top: 0;
        background: var(--el-color-primary);
        border-radius: 2px 0 0 2px;
      }
    }
    &:last-child {
      border-bottom: none;
    }
    h3 {
      color: var(--base-text-color);
      font-size: 13px;
    }
    span {
      font-family: Arial;
      font-size: 13px;
    }
  }
}
.list-box::-webkit-scrollbar {
  display: none;
}
</style>
