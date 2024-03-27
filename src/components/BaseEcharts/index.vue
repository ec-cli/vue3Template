<!--
 * @Author: rk
 * @Description: echarts封装
 * @Date: 2023-09-05 09:06:46
 * @LastEditors: rk
 * @LastEditTime: 2023-12-21 11:26:51
-->

<template>
  <div :id="id" :style="{ height, width }"></div>
</template>

<script setup>
// urils
import { deepClone, createUniqueString } from '@/utils'
import * as echarts from 'echarts'
import chartStyle from '@/assets/styles/chartStyle.js'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
const appStore = useAppStore()
const settingStore = useSettingsStore()
// 系统主题
const systemTheme = computed(() => settingStore.systemTheme)
// 菜单栏状态
const isCollapse = computed(() => appStore.sidebar.opened)
// 获取 dom 和 父组件数据 并定义"myChart"用于初始化图表
let myChart
// props
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  },
  // 图表id
  id: {
    type: String,
    default: createUniqueString(),
    required: true
  },
  // 图表配置
  fullOptions: {
    type: Object,
    default: () => ({}),
    required: true
  }
})
// emits
const emits = defineEmits(['legend-select-changed'])

// 监听
watch(
  () => [props.fullOptions.options, systemTheme, isCollapse],
  () => {
    if (myChart) {
      if (props.fullOptions.options?.seriesData) {
        myChart.setOption(pieChartParamsInit(props.fullOptions.options), true)
      } else {
        myChart.setOption(paramsInit(props.fullOptions.options), true)
      }
      setTimeout(() => {
        handleChartResize()
      }, 300)
    }
  },
  { deep: true }
)

onMounted(() => {
  handleChartRender()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', cancalDebounce)
  if (myChart) {
    myChart.dispose()
  }
})

