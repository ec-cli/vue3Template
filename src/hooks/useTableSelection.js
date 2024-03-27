/*
 * @Author: rk
 * @Description: table 列多选
 * @Date: 2023-09-19 15:18:09
 * @LastEditors: rk
 * @LastEditTime: 2024-03-27 16:45:19
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
