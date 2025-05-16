<template>
  <ContextMenuItem @click="htmlToPdf('ProseMirror')">导出PDF</ContextMenuItem>

  <iframe class="doc-iframe" ref="iframeRef" :srcdoc="iframeCode" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ContextMenuItem } from "@/components"
import { DocxDocumentItem } from "@/types"
import { SystemAlert, SystemPrompt } from "@/utils"
interface PropsType {
  nowDoc: DocxDocumentItem
}

const props = withDefaults(defineProps<PropsType>(), {})

let glFileName: string = ""
const iframeCode = ref("")
const iframeRef = ref()

/**
 * @param pageClassName 待转换html块的类名
 */
function htmlToPdf(pageClassName: string) {
  iframeCode.value = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <title>${glFileName}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

    </head>
    <body class="is-print">
    <div></div>
      ${document.getElementsByClassName(pageClassName)[0]?.outerHTML}
    </body>
    </html>
    `

  SystemPrompt("确认是否要导出pdf").then(() => {
    setTimeout(() => {
      iframeRef.value.contentWindow.print()
    }, 300)
  })
}
</script>

<style lang="less" scoped>
.doc-iframe {
  position: fixed;
  top: -1000px;
  left: -1000px;
  z-index: -1;
}
</style>