// 折线图、柱状图参数配置方法
const paramsInit = (data) => {
  // 浅色主题颜色
  const lightColors = chartStyle.lightColors
  // 深色主题颜色
  const darkColors = chartStyle.darkColors
  // 是否是深色主题
  const dark = ['dark', 'darkblue'].includes(systemTheme.value)
  // option配置
  const option = {
    backgroundColor: 'transparent', // 图表背景颜色
    // 图例配置
    legend: {
      type: data?.legendType ? 'plain' : 'scroll', // 图例类型
      data: data?.legend, // 图例数据
      top: data?.legendTop || 0, // 图例距离盒子上边框的距离
      selected: data?.legendSelected || null, // 图例选中状态
      width: data?.legendWidth || '100%', // 图例区域的宽度
      itemWidth: 20, // 图标的宽度
      itemHeight: 12, // 图标的高度
      itemGap: 8, // 图标的间距
      textStyle: {
        color: dark ? darkColors.legendColor : lightColors.legendColor, // 图例文字颜色
        fontSize: data?.legendFontSize || chartStyle.legendFontSize // 图例文字大小
      },
      pageIconSize: 13, // 分页图标大小
      pageIconColor: dark ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.6)', // 分页图标颜色
      pageIconInactiveColor: dark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.3)', // 分页图标选中状态下颜色
      pageTextStyle: {
        color: dark ? darkColors.legendColor : lightColors.legendColor // 分页文字颜色
      }
    },
    // tooltio弹窗配置
    tooltip: {
      trigger: 'axis', // 触发类型
      triggerOn: 'mousemove|click', // 触发的条件
      confine: true, // 是否将 tooltip 框限制在图表的区域内
      borderColor: dark ? darkColors.borderColor : lightColors.borderColor, // 边框颜色
      backgroundColor: dark ? darkColors.background : lightColors.background, // 背景颜色
      // 文字样式
      textStyle: {
        color: dark ? darkColors.toolFontColor : lightColors.toolFontColor,
        fontSize: chartStyle.toolFontSize
      },
      padding: [10, 15], // 内边距
      // 额外附加到浮层的 css 样式
      extraCssText: dark
        ? 'box-shadow: 1px 0 15px 0 rgba(0, 0, 0, 0.2)'
        : 'box-shadow: 1px 0 5px 0 rgba(163, 163, 163 ,0.5)',
      // 坐标轴指示器配置项
      axisPointer: {
        type: 'cross',
        // 坐标轴指示器的文本标签
        label: {
          show: true,
          color: dark ? darkColors.tooltipColor : lightColors.tooltipColor,
          backgroundColor: dark
            ? darkColors.axisLineColor
            : lightColors.axisLineColor
        },
        // 指示器样式
        crossStyle: {
          type: 'dashed',
          width: 1,
          color: chartStyle.axisPointerColor
        }
      },
      formatter: data?.tooltipFormatter || null
    },
    // 直角坐标系配置
    grid: {
      top: data?.top || 40,
      bottom: data?.bottom || 40,
      right: data?.right || 40,
      left: data?.left || 40
    },
    // 区域缩放
    dataZoom: [
      {
        type: 'inside', // 默认支持鼠标滚轮缩放
        show: true,
        start: data?.dataZoomStartValue || 0,
        end: data?.dataZoomEndValue || 100,
        zoomLock: data?.zoomLock
      },
      {
        type: data?.dataZoomType || 'inside', // 扩展支持滑块缩放，如果不传dataZoomType: "slider" 默认鼠标滚轮缩放
        show: data?.dataZoomShow,
        start: data?.dataZoomStartValue || 0,
        end: data?.dataZoomEndValue || 100,
        zoomLock: data?.zoomLock,
        height: 14,
        bottom: 5,
        brushSelect: false,
        borderColor: dark ? darkColors.borderColor : lightColors.borderColor,
        fillerColor: dark ? darkColors.fillerColor : lightColors.fillerColor,
        textStyle: {
          fontSize: 10,
          color: dark ? darkColors.labelColor : lightColors.labelColor
        }
      }
    ],
    // x轴配置
    xAxis: [
      {
        type: 'category',
        boundaryGap: data?.boundaryGap || true, // 坐标系两侧是否留白
        data: data?.xData,
        // 坐标轴轴线配置
        axisLine: {
          lineStyle: {
            color: dark ? darkColors.axisLineColor : lightColors.axisLineColor
          }
        },
        // 坐标轴刻度配置
        axisTick: {
          show: false
        },
        // 坐标轴刻度标签配置
        axisLabel: {
          interval: data?.xInterval || null,
          color: dark ? darkColors.labelColor : lightColors.labelColor,
          fontSize: data?.fontSize || chartStyle.axisFontSize,
          rotate: data?.xRotate || null,
          margin: 10
        },
        // 坐标轴在 grid 区域中的分隔线
        splitLine: {
          show: true,
          lineStyle: {
            width: 0.5,
            type: 'dashed',
            color: dark ? darkColors.splitLineColor : lightColors.splitLineColor
          }
        },
        // 坐标轴指示器配置项
        axisPointer: {
          type: 'line',
          lineStyle: {
            type: 'dashed',
            width: 1,
            color: chartStyle.axisPointerColor
          }
        }
      }
    ],
    // y轴配置
    yAxis: [
      {
        type: 'value',
        name: data?.yName1, // y轴单位
        nameGap: 10, // 坐标轴名称与轴线之间的距离
        nameTextStyle: {
          color: dark ? darkColors.nameColor : lightColors.nameColor,
          fontSize: data?.fontSize || chartStyle.nameFontSize
        },
        splitNumber: 5, // 坐标轴的分割段数
        // 坐标轴轴线配置
        axisLine: {
          show: false
        },
        // 坐标轴刻度配置
        axisTick: {
          show: false
        },
        // 坐标轴刻度标签配置
        axisLabel: {
          color: dark ? darkColors.labelColor : lightColors.labelColor,
          fontSize: data?.fontSize || chartStyle.axisFontSize
        },
        // 坐标轴在 grid 区域中的分隔线
        splitLine: {
          show: true,
          lineStyle: {
            width: 0.5,
            type: 'dashed',
            color: dark ? darkColors.splitLineColor : lightColors.splitLineColor
          }
        }
      }
    ],
    // series配置
    series: data?.series || []
  }
  // 如果存在xName2,则认为有两条x轴
  if (data?.xName2) {
    option.xAxis[1] = deepClone(option.xAxis[0])
    option.xAxis[1].show = false
  }
  // 如果存在yName2，则认为有两条y轴
  if (data?.yName2) {
    option.yAxis[1] = deepClone(option.yAxis[0])
    option.yAxis[1].name = data.yName2
  }
  // 如果存在yName3，则认为有3条y轴
  if (data?.xName2 && data?.yName3) {
    option.yAxis[2] = deepClone(option.yAxis[0])
    option.yAxis[2].name = data.yName3
    option.yAxis[2].offset = 65
    option.yAxis[2].nameTextStyle.align = 'left'
  }
  return option
}

