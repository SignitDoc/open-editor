<template>
  <div class="markdown-root">
    <!-- 头部菜单 -->
    <PageHeader
      class="page-header"
      v-model:doc="markdownState.nowMarkdown"
      show-more-actions
      :edit="true"
      :save="handleSave"
      :save-loading="saveLoading"
    >
      <template #dropdown>
        <ContextMenuItem @click="exportMarkdown">导出</ContextMenuItem>
        <ContextMenuItem @click="toJson">输出文本</ContextMenuItem>
      </template>
    </PageHeader>

    <!-- 编辑器 -->
    <div id="editor" class="markdown-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue"
import { ContextMenuItem } from "@/components"
import { PageHeader } from "@/editor-modules"
import { HistoryItem, CommentItem, MarkdownDocumentItem } from "@/types"
import { DocumentActionEnum } from "@/enum"
import Editor from "@toast-ui/editor"
import { useSaveCommon } from "@/hooks"
import { Message } from "@/utils"
import { useRouter } from "vue-router"
import { useDocumentListStore } from "@/store"
import "@toast-ui/editor/dist/i18n/zh-cn"
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

// 初始化编辑器
function initEditor() {
  const editorDom = document.querySelector("#editor") as HTMLElement
  if (editorDom)
    editor.value = new Editor({
      el: editorDom,
      previewStyle: "vertical",
      placeholder: "请输入文档内容...",
      initialValue: markdownState.nowMarkdown.content || "",
      language: "zh-CN"
    })
}

// 暂存
const saveLoading = ref(false)
function handleSave() {
  const content = editor.value?.getMarkdown()
  useSaveCommon(
    DocumentActionEnum.Edit,
    "markdown",
    markdownState.nowMarkdown.title,
    content,
    saveLoading,
    markdownState.nowMarkdown,
    markdown => {
      markdownState.nowMarkdown = markdown as MarkdownDocumentItem
      Message.success("保存成功")
    }
  )
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
  }
}
</style>
