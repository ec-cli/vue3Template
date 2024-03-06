<!--
 * @Author: yangchenguang
 * @Description: 日历表
 * @Date: 2023-09-01 15:25:13
 * @LastEditors: rk
 * @LastEditTime: 2023-12-13 10:27:53
-->

<template>
  <el-table
    style="width: 100%"
    scrollbar-always-on
    border
    :data="tableData"
    :header-cell-class-name="headerCellClassName"
    @header-click="handleHeaderClick">
    <el-table-column
      v-if="props.showLabel"
      prop="status"
      align="center"
      fixed
      :label="labelName.dateName"></el-table-column>
    <el-table-column
      align="center"
      min-width="30px"
      v-for="(item, index) in tableHeader"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :resizable="false">
      <template #default="scope">
        <el-icon
          v-if="scope.row[item.prop] === 0"
          color="var(--el-color-danger)">
          <CloseBold></CloseBold>
        </el-icon>
        <el-icon
          v-if="scope.row[item.prop] === 2"
          color="var(--el-color-success)">
          <Select></Select>
        </el-icon>
        <el-icon v-if="scope.row[item.prop] === 1" size="20">
          <SvgIcon name="warning-icon" color="var(--el-color-warning)" />
        </el-icon>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { reactive, toRefs, watch, nextTick } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  // 选择的日期
  date: {
    require: true
  },
  // 月份/日期
  type: {
    type: Number,
    default: 1
  },
  // 状态列表
  statusList: {
    type: Array,
    default: () => []
  },
  // 表头名称
  labelName: {
    type: Object,
    default: () => ({
      dateName: '日期',
      statusName: '状态'
    })
  },
  // 是否显示表头
  showLabel: {
    type: Boolean,
    default: true
  },
  // 如果是本月，默认展示当天，也可以选择相对天数 relativeDate
  relativeDate: {
    type: Number,
    default: 0
  },
  // 是否在日期改变时时执行一次回调
  immediateCb: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['handle-header-click'])

const table = reactive({
  // 表格数据
  tableData: [
    {
      status: props.labelName.statusName
      // ...props.statusList
    }
  ],
  // 表头数据 用于生成日历天数
  tableHeader: [],
  // 选中天
  selectedDay: ''
})

const { tableData, tableHeader, selectedDay } = toRefs(table)

// 监听传入props，生成该月的天数
watch(
  () => props.date,
  (newValue) => {
    // 生成日期表
    tableHeader.value = []
    // 当前时间
    const currentDate = dayjs()
    if (props.type === 1) {
      // 日期
      for (let i = 0; i < dayjs(newValue).daysInMonth(); i++) {
        tableHeader.value.push({
          prop: `${i}`,
          label: `${i + 1}`
        })
      }
      // 判断日期是否为当前月份，当前月份展示今天+相对日期`props.relativeDate`天
      // 日期是否在当月
      if (currentDate.isSame(dayjs(newValue), 'month')) {
        const currentDay = currentDate.date() // 当前天
        const relativeDay = currentDay + props.relativeDate // 当前天+相对日期天数
        const monthDay = dayjs(newValue).daysInMonth() // 一月有多少天
        // 日期+相对日期，如果小于1或大于当月最大天，则相对日期失效
        selectedDay.value =
          monthDay <= relativeDay || relativeDay < 1 ? currentDay : relativeDay
      } else {
        // 不在当月 默认选中第一天
        selectedDay.value = 1
      }
    } else if (props.type === 2) {
      // 月份
      for (let i = 0; i < 12; i++) {
        tableHeader.value.push({
          prop: `${i}`,
          label: `${i + 1}`
        })
      }
      if (currentDate.isSame(dayjs(newValue), 'year')) {
        // 日期是否在当年
        const currentMonth = currentDate.month() + 1 // 当前月
        selectedDay.value = currentMonth
      } else {
        // 不在当年 默认选中一月
        selectedDay.value = 1
      }
    }
    nextTick(() => {
      if (props.immediateCb) handleCbClick(selectedDay.value)
    })
  },
  {
    immediate: true
  }
)
watch(
  () => props.statusList,
  (newValue) => {
    tableData.value = [
      {
        status: props.labelName.statusName,
        ...newValue
      }
    ]
  },
  {
    immediate: true
  }
)

// 表格头部点击
const handleHeaderClick = (column) => {
  if (column.no === 0) return // 点击表头返回
  const day = +column.label
  selectedDay.value = day
  handleCbClick(selectedDay.value)
}

// 日历表头列自定义类名
const headerCellClassName = ({ columnIndex }) => {
  if (selectedDay.value === columnIndex) {
    return 'active'
  }
  return ''
}

// 处理点击回调
const handleCbClick = (date) => {
  if (date < 10) date = '0' + date
  if (props.type === 1) {
    // 日期
    emits(
      'handle-header-click',
      dayjs(props.date).format('YYYY-MM') + `-${date}`
    )
  } else if (props.type === 2) {
    // 月份
    emits('handle-header-click', dayjs(props.date).format('YYYY') + `-${date}`)
  }
}
</script>

<style lang="scss" scoped>
:deep(th.el-table__cell) {
  cursor: pointer;
  &.active {
    background: var(--el-color-primary) !important;
    color: #fff !important;
    border-top: 1px solid var(--el-color-primary);
  }
}

:deep(.el-table__cell .cell) {
  padding: 0 !important;
}
</style>
