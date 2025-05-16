<template>
  <el-upload
    class="popover-button-item"
    accept=".docx"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleConvert"
  >
    <div type="primary">Docx文件</div>
  </el-upload>
</template>

<script setup lang="ts">
import type { UploadFile } from "element-plus"
import type { Editor } from "@tiptap/vue-3"
import useDocumentStore from "@/store/documentStore"
import { renderAsync } from "docx-preview"

const documentStore = useDocumentStore()

const props = defineProps<{
  editor?: Editor | undefined
  createDoc: () => void
}>()

// docx转为html
function handleConvert(uploadFile: UploadFile) {
  if (!uploadFile.raw) return

  let reader = new FileReader()
  reader.readAsArrayBuffer(uploadFile.raw)
  reader.onload = function () {
    const dom = document.createElement("div")
    renderAsync(reader.result, dom, undefined, { useBase64URL: true }).then(x => {
      if (props.editor) props.editor?.commands.insertContent(dom.outerHTML)
      else {
        documentStore.setTransferDoc(dom.outerHTML)
        documentStore.setTransferTitle(uploadFile.name)
        props.createDoc()
      }
    })
  }
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
