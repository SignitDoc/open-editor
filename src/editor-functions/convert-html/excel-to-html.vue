<template>
  <el-upload
    class="popover-button-item"
    accept=".xls, .xlsx"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleConvert"
  >
    <div type="primary">Excel表格</div>
  </el-upload>
</template>

<script setup lang="ts">
import LuckyExcel from "luckyexcel"
import type { UploadFile } from "element-plus"
import useDocumentStore from "@/store/documentStore"

const documentStore = useDocumentStore()

const props = defineProps<{
  createExcel: () => void
}>()
function handleConvert(uploadFile: UploadFile) {
  // 转换
  LuckyExcel.transformExcelToLucky(uploadFile.raw, function (exportJson, luckysheetfile) {
    if (exportJson.sheets === null || exportJson.sheets.length === 0) {
      alert("Failed to read the content of the excel file, currently does not support xls files!")
      return
    }

    documentStore.setTransferTitle(uploadFile.name)
    documentStore.setTransferDoc(JSON.parse(luckysheetfile).sheets, "excel")

    props.createExcel()
  })
}
</script>

<style lang="less" scoped>
:deep(.el-upload) {
  width: 100%;
  justify-content: flex-start;
  padding: 5px;
  box-sizing: border-box;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}
:deep(.div) {
  width: 100%;
}
</style>
