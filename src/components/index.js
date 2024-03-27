/*
 * @Author: rk
 * @Description: 全局组件导入
 * @Date: 2023-10-08 11:29:53
 * @LastEditors: rk
 * @LastEditTime: 2024-03-27 16:44:25
 */

// 基础组件
import BaseDateStatusTable from '@/components/BaseDateStatusTable' // 日历表组件
import BaseIconSwitch from '@/components/BaseIconSwitch' // icon切换组件
import BaseEcharts from '@/components/BaseEcharts' // echarts组件
import BaseImportResult from '@/components/BaseImportResult' // 导入接口组件
import BaseCustomPanel from '@/components/BaseCustomPanel' // 卡片组件
import BasePagination from '@/components/BasePagination' // 分页组件
import BaseEmpty from '@/components/BaseEmpty' // 空状态

// 业务组件
import FileUpload from '@/components/FileUpload' // 文件上传组件
import ImageUpload from '@/components/ImageUpload' // 图片上传组件
import ImagePreview from '@/components/ImagePreview' // 图片预览组件
import DictTag from '@/components/DictTag' // 字典标签组件
import SvgIcon from '@/components/SvgIcon/index' // icon

export default {
  install: (Vue) => {
    // 基础组件
    Vue.component('BaseDateStatusTable', BaseDateStatusTable)
    Vue.component('BaseIconSwitch', BaseIconSwitch)
    Vue.component('BaseEcharts', BaseEcharts)
    Vue.component('BaseImportResult', BaseImportResult)
    Vue.component('BaseCustomPanel', BaseCustomPanel)
    Vue.component('BasePagination', BasePagination)
    Vue.component('BaseEmpty', BaseEmpty)

    // 业务组件
    Vue.component('DictTag', DictTag)
    Vue.component('UploadFile', FileUpload)
    Vue.component('UploadImage', ImageUpload)
    Vue.component('ImagePreview', ImagePreview)
    Vue.component('SvgIcon', SvgIcon)
  }
}
