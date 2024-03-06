/*
 * @Author: yangchenguang
 * @Description: table 列多选
 * @Date: 2023-09-19 15:18:09
 * @LastEditors: yangchenguang
 * @LastEditTime: 2023-09-20 17:59:29
 */

export default function useTableSelection() {
  const selectedRows = ref([])

  function handleSelectionChange(selection) {
    selectedRows.value = selection
  }

  return {
    selectedRows,
    handleSelectionChange
  }
}
