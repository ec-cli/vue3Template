/*
 * @Author: rk
 * @Description: echarts 样式配置
 * @Date: 2023-09-14 10:20:04
 * @LastEditors: rk
 * @LastEditTime: 2023-12-21 11:28:58
 */

// 图表公共样式
export default {
  legendFontSize: 12, // 图例字体大小
  axisFontSize: 11, // x、y轴文字大小
  nameFontSize: 11, // x、y轴单位的大小
  toolFontSize: 13, // 鼠标滑过弹窗文字大小
  axisPointerColor: 'rgba(91,132,245,.6)', // 坐标轴指示器颜色
  // 深色主题下系列颜色
  darkColors: {
    nameColor: 'rgba(255,255,255,.8)', // 坐标轴名称的文字颜色
    labelColor: 'rgba(255,255,255,.8)', // 坐标轴标签颜色
    markLineColor: '#9a9a9a', // 平均值线颜色
    axisLineColor: '#0F3D6F', // x、y轴线条颜色
    legendColor: 'rgba(255,255,255,1)', // 图例颜色
    splitLineColor: '#0F3D6F', // 分割线颜色
    tooltipColor: '#fff', // 提示框字体颜色
    background: 'rgba(32, 47, 102, 0.7)', // 弹框背景颜色
    borderColor: '#202f66', // 弹框边框颜色
    toolFontColor: '#fff', // 弹框文字颜色
    fillerColor: 'rgba(28,34,58,.4)' // dataZoom滑块选中区域填充颜色
  },
  // 浅色主题下系列颜色
  lightColors: {
    nameColor: '#666', // 坐标轴名称的文字颜色
    labelColor: '#666', // 坐标轴标签颜色
    markLineColor: '#dcdcdc', // 平均值线颜色
    axisLineColor: '#dcdcdc', // 坐标轴线的颜色
    legendColor: '#666', // 图例颜色
    splitLineColor: '#ccc', // 分割线颜色
    tooltipColor: '#515a6e', // 提示框字体颜色
    background: 'rgba(255,255,255,.8)', // 弹框背景颜色
    borderColor: '#fff', // 弹框边框颜色
    toolFontColor: '#666', // 弹框文字颜色
    fillerColor: 'rgba(220,220,220,.4)' // dataZoom滑块选中区域填充颜色
  },
  // 颜色列表
  chartColorList: [
    '#5b84f5',
    '#87d18a',
    '#f18c2a',
    '#9062e0',
    '#e46f7d',
    '#00b9db',
    '#ffe119',
    '#4363d8',
    '#911eb4',
    '#42d4f4',
    '#f032e6',
    '#fabed4',
    '#469990',
    '#dcbeff',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#a9a9a9',
    '#e6194B',
    '#3cb44b'
  ]
}
