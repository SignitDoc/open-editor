<template>
  <div class="markdown-root">
    <!-- 头部菜单 -->
    <PageHeader class="page-header" v-model:doc="markdownState.nowMarkdown" show-more-actions>
      <template #dropdown>
        <ContextMenuItem @click="exportMarkdown">导出</ContextMenuItem>
        <ContextMenuItem @click="toJson">输出文本</ContextMenuItem>
      </template>
    </PageHeader>

    <!-- 编辑器 -->
    <div id="viewer" class="markdown-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue"
import { ContextMenuItem } from "@/components"
import { PageHeader } from "@/editor-modules"
import { HistoryItem, CommentItem, MarkdownDocumentItem } from "@/types"
import { DocumentPermissionEnum } from "@/enum"
import { useRouter } from "vue-router"
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer"
import { useDocumentListStore } from "@/store"
import { cloneDeep } from "lodash"

const router = useRouter()

const documentListStore = useDocumentListStore()

const id = router.currentRoute.value.query.id as string

const markdownState = reactive({
  nowMarkdown: {
    _id: "",
    type: "markdown",
    title: "未命名笔记",
    content: "",
    updateTime: "",
    history: [] as Array<HistoryItem>,
    createdTime: "",
    commentList: [] as Array<CommentItem>,
    creator: "",
    versionList: []
  } as MarkdownDocumentItem
})

const editor = ref()

// 初始化笔记内容
onMounted(async () => {
  try {
    let document = documentListStore.getDetail(id)
    if (!document || document.type !== "markdown") return router.push(`/none`)

    document = cloneDeep(document)
    markdownState.nowMarkdown = document

    initEditor()
  } catch (err: any) {
    if (err?.response?.status === 401) router.push(`/without-permission`)
    else if (err?.response?.status === 404) router.push(`/none`)
  }
})

// 初始化viewer
function initEditor() {
  const editorDom = document.querySelector("#viewer") as HTMLElement
  if (editorDom)
    editor.value = new Viewer({
      el: editorDom,
      initialValue: markdownState.nowMarkdown.content || ""
    })
}

// 输出md字符串
function toJson() {
  console.log(editor.value?.getMarkdown())
}

// 导出md
function exportMarkdown() {
  const blob = new Blob([editor.value?.getMarkdown()], {
    type: "text/markdown"
  })
  const objectURL = URL.createObjectURL(blob)

  const aTag = document.createElement("a")
  aTag.href = objectURL
  aTag.download = `${markdownState.nowMarkdown.title}.md`
  aTag.click()
  URL.revokeObjectURL(objectURL)
}
</script>

<style lang="less" scoped>
.markdown-root {
  width: 100%;
  height: 100%;
  .markdown-container {
    width: 100%;
    height: calc(100% - 53px) !important;
    padding: 18px 25px;
    box-sizing: border-box;
    overflow-y: auto;
    background: #fff;
  }
}
</style>