// 饼状图参数配置方法
const pieChartParamsInit = (data) => {
  // 是否是深色主题
  const dark = ['dark', 'darkblue'].includes(systemTheme.value)
  // 颜色列表
  const colorList = data?.colorList || chartStyle.chartColorList
  // 浅色主题颜色
  const lightColors = chartStyle.lightColors
  // 深色主题颜色
  const darkColors = chartStyle.darkColors
  const option = {
    backgroundColor: 'transparent',
    color: colorList,
    legend: {
      type: 'scroll',
      data: data?.legend,
      selected: data?.legendSelected || null, // 图例选中状态
      orient: data?.legendOrient || 'vertical',
      show: data?.legendShow,
      right:
        data?.legendOrient === 'vertical'
          ? data?.legendRight || 0
          : data?.legendRight || 'center', // 纵向展示默认靠右，横向展示默认居中
      top: data?.legendOrient === 'vertical' ? 'center' : data?.legendTop || 0, // 纵向展示默认居中，横向显示默认距离上边框0
      itemWidth: 11,
      itemHeight: 11,
      itemGap: data?.legendGap || 16,
      pageIconSize: 10,
      pageIconColor: dark ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.6)', // 分页图标颜色
      pageIconInactiveColor: dark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.3)', // 分页图标选中状态下颜色
      pageTextStyle: {
        color: dark ? darkColors.legendColor : lightColors.legendColor
      },
      textStyle: {
        color: dark ? darkColors.legendColor : lightColors.legendColor,
        fontSize: 11,
        rich: {
          labelName: {
            width: data?.legendNameWidth || 40,
            align: 'left',
            fontSize: 11
          },
          elec: {
            width: 50,
            align: 'right',
            fontSize: 11,
            padding: [0, 6]
          },
          ratio: {
            width: 30,
            align: 'right',
            fontSize: 11
          }
        }
      }
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove|click', // 触发的条件
      confine: true, // 是否将 tooltip 框限制在图表的区域内
      borderColor: dark ? darkColors.borderColor : lightColors.borderColor, // 边框颜色
      backgroundColor: dark ? darkColors.background : lightColors.background, // 背景颜色
      // 文字样式
      textStyle: {
        color: dark ? darkColors.toolFontColor : lightColors.toolFontColor,
        fontSize: chartStyle.toolFontSize
      },
      padding: 15, // 内边距
      // 额外附加到浮层的 css 样式
      extraCssText: dark
        ? 'box-shadow: 1px 0 5px 0 rgba(0, 0, 0, 0.7)'
        : 'box-shadow: 1px 0 5px 0 rgba(163, 163, 163 ,0.5)'
    },
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['0%', '60%'],
        labelLine: {
          show: true,
          length: 5,
          length2: 10
        },
        label: {
          formatter: function (params) {
            return params.name + '：' + params.value + '%'
          },
          show: true,
          position: 'outside',
          textStyle: {
            color: dark ? darkColors.legendColor : lightColors.legendColor
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 0
        },
        data: data?.seriesData || []
      }
    ]
  }
  return option
}

// 图表渲染方法
const handleChartRender = () => {
  // 配置为 svg 形式，预防页面缩放而出现模糊问题；图表过于复杂时建议使用 Canvas
  myChart = echarts.init(document.getElementById(props.id), null, {
    renderer: 'svg',
    devicePixelRatio: 2
  })
  // 自适应不同屏幕时改变图表尺寸
  window.addEventListener('resize', cancalDebounce)
  if (props.fullOptions.options?.seriesData) {
    myChart.setOption(pieChartParamsInit(props.fullOptions.options), false)
  } else {
    myChart.setOption(paramsInit(props.fullOptions.options), false)
  }
  // 监听图例select事件
  myChart.on('legendselectchanged', (params) => {
    emits('legend-select-changed', params.selected)
  })
}

// 重绘图表函数
const handleChartResize = () => {
  myChart.resize()
}

// 设置防抖，保证无论拖动窗口大小，只执行一次获取浏览器宽高的方法
const debounce = (fun, delay) => {
  let timer
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun()
    }, delay)
  }
}

// 取消防抖
const cancalDebounce = debounce(handleChartResize, 50)
</script>
