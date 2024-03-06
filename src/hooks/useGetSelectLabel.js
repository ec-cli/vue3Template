/*
 * @Author: yangchenguang
 * @Description: 获取select对应id的名称, 一般在模板中使用
 * @Date: 2023-10-10 16:36:29
 * @LastEditors: yangchenguang
 * @LastEditTime: 2023-10-10 17:02:43
 */

export default function useGetSelectLabel() {
  const getSelectLabel = computed(
    () =>
      (selectList, value, valueName = 'value', labelName = 'label') => {
        if (value === undefined) return ''
        return selectList.find((i) => i[valueName] === value)?.[labelName]
      }
  )
  return getSelectLabel
}
